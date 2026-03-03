<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect(): RedirectResponse
    {
        if (! config('services.google.client_id')) {
            return redirect()->back()
                ->with('status', 'Google sign-in is not configured yet. Please use email and password, or contact support.');
        }

        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the callback from Google after authentication.
     */
    public function callback(): RedirectResponse
    {
        $googleUser = Socialite::driver('google')->user();

        $user = User::where('google_id', $googleUser->getId())->first();

        if ($user) {
            $user->update([
                'name' => $googleUser->getName() ?: $user->name,
                'email' => $googleUser->getEmail() ?: $user->email,
            ]);
        } else {
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                $user->update(['google_id' => $googleUser->getId()]);
            } else {
                $user = User::create([
                    'name' => $googleUser->getName() ?? explode('@', $googleUser->getEmail())[0],
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => null,
                    'email_verified_at' => now(),
                ]);
            }
        }

        Auth::login($user, true);

        $this->mergeGuestCart(request());

        $redirectTo = $user->role === 'admin' ? '/dashboard' : '/';

        return redirect()->intended($redirectTo);
    }

    private function mergeGuestCart(\Illuminate\Http\Request $request): void
    {
        $guestCart = $request->session()->get('guest_cart', []);
        if (empty($guestCart) || ! $request->user()) {
            return;
        }
        foreach ($guestCart as $variantId => $qty) {
            $variant = ProductVariant::find($variantId);
            if (! $variant) {
                continue;
            }
            $item = CartItem::firstOrNew([
                'user_id' => $request->user()->id,
                'product_variant_id' => $variantId,
            ]);
            $item->quantity = min(($item->quantity ?? 0) + (int) $qty, $variant->stock_quantity ?: 99);
            $item->save();
        }
        $request->session()->forget('guest_cart');
    }
}
