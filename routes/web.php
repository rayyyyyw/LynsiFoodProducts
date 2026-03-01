<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Products\CategoryController;
use App\Http\Controllers\Products\InventoryController;
use App\Http\Controllers\Products\ProductController;
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
            $featured = Product::with('category', 'variants')
                ->where('featured', true)
                ->orderBy('name')
                ->get();
            // Use featured products when available; otherwise show latest 8 from admin so section always shows real data
            $productsForLanding = $featured->isNotEmpty()
                ? $featured
                : Product::with('category', 'variants')->orderBy('updated_at', 'desc')->limit(8)->get();
            $featuredProducts = $productsForLanding->map(fn ($p) => [
                'id' => $p->id,
                'slug' => $p->slug,
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
    ])->toResponse(request())->withHeaders([
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
    ]);
})->name('home');

Route::get('/shop', function () {
    $products = [];
    $categories = [];
    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('categories')) {
            $categories = \App\Models\Category::orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'slug']);
        }
        if (\Illuminate\Support\Facades\Schema::hasTable('products')) {
            $products = Product::with('category', 'variants')
                ->orderBy('name')
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'slug' => $p->slug,
                    'description' => $p->description,
                    'image_url' => $p->image_url,
                    'featured' => $p->featured,
                    'category' => $p->category ? ['id' => $p->category->id, 'name' => $p->category->name, 'slug' => $p->category->slug] : null,
                    'variants' => $p->variants->map(fn ($v) => [
                        'id' => $v->id,
                        'size' => $v->size,
                        'flavor' => $v->flavor,
                        'price' => (float) $v->price,
                        'stock_quantity' => $v->stock_quantity,
                    ]),
                ]);
        }
    } catch (\Throwable $e) {
    }

    return Inertia::render('LandingPage/Shop', [
        'products' => $products,
        'categories' => $categories,
        'canRegister' => Features::enabled(Features::registration()),
    ])->toResponse(request())->withHeaders([
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
    ]);
})->name('shop');

Route::get('/shop/product/{slug}', function (string $slug) {
    $product = Product::with('category', 'variants')
        ->where('slug', $slug)
        ->firstOrFail();
    $payload = [
        'id' => $product->id,
        'name' => $product->name,
        'slug' => $product->slug,
        'description' => $product->description,
        'expiry' => $product->expiry?->format('Y-m-d'),
        'image_url' => $product->image_url,
        'featured' => $product->featured,
        'category' => $product->category ? ['id' => $product->category->id, 'name' => $product->category->name, 'slug' => $product->category->slug] : null,
        'variants' => $product->variants->map(fn ($v) => [
            'id' => $v->id,
            'size' => $v->size,
            'flavor' => $v->flavor,
            'price' => (float) $v->price,
            'stock_quantity' => $v->stock_quantity,
        ]),
    ];

    return Inertia::render('LandingPage/ProductDetail', [
        'product' => $payload,
        'canRegister' => Features::enabled(Features::registration()),
    ])->toResponse(request())->withHeaders([
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
    ]);
})->name('shop.product');

Route::get('dashboard', function () {
    return Inertia::render('dashboard', ['section' => null]);
})->middleware(['auth', 'verified', 'admin'])->name('dashboard');

Route::get('/account', function (\Illuminate\Http\Request $request) {
    return Inertia::render('Account/Profile', [
        'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
        'status' => $request->session()->get('status'),
    ]);
})->middleware(['auth'])->name('account.profile');

/* ── Checkout ── */
Route::middleware(['auth'])->prefix('checkout')->name('checkout.')->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('index');
    Route::post('/', [CheckoutController::class, 'store'])->name('store');
    Route::get('/confirmation/{orderNumber}', [CheckoutController::class, 'confirmation'])->name('confirmation');
});

/* ── Cart ── */
Route::middleware(['auth'])->prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/', [CartController::class, 'store'])->name('store');
    Route::patch('/{cartItem}', [CartController::class, 'update'])->name('update');
    Route::delete('/{cartItem}', [CartController::class, 'destroy'])->name('destroy');
    Route::delete('/', [CartController::class, 'clear'])->name('clear');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('products')->name('products.')->group(function () {
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
})->middleware(['auth', 'verified', 'admin'])->where('section', 'orders|returns|customers|roles|discounts|coupons|banners|pages|blog|faq|sales|analytics|general|payments|shipping|email-templates')->name('dashboard.section');

require __DIR__.'/settings.php';
