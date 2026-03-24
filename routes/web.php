<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Products\CategoryController;
use App\Http\Controllers\Products\InventoryController;
use App\Http\Controllers\Products\ProductController;
use App\Models\LandingPageSetting;
use App\Models\Order;
use App\Models\Coupon;
use App\Models\ContactQuery;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/* ── Google OAuth ── */
Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');

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

Route::get('/favorites', function () {
    $products = [];
    try {
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
    $response = Inertia::render('LandingPage/Favorites', [
        'products' => $products,
        'canRegister' => Features::enabled(Features::registration()),
    ])->toResponse(request());

    return $response->withHeaders([
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
    ]);
})->name('favorites');

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

    $relatedProducts = Product::with('category', 'variants')
        ->where('id', '!=', $product->id)
        ->where(function ($q) use ($product) {
            $q->where('featured', true);
            if ($product->category_id) {
                $q->orWhere('category_id', $product->category_id);
            }
        })
        ->latest()
        ->limit(6)
        ->get()
        ->map(fn ($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'image_url' => $p->image_url,
            'category' => $p->category?->name,
            'price' => (float) $p->variants->min('price'),
        ])
        ->values();

    $reviews = ProductReview::with('user:id,name')
        ->where('product_id', $product->id)
        ->where('status', 'approved')
        ->latest()
        ->limit(25)
        ->get()
        ->map(fn ($r) => [
            'id' => $r->id,
            'rating' => (int) $r->rating,
            'comment' => $r->comment,
            'created_at' => $r->created_at->toDateTimeString(),
            'user' => [
                'name' => $r->user?->name ?? 'Customer',
            ],
        ])
        ->values();

    /** @var \Illuminate\Http\Response $response */
    $response = Inertia::render('LandingPage/ProductDetail', [
        'product' => $payload,
        'relatedProducts' => $relatedProducts,
        'reviews' => $reviews,
        'canRegister' => Features::enabled(Features::registration()),
    ])->toResponse(request());

    return $response->withHeaders([
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
    ]);
})->name('shop.product');

Route::post('/shop/product/{slug}/reviews', function (Request $request, string $slug) {
    $product = Product::where('slug', $slug)->firstOrFail();
    $data = $request->validate([
        'rating' => ['required', 'integer', 'min:1', 'max:5'],
        'comment' => ['nullable', 'string', 'max:500'],
    ]);

    ProductReview::updateOrCreate(
        ['product_id' => $product->id, 'user_id' => $request->user()->id],
        [
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
            'status' => 'pending',
            'moderated_by' => null,
            'moderated_at' => null,
        ],
    );

    return back()->with('status', 'Review submitted.');
})->middleware(['auth'])->name('shop.product.reviews.store');

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
    $ordersBase = Order::query()->where('status', '!=', 'cancelled');
    $now = now();
    $currentMonthStart = $now->copy()->startOfMonth();
    $currentMonthEnd = $now->copy()->endOfMonth();
    $previousMonthStart = $now->copy()->subMonth()->startOfMonth();
    $previousMonthEnd = $now->copy()->subMonth()->endOfMonth();

    $ordersCurrent = (clone $ordersBase)->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])->count();
    $ordersPrevious = (clone $ordersBase)->whereBetween('created_at', [$previousMonthStart, $previousMonthEnd])->count();

    $revenueCurrent = (float) (clone $ordersBase)->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])->sum('total');
    $revenuePrevious = (float) (clone $ordersBase)->whereBetween('created_at', [$previousMonthStart, $previousMonthEnd])->sum('total');

    $orderChange = $ordersPrevious > 0
        ? (($ordersCurrent - $ordersPrevious) / $ordersPrevious) * 100
        : ($ordersCurrent > 0 ? 100.0 : 0.0);
    $revenueChange = $revenuePrevious > 0
        ? (($revenueCurrent - $revenuePrevious) / $revenuePrevious) * 100
        : ($revenueCurrent > 0 ? 100.0 : 0.0);

    $dashboardSummary = [
        'total_orders' => (int) (clone $ordersBase)->count(),
        'revenue' => (float) (clone $ordersBase)->sum('total'),
        'products' => (int) Product::count(),
        'customers' => (int) User::where('role', '!=', 'admin')->count(),
        'order_change_pct' => (float) $orderChange,
        'revenue_change_pct' => (float) $revenueChange,
    ];

    $dashboardRecentOrders = Order::with('items')
        ->latest()
        ->limit(5)
        ->get()
        ->map(fn ($order) => [
            'order_number' => $order->order_number,
            'item' => $order->items->first()?->product_name ?? 'Order items',
            'amount' => (float) $order->total,
            'status' => ucfirst($order->status),
        ])
        ->values();

    return Inertia::render('dashboard', [
        'section' => null,
        'dashboardSummary' => $dashboardSummary,
        'dashboardRecentOrders' => $dashboardRecentOrders,
    ]);
})->middleware(['auth', 'verified', 'admin'])->name('dashboard');

