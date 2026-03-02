<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /** Update order status (admin). */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,delivered,cancelled'],
        ]);

        $order->update(['status' => $data['status']]);

        return back()->with('status', 'Order status updated.');
    }
}
