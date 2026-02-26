<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('category', 'variants');
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        $products = $query->orderBy('name')->get();
        $categories = Category::orderBy('sort_order')->orderBy('name')->get();

        return Inertia::render('Products/Products', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        $categories = Category::orderBy('sort_order')->orderBy('name')->get();

        return Inertia::render('Products/ProductForm', [
            'categories' => $categories,
            'product' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'expiry' => 'nullable|date',
            'featured' => 'boolean',
            'image' => 'nullable|image|max:2048',
            'variants' => 'required|array|min:1',
            'variants.*.size' => 'nullable|string|max:100',
            'variants.*.flavor' => 'nullable|string|max:100',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.sku' => 'nullable|string|max:100',
            'variants.*.stock_quantity' => 'nullable|integer|min:0',
        ]);

        $product = new Product;
        $product->category_id = $validated['category_id'];
        $product->name = $validated['name'];
        $product->slug = $this->uniqueProductSlug($validated['slug'] ?? \Illuminate\Support\Str::slug($validated['name']));
        $product->description = $validated['description'] ?? null;
        $product->expiry = $validated['expiry'] ?? null;
        $product->featured = $validated['featured'] ?? false;
        if ($request->hasFile('image')) {
            $product->image_path = $request->file('image')->store('product-images', 'public');
        }
        $product->save();

        foreach ($validated['variants'] as $v) {
            $variant = $product->variants()->create([
                'size' => $v['size'] ?? null,
                'flavor' => $v['flavor'] ?? null,
                'price' => $v['price'],
                'sku' => null,
                'stock_quantity' => (int) ($v['stock_quantity'] ?? 0),
            ]);
            $variant->sku = str_pad((string) $variant->id, 3, '0', STR_PAD_LEFT);
            $variant->save();
        }

        return redirect()->route('products.products')->with('status', 'Product created.');
    }

    public function edit(Product $product): Response
    {
        $product->load('variants');
        $categories = Category::orderBy('sort_order')->orderBy('name')->get();

        return Inertia::render('Products/ProductForm', [
            'categories' => $categories,
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'expiry' => 'nullable|date',
            'featured' => 'boolean',
            'image' => 'nullable|image|max:2048',
            'variants' => 'required|array|min:1',
            'variants.*.id' => 'nullable|exists:product_variants,id',
            'variants.*.size' => 'nullable|string|max:100',
            'variants.*.flavor' => 'nullable|string|max:100',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.sku' => 'nullable|string|max:100',
            'variants.*.stock_quantity' => 'nullable|integer|min:0',
        ]);

        $product->category_id = $validated['category_id'];
        $product->name = $validated['name'];
        $product->slug = $this->uniqueProductSlug($validated['slug'] ?? \Illuminate\Support\Str::slug($validated['name']), $product->id);
        $product->description = $validated['description'] ?? null;
        $product->expiry = $validated['expiry'] ?? null;
        $product->featured = $validated['featured'] ?? false;
        if ($request->hasFile('image')) {
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $product->image_path = $request->file('image')->store('product-images', 'public');
        }
        $product->save();

        $existingIds = [];
        foreach ($validated['variants'] as $v) {
            $payload = [
                'size' => $v['size'] ?? null,
                'flavor' => $v['flavor'] ?? null,
                'price' => $v['price'],
                'sku' => $v['sku'] ?? null,
                'stock_quantity' => (int) ($v['stock_quantity'] ?? 0),
            ];
            if (! empty($v['id'])) {
                $variant = $product->variants()->find($v['id']);
                if ($variant) {
                    $variant->update($payload);
                    $existingIds[] = $variant->id;
                }
            } else {
                $payload['sku'] = null;
                $variant = $product->variants()->create($payload);
                $variant->sku = str_pad((string) $variant->id, 3, '0', STR_PAD_LEFT);
                $variant->save();
                $existingIds[] = $variant->id;
            }
        }
        $product->variants()->whereNotIn('id', $existingIds)->delete();

        return redirect()->route('products.products')->with('status', 'Product updated.');
    }

    /**
     * Return a slug that is unique in the products table.
     * If the base slug exists, appends -2, -3, etc. until unique.
     *
     * @param  int|null  $excludeId  Product ID to exclude (for updates).
     */
    private function uniqueProductSlug(string $baseSlug, ?int $excludeId = null): string
    {
        $slug = $baseSlug;
        $count = 1;
        $query = Product::where('slug', $slug);
        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }
        while ($query->exists()) {
            $slug = $baseSlug.'-'.$count;
            $count++;
            $query = Product::where('slug', $slug);
            if ($excludeId !== null) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }
        $product->delete();

        return redirect()->route('products.products')->with('status', 'Product deleted.');
    }
}
