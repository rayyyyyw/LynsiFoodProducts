import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Coupon = {
    id: number;
    code: string;
    type: 'percent' | 'fixed';
    value: number;
    min_subtotal: number;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
};
type Paginated<T> = {
    data: T[];
    links?: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Discounts', href: '/dashboard/discounts' },
];

export default function DiscountsPage({
    coupons,
}: {
    coupons: Paginated<Coupon>;
}) {
    const { data, setData, post, processing, reset } = useForm({
        code: '',
        type: 'percent',
        value: '',
        min_subtotal: '',
        usage_limit: '',
        is_active: true,
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [editMinSubtotal, setEditMinSubtotal] = useState('');
    const [editUsageLimit, setEditUsageLimit] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Discounts" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <h1 className="text-2xl font-bold">Discounts & Coupons</h1>

                <form
                    className="grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/dashboard/discounts', {
                            preserveScroll: true,
                            onSuccess: () => reset(),
                        });
                    }}
                >
                    <input
                        className="rounded border px-3 py-2 text-sm"
                        placeholder="CODE"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                    />
                    <select
                        className="rounded border px-3 py-2 text-sm"
                        value={data.type}
                        onChange={(e) =>
                            setData(
                                'type',
                                e.target.value as 'percent' | 'fixed',
                            )
                        }
                    >
                        <option value="percent">Percent</option>
                        <option value="fixed">Fixed amount</option>
                    </select>
                    <input
                        className="rounded border px-3 py-2 text-sm"
                        placeholder="Value"
                        type="number"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                    />
                    <input
                        className="rounded border px-3 py-2 text-sm"
                        placeholder="Min subtotal"
                        type="number"
                        value={data.min_subtotal}
                        onChange={(e) =>
                            setData('min_subtotal', e.target.value)
                        }
                    />
                    <input
                        className="rounded border px-3 py-2 text-sm"
                        placeholder="Usage limit"
                        type="number"
                        value={data.usage_limit}
                        onChange={(e) => setData('usage_limit', e.target.value)}
                    />
                    <button
                        disabled={processing}
                        className="rounded bg-emerald-700 px-3 py-2 text-sm font-semibold text-white"
                        type="submit"
                    >
                        Create coupon
                    </button>
                </form>

                <div className="overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full min-w-[900px] text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-3 py-2 text-left">Code</th>
                                <th className="px-3 py-2 text-left">Type</th>
                                <th className="px-3 py-2 text-left">Value</th>
                                <th className="px-3 py-2 text-left">
                                    Min subtotal
                                </th>
                                <th className="px-3 py-2 text-left">Used</th>
                                <th className="px-3 py-2 text-left">Active</th>
                                <th className="px-3 py-2 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.data.map((c) => (
                                <tr key={c.id} className="border-t">
                                    <td className="px-3 py-2 font-mono font-semibold">
                                        {c.code}
                                    </td>
                                    <td className="px-3 py-2 capitalize">
                                        {c.type}
                                    </td>
                                    <td className="px-3 py-2">
                                        {c.type === 'percent'
                                            ? `${c.value}%`
                                            : `₱${c.value.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                                    </td>
                                    <td className="px-3 py-2">
                                        ₱
                                        {c.min_subtotal.toLocaleString(
                                            'en-PH',
                                            { minimumFractionDigits: 2 },
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        {c.used_count}
                                        {c.usage_limit
                                            ? ` / ${c.usage_limit}`
                                            : ''}
                                    </td>
                                    <td className="px-3 py-2">
                                        <button
                                            type="button"
                                            className={`rounded px-2 py-1 text-xs font-semibold ${c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}
                                            onClick={() =>
                                                router.patch(
                                                    `/dashboard/discounts/${c.id}`,
                                                    { is_active: !c.is_active },
                                                    { preserveScroll: true },
                                                )
                                            }
                                        >
                                            {c.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        <div className="inline-flex gap-2">
                                            <button
                                                type="button"
                                                className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700"
                                                onClick={() => {
                                                    setEditingId(c.id);
                                                    setEditValue(
                                                        String(c.value),
                                                    );
                                                    setEditMinSubtotal(
                                                        String(c.min_subtotal),
                                                    );
                                                    setEditUsageLimit(
                                                        c.usage_limit
                                                            ? String(
                                                                  c.usage_limit,
                                                              )
                                                            : '',
                                                    );
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700"
                                                onClick={() =>
                                                    router.delete(
                                                        `/dashboard/discounts/${c.id}`,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {coupons.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-3 py-8 text-center text-muted-foreground"
                                    >
                                        No coupons yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {editingId && (
                    <form
                        className="grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-5"
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.patch(
                                `/dashboard/discounts/${editingId}`,
                                {
                                    value: Number(editValue || 0),
                                    min_subtotal: Number(editMinSubtotal || 0),
                                    usage_limit: editUsageLimit
                                        ? Number(editUsageLimit)
                                        : null,
                                },
                                {
                                    preserveScroll: true,
                                    onSuccess: () => setEditingId(null),
                                },
                            );
                        }}
                    >
                        <input
                            className="rounded border px-3 py-2 text-sm"
                            placeholder="Value"
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                        />
                        <input
                            className="rounded border px-3 py-2 text-sm"
                            placeholder="Min subtotal"
                            type="number"
                            value={editMinSubtotal}
                            onChange={(e) => setEditMinSubtotal(e.target.value)}
                        />
                        <input
                            className="rounded border px-3 py-2 text-sm"
                            placeholder="Usage limit"
                            type="number"
                            value={editUsageLimit}
                            onChange={(e) => setEditUsageLimit(e.target.value)}
                        />
                        <button
                            className="rounded bg-emerald-700 px-3 py-2 text-sm font-semibold text-white"
                            type="submit"
                        >
                            Save changes
                        </button>
                        <button
                            className="rounded bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                            type="button"
                            onClick={() => setEditingId(null)}
                        >
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
