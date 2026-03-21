import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, Coins, ShoppingCart, Users } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type AnalyticsData = {
    range: 'days' | 'weeks' | 'months';
    summary: {
        orders: number;
        revenue: number;
        avg_order_value: number;
        unique_customers: number;
    };
    trend: { label: string; orders: number; revenue: number }[];
    top_products: { name: string; qty_sold: number; revenue: number }[];
    top_customers: {
        name: string;
        email: string | null;
        orders_count: number;
        spent: number;
    }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Analytics', href: '/dashboard/analytics' },
];

function peso(value: number): string {
    return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

export default function AnalyticsPage() {
    const { analytics } = usePage().props as { analytics?: AnalyticsData };
    const data: AnalyticsData = analytics ?? {
        range: 'days',
        summary: {
            orders: 0,
            revenue: 0,
            avg_order_value: 0,
            unique_customers: 0,
        },
        trend: [],
        top_products: [],
        top_customers: [],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Analytics
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Business performance overview with real sales,
                            customer, and product data.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {(['days', 'weeks', 'months'] as const).map((range) => (
                            <Link
                                key={range}
                                href={`/dashboard/analytics?range=${range}`}
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

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total orders
                            </CardTitle>
                            <ShoppingCart className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.summary.orders}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Completed or processing orders
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Revenue
                            </CardTitle>
                            <Coins className="size-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {peso(data.summary.revenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total gross sales
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Avg order value
                            </CardTitle>
                            <BarChart3 className="size-4 text-amber-600 dark:text-amber-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {peso(data.summary.avg_order_value)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Revenue per order
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Unique customers
                            </CardTitle>
                            <Users className="size-4 text-violet-600 dark:text-violet-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.summary.unique_customers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Customers who placed orders
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Revenue trend</CardTitle>
                            <CardDescription>
                                Period-by-period order count and revenue.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="px-4 py-3 text-left font-medium">
                                                Period
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Orders
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.trend.map((row, i) => (
                                            <tr
                                                key={`${row.label}-${i}`}
                                                className="border-b last:border-0 hover:bg-muted/20"
                                            >
                                                <td className="px-4 py-2.5 text-muted-foreground">
                                                    {row.label}
                                                </td>
                                                <td className="px-4 py-2.5 font-medium">
                                                    {row.orders}
                                                </td>
                                                <td className="px-4 py-2.5 text-right font-semibold">
                                                    {peso(row.revenue)}
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
                            <CardTitle>Top products</CardTitle>
                            <CardDescription>
                                Highest product revenue in selected range.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {data.top_products.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No product data yet.
                                </p>
                            ) : (
                                data.top_products.map((p, idx) => (
                                    <div
                                        key={`${p.name}-${idx}`}
                                        className="rounded-lg border p-2.5"
                                    >
                                        <p className="line-clamp-1 text-sm font-medium">
                                            {p.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {p.qty_sold} sold
                                        </p>
                                        <p className="text-sm font-semibold">
                                            {peso(p.revenue)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Top customers</CardTitle>
                        <CardDescription>
                            Customers with highest spending in selected range.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-lg border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Orders
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Spent
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.top_customers.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-4 py-6 text-center text-muted-foreground"
                                            >
                                                No customer data yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.top_customers.map((c, idx) => (
                                            <tr
                                                key={`${c.name}-${idx}`}
                                                className="border-b last:border-0 hover:bg-muted/20"
                                            >
                                                <td className="px-4 py-2.5">
                                                    <p className="font-medium">
                                                        {c.name}
                                                    </p>
                                                    {c.email && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {c.email}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    {c.orders_count}
                                                </td>
                                                <td className="px-4 py-2.5 text-right font-semibold">
                                                    {peso(c.spent)}
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
