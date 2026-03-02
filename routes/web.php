<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Products\CategoryController;
use App\Http\Controllers\Products\InventoryController;
use App\Http\Controllers\Products\ProductController;
use App\Models\LandingPageSetting;
use App\Models\Order;
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
                    'id' => $v->id,
                    'size' => $v->size,
                    'flavor' => $v->flavor,
                    'price' => $v->price,
                    'stock_quantity' => $v->stock_quantity,
                ]),
            ]);
        }
    } catch (\Throwable $e) {
    }

    /** @var \Illuminate\Http\Response $response */
    $response = Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'landingContent' => $landingContent,
        'featuredProducts' => $featuredProducts,
    ])->toResponse(request());

    return $response->withHeaders([
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

    /** @var \Illuminate\Http\Response $response */
    $response = Inertia::render('LandingPage/Shop', [
        'products' => $products,
        'categories' => $categories,
        'canRegister' => Features::enabled(Features::registration()),
    ])->toResponse(request());

    return $response->withHeaders([
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

    /** @var \Illuminate\Http\Response $response */
    $response = Inertia::render('LandingPage/ProductDetail', [
        'product' => $payload,
        'canRegister' => Features::enabled(Features::registration()),
    ])->toResponse(request());

    return $response->withHeaders([
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
    ]);
})->name('shop.product');

Route::get('/locations', function () {
    $locations = null;
    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('landing_page_settings')) {
            $content = LandingPageSetting::getContent();
            $locations = $content['locations'] ?? null;
        }
    } catch (\Throwable $e) {
    }
    $locations = $locations ?? LandingPageSetting::defaultContent()['locations'];

    /** @var \Illuminate\Http\Response $response */
    $response = Inertia::render('LandingPage/Locations', [
        'locations' => $locations,
        'canRegister' => Features::enabled(Features::registration()),
    ])->toResponse(request());

    return $response->withHeaders([
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
    ]);
})->name('locations');

Route::get('/about', function () {
    $aboutUs = null;
    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('landing_page_settings')) {
            $content = LandingPageSetting::getContent();
            $aboutUs = $content['aboutUs'] ?? null;
        }
    } catch (\Throwable $e) {
    }
    $aboutUs = $aboutUs ?? LandingPageSetting::defaultContent()['aboutUs'];

    /** @var \Illuminate\Http\Response $response */
    $response = Inertia::render('LandingPage/About', [
        'aboutUs' => $aboutUs,
        'canRegister' => Features::enabled(Features::registration()),
    ])->toResponse(request());

    return $response->withHeaders([
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
    ]);
})->name('about');

Route::get('/contact', function () {
    $contactUs = null;
    try {
        if (\Illuminate\Support\Facades\Schema::hasTable('landing_page_settings')) {
            $content = LandingPageSetting::getContent();
            $contactUs = $content['contactUs'] ?? null;
        }
    } catch (\Throwable $e) {
    }
    $contactUs = $contactUs ?? LandingPageSetting::defaultContent()['contactUs'];

    /** @var \Illuminate\Http\Response $response */
    $response = Inertia::render('LandingPage/Contact', [
        'contactUs' => $contactUs,
        'canRegister' => Features::enabled(Features::registration()),
    ])->toResponse(request());

    return $response->withHeaders([
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
    ]);
})->name('contact');

Route::post('/contact', [ContactController::class, 'store'])->middleware('auth')->name('contact.store');

Route::get('dashboard', function () {
    return Inertia::render('dashboard', ['section' => null]);
})->middleware(['auth', 'verified', 'admin'])->name('dashboard');

Route::get('/account', function (\Illuminate\Http\Request $request) {
    return Inertia::render('Account/Profile', [
        'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
        'status' => $request->session()->get('status'),
    ]);
})->middleware(['auth'])->name('account.profile');

Route::get('/my-purchases', [OrderController::class, 'myOrders'])->middleware(['auth'])->name('account.orders');

/* ── Checkout ── */
Route::middleware(['auth'])->prefix('checkout')->name('checkout.')->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('index');
    Route::post('/', [CheckoutController::class, 'store'])->name('store');
    Route::get('/confirmation/{orderNumber}', [CheckoutController::class, 'confirmation'])->name('confirmation');
});

/* ── Cart ── */
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/guest/{variantId}', [CartController::class, 'updateGuest'])->name('cart.guest.update');
Route::delete('/cart/guest/{variantId}', [CartController::class, 'destroyGuest'])->name('cart.guest.destroy');
Route::delete('/cart/guest', [CartController::class, 'clearGuest'])->name('cart.guest.clear');
Route::middleware(['auth'])->prefix('cart')->name('cart.')->group(function () {
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

Route::patch('dashboard/orders/{order}/status', [OrderController::class, 'updateStatus'])->middleware(['auth', 'verified', 'admin'])->name('dashboard.orders.update-status');
Route::get('dashboard/{section}', function (string $section) {
    $payload = ['section' => $section];
    if ($section === 'orders') {
        $orderCounts = [
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::whereIn('status', ['processing', 'shipped'])->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];
        $orders = Order::with(['user:id,name,email', 'items'])->latest()->paginate(20);
        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
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
                'total' => (float) $order->total,
                'subtotal' => (float) $order->subtotal,
                'notes' => $order->notes,
                'created_at' => $order->created_at->toDateTimeString(),
                'user' => $order->user ? ['id' => $order->user->id, 'name' => $order->user->name, 'email' => $order->user->email] : null,
                'items' => $order->items->map(fn ($item) => [
                    'product_name' => $item->product_name,
                    'variant_display_name' => $item->variant_display_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'line_total' => (float) $item->line_total,
                ]),
            ];
        });
        $payload['orders'] = $orders;
        $payload['orderCounts'] = $orderCounts;
    }

    return Inertia::render('dashboard', $payload);
})->middleware(['auth', 'verified', 'admin'])->where('section', 'orders|returns|customers|roles|discounts|coupons|banners|pages|blog|faq|sales|analytics|general|payments|shipping|email-templates')->name('dashboard.section');

require __DIR__.'/settings.php';
