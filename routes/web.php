<?php

use App\Http\Controllers\Products\CategoryController;
use App\Http\Controllers\Products\InventoryController;
use App\Http\Controllers\Products\ProductController;
use App\Models\LandingPageSetting;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    $landingContent = null;
    $featuredProducts = [];
    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('landing_page_settings')) {
            $landingContent = \App\Models\LandingPageSetting::getContent();
        }
        if (\Illuminate\Support\Facades\Schema::hasTable('products')) {
            $featuredProducts = Product::with('category', 'variants')
                ->where('featured', true)
                ->orderBy('name')
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'description' => $p->description,
                    'expiry' => $p->expiry?->format('Y-m-d'),
                    'image_url' => $p->image_url,
                    'category' => $p->category?->name,
                    'variants' => $p->variants->map(fn ($v) => [
                        'size' => $v->size,
                        'flavor' => $v->flavor,
                        'price' => $v->price,
                        'stock_quantity' => $v->stock_quantity,
                    ]),
                ]);
        }
    } catch (\Throwable $e) {
    }
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'landingContent' => $landingContent,
        'featuredProducts' => $featuredProducts,
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard', ['section' => null]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('products')->name('products.')->group(function () {
    Route::get('categories', [CategoryController::class, 'index'])->name('categories');
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);

    Route::get('products', [ProductController::class, 'index'])->name('products');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store']);
    Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('products/{product}', [ProductController::class, 'update']);
    Route::delete('products/{product}', [ProductController::class, 'destroy']);

    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory');
    Route::patch('inventory/{variant}/stock', [InventoryController::class, 'updateStock'])->name('inventory.update-stock');
    Route::post('inventory/{variant}/adjust', [InventoryController::class, 'adjustStock'])->name('inventory.adjust');
});

Route::get('dashboard/{section}', function (string $section) {
    return Inertia::render('dashboard', ['section' => $section]);
})->middleware(['auth', 'verified'])->where('section', 'orders|returns|customers|roles|discounts|coupons|banners|pages|blog|faq|sales|analytics|general|payments|shipping|email-templates')->name('dashboard.section');

require __DIR__.'/settings.php';
