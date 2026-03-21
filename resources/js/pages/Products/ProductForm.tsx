import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type PriceListItem = { size: string; price: number };
type Category = {
    id: number;
    name: string;
    slug: string;
    flavors?: string[];
    price_list?: PriceListItem[];
};
type Variant = {
    id?: number;
    size: string;
    flavor: string;
    price: string;
    sku: string;
    stock_quantity: number;
};
type Product = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_path: string | null;
    image_url?: string | null;
    expiry: string | null;
    featured: boolean;
    category_id: number;
    variants: Variant[];
};

const emptyVariant = (): Variant => ({
    size: '',
    flavor: '',
    price: '',
    sku: '',
    stock_quantity: 0,
});

function getPriceForSize(
    priceList: PriceListItem[] | undefined,
    size: string,
): string {
    if (!priceList?.length || !size) return '';
    const item = priceList.find(
        (p) => String(p.size).trim() === String(size).trim(),
    );
    return item != null ? String(item.price) : '';
}

/** Display size with "g" suffix for grams when not already present. */
function displaySizeWithUnit(size: string): string {
    const s = String(size).trim();
    if (!s) return s;
    return s.toLowerCase().endsWith('g') ? s : `${s}g`;
}

export default function ProductForm({
    categories = [],
    product = null,
}: {
    categories: Category[];
    product: Product | null;
}) {
    const isEdit = !!product;
    const [name, setName] = useState(product?.name ?? '');
    const [slug, setSlug] = useState(product?.slug ?? '');
    const [description, setDescription] = useState(product?.description ?? '');
    const [categoryId, setCategoryId] = useState(
        product?.category_id ?? (categories[0] ? String(categories[0].id) : ''),
    );
    const [expiry, setExpiry] = useState(() => {
        const e = product?.expiry;
        if (e == null || e === '') return '';
        const str = String(e);
        if (str.includes('T')) return str.slice(0, 10);
        return str.length >= 10 ? str.slice(0, 10) : str;
    });
    const [featured, setFeatured] = useState(product?.featured ?? false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [variants, setVariants] = useState<Variant[]>(
        product?.variants?.length
            ? product.variants.map((v) => ({
                  id: v.id,
                  size: v.size ?? '',
                  flavor: v.flavor ?? '',
                  price: String(v.price),
                  sku: v.sku ?? '',
                  stock_quantity: Number(v.stock_quantity ?? 0),
              }))
            : [emptyVariant()],
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const selectedCategory = categories.find(
        (c) => String(c.id) === categoryId,
    );
    const sizeOptions = selectedCategory?.price_list ?? [];
    const flavorOptions = selectedCategory?.flavors ?? [];

    const addVariant = () => {
        const firstSize = sizeOptions[0];
        const firstFlavor = flavorOptions[0] ?? '';
        const firstPrice = firstSize != null ? String(firstSize.price) : '';
        setVariants((v) => [
            ...v,
            {
                ...emptyVariant(),
                size: firstSize?.size ?? '',
                flavor: firstFlavor,
                price: firstPrice,
                stock_quantity: 0,
            },
        ]);
    };
    const removeVariant = (index: number) => {
        if (variants.length <= 1) return;
        setVariants((v) => v.filter((_, i) => i !== index));
    };
    const updateVariant = (
        index: number,
        field: keyof Variant,
        value: string | number,
    ) => {
        setVariants((v) => {
            const next = v.map((x, i) =>
                i === index ? { ...x, [field]: value } : x,
            );
            if (field === 'size' && selectedCategory?.price_list?.length) {
                const sizeStr = String(value);
                const price = getPriceForSize(
                    selectedCategory.price_list,
                    sizeStr,
                );
                if (price) next[index] = { ...next[index], price };
            }
            return next;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);
        const formData = new FormData();
        formData.append('category_id', String(categoryId));
        formData.append('name', name);
        if (slug) formData.append('slug', slug);
        formData.append('description', description);
        if (expiry) formData.append('expiry', expiry);
        formData.append('featured', featured ? '1' : '0');
        if (imageFile) formData.append('image', imageFile);
        variants.forEach((v, i) => {
            formData.append(`variants[${i}][size]`, v.size);
            formData.append(`variants[${i}][flavor]`, v.flavor);
            formData.append(`variants[${i}][price]`, v.price);
            formData.append(`variants[${i}][sku]`, v.sku ?? '');
            formData.append(
                `variants[${i}][stock_quantity]`,
                String(v.stock_quantity),
            );
            if (v.id) formData.append(`variants[${i}][id]`, String(v.id));
        });

        const url = isEdit
            ? `/products/products/${product.id}`
            : '/products/products';
        if (isEdit) formData.append('_method', 'PUT');
        const opts = {
            preserveScroll: true,
            forceFormData: true,
            onError: (err: Record<string, string>) => {
                setErrors(err);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        };
        if (isEdit) {
            router.post(url, formData, { ...opts, method: 'put' });
        } else {
            router.post(url, formData, opts);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Products', href: '/products/products' },
        { title: isEdit ? 'Edit product' : 'Add product', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit product' : 'Add product'} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/products/products">← Back</Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEdit ? 'Edit product' : 'Add product'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic info</CardTitle>
                            <CardDescription>
                                Name, category, description, expiry, and image.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product name *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="e.g. Organic Chips"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">
                                        Slug (optional)
                                    </Label>
                                    <Input
                                        id="slug"
                                        value={slug}
                                        onChange={(e) =>
                                            setSlug(e.target.value)
                                        }
                                        placeholder="auto from name"
                                    />
                                    <InputError message={errors.slug} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                {categories.length === 0 ? (
                                    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                                        Create a category first in{' '}
                                        <Link
                                            href="/products/categories"
                                            className="underline"
                                        >
                                            Products → Categories
                                        </Link>
                                        .
                                    </p>
                                ) : (
                                    <>
                                        <select
                                            id="category"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                            value={categoryId}
                                            onChange={(e) =>
                                                setCategoryId(e.target.value)
                                            }
                                            required
                                        >
                                            {categories.map((c) => (
                                                <option
                                                    key={c.id}
                                                    value={String(c.id)}
                                                >
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.category_id}
                                        />
                                    </>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Product description..."
                                    rows={3}
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry">
                                        Expiry / Best before
                                    </Label>
                                    <Input
                                        id="expiry"
                                        type="date"
                                        value={expiry}
                                        onChange={(e) =>
                                            setExpiry(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-8">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={featured}
                                        onChange={(e) =>
                                            setFeatured(e.target.checked)
                                        }
                                        className="size-4 rounded border-input"
                                    />
                                    <Label htmlFor="featured">
                                        Featured on landing page
                                    </Label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Product image</Label>
                                {product?.image_url && !imageFile && (
                                    <div className="mb-2">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-24 w-24 rounded-lg border object-cover"
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Current image. Upload a new file to
                                            replace.
                                        </p>
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImageFile(
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                                <InputError message={errors.image} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="space-y-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle>
                                        Sizes, flavors & prices
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Add at least one variant (e.g. BBQ 100g
                                        = ₱50, Original 50g = ₱30).
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0"
                                    onClick={addVariant}
                                >
                                    <Plus className="mr-2 size-4" />
                                    Add variant
                                </Button>
                            </div>
                            {selectedCategory &&
                                (sizeOptions.length > 0 ||
                                    flavorOptions.length > 0) && (
                                    <div className="rounded-md border border-border/80 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                                        Size and flavor options come from the
                                        selected category. Price can be
                                        adjusted.
                                    </div>
                                )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {variants.map((v, i) => (
                                    <div
                                        key={i}
                                        className="rounded-xl border border-border/80 bg-muted/10 p-4 transition-colors hover:bg-muted/20"
                                    >
                                        <div className="flex flex-wrap items-end gap-4 sm:gap-5">
                                            <div className="flex shrink-0 items-center gap-2 sm:min-w-0">
                                                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                                    Variant {i + 1}
                                                </span>
                                            </div>
                                            <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_90px_80px_auto] sm:gap-5">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Size
                                                    </Label>
                                                    {sizeOptions.length > 0 ? (
                                                        <Select
                                                            value={
                                                                v.size ||
                                                                undefined
                                                            }
                                                            onValueChange={(
                                                                val,
                                                            ) =>
                                                                updateVariant(
                                                                    i,
                                                                    'size',
                                                                    val ?? '',
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="h-10 rounded-lg">
                                                                <SelectValue placeholder="Select size" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-lg border-border/80 shadow-lg">
                                                                {sizeOptions.map(
                                                                    (pl) => (
                                                                        <SelectItem
                                                                            key={
                                                                                pl.size
                                                                            }
                                                                            value={
                                                                                pl.size
                                                                            }
                                                                            className="rounded-md py-2"
                                                                        >
                                                                            {displaySizeWithUnit(
                                                                                pl.size,
                                                                            )}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                                {v.size &&
                                                                    !sizeOptions.some(
                                                                        (pl) =>
                                                                            pl.size ===
                                                                            v.size,
                                                                    ) && (
                                                                        <SelectItem
                                                                            value={
                                                                                v.size
                                                                            }
                                                                            className="rounded-md py-2"
                                                                        >
                                                                            {displaySizeWithUnit(
                                                                                v.size,
                                                                            )}
                                                                        </SelectItem>
                                                                    )}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <Input
                                                            placeholder="e.g. 50g"
                                                            value={v.size}
                                                            onChange={(e) =>
                                                                updateVariant(
                                                                    i,
                                                                    'size',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-10 rounded-lg"
                                                        />
                                                    )}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Flavor
                                                    </Label>
                                                    {flavorOptions.length >
                                                    0 ? (
                                                        <Select
                                                            value={
                                                                v.flavor ||
                                                                undefined
                                                            }
                                                            onValueChange={(
                                                                val,
                                                            ) =>
                                                                updateVariant(
                                                                    i,
                                                                    'flavor',
                                                                    val ?? '',
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="h-10 rounded-lg">
                                                                <SelectValue placeholder="Select flavor" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-lg border-border/80 shadow-lg">
                                                                {flavorOptions.map(
                                                                    (f) => (
                                                                        <SelectItem
                                                                            key={
                                                                                f
                                                                            }
                                                                            value={
                                                                                f
                                                                            }
                                                                            className="rounded-md py-2"
                                                                        >
                                                                            {f}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                                {v.flavor &&
                                                                    !flavorOptions.includes(
                                                                        v.flavor,
                                                                    ) && (
                                                                        <SelectItem
                                                                            value={
                                                                                v.flavor
                                                                            }
                                                                            className="rounded-md py-2"
                                                                        >
                                                                            {
                                                                                v.flavor
                                                                            }
                                                                        </SelectItem>
                                                                    )}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <Input
                                                            placeholder="e.g. BBQ"
                                                            value={v.flavor}
                                                            onChange={(e) =>
                                                                updateVariant(
                                                                    i,
                                                                    'flavor',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-10 rounded-lg"
                                                        />
                                                    )}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Price (₱) *
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        placeholder="0"
                                                        value={v.price}
                                                        onChange={(e) =>
                                                            updateVariant(
                                                                i,
                                                                'price',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-10 rounded-lg"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Stock
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={v.stock_quantity}
                                                        onChange={(e) =>
                                                            updateVariant(
                                                                i,
                                                                'stock_quantity',
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10,
                                                                ) || 0,
                                                            )
                                                        }
                                                        className="h-10 rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex items-end gap-2 pb-0.5">
                                                    <span className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">
                                                        SKU auto
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-10 shrink-0 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            removeVariant(i)
                                                        }
                                                        disabled={
                                                            variants.length <= 1
                                                        }
                                                        aria-label="Remove variant"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.variants && (
                                <InputError message={errors.variants} />
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={processing || categories.length === 0}
                        >
                            {processing
                                ? 'Saving...'
                                : isEdit
                                  ? 'Update product'
                                  : 'Create product'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/products/products">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
