<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /** List the authenticated user's orders (my purchases). */
    public function myOrders(Request $request): Response
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10)
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total' => (float) $order->total,
                'created_at' => $order->created_at->toDateTimeString(),
                'item_count' => $order->items()->count(),
            ]);

        return Inertia::render('Account/Orders', [
            'orders' => $orders,
        ]);
    }

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