Route::get('/account', function (\Illuminate\Http\Request $request) {
    return Inertia::render('Account/Profile', [
        'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
        'status' => $request->session()->get('status'),
    ]);
})->middleware(['auth'])->name('account.profile');

Route::get('/my-purchases', [OrderController::class, 'myOrders'])->middleware(['auth'])->name('account.orders');
Route::post('/my-purchases/{order}/reorder', [OrderController::class, 'reorder'])->middleware(['auth'])->name('account.orders.reorder');
Route::post('/my-purchases/{order}/return-request', [OrderController::class, 'requestReturn'])->middleware(['auth'])->name('account.orders.return-request');

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
Route::patch('dashboard/orders/{order}/return-status', function (Request $request, Order $order) {
    $data = $request->validate([
        'return_status' => ['required', 'in:none,requested,approved,rejected,received,refunded'],
    ]);
    $order->update(['return_status' => $data['return_status']]);
    return back()->with('status', 'Return status updated.');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard.orders.update-return-status');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::patch('dashboard/customers/{user}/toggle-active', function (User $user) {
        abort_if($user->role === 'admin', 403, 'Cannot deactivate an admin account.');
        $user->update(['is_active' => !$user->is_active]);
        return back();
    })->name('dashboard.customers.toggle-active');

    Route::delete('dashboard/customers/{user}', function (User $user) {
        abort_if($user->role === 'admin', 403, 'Cannot delete an admin account.');
        $user->delete();
        return back();
    })->name('dashboard.customers.destroy');

    Route::post('dashboard/discounts', function (Request $request) {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:30', 'unique:coupons,code'],
            'type' => ['required', 'in:percent,fixed'],
            'value' => ['required', 'numeric', 'min:0'],
            'min_subtotal' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
        ]);
        Coupon::create([
            'code' => strtoupper(trim($data['code'])),
            'type' => $data['type'],
            'value' => (float) $data['value'],
            'min_subtotal' => (float) ($data['min_subtotal'] ?? 0),
            'usage_limit' => $data['usage_limit'] ?? null,
            'is_active' => (bool) ($data['is_active'] ?? true),
            'starts_at' => $data['starts_at'] ?? null,
            'ends_at' => $data['ends_at'] ?? null,
        ]);
        return back()->with('status', 'Coupon created.');
    })->name('dashboard.discounts.store');

    Route::patch('dashboard/discounts/{coupon}', function (Request $request, Coupon $coupon) {
        $data = $request->validate([
            'type' => ['nullable', 'in:percent,fixed'],
            'value' => ['nullable', 'numeric', 'min:0'],
            'min_subtotal' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
        ]);
        $coupon->update($data);
        return back()->with('status', 'Coupon updated.');
    })->name('dashboard.discounts.update');

    Route::delete('dashboard/discounts/{coupon}', function (Coupon $coupon) {
        $coupon->delete();
        return back()->with('status', 'Coupon deleted.');
    })->name('dashboard.discounts.destroy');

    Route::patch('dashboard/reviews/{review}/status', function (Request $request, ProductReview $review) {
        $data = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected'],
        ]);
        $review->update([
            'status' => $data['status'],
            'moderated_by' => $request->user()->id,
            'moderated_at' => now(),
        ]);
        return back()->with('status', 'Review moderation updated.');
    })->name('dashboard.reviews.update-status');
});

