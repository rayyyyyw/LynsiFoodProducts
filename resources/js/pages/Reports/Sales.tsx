import { Head, Link, usePage } from '@inertiajs/react';
import { BadgeCheck, Clock3, Coins, CreditCard, Receipt, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type SalesData = {
    range: 'days' | 'weeks' | 'months';
    summary: {
        gross_sales: number;
        paid_sales: number;
        pending_sales: number;
        total_orders: number;
        avg_ticket: number;
    };
    status_counts: {
        pending: number;
        processing: number;
        delivered: number;
        cancelled: number;
    };
    payment_methods: { payment_method: string; orders_count: number; amount: number }[];
    recent_sales: {
        id: number;
        order_number: string;
        customer_name: string;
        customer_email: string | null;
        profile_photo_url: string | null;
        total: number;
        status: string;
        payment_method: string;
        payment_status: string;
        created_at: string;
    }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Sales', href: '/dashboard/sales' },
];

function peso(value: number): string {
    return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

function statusStyle(status: string): string {
    if (status === 'pending') return 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
    if (status === 'processing' || status === 'shipped') return 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300';
    if (status === 'delivered') return 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
    return 'border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300';
}

export default function SalesPage() {
    const { sales } = usePage().props as { sales?: SalesData };
    const data: SalesData = sales ?? {
        range: 'days',
        summary: { gross_sales: 0, paid_sales: 0, pending_sales: 0, total_orders: 0, avg_ticket: 0 },
        status_counts: { pending: 0, processing: 0, delivered: 0, cancelled: 0 },
        payment_methods: [],
        recent_sales: [],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Revenue, payments, and order performance in one place.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {(['days', 'weeks', 'months'] as const).map((range) => (
                            <Link
                                key={range}
                                href={`/dashboard/sales?range=${range}`}
                                preserveScroll
                                className={cn(
                                    'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors',
                                    data.range === range
                                        ? 'bg-black text-white dark:bg-white dark:text-black'
                                        : 'bg-background text-muted-foreground hover:bg-muted',
                                )}
                            >
                                {range}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Gross sales</CardTitle>
                            <Coins className="size-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{peso(data.summary.gross_sales)}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Paid sales</CardTitle>
                            <BadgeCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{peso(data.summary.paid_sales)}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending payment</CardTitle>
                            <Clock3 className="size-4 text-amber-600 dark:text-amber-400" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{peso(data.summary.pending_sales)}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
                            <Receipt className="size-4 text-violet-600 dark:text-violet-400" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{data.summary.total_orders}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg ticket</CardTitle>
                            <CreditCard className="size-4 text-rose-600 dark:text-rose-400" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{peso(data.summary.avg_ticket)}</div></CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order status mix</CardTitle>
                            <CardDescription>How orders are distributed by status.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center justify-between rounded border p-2"><span>Pending</span><span className="font-semibold">{data.status_counts.pending}</span></div>
                            <div className="flex items-center justify-between rounded border p-2"><span>Processing</span><span className="font-semibold">{data.status_counts.processing}</span></div>
                            <div className="flex items-center justify-between rounded border p-2"><span>Delivered</span><span className="font-semibold">{data.status_counts.delivered}</span></div>
                            <div className="flex items-center justify-between rounded border p-2"><span>Cancelled</span><span className="font-semibold">{data.status_counts.cancelled}</span></div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Payment methods</CardTitle>
                            <CardDescription>Revenue split by payment method.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="px-4 py-3 text-left font-medium">Method</th>
                                            <th className="px-4 py-3 text-left font-medium">Orders</th>
                                            <th className="px-4 py-3 text-right font-medium">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.payment_methods.length === 0 ? (
                                            <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">No payment data yet.</td></tr>
                                        ) : (
                                            data.payment_methods.map((m) => (
                                                <tr key={m.payment_method} className="border-b last:border-0">
                                                    <td className="px-4 py-2.5 capitalize">{m.payment_method.replace('_', ' ')}</td>
                                                    <td className="px-4 py-2.5">{m.orders_count}</td>
                                                    <td className="px-4 py-2.5 text-right font-semibold">{peso(m.amount)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent sales</CardTitle>
                        <CardDescription>Latest orders in selected period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-lg border">
                            <table className="w-full min-w-[820px] text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Order #</th>
                                        <th className="px-4 py-3 text-left font-medium">Customer</th>
                                        <th className="px-4 py-3 text-left font-medium">Payment</th>
                                        <th className="px-4 py-3 text-right font-medium">Amount</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-left font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recent_sales.length === 0 ? (
                                        <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No sales yet.</td></tr>
                                    ) : (
                                        data.recent_sales.map((sale) => (
                                            <tr key={sale.id} className="border-b last:border-0 hover:bg-muted/20">
                                                <td className="px-4 py-2.5 font-mono text-muted-foreground">{sale.order_number}</td>
                                                <td className="px-4 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        {sale.profile_photo_url ? (
                                                            <img src={sale.profile_photo_url} alt={sale.customer_name} className="size-8 rounded-full border object-cover" />
                                                        ) : (
                                                            <div className="flex size-8 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-muted-foreground">
                                                                {(sale.customer_name || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium">{sale.customer_name}</p>
                                                            {sale.customer_email && <p className="truncate text-xs text-muted-foreground">{sale.customer_email}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <p className="capitalize">{sale.payment_method.replace('_', ' ')}</p>
                                                    <p className="text-xs text-muted-foreground">{sale.payment_status || '—'}</p>
                                                </td>
                                                <td className="px-4 py-2.5 text-right font-semibold">{peso(sale.total)}</td>
                                                <td className="px-4 py-2.5">
                                                    <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize', statusStyle(sale.status))}>
                                                        {sale.status === 'shipped' ? 'processing' : sale.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-muted-foreground">
                                                    {new Date(sale.created_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
