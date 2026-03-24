import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type ReviewRow = {
    id: number;
    rating: number;
    comment: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    moderated_at: string | null;
    product: { name: string; slug: string } | null;
    user: { name: string; email: string } | null;
};
type Paginated<T> = {
    data: T[];
    links?: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Reviews', href: '/dashboard/reviews' },
];

export default function ReviewsModeration({ reviews }: { reviews: Paginated<ReviewRow> }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const filteredReviews = useMemo(
        () =>
            reviews.data.filter((r) => {
                const statusOk = statusFilter === 'all' || r.status === statusFilter;
                const q = query.trim().toLowerCase();
                const qOk =
                    q.length === 0 ||
                    r.product?.name?.toLowerCase().includes(q) ||
                    r.user?.name?.toLowerCase().includes(q) ||
                    r.user?.email?.toLowerCase().includes(q) ||
                    r.comment?.toLowerCase().includes(q);
                return statusOk && qOk;
            }),
        [reviews.data, query, statusFilter],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reviews moderation" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <h1 className="text-2xl font-bold">Reviews moderation</h1>
                <div className="grid gap-2 rounded-xl border bg-white p-3 md:grid-cols-3">
                    <input
                        className="rounded border px-3 py-2 text-sm"
                        placeholder="Search product/user/comment"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select
                        className="rounded border px-3 py-2 text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
                    >
                        <option value="all">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <div className="flex items-center text-sm text-muted-foreground">
                        Showing {filteredReviews.length} of {reviews.data.length}
                    </div>
                </div>
                <div className="overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full min-w-[900px] text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-3 py-2 text-left">Product</th>
                                <th className="px-3 py-2 text-left">User</th>
                                <th className="px-3 py-2 text-left">Rating</th>
                                <th className="px-3 py-2 text-left">Comment</th>
                                <th className="px-3 py-2 text-left">Status</th>
                                <th className="px-3 py-2 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-3 py-2">
                                        <div className="font-medium">{r.product?.name ?? 'Unknown product'}</div>
                                        {r.product?.slug && (
                                            <div className="text-xs text-muted-foreground">{r.product.slug}</div>
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="font-medium">{r.user?.name ?? 'Anonymous'}</div>
                                        <div className="text-xs text-muted-foreground">{r.user?.email ?? ''}</div>
                                    </td>
                                    <td className="px-3 py-2">{'★'.repeat(r.rating)}</td>
                                    <td className="px-3 py-2 text-muted-foreground">{r.comment ?? '—'}</td>
                                    <td className="px-3 py-2 capitalize">{r.status}</td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="inline-flex gap-2">
                                            {(['approved', 'rejected', 'pending'] as const).map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    className={`rounded px-2 py-1 text-xs font-semibold ${
                                                        s === 'approved'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : s === 'rejected'
                                                              ? 'bg-red-50 text-red-700'
                                                              : 'bg-slate-100 text-slate-700'
                                                    }`}
                                                    onClick={() =>
                                                        router.patch(
                                                            `/dashboard/reviews/${r.id}/status`,
                                                            { status: s },
                                                            { preserveScroll: true },
                                                        )
                                                    }
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredReviews.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                                        No reviews match your filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

