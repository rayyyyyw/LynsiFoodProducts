import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Package, ShoppingCart, Users, TrendingUp, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
type OrderItemRow = {
    product_name: string;
    variant_display_name: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
};

type OrderRow = {
    id: number;
    order_number: string;
    status: string;
    payment_method: string;
    payment_status: string;
    shipping_name: string;
    shipping_phone: string | null;
    shipping_address: string | null;
    shipping_city: string | null;
    shipping_province: string | null;
    shipping_zip: string | null;
    total: number;
    subtotal: number;
    notes: string | null;
    created_at: string;
    user: { id: number; name: string; email: string; profile_photo_url?: string | null } | null;
    items: OrderItemRow[];
};

type OrdersPaginated = {
    data: OrderRow[];
    links?: { url: string | null; label: string; active: boolean }[];
};
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const sectionLabels: Record<string, string> = {
    categories: 'Categories',
    products: 'Products',
    inventory: 'Inventory',
    orders: 'Orders',
    returns: 'Returns',
    customers: 'Customers',
    roles: 'Roles & Permissions',
    discounts: 'Discounts',
    coupons: 'Coupons',
    banners: 'Banners',
    pages: 'Pages',
    blog: 'Blog',
    faq: 'FAQ',
    sales: 'Sales',
    analytics: 'Analytics',
    general: 'General',
    payments: 'Payments',
    shipping: 'Shipping',
    'email-templates': 'Email templates',
};

const stats = [
    {
        title: 'Total Orders',
        value: '24',
        change: '+12% from last month',
        icon: ShoppingCart,
        className: 'text-emerald-600 dark:text-emerald-400',
    },
    {
        title: 'Revenue',
        value: '₱124,500',
        change: '+8% from last month',
        icon: TrendingUp,
        className: 'text-blue-600 dark:text-blue-400',
    },
    {
        title: 'Products',
        value: '500+',
        change: 'Certified organic',
        icon: Package,
        className: 'text-amber-600 dark:text-amber-400',
    },
    {
        title: 'Customers',
        value: '50k+',
        change: 'Happy customers',
        icon: Users,
        className: 'text-violet-600 dark:text-violet-400',
    },
];

const recentOrders = [
    { id: '#1024', item: 'Organic Hass Avocados', amount: '₱350', status: 'Delivered' },
    { id: '#1023', item: 'Farm-Fresh Tomatoes', amount: '₱120', status: 'Shipped' },
    { id: '#1022', item: 'Free-Range Brown Eggs', amount: '₱240', status: 'Processing' },
    { id: '#1021', item: 'Artisan Sourdough', amount: '₱180', status: 'Delivered' },
    { id: '#1020', item: 'Organic Veggie Bundle', amount: '₱420', status: 'Shipped' },
];

