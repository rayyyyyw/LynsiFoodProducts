import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type ReturnRow = {
    id: number;
    order_number: string;
    status: string;
    return_status: 'none' | 'requested' | 'approved' | 'rejected' | 'received' | 'refunded';
    return_reason: string | null;
    return_requested_at: string | null;
    total: number;
    user: { name: string; email: string } | null;
};

type Paginated<T> = {
    data: T[];
    links?: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Returns', href: '/dashboard/returns' },
];

export default function ReturnsPage({ returns }: { returns: Paginated<ReturnRow> }) {
    const [statusFilter, setStatusFilter] = useState<'all' | ReturnRow['return_status']>('all');
    const [query, setQuery] = useState('');
    const filteredReturns = useMemo(
        () =>
            returns.data.filter((row) => {
                const statusOk = statusFilter === 'all' || row.return_status === statusFilter;
                const q = query.trim().toLowerCase();
                const qOk =
                    q.length === 0 ||
                    row.order_number.toLowerCase().includes(q) ||
                    row.user?.name.toLowerCase().includes(q) ||
                    row.user?.email.toLowerCase().includes(q) ||
                    row.return_reason?.toLowerCase().includes(q);
                return statusOk && qOk;
            }),
        [returns.data, query, statusFilter],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Returns" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <h1 className="text-2xl font-bold">Returns</h1>
                <div className="grid gap-2 rounded-xl border bg-white p-3 md:grid-cols-3">
                    <input
                        className="rounded border px-3 py-2 text-sm"
                        placeholder="Search order, customer, reason"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select
                        className="rounded border px-3 py-2 text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | ReturnRow['return_status'])}
                    >
                        <option value="all">All return statuses</option>
                        {['requested', 'approved', 'rejected', 'received', 'refunded'].map((v) => (
                            <option key={v} value={v}>
                                {v}
                            </option>
                        ))}
                    </select>
                    <div className="flex items-center text-sm text-muted-foreground">
                        Showing {filteredReturns.length} of {returns.data.length}
                    </div>
                </div>
                <div className="overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full min-w-[900px] text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-3 py-2 text-left">Order</th>
                                <th className="px-3 py-2 text-left">Customer</th>
                                <th className="px-3 py-2 text-left">Order status</th>
                                <th className="px-3 py-2 text-left">Return status</th>
                                <th className="px-3 py-2 text-left">Reason</th>
                                <th className="px-3 py-2 text-left">Requested</th>
                                <th className="px-3 py-2 text-right">Total</th>
                                <th className="px-3 py-2 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReturns.length === 0 ? (
                                <tr>
                                    <td className="px-3 py-8 text-center text-muted-foreground" colSpan={8}>
                                        No return requests match your filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredReturns.map((row) => (
                                    <tr key={row.id} className="border-t">
                                        <td className="px-3 py-2 font-mono">{row.order_number}</td>
                                        <td className="px-3 py-2">
                                            <div className="font-medium">{row.user?.name ?? 'N/A'}</div>
                                            <div className="text-xs text-muted-foreground">{row.user?.email ?? ''}</div>
                                        </td>
                                        <td className="px-3 py-2 capitalize">{row.status}</td>
                                        <td className="px-3 py-2 capitalize">{row.return_status}</td>
                                        <td className="px-3 py-2 text-muted-foreground">{row.return_reason ?? '—'}</td>
                                        <td className="px-3 py-2 text-xs text-muted-foreground">
                                            {row.return_requested_at ? new Date(row.return_requested_at).toLocaleString() : '—'}
                                        </td>
                                        <td className="px-3 py-2 text-right font-semibold">
                                            ₱{row.total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <select
                                                className="rounded border px-2 py-1 text-xs"
                                                value={row.return_status}
                                                onChange={(e) =>
                                                    router.patch(
                                                        `/dashboard/orders/${row.id}/return-status`,
                                                        { return_status: e.target.value },
                                                        { preserveScroll: true },
                                                    )
                                                }
                                            >
                                                {['none', 'requested', 'approved', 'rejected', 'received', 'refunded'].map((v) => (
                                                    <option key={v} value={v}>
                                                        {v}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

