<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(): Response
    {
        $variants = ProductVariant::with('product.category')
            ->orderBy('product_id')
            ->get();

        return Inertia::render('Products/Inventory', [
            'variants' => $variants,
        ]);
    }

    public function updateStock(Request $request, ProductVariant $variant): RedirectResponse
    {
        $validated = $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);
        $variant->update(['stock_quantity' => $validated['stock_quantity']]);
        return redirect()->route('products.inventory')->with('status', 'Stock updated.');
    }

    public function adjustStock(Request $request, ProductVariant $variant): RedirectResponse
    {
        $validated = $request->validate([
            'adjustment' => 'required|integer',
        ]);
        $newStock = max(0, $variant->stock_quantity + $validated['adjustment']);
        $variant->update(['stock_quantity' => $newStock]);
        return redirect()->route('products.inventory')->with('status', 'Stock adjusted.');
    }
}