export default function Dashboard() {
    const { section, orders, orderCounts } = usePage().props as {
        section?: string | null;
        orders?: OrdersPaginated;
        orderCounts?: { pending: number; processing: number; delivered: number; cancelled: number };
    };
    const sectionTitle = section ? sectionLabels[section] ?? section : null;
    const isSubSection = Boolean(section);
    const isOrdersSection = section === 'orders' && orders;
    const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={sectionTitle ?? 'Dashboard'} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {sectionTitle ?? 'Dashboard'}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {isSubSection
                            ? `Manage your ${sectionTitle?.toLowerCase() ?? 'section'} from here.`
                            : 'Welcome back. Here’s what’s happening with Lynsi Food Products today.'}
                    </p>
                </div>

                {isOrdersSection ? (
                    <>
                        {/* Status summary cards – same style as main dashboard stats */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending orders</CardTitle>
                                    <Clock className={cn('size-4', 'text-amber-600 dark:text-amber-400')} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{orderCounts?.pending ?? 0}</div>
                                    <p className="text-xs text-muted-foreground">Awaiting fulfillment</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
                                    <Truck className={cn('size-4', 'text-blue-600 dark:text-blue-400')} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{orderCounts?.processing ?? 0}</div>
                                    <p className="text-xs text-muted-foreground">In progress / in transit</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Done</CardTitle>
                                    <CheckCircle className={cn('size-4', 'text-emerald-600 dark:text-emerald-400')} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{orderCounts?.delivered ?? 0}</div>
                                    <p className="text-xs text-muted-foreground">Delivered</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
                                    <XCircle className={cn('size-4', 'text-red-600 dark:text-red-400')} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{orderCounts?.cancelled ?? 0}</div>
                                    <p className="text-xs text-muted-foreground">Cancelled orders</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Customer orders table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer orders</CardTitle>
                                <CardDescription>Orders placed by users. Fulfill and track each order here.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto rounded-lg border">
                                <table className="w-full min-w-[800px] text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="px-4 py-3 text-left font-medium">Order #</th>
                                            <th className="px-4 py-3 text-left font-medium">Customer</th>
                                            <th className="px-4 py-3 text-left font-medium">Items</th>
                                            <th className="px-4 py-3 text-left font-medium">Ship to</th>
                                            <th className="px-4 py-3 text-right font-medium">Total</th>
                                            <th className="px-4 py-3 text-left font-medium">Status</th>
                                            <th className="px-4 py-3 text-left font-medium">Date</th>
                                            <th className="px-4 py-3 text-left font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                                    No orders yet. Customer orders from checkout will appear here.
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.data.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="border-b last:border-0 hover:bg-muted/30"
                                                >
                                                    <td className="px-4 py-3 font-mono text-muted-foreground whitespace-nowrap">
                                                        {order.order_number}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            {order.user?.profile_photo_url ? (
                                                                <img
                                                                    src={order.user.profile_photo_url}
                                                                    alt={order.user?.name ?? 'Buyer'}
                                                                    className="size-9 rounded-full border object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex size-9 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-muted-foreground">
                                                                    {(order.user?.name ?? order.shipping_name ?? 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            <div className="min-w-0">
                                                                <div className="font-medium">{order.user?.name ?? order.shipping_name ?? '—'}</div>
                                                                {order.user?.email && (
                                                                    <span className="block truncate text-xs text-muted-foreground">{order.user.email}</span>
                                                                )}
                                                                {order.shipping_phone && (
                                                                    <span className="block text-xs text-muted-foreground">{order.shipping_phone}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 max-w-[200px]">
                                                        <div className="space-y-0.5">
                                                            {order.items.slice(0, 3).map((item, i) => (
                                                                <div key={i} className="text-xs">
                                                                    {item.quantity}× {item.product_name}
                                                                    {item.variant_display_name ? ` (${item.variant_display_name})` : ''}
                                                                </div>
                                                            ))}
                                                            {order.items.length > 3 && (
                                                                <div className="text-xs text-muted-foreground">+{order.items.length - 3} more</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 max-w-[180px]">
                                                        <div className="text-xs">
                                                            <span className="font-medium">{order.shipping_name}</span>
                                                            {order.shipping_address && (
                                                                <span className="block text-muted-foreground truncate" title={order.shipping_address}>
                                                                    {order.shipping_address}
                                                                </span>
                                                            )}
                                                            {(order.shipping_city || order.shipping_province) && (
                                                                <span className="block text-muted-foreground">
                                                                    {[order.shipping_city, order.shipping_province, order.shipping_zip].filter(Boolean).join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                                                        ₱{Number(order.total).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Select
                                                            value={order.status === 'shipped' ? 'processing' : order.status}
                                                            onValueChange={(status) => {
                                                                router.patch(`/dashboard/orders/${order.id}/status`, { status }, { preserveScroll: true });
                                                            }}
                                                        >
                                                            <SelectTrigger
                                                                className={cn(
                                                                    'h-8 min-w-[130px] text-xs font-medium',
                                                                    order.status === 'pending' && 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                                                                    (order.status === 'processing' || order.status === 'shipped') && 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
                                                                    order.status === 'delivered' && 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                                                                    order.status === 'cancelled' && 'border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300',
                                                                )}
                                                            >
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent align="end" className="min-w-[160px]">
                                                                <SelectItem value="pending" className="flex items-center gap-2 text-xs">
                                                                    <Clock className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                                    Pending
                                                                </SelectItem>
                                                                <SelectItem value="processing" className="flex items-center gap-2 text-xs">
                                                                    <Truck className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                                    Processing
                                                                </SelectItem>
                                                                <SelectItem value="delivered" className="flex items-center gap-2 text-xs">
                                                                    <CheckCircle className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                    Done
                                                                </SelectItem>
                                                                <SelectItem value="cancelled" className="flex items-center gap-2 text-xs">
                                                                    <XCircle className="size-3.5 text-red-600 dark:text-red-400" />
                                                                    Cancelled
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                                        {new Date(order.created_at).toLocaleString(undefined, {
                                                            dateStyle: 'short',
                                                            timeStyle: 'short',
                                                        })}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Button type="button" variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                                            View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {orders.data.length > 0 && orders.links && (
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                    {orders.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={cn(
                                                'rounded px-3 py-1 text-sm',
                                                link.active ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80',
                                                !link.url && 'pointer-events-none opacity-50',
                                            )}
                                            preserveScroll
                                        >
                                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                        </Link>
                                    ))}
                                </div>
                            )}
                                </CardContent>
                            </Card>

                            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Order details</DialogTitle>
                                    </DialogHeader>
                                    {selectedOrder && (
                                        <div className="space-y-4 text-sm">
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="rounded-lg border p-3">
                                                    <p className="text-xs text-muted-foreground">Order #</p>
                                                    <p className="font-medium">{selectedOrder.order_number}</p>
                                                </div>
                                                <div className="rounded-lg border p-3">
                                                    <p className="text-xs text-muted-foreground">Placed</p>
                                                    <p className="font-medium">
                                                        {new Date(selectedOrder.created_at).toLocaleString(undefined, {
                                                            dateStyle: 'medium',
                                                            timeStyle: 'short',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="rounded-lg border p-3">
                                                <p className="text-xs text-muted-foreground">Customer</p>
                                                <div className="mt-2 flex items-center gap-3">
                                                    {selectedOrder.user?.profile_photo_url ? (
                                                        <img
                                                            src={selectedOrder.user.profile_photo_url}
                                                            alt={selectedOrder.user?.name ?? 'Buyer'}
                                                            className="size-10 rounded-full border object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex size-10 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-muted-foreground">
                                                            {(selectedOrder.user?.name ?? selectedOrder.shipping_name ?? 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-medium">{selectedOrder.user?.name ?? selectedOrder.shipping_name}</p>
                                                        {selectedOrder.user?.email && <p className="truncate text-muted-foreground">{selectedOrder.user.email}</p>}
                                                        {selectedOrder.shipping_phone && <p className="text-muted-foreground">{selectedOrder.shipping_phone}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-lg border p-3">
                                                <p className="text-xs text-muted-foreground">Shipping address</p>
                                                <p className="font-medium">{selectedOrder.shipping_name}</p>
                                                <p className="text-muted-foreground">
                                                    {[selectedOrder.shipping_address, selectedOrder.shipping_city, selectedOrder.shipping_province, selectedOrder.shipping_zip]
                                                        .filter(Boolean)
                                                        .join(', ') || '—'}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border p-3">
                                                <p className="mb-2 text-xs text-muted-foreground">Items</p>
                                                <div className="space-y-2">
                                                    {selectedOrder.items.map((item, i) => (
                                                        <div key={i} className="flex items-start justify-between gap-3 border-b pb-2 last:border-0 last:pb-0">
                                                            <div>
                                                                <p className="font-medium">
                                                                    {item.quantity}x {item.product_name}
                                                                    {item.variant_display_name ? ` (${item.variant_display_name})` : ''}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Unit: ₱{Number(item.unit_price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                                </p>
                                                            </div>
                                                            <p className="font-semibold">
                                                                ₱{Number(item.line_total).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-3">
                                                <div className="rounded-lg border p-3">
                                                    <p className="text-xs text-muted-foreground">Payment</p>
                                                    <p className="font-medium capitalize">{selectedOrder.payment_method.replace('_', ' ')}</p>
                                                    {selectedOrder.payment_status && (
                                                        <p className="text-xs text-muted-foreground">{selectedOrder.payment_status}</p>
                                                    )}
                                                </div>
                                                <div className="rounded-lg border p-3">
                                                    <p className="text-xs text-muted-foreground">Status</p>
                                                    <span
                                                        className={cn(
                                                            'mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
                                                            selectedOrder.status === 'pending' &&
                                                                'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                                                            (selectedOrder.status === 'processing' || selectedOrder.status === 'shipped') &&
                                                                'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
                                                            selectedOrder.status === 'delivered' &&
                                                                'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                                                            selectedOrder.status === 'cancelled' &&
                                                                'border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300',
                                                        )}
                                                    >
                                                        {selectedOrder.status === 'shipped' ? 'processing' : selectedOrder.status}
                                                    </span>
                                                </div>
                                                <div className="rounded-lg border p-3">
                                                    <p className="text-xs text-muted-foreground">Total</p>
                                                    <p className="font-semibold">
                                                        ₱{Number(selectedOrder.total).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            </div>

                                            {selectedOrder.notes && (
                                                <div className="rounded-lg border border-amber-300 bg-amber-50/80 p-3 dark:border-amber-700 dark:bg-amber-950/30">
                                                    <p className="text-xs font-medium text-amber-800 dark:text-amber-300">Notes</p>
                                                    <p className="mt-1 text-amber-900 dark:text-amber-200">{selectedOrder.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <Card key={stat.title}>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            {stat.title}
                                        </CardTitle>
                                        <stat.icon className={cn('size-4', stat.className)} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Recent orders + Quick actions */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Recent orders</CardTitle>
                                    <CardDescription>Latest orders from your store.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-hidden rounded-lg border">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-muted/50">
                                                    <th className="px-4 py-3 text-left font-medium">Order</th>
                                                    <th className="px-4 py-3 text-left font-medium">Item</th>
                                                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentOrders.map((order) => (
                                                    <tr
                                                        key={order.id}
                                                        className="border-b last:border-0 hover:bg-muted/30"
                                                    >
                                                        <td className="px-4 py-3 font-mono text-muted-foreground">
                                                            {order.id}
                                                        </td>
                                                        <td className="px-4 py-3">{order.item}</td>
                                                        <td className="px-4 py-3">{order.amount}</td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={cn(
                                                                    'rounded-full px-2 py-0.5 text-xs font-medium',
                                                                    order.status === 'Delivered' &&
                                                                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                                                                    order.status === 'Shipped' &&
                                                                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                                                                    order.status === 'Processing' &&
                                                                        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                                                                )}
                                                            >
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick actions</CardTitle>
                                    <CardDescription>Shortcuts for common tasks.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <Link
                                        href="/products/products"
                                        className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
                                    >
                                        <Package className="size-4 text-muted-foreground" />
                                        <span>Add new product</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/orders"
                                        className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
                                    >
                                        <ShoppingCart className="size-4 text-muted-foreground" />
                                        <span>View all orders</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/customers"
                                        className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
                                    >
                                        <Users className="size-4 text-muted-foreground" />
                                        <span>Manage customers</span>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
