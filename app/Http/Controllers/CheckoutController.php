<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /** Redirect to cart step 2 (checkout) — checkout is a wizard step within the cart page. */
    public function index(): RedirectResponse
    {
        return redirect()->route('cart.index', ['step' => 2]);
    }

    /** Place the order. */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'shipping_name' => ['required', 'string', 'max:100'],
            'shipping_phone' => ['required', 'string', 'max:30'],
            'shipping_address' => ['required', 'string', 'max:255'],
            'shipping_city' => ['required', 'string', 'max:100'],
            'shipping_province' => ['required', 'string', 'max:100'],
            'shipping_zip' => ['nullable', 'string', 'max:10'],
            'payment_method' => ['required', 'in:cod,gcash,bank_transfer'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $userId = $request->user()->id;
        $cartItems = CartItem::where('user_id', $userId)
            ->with(['variant.product'])
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $subtotal = $cartItems->reduce(fn ($carry, $item) => $carry + ($item->variant->price * $item->quantity), 0.0);
        $shippingFee = 0.0;
        $total = $subtotal + $shippingFee;

        $order = DB::transaction(function () use ($data, $userId, $cartItems, $subtotal, $shippingFee, $total) {
            $order = Order::create([
                'user_id' => $userId,
                'order_number' => Order::generateOrderNumber(),
                'status' => 'pending',
                'payment_method' => $data['payment_method'],
                'payment_status' => 'unpaid',
                'shipping_name' => $data['shipping_name'],
                'shipping_phone' => $data['shipping_phone'],
                'shipping_address' => $data['shipping_address'],
                'shipping_city' => $data['shipping_city'],
                'shipping_province' => $data['shipping_province'],
                'shipping_zip' => $data['shipping_zip'] ?? null,
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $item->product_variant_id,
                    'product_name' => $item->variant->product->name,
                    'variant_display_name' => $item->variant->display_name !== 'Default' ? $item->variant->display_name : null,
                    'product_image_url' => $item->variant->product->image_url,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->variant->price,
                    'line_total' => (float) $item->variant->price * $item->quantity,
                ]);
                $item->variant->decrement('stock_quantity', $item->quantity);
            }

            CartItem::where('user_id', $userId)->delete();

            return $order;
        });

        return redirect()->route('checkout.confirmation', $order->order_number);
    }

    /** Show order confirmation. */
    public function confirmation(Request $request, string $orderNumber): Response|RedirectResponse
    {
        $order = Order::where('user_id', $request->user()->id)
            ->where('order_number', $orderNumber)
            ->with('items')
            ->firstOrFail();

        return Inertia::render('Checkout/Confirmation', [
            'order' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'shipping_name' => $order->shipping_name,
                'shipping_phone' => $order->shipping_phone,
                'shipping_address' => $order->shipping_address,
                'shipping_city' => $order->shipping_city,
                'shipping_province' => $order->shipping_province,
                'shipping_zip' => $order->shipping_zip,
                'subtotal' => $order->subtotal,
                'shipping_fee' => $order->shipping_fee,
                'total' => $order->total,
                'notes' => $order->notes,
                'created_at' => $order->created_at->toDateTimeString(),
                'items' => $order->items->map(fn ($item) => [
                    'product_name' => $item->product_name,
                    'variant_display_name' => $item->variant_display_name,
                    'product_image_url' => $item->product_image_url,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'line_total' => $item->line_total,
                ]),
            ],
        ]);
    }
}
