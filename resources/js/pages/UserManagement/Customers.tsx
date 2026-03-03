import { Head, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Eye,
    MapPin,
    MoreHorizontal,
    Phone,
    ShoppingBag,
    UserCheck,
    UserMinus,
    UserPlus,
    UserX,
    Users,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type UserRow = {
    id: number;
    name: string;
    email: string;
    is_active?: boolean;
    profile_photo_url?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    zip?: string | null;
    orders_count?: number;
    total_spent?: number;
    created_at: string;
};

type UsersPaginated = {
    data: UserRow[];
    links?: { url: string | null; label: string; active: boolean }[];
};

type CustomerStats = {
    total: number;
    active: number;
    inactive: number;
    new_this_month: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Customers', href: dashboard('customers').url },
];

const statCards = [
    { key: 'total', title: 'Total Customers', icon: Users, className: 'text-violet-600 dark:text-violet-400', description: 'All registered customers' },
    { key: 'active', title: 'Active', icon: UserCheck, className: 'text-emerald-600 dark:text-emerald-400', description: 'Currently active' },
    { key: 'inactive', title: 'Inactive', icon: UserX, className: 'text-red-600 dark:text-red-400', description: 'Deactivated accounts' },
    { key: 'new_this_month', title: 'New This Month', icon: UserPlus, className: 'text-blue-600 dark:text-blue-400', description: 'Joined this month' },
] as const;

function Avatar({ user, size = 'sm' }: { user: UserRow; size?: 'sm' | 'lg' }) {
    const dim = size === 'lg' ? 'size-14' : 'size-9';
    const textSize = size === 'lg' ? 'text-xl' : 'text-sm';

    if (user.profile_photo_url) {
        return (
            <img
                src={user.profile_photo_url}
                alt={user.name}
                className={cn(dim, 'rounded-full object-cover ring-2 ring-border')}
            />
        );
    }

    const colors = [
        'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
        'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    ];
    const color = colors[user.id % colors.length];

    return (
        <div className={cn(dim, 'flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-border', textSize, color)}>
            {user.name.charAt(0).toUpperCase()}
        </div>
    );
}

function formatAddress(user: UserRow): string | null {
    const parts = [user.address, user.city, user.province, user.zip].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
}

export default function Customers() {
    const { users, customerStats } = usePage().props as {
        users?: UsersPaginated;
        customerStats?: CustomerStats;
    };

    const list: UserRow[] = users?.data ?? [];
    const stats = customerStats ?? { total: 0, active: 0, inactive: 0, new_this_month: 0 };

    const [viewingUser, setViewingUser] = useState<UserRow | null>(null);

    const handleToggleActive = (user: UserRow) => {
        const action = user.is_active !== false ? 'deactivate' : 'reactivate';
        if (!confirm(`Are you sure you want to ${action} "${user.name}"?`)) return;
        router.patch(`/dashboard/customers/${user.id}/toggle-active`, {}, { preserveScroll: true });
    };

    const handleDelete = (user: UserRow) => {
        if (!confirm(`Permanently delete "${user.name}"? This action cannot be undone.`)) return;
        router.delete(`/dashboard/customers/${user.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            View and manage the customers who shop at Lynsi Food Products.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                        <Users className="h-4 w-4" />
                        {list.length} shown
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <Card key={stat.key}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                <stat.icon className={cn('size-4', stat.className)} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats[stat.key]}</div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Customer table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer list</CardTitle>
                        <CardDescription>
                            Basic information about your registered users. Use the actions menu to view, deactivate, or delete a user.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full min-w-[820px] text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Customer</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-left font-medium">Orders</th>
                                        <th className="px-4 py-3 text-left font-medium">Joined</th>
                                        <th className="px-4 py-3 text-center font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                No customers found yet. New user accounts will appear here.
                                            </td>
                                        </tr>
                                    ) : (
                                        list.map((user) => {
                                            const isActive = user.is_active !== false;
                                            return (
                                                <tr key={user.id} className={cn('border-b last:border-0 hover:bg-muted/30', !isActive && 'opacity-60')}>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar user={user} />
                                                            <div className="min-w-0">
                                                                <div className="truncate font-medium">{user.name}</div>
                                                                <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={cn(
                                                            'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                                                            isActive
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                                                                : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
                                                        )}>
                                                            <span className={cn('size-1.5 rounded-full', isActive ? 'bg-emerald-500' : 'bg-red-500')} />
                                                            {isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1.5 text-sm">
                                                            <ShoppingBag className="size-3.5 text-muted-foreground" />
                                                            <span className="font-medium">{user.orders_count ?? 0}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <CalendarDays className="size-3.5" />
                                                            {new Date(user.created_at).toLocaleDateString('en-PH', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: '2-digit',
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="size-8">
                                                                    <MoreHorizontal className="size-4" />
                                                                    <span className="sr-only">Actions</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-44">
                                                                <DropdownMenuItem onClick={() => setViewingUser(user)}>
                                                                    <Eye className="mr-2 size-4" />
                                                                    View details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                                                                    <UserMinus className="mr-2 size-4" />
                                                                    {isActive ? 'Deactivate' : 'Reactivate'}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(user)}
                                                                    className="text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 size-4" />
                                                                    Delete user
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users && users.links && users.data.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                {users.links.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                        disabled={!link.url}
                                        className={cn(
                                            'rounded px-3 py-1 text-sm transition-colors',
                                            link.active ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80',
                                            !link.url && 'pointer-events-none opacity-50',
                                        )}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* View user dialog */}
                <Dialog open={!!viewingUser} onOpenChange={(open) => !open && setViewingUser(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Customer Details</DialogTitle>
                        </DialogHeader>
                        {viewingUser && (() => {
                            const addr = formatAddress(viewingUser);
                            const isActive = viewingUser.is_active !== false;
                            return (
                                <div className="space-y-4">
                                    {/* Avatar + name */}
                                    <div className="flex items-center gap-4">
                                        <Avatar user={viewingUser} size="lg" />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-lg font-semibold">{viewingUser.name}</h3>
                                            <p className="truncate text-sm text-muted-foreground">{viewingUser.email}</p>
                                        </div>
                                    </div>

                                    {/* Info grid */}
                                    <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Status</p>
                                            <div className="mt-1 flex items-center gap-1.5">
                                                <span className={cn('size-2 rounded-full', isActive ? 'bg-emerald-500' : 'bg-red-500')} />
                                                <span className="text-sm font-medium">{isActive ? 'Active' : 'Inactive'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Customer ID</p>
                                            <p className="mt-1 text-sm font-mono">{viewingUser.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Total Orders</p>
                                            <div className="mt-1 flex items-center gap-1.5">
                                                <ShoppingBag className="size-3.5 text-muted-foreground" />
                                                <span className="text-sm font-semibold">{viewingUser.orders_count ?? 0}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Total Spent</p>
                                            <p className="mt-1 text-sm font-semibold">
                                                ₱{(viewingUser.total_spent ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs font-medium text-muted-foreground">Joined</p>
                                            <div className="mt-1 flex items-center gap-1.5 text-sm">
                                                <CalendarDays className="size-3.5 text-muted-foreground" />
                                                {new Date(viewingUser.created_at).toLocaleDateString('en-PH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact & address */}
                                    {(viewingUser.phone || addr) && (
                                        <div className="space-y-2 rounded-lg border p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact & Address</p>
                                            {viewingUser.phone && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="size-3.5 text-muted-foreground" />
                                                    {viewingUser.phone}
                                                </div>
                                            )}
                                            {addr && (
                                                <div className="flex items-start gap-2 text-sm">
                                                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                                                    <span>{addr}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => { handleToggleActive(viewingUser); setViewingUser(null); }}
                                        >
                                            <UserMinus className="mr-2 size-4" />
                                            {isActive ? 'Deactivate' : 'Reactivate'}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => { handleDelete(viewingUser); setViewingUser(null); }}
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            );
                        })()}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