Route::get('dashboard/{section}', function (Request $request, string $section) {
    if ($section === 'customers') {
        $users = User::withCount('orders')
            ->where('role', '!=', 'admin')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'profile_photo_url' => $user->profile_photo_url,
                'phone' => $user->phone,
                'address' => $user->address,
                'city' => $user->city,
                'province' => $user->province,
                'zip' => $user->zip,
                'orders_count' => $user->orders_count,
                'total_spent' => (float) $user->orders()->sum('total'),
                'created_at' => $user->created_at->toDateTimeString(),
            ];
        });

        $now = now();
        $nonAdmin = User::where('role', '!=', 'admin');
        $customerStats = [
            'total' => (clone $nonAdmin)->count(),
            'active' => (clone $nonAdmin)->where('is_active', true)->count(),
            'inactive' => (clone $nonAdmin)->where('is_active', false)->count(),
            'new_this_month' => (clone $nonAdmin)->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year)->count(),
        ];

        return Inertia::render('UserManagement/Customers', [
            'section' => $section,
            'users' => $users,
            'customerStats' => $customerStats,
        ]);
    }

    $payload = ['section' => $section];
    if ($section === 'orders') {
        $orderCounts = [
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::whereIn('status', ['processing', 'shipped'])->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];
        $orders = Order::with(['user:id,name,email,profile_photo_path', 'items'])->latest()->paginate(20);
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
                'user' => $order->user ? [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                    'profile_photo_url' => $order->user->profile_photo_url,
                ] : null,
                'items' => $order->items->map(fn ($item) => [
                    'product_name' => $item->product_name,
                    'variant_display_name' => $item->variant_display_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'line_total' => (float) $item->line_total,
                ]),
                'return_status' => $order->return_status,
                'return_reason' => $order->return_reason,
                'return_requested_at' => $order->return_requested_at?->toDateTimeString(),
            ];
        });
        $payload['orders'] = $orders;
        $payload['orderCounts'] = $orderCounts;
    }
    if ($section === 'returns') {
        $returns = Order::with('user:id,name,email')
            ->where('return_status', '!=', 'none')
            ->latest()
            ->paginate(20);
        $returns->getCollection()->transform(fn ($order) => [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'return_status' => $order->return_status,
            'return_reason' => $order->return_reason,
            'return_requested_at' => $order->return_requested_at?->toDateTimeString(),
            'total' => (float) $order->total,
            'user' => $order->user ? [
                'name' => $order->user->name,
                'email' => $order->user->email,
            ] : null,
        ]);
        return Inertia::render('Orders/Returns', [
            'section' => $section,
            'returns' => $returns,
        ]);
    }
    if ($section === 'discounts') {
        $coupons = Coupon::latest()->paginate(20);
        $coupons->getCollection()->transform(fn ($c) => [
            'id' => $c->id,
            'code' => $c->code,
            'type' => $c->type,
            'value' => (float) $c->value,
            'min_subtotal' => (float) $c->min_subtotal,
            'usage_limit' => $c->usage_limit,
            'used_count' => (int) $c->used_count,
            'is_active' => (bool) $c->is_active,
            'starts_at' => $c->starts_at?->toDateTimeString(),
            'ends_at' => $c->ends_at?->toDateTimeString(),
        ]);
        return Inertia::render('Reports/Discounts', [
            'section' => $section,
            'coupons' => $coupons,
        ]);
    }
    if ($section === 'reviews') {
        $reviews = ProductReview::with(['product:id,name,slug', 'user:id,name,email'])
            ->latest()
            ->paginate(25);
        $reviews->getCollection()->transform(fn ($r) => [
            'id' => $r->id,
            'rating' => (int) $r->rating,
            'comment' => $r->comment,
            'status' => $r->status,
            'created_at' => $r->created_at->toDateTimeString(),
            'moderated_at' => $r->moderated_at?->toDateTimeString(),
            'product' => $r->product ? ['name' => $r->product->name, 'slug' => $r->product->slug] : null,
            'user' => $r->user ? ['name' => $r->user->name, 'email' => $r->user->email] : null,
        ]);
        return Inertia::render('Products/ReviewsModeration', [
            'section' => $section,
            'reviews' => $reviews,
        ]);
    }
    if ($section === 'queries') {
        $queries = ContactQuery::latest()->paginate(30);
        $queries->getCollection()->transform(fn ($q) => [
            'id' => $q->id,
            'name' => $q->name,
            'email' => $q->email,
            'subject' => $q->subject,
            'message' => $q->message,
            'created_at' => $q->created_at->toDateTimeString(),
        ]);
        return Inertia::render('Support/Queries', [
            'section' => $section,
            'queries' => $queries,
        ]);
    }
    if ($section === 'feedbacks') {
        $feedbacks = ContactQuery::query()
            ->where(function ($q) {
                $q->where('subject', 'like', '%feedback%')
                    ->orWhere('subject', 'like', '%suggest%')
                    ->orWhere('subject', 'like', '%feature%')
                    ->orWhere('message', 'like', '%feedback%')
                    ->orWhere('message', 'like', '%suggest%')
                    ->orWhere('message', 'like', '%improve%');
            })
            ->latest()
            ->paginate(30);
        $feedbacks->getCollection()->transform(fn ($q) => [
            'id' => $q->id,
            'name' => $q->name,
            'email' => $q->email,
            'subject' => $q->subject,
            'message' => $q->message,
            'created_at' => $q->created_at->toDateTimeString(),
        ]);
        return Inertia::render('Support/Feedbacks', [
            'section' => $section,
            'feedbacks' => $feedbacks,
        ]);
    }
    if ($section === 'sales') {
        $range = $request->string('range')->toString();
        if (! in_array($range, ['days', 'weeks', 'months'], true)) {
            $range = 'days';
        }

        $now = now();
        $start = match ($range) {
            'weeks' => $now->copy()->startOfWeek()->subWeeks(11),
            'months' => $now->copy()->startOfMonth()->subMonths(11),
            default => $now->copy()->startOfDay()->subDays(29),
        };

        $baseSales = Order::query()
            ->where('created_at', '>=', $start);

        $validSales = (clone $baseSales)->where('status', '!=', 'cancelled');
        $totalOrders = (clone $validSales)->count();
        $grossSales = (float) (clone $validSales)->sum('total');
        $paidSales = (float) (clone $validSales)->where('payment_status', 'paid')->sum('total');
        $pendingSales = (float) (clone $validSales)->where('payment_status', '!=', 'paid')->sum('total');
        $avgTicket = $totalOrders > 0 ? $grossSales / $totalOrders : 0.0;

        $statusCounts = [
            'pending' => (int) (clone $baseSales)->where('status', 'pending')->count(),
            'processing' => (int) (clone $baseSales)->whereIn('status', ['processing', 'shipped'])->count(),
            'delivered' => (int) (clone $baseSales)->where('status', 'delivered')->count(),
            'cancelled' => (int) (clone $baseSales)->where('status', 'cancelled')->count(),
        ];

        $methodBreakdown = (clone $validSales)
            ->selectRaw('payment_method, COUNT(*) as orders_count, SUM(total) as amount')
            ->groupBy('payment_method')
            ->orderByDesc('amount')
            ->get()
            ->map(fn ($row) => [
                'payment_method' => (string) $row->payment_method,
                'orders_count' => (int) $row->orders_count,
                'amount' => (float) $row->amount,
            ])
            ->values();

        $recentSales = (clone $baseSales)
            ->with('user:id,name,email,profile_photo_path')
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user?->name ?? $order->shipping_name,
                'customer_email' => $order->user?->email,
                'profile_photo_url' => $order->user?->profile_photo_url,
                'total' => (float) $order->total,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at->toDateTimeString(),
            ])
            ->values();

        return Inertia::render('Reports/Sales', [
            'section' => $section,
            'sales' => [
                'range' => $range,
                'summary' => [
                    'gross_sales' => $grossSales,
                    'paid_sales' => $paidSales,
                    'pending_sales' => $pendingSales,
                    'total_orders' => $totalOrders,
                    'avg_ticket' => (float) $avgTicket,
                ],
                'status_counts' => $statusCounts,
                'payment_methods' => $methodBreakdown,
                'recent_sales' => $recentSales,
            ],
        ]);
    }
    if ($section === 'analytics') {
        $range = $request->string('range')->toString();
        if (! in_array($range, ['days', 'weeks', 'months'], true)) {
            $range = 'days';
        }

        $now = now();
        $start = match ($range) {
            'weeks' => $now->copy()->startOfWeek()->subWeeks(11),
            'months' => $now->copy()->startOfMonth()->subMonths(11),
            default => $now->copy()->startOfDay()->subDays(13),
        };

        $baseOrders = Order::query()
            ->where('created_at', '>=', $start)
            ->where('status', '!=', 'cancelled');

        $orders = (clone $baseOrders)->get(['id', 'user_id', 'total', 'created_at']);
        $summary = [
            'orders' => $orders->count(),
            'revenue' => (float) $orders->sum('total'),
            'avg_order_value' => $orders->count() > 0 ? (float) ($orders->sum('total') / $orders->count()) : 0.0,
            'unique_customers' => (int) $orders->pluck('user_id')->filter()->unique()->count(),
        ];

        $trendMap = [];
        if ($range === 'days') {
            for ($i = 13; $i >= 0; $i--) {
                $d = $now->copy()->subDays($i);
                $key = $d->format('Y-m-d');
                $trendMap[$key] = ['label' => $d->format('M d'), 'orders' => 0, 'revenue' => 0.0];
            }
            foreach ($orders as $o) {
                $key = $o->created_at->format('Y-m-d');
                if (isset($trendMap[$key])) {
                    $trendMap[$key]['orders']++;
                    $trendMap[$key]['revenue'] += (float) $o->total;
                }
            }
        } elseif ($range === 'weeks') {
            for ($i = 11; $i >= 0; $i--) {
                $w = $now->copy()->startOfWeek()->subWeeks($i);
                $key = $w->format('o-\WW');
                $trendMap[$key] = ['label' => $w->format('M d'), 'orders' => 0, 'revenue' => 0.0];
            }
            foreach ($orders as $o) {
                $key = $o->created_at->copy()->startOfWeek()->format('o-\WW');
                if (isset($trendMap[$key])) {
                    $trendMap[$key]['orders']++;
                    $trendMap[$key]['revenue'] += (float) $o->total;
                }
            }
        } else {
            for ($i = 11; $i >= 0; $i--) {
                $m = $now->copy()->startOfMonth()->subMonths($i);
                $key = $m->format('Y-m');
                $trendMap[$key] = ['label' => $m->format('M Y'), 'orders' => 0, 'revenue' => 0.0];
            }
            foreach ($orders as $o) {
                $key = $o->created_at->format('Y-m');
                if (isset($trendMap[$key])) {
                    $trendMap[$key]['orders']++;
                    $trendMap[$key]['revenue'] += (float) $o->total;
                }
            }
        }

        $topProducts = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.created_at', '>=', $start)
            ->where('orders.status', '!=', 'cancelled')
            ->selectRaw('order_items.product_name as name, SUM(order_items.quantity) as qty_sold, SUM(order_items.line_total) as revenue')
            ->groupBy('order_items.product_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn ($r) => [
                'name' => $r->name,
                'qty_sold' => (int) $r->qty_sold,
                'revenue' => (float) $r->revenue,
            ])
            ->values();

        $topCustomers = DB::table('orders')
            ->leftJoin('users', 'users.id', '=', 'orders.user_id')
            ->where('orders.created_at', '>=', $start)
            ->where('orders.status', '!=', 'cancelled')
            ->selectRaw('orders.user_id, COALESCE(users.name, orders.shipping_name) as name, users.email as email, COUNT(orders.id) as orders_count, SUM(orders.total) as spent')
            ->groupBy('orders.user_id', 'users.name', 'users.email', 'orders.shipping_name')
            ->orderByDesc('spent')
            ->limit(5)
            ->get()
            ->map(fn ($r) => [
                'name' => $r->name,
                'email' => $r->email,
                'orders_count' => (int) $r->orders_count,
                'spent' => (float) $r->spent,
            ])
            ->values();

        $analyticsPayload = [
            'range' => $range,
            'summary' => $summary,
            'trend' => array_values($trendMap),
            'top_products' => $topProducts,
            'top_customers' => $topCustomers,
        ];

        return Inertia::render('Reports/Analytics', [
            'section' => $section,
            'analytics' => $analyticsPayload,
        ]);
    }

    return Inertia::render('dashboard', $payload);
})->middleware(['auth', 'verified', 'admin'])->where('section', 'orders|returns|customers|roles|discounts|coupons|banners|pages|blog|faq|sales|analytics|general|payments|shipping|email-templates|reviews|queries|feedbacks')->name('dashboard.section');

require __DIR__.'/settings.php';
