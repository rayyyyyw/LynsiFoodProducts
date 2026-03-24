import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Eye, Package, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Inventory', href: '/products/inventory' },
];

const LOW_STOCK_THRESHOLD = 10;

function formatExpiryDisplay(expiry: string | null | undefined): string {
    if (expiry == null || String(expiry).trim() === '') return '—';
    const str = String(expiry);
    const date = str.includes('T')
        ? new Date(str)
        : new Date(str + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return str;
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

type Product = {
    id: number;
    name: string;
    slug?: string | null;
    description?: string | null;
    image_path?: string | null;
    image_url?: string | null;
    expiry?: string | null;
    featured?: boolean;
    category?: { id: number; name: string };
};
type Variant = {
    id: number;
    size: string | null;
    flavor: string | null;
    price: string;
    sku: string | null;
    stock_quantity: number;
    product: Product;
};

type StatusFilter = 'all' | 'ok' | 'low' | 'out';

export default function Inventory({ variants = [] }: { variants: Variant[] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [previewVariant, setPreviewVariant] = useState<Variant | null>(null);

    const status = (v: Variant) => {
        const qty = v.stock_quantity;
        if (qty === 0) return 'out';
        if (qty <= LOW_STOCK_THRESHOLD) return 'low';
        return 'ok';
    };

    const setStockTo = (variant: Variant, value: number) => {
        if (value < 0) return;
        router.patch(
            `/products/inventory/${variant.id}/stock`,
            { stock_quantity: value },
            { preserveScroll: true },
        );
    };

    const handleStockInputBlur = (
        variant: Variant,
        e: React.FocusEvent<HTMLInputElement>,
    ) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0 && val !== variant.stock_quantity) {
            setStockTo(variant, val);
        }
    };

    const handleStockInputKeyDown = (
        variant: Variant,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    const displayGrams = (v: Variant) => {
        const size = v.size?.trim();
        if (!size) return '—';
        return size.toLowerCase().endsWith('g') ? size : `${size}g`;
    };
    const variantDisplayName = (v: Variant) => {
        const flavor = v.flavor?.trim();
        const grams = displayGrams(v);
        const details = [flavor, grams !== '—' ? grams : null]
            .filter(Boolean)
            .join(' / ');
        return details
            ? `${v.product?.name ?? 'Product'} (${details})`
            : (v.product?.name ?? 'Product');
    };

    const filteredVariants = useMemo(() => {
        let list = variants;
        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (v) =>
                    (v.product?.name ?? '').toLowerCase().includes(q) ||
                    (v.flavor ?? '').toLowerCase().includes(q) ||
                    (v.sku ?? '').toLowerCase().includes(q) ||
                    (v.size ?? '').toLowerCase().includes(q),
            );
        }
        if (statusFilter !== 'all') {
            list = list.filter((v) => status(v) === statusFilter);
        }
        return list;
    }, [variants, search, statusFilter]);

    const lowStockCount = useMemo(
        () =>
            variants.filter(
                (v) =>
                    v.stock_quantity > 0 &&
                    v.stock_quantity <= LOW_STOCK_THRESHOLD,
            ).length,
        [variants],
    );
    const outOfStockCount = useMemo(
        () => variants.filter((v) => v.stock_quantity === 0).length,
        [variants],
    );
    const lowStockItems = useMemo(
        () =>
            variants
                .filter(
                    (v) =>
                        v.stock_quantity > 0 &&
                        v.stock_quantity <= LOW_STOCK_THRESHOLD,
                )
                .slice(0, 8),
        [variants],
    );
    const outOfStockItems = useMemo(
        () => variants.filter((v) => v.stock_quantity === 0).slice(0, 8),
        [variants],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Inventory
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Track and adjust stock levels per product variant
                        (size/flavor).
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="size-5" />
                            Stock levels
                        </CardTitle>
                        <CardDescription>
                            Current inventory by variant. Type a number in Stock
                            and blur or press Enter to save.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(lowStockCount > 0 || outOfStockCount > 0) && (
                            <div className="space-y-2">
                                {lowStockCount > 0 && (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-200">
                                        <div className="font-medium">
                                            Low stock warning ({lowStockCount})
                                        </div>
                                        <ul className="mt-1 list-inside list-disc text-xs opacity-95">
                                            {lowStockItems.map((v) => (
                                                <li key={`low-${v.id}`}>
                                                    {variantDisplayName(v)} —{' '}
                                                    {v.stock_quantity} left
                                                </li>
                                            ))}
                                            {lowStockCount >
                                                lowStockItems.length && (
                                                <li>
                                                    ...and{' '}
                                                    {lowStockCount -
                                                        lowStockItems.length}{' '}
                                                    more
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {outOfStockCount > 0 && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-200">
                                        <div className="font-medium">
                                            Out of stock - danger (
                                            {outOfStockCount})
                                        </div>
                                        <ul className="mt-1 list-inside list-disc text-xs opacity-95">
                                            {outOfStockItems.map((v) => (
                                                <li key={`out-${v.id}`}>
                                                    {variantDisplayName(v)}
                                                </li>
                                            ))}
                                            {outOfStockCount >
                                                outOfStockItems.length && (
                                                <li>
                                                    ...and{' '}
                                                    {outOfStockCount -
                                                        outOfStockItems.length}{' '}
                                                    more
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative max-w-sm min-w-[200px] flex-1">
                                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Filter by product, flavor, SKU, size..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-xs whitespace-nowrap text-muted-foreground">
                                    Status:
                                </Label>
                                <div className="flex rounded-md border bg-muted/30 p-0.5">
                                    {(
                                        [
                                            {
                                                value: 'all' as const,
                                                label: 'All',
                                            },
                                            {
                                                value: 'ok' as const,
                                                label: 'In stock',
                                            },
                                            {
                                                value: 'low' as const,
                                                label: 'Low stock',
                                            },
                                            {
                                                value: 'out' as const,
                                                label: 'Out of stock',
                                            },
                                        ] as const
                                    ).map(({ value, label }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() =>
                                                setStatusFilter(value)
                                            }
                                            className={cn(
                                                'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                                                statusFilter === value
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {(search || statusFilter !== 'all') && (
                                <span className="text-xs text-muted-foreground">
                                    {filteredVariants.length} of{' '}
                                    {variants.length} variant
                                    {variants.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">
                                            Product
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Flavor
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Grams
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            SKU
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Price
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Stock
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Status
                                        </th>
                                        <th className="w-[1%] px-4 py-3 text-right font-medium">
                                            Preview
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVariants.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
                                                {variants.length === 0
                                                    ? 'No product variants yet. Add products with variants in the Products section.'
                                                    : 'No variants match the current filter.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredVariants.map((v) => (
                                            <tr
                                                key={v.id}
                                                className="border-b last:border-0 hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    {v.product?.name ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {v.flavor ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {displayGrams(v)}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-muted-foreground">
                                                    {v.sku ?? '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    ₱
                                                    {Number(v.price).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        key={`stock-${v.id}-${v.stock_quantity}`}
                                                        type="number"
                                                        min={0}
                                                        className="h-8 w-20"
                                                        defaultValue={
                                                            v.stock_quantity
                                                        }
                                                        onBlur={(e) =>
                                                            handleStockInputBlur(
                                                                v,
                                                                e,
                                                            )
                                                        }
                                                        onKeyDown={(e) =>
                                                            handleStockInputKeyDown(
                                                                v,
                                                                e,
                                                            )
                                                        }
                                                        aria-label="Stock quantity"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={cn(
                                                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                                            status(v) ===
                                                                'ok' &&
                                                                'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                                                            status(v) ===
                                                                'low' &&
                                                                'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                                                            status(v) ===
                                                                'out' &&
                                                                'bg-destructive/10 text-destructive',
                                                        )}
                                                    >
                                                        {status(v) ===
                                                            'low' && (
                                                            <AlertTriangle className="size-3" />
                                                        )}
                                                        {status(v) === 'ok'
                                                            ? 'In stock'
                                                            : status(v) ===
                                                                'low'
                                                              ? 'Low stock'
                                                              : 'Out of stock'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-1"
                                                        onClick={() =>
                                                            setPreviewVariant(v)
                                                        }
                                                        aria-label="Preview"
                                                    >
                                                        <Eye className="size-4" />
                                                        Preview
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Dialog
                    open={!!previewVariant}
                    onOpenChange={(open) => !open && setPreviewVariant(null)}
                >
                    <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Product & variant details</DialogTitle>
                        </DialogHeader>
                        {previewVariant && (
                            <div className="space-y-4 text-sm">
                                {previewVariant.product?.image_url && (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Image
                                        </Label>
                                        <img
                                            src={
                                                previewVariant.product.image_url
                                            }
                                            alt={previewVariant.product.name}
                                            className="mt-1 h-32 w-32 rounded-lg border object-cover"
                                        />
                                    </div>
                                )}
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Product name
                                        </Label>
                                        <p className="font-medium">
                                            {previewVariant.product?.name ??
                                                '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Slug
                                        </Label>
                                        <p className="font-mono text-muted-foreground">
                                            {previewVariant.product?.slug ??
                                                '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Category
                                        </Label>
                                        <p>
                                            {previewVariant.product?.category
                                                ?.name ?? '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Featured
                                        </Label>
                                        <p>
                                            {previewVariant.product?.featured
                                                ? 'Yes'
                                                : 'No'}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Description
                                        </Label>
                                        <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                                            {previewVariant.product
                                                ?.description ?? '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Expiry / Best before
                                        </Label>
                                        <p>
                                            {formatExpiryDisplay(
                                                previewVariant.product?.expiry,
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <Label className="text-xs text-muted-foreground">
                                        This variant
                                    </Label>
                                    <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                                        <li>
                                            <span className="text-muted-foreground">
                                                Flavor:
                                            </span>{' '}
                                            {previewVariant.flavor ?? '—'}
                                        </li>
                                        <li>
                                            <span className="text-muted-foreground">
                                                Grams:
                                            </span>{' '}
                                            {displayGrams(previewVariant)}
                                        </li>
                                        <li>
                                            <span className="text-muted-foreground">
                                                SKU:
                                            </span>{' '}
                                            {previewVariant.sku ?? '—'}
                                        </li>
                                        <li>
                                            <span className="text-muted-foreground">
                                                Price:
                                            </span>{' '}
                                            ₱
                                            {Number(
                                                previewVariant.price,
                                            ).toFixed(2)}
                                        </li>
                                        <li>
                                            <span className="text-muted-foreground">
                                                Stock:
                                            </span>{' '}
                                            {previewVariant.stock_quantity}
                                        </li>
                                        <li>
                                            <span className="text-muted-foreground">
                                                Status:
                                            </span>{' '}
                                            <span
                                                className={cn(
                                                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                                    status(previewVariant) ===
                                                        'ok' &&
                                                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                                                    status(previewVariant) ===
                                                        'low' &&
                                                        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                                                    status(previewVariant) ===
                                                        'out' &&
                                                        'bg-destructive/10 text-destructive',
                                                )}
                                            >
                                                {status(previewVariant) ===
                                                    'low' && (
                                                    <AlertTriangle className="size-3" />
                                                )}
                                                {status(previewVariant) === 'ok'
                                                    ? 'In stock'
                                                    : status(previewVariant) ===
                                                        'low'
                                                      ? 'Low stock'
                                                      : 'Out of stock'}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
