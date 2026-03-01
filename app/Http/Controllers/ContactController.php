<?php

namespace App\Http\Controllers;

use App\Models\ContactQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:10000'],
        ]);

        $validated['user_id'] = $request->user()?->id;

        ContactQuery::create($validated);

        return redirect()->route('contact')->with('status', 'Thank you! Your message has been sent. We’ll get back to you within 24 hours.');
    }
}
