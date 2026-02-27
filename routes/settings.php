<?php

use App\Http\Controllers\Settings\LandingPageController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/general');
    Route::redirect('settings/password', '/settings/profile');

    Route::get('settings/general', fn () => Inertia::render('settings/general'))->middleware('admin')->name('settings.general');
    Route::get('settings/landing', [LandingPageController::class, 'edit'])->middleware('admin')->name('settings.landing');
    Route::put('settings/landing', [LandingPageController::class, 'update'])->middleware('admin')->name('settings.landing.update');
    Route::post('settings/landing/upload-location-image', [LandingPageController::class, 'uploadLocationImage'])->middleware('admin')->name('settings.landing.upload-location-image');
    Route::get('settings/appearance', fn () => redirect()->route('profile.edit'))->name('appearance.edit');

    Route::get('settings/profile', function (\Illuminate\Http\Request $request) {
        if ($request->user()?->role === 'buyer') {
            return redirect()->route('account.profile');
        }
        return (new ProfileController)->edit($request);
    })->name('profile.edit');

    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->middleware('admin')->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
