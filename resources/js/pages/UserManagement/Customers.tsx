import { Head, usePage } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role?: string | null;
    created_at: string;
};

type UsersPaginated = {
    data: UserRow[];
    links?: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Customers', href: dashboard('customers').url },
];

export default function Customers() {
    const { users } = usePage().props as {
        users?: UsersPaginated;
    };

    const list: UserRow[] = users?.data ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Customers
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            View and manage the customers who shop at Lynsi Food Products.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        <Users className="h-4 w-4" />
                        {list.length} shown
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer list</CardTitle>
                        <CardDescription>
                            Basic information about your registered users. You can cross-reference them with orders in the Orders section.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full min-w-[720px] text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Email</th>
                                        <th className="px-4 py-3 text-left font-medium">Role</th>
                                        <th className="px-4 py-3 text-left font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                No customers found yet. New user accounts will appear here.
                                            </td>
                                        </tr>
                                    ) : (
                                        list.map((user) => (
                                            <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{user.name}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs text-muted-foreground break-all">{user.email}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                        {user.role ?? 'customer'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(user.created_at).toLocaleDateString('en-PH', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: '2-digit',
                                                        })}
                                                    </span>
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

