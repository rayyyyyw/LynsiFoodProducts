<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard', ['section' => null]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('products/categories', function () {
    return Inertia::render('Products/Categories');
})->middleware(['auth', 'verified'])->name('products.categories');

Route::get('products/products', function () {
    return Inertia::render('Products/Products');
})->middleware(['auth', 'verified'])->name('products.products');

Route::get('products/inventory', function () {
    return Inertia::render('Products/Inventory');
})->middleware(['auth', 'verified'])->name('products.inventory');

Route::get('dashboard/{section}', function (string $section) {
    return Inertia::render('dashboard', ['section' => $section]);
})->middleware(['auth', 'verified'])->where('section', 'orders|returns|customers|roles|discounts|coupons|banners|pages|blog|faq|sales|analytics|general|payments|shipping|email-templates')->name('dashboard.section');

require __DIR__.'/settings.php';
