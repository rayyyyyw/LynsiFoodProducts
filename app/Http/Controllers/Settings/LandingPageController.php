<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\LandingPageSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    /**
     * Show the landing page settings form.
     */
    public function edit(): Response
    {
        $content = LandingPageSetting::getContent();

        return Inertia::render('settings/landing', [
            'content' => $content,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the landing page content.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'content' => 'required|array',
        ]);

        LandingPageSetting::setContent($request->input('content'));

        return redirect()->route('settings.landing')->with('status', 'Landing page content saved.');
    }
}
