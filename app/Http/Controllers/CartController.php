<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /** Show the cart page. Works for both authenticated users and guests (session cart). */
    public function index(Request $request): Response
    {
        if ($request->user()) {
            $items = CartItem::where('user_id', $request->user()->id)
                ->with(['variant.product.category'])
                ->get()
                ->map(fn ($item) => [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'variant' => [
                        'id' => $item->variant->id,
                        'size' => $item->variant->size,
                        'flavor' => $item->variant->flavor,
                        'price' => (float) $item->variant->price,
                        'stock_quantity' => $item->variant->stock_quantity,
                        'display_name' => $item->variant->display_name,
                    ],
                    'product' => [
                        'id' => $item->variant->product->id,
                        'name' => $item->variant->product->name,
                        'slug' => $item->variant->product->slug,
                        'image_url' => $item->variant->product->image_url,
                        'category' => $item->variant->product->category?->name,
                    ],
                    'is_guest_item' => false,
                ]);
        } else {
            $guestCart = $request->session()->get('guest_cart', []);
            $variantIds = array_keys($guestCart);
            $variants = ProductVariant::with('product.category')
                ->whereIn('id', $variantIds)
                ->get()
                ->keyBy('id');
            $items = [];
            foreach ($guestCart as $variantId => $qty) {
                $variant = $variants->get($variantId);
                if (! $variant) {
                    continue;
                }
                $items[] = [
                    'id' => $variant->id,
                    'quantity' => (int) $qty,
                    'variant' => [
                        'id' => $variant->id,
                        'size' => $variant->size,
                        'flavor' => $variant->flavor,
                        'price' => (float) $variant->price,
                        'stock_quantity' => $variant->stock_quantity,
                        'display_name' => $variant->display_name,
                    ],
                    'product' => [
                        'id' => $variant->product->id,
                        'name' => $variant->product->name,
                        'slug' => $variant->product->slug,
                        'image_url' => $variant->product->image_url,
                        'category' => $variant->product->category?->name,
                    ],
                    'is_guest_item' => true,
                ];
            }
        }

        $step = (int) $request->query('step', 1);
        $step = $step === 2 ? 2 : 1;

        return Inertia::render('Cart/Index', [
            'items' => $items,
            'initialStep' => $step,
        ]);
    }

    /** Add or increment an item. Guests: save to session (no redirect; account required only at checkout). */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $variant = ProductVariant::findOrFail($data['variant_id']);
        $qty = (int) min($data['quantity'], $variant->stock_quantity ?: 99);

        if ($request->user()) {
            $item = CartItem::firstOrNew([
                'user_id' => $request->user()->id,
                'product_variant_id' => $variant->id,
            ]);
            $newQty = ($item->exists ? $item->quantity : 0) + $qty;
            $item->quantity = min($newQty, $variant->stock_quantity ?: 99);
            $item->save();

            return back()->with('cart_success', 'Item added to cart.');
        }

        $guestCart = $request->session()->get('guest_cart', []);
        $guestCart[$variant->id] = ($guestCart[$variant->id] ?? 0) + $qty;
        $guestCart[$variant->id] = min($guestCart[$variant->id], $variant->stock_quantity ?: 99);
        $request->session()->put('guest_cart', $guestCart);

        return back()->with('cart_success', 'Item added to cart.');
    }

    /** Update quantity of an existing cart item. */
    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->authorizeItem($request, $cartItem);

        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $cartItem->quantity = min($data['quantity'], $cartItem->variant->stock_quantity ?: 99);
        $cartItem->save();

        return back();
    }

    /** Remove one item from the cart. */
    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->authorizeItem($request, $cartItem);
        $cartItem->delete();

        return back()->with('cart_success', 'Item removed.');
    }

    /** Empty the whole cart. */
    public function clear(Request $request): RedirectResponse
    {
        CartItem::where('user_id', $request->user()->id)->delete();

        return back()->with('cart_success', 'Cart cleared.');
    }

    /** Update quantity for a guest cart item (session). */
    public function updateGuest(Request $request, int $variantId): RedirectResponse
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);
        $variant = ProductVariant::findOrFail($variantId);
        $qty = min($data['quantity'], $variant->stock_quantity ?: 99);
        $guestCart = $request->session()->get('guest_cart', []);
        if (! array_key_exists($variantId, $guestCart)) {
            return back();
        }
        $guestCart[$variantId] = $qty;
        $request->session()->put('guest_cart', $guestCart);

        return back();
    }

    /** Remove one item from guest cart (session). */
    public function destroyGuest(Request $request, int $variantId): RedirectResponse
    {
        $guestCart = $request->session()->get('guest_cart', []);
        unset($guestCart[$variantId]);
        $request->session()->put('guest_cart', $guestCart);

        return back()->with('cart_success', 'Item removed.');
    }

    /** Clear all guest cart items (session). */
    public function clearGuest(Request $request): RedirectResponse
    {
        $request->session()->forget('guest_cart');

        return back()->with('cart_success', 'Cart cleared.');
    }

    private function authorizeItem(Request $request, CartItem $item): void
    {
        abort_if($item->user_id !== $request->user()->id, 403);
    }
}
