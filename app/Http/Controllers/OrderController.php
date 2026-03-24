<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /** List the authenticated user's orders (my purchases). */
    public function myOrders(Request $request): Response
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10)
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'return_status' => $order->return_status,
                'total' => (float) $order->total,
                'created_at' => $order->created_at->toDateTimeString(),
                'item_count' => $order->items()->count(),
            ]);

        return Inertia::render('Account/Orders', [
            'orders' => $orders,
        ]);
    }

    /** Update order status (admin). */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,delivered,cancelled'],
        ]);

        $order->update(['status' => $data['status']]);

        return back()->with('status', 'Order status updated.');
    }

    /** Re-add order items back to cart for quick re-order (customer). */
    public function reorder(Request $request, Order $order): RedirectResponse
    {
        abort_if($order->user_id !== $request->user()->id, 403);

        $order->load('items');
        foreach ($order->items as $item) {
            if (! $item->product_variant_id) {
                continue;
            }

            $cartItem = CartItem::firstOrNew([
                'user_id' => $request->user()->id,
                'product_variant_id' => $item->product_variant_id,
            ]);
            $cartItem->quantity = min(($cartItem->exists ? $cartItem->quantity : 0) + $item->quantity, 99);
            $cartItem->save();
        }

        return redirect()->route('cart.index')->with('cart_success', 'Items added to cart for reorder.');
    }

    public function requestReturn(Request $request, Order $order): RedirectResponse
    {
        abort_if($order->user_id !== $request->user()->id, 403);
        abort_if($order->status !== 'delivered', 422, 'Only delivered orders can be returned.');

        $data = $request->validate([
            'return_reason' => ['required', 'string', 'max:500'],
        ]);

        $order->update([
            'return_status' => 'requested',
            'return_reason' => $data['return_reason'],
            'return_requested_at' => now(),
        ]);

        return back()->with('status', 'Return request submitted.');
    }
}
