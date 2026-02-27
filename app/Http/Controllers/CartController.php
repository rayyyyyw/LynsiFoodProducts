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
    /** Show the cart page. */
    public function index(Request $request): Response
    {
        $items = CartItem::where('user_id', $request->user()->id)
            ->with(['variant.product.category'])
            ->get()
            ->map(fn ($item) => [
                'id'        => $item->id,
                'quantity'  => $item->quantity,
                'variant'   => [
                    'id'             => $item->variant->id,
                    'size'           => $item->variant->size,
                    'flavor'         => $item->variant->flavor,
                    'price'          => (float) $item->variant->price,
                    'stock_quantity' => $item->variant->stock_quantity,
                    'display_name'   => $item->variant->display_name,
                ],
                'product'   => [
                    'id'        => $item->variant->product->id,
                    'name'      => $item->variant->product->name,
                    'slug'      => $item->variant->product->slug,
                    'image_url' => $item->variant->product->image_url,
                    'category'  => $item->variant->product->category?->name,
                ],
            ]);

        return Inertia::render('Cart/Index', [
            'items' => $items,
        ]);
    }

    /** Add or increment an item. */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'quantity'   => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $variant = ProductVariant::findOrFail($data['variant_id']);

        $item = CartItem::firstOrNew([
            'user_id'            => $request->user()->id,
            'product_variant_id' => $variant->id,
        ]);

        $newQty = ($item->exists ? $item->quantity : 0) + $data['quantity'];
        $item->quantity = min($newQty, $variant->stock_quantity ?: 99);
        $item->save();

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

    private function authorizeItem(Request $request, CartItem $item): void
    {
        abort_if($item->user_id !== $request->user()->id, 403);
    }
}
