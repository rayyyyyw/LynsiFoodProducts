import { Head, Link, usePage } from '@inertiajs/react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    const { section } = usePage().props as { section?: string | null };
    const sectionTitle = section ? sectionLabels[section] ?? section : null;
    const isSubSection = Boolean(section);

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
            </div>
        </AppLayout>
    );
}
