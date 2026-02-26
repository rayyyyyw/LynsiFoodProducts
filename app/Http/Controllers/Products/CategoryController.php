<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::withCount('products')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Categories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'flavors' => 'nullable|array',
            'flavors.*' => 'string|max:100',
            'price_list' => 'nullable|array',
            'price_list.*.size' => 'required|string|max:100',
            'price_list.*.price' => 'required|numeric|min:0',
        ]);
        if (empty($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        }
        $validated['flavors'] = $validated['flavors'] ?? [];
        $validated['price_list'] = $validated['price_list'] ?? [];
        Category::create($validated);

        return redirect()->route('products.categories')->with('status', 'Category created.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug,'.$category->id,
            'flavors' => 'nullable|array',
            'flavors.*' => 'string|max:100',
            'price_list' => 'nullable|array',
            'price_list.*.size' => 'required|string|max:100',
            'price_list.*.price' => 'required|numeric|min:0',
        ]);
        if (empty($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        }
        $validated['flavors'] = $validated['flavors'] ?? [];
        $validated['price_list'] = $validated['price_list'] ?? [];
        $category->update($validated);

        return redirect()->route('products.categories')->with('status', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('products.categories')->with('status', 'Category deleted.');
    }
}
