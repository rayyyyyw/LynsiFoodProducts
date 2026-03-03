import { Head, router, useForm } from '@inertiajs/react';
import { CircleDollarSign, ChevronDown, Layers, ListChecks, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Categories', href: '/products/categories' },
];

type PriceItem = { size: string; price: string };
type Category = {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
    products_count: number;
    flavors?: string[];
    price_list?: PriceItem[];
};

function StyledSelect({ id, value, onChange, placeholder, children }: {
    id?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder: string;
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                <option value="" className="text-muted-foreground">{placeholder}</option>
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    );
}

function FormErrors({ errors }: { errors: Record<string, unknown> }) {
    const entries = Object.entries(errors);
    if (entries.length === 0) return null;
    return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {entries.map(([k, v]) => (
                <div key={k}>{typeof v === 'string' ? v : Array.isArray(v) ? (v as string[]).join(', ') : String(v)}</div>
            ))}
        </div>
    );
}

export default function Categories({
    categories = [],
}: {
    categories: Category[];
}) {
    const [editing, setEditing] = useState<Category | null>(null);
    const [selectedCategoryIdForFlavors, setSelectedCategoryIdForFlavors] = useState<number | ''>('');
    const [selectedCategoryIdForPriceList, setSelectedCategoryIdForPriceList] = useState<number | ''>('');
    const [newFlavorInput, setNewFlavorInput] = useState('');

    const addForm = useForm({ name: '', slug: '' });

    const flavorsForm = useForm({
        name: '',
        slug: '',
        flavors: [] as string[],
        price_list: [] as PriceItem[],
    });

    const priceListForm = useForm({
        name: '',
        slug: '',
        flavors: [] as string[],
        price_list: [] as PriceItem[],
    });

    const editForm = useForm({
        name: '',
        slug: '',
        flavors: [] as string[],
        price_list: [] as PriceItem[],
    });

    const openEdit = (cat: Category) => {
        setEditing(cat);
        editForm.setData({
            name: cat.name,
            slug: cat.slug,
            flavors: cat.flavors ?? [],
            price_list: (cat.price_list ?? []).map((p) => ({ size: p.size ?? '', price: String(p.price ?? '') })),
        });
    };

    const selectedCategoryForFlavors = selectedCategoryIdForFlavors
        ? categories.find((c) => c.id === selectedCategoryIdForFlavors)
        : null;
    const selectedCategoryForPriceList = selectedCategoryIdForPriceList
        ? categories.find((c) => c.id === selectedCategoryIdForPriceList)
        : null;

    const handleSelectCategoryForFlavors = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value ? Number(e.target.value) : '';
        setSelectedCategoryIdForFlavors(id);
        if (!id) return;
        const cat = categories.find((c) => c.id === id);
        if (cat) {
            flavorsForm.setData({
                name: cat.name,
                slug: cat.slug,
                flavors: cat.flavors ?? [],
                price_list: (cat.price_list ?? []).map((p) => ({ size: String(p.size ?? ''), price: String(p.price ?? '') })),
            });
        }
    };

    const handleSelectCategoryForPriceList = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value ? Number(e.target.value) : '';
        setSelectedCategoryIdForPriceList(id);
        if (!id) return;
        const cat = categories.find((c) => c.id === id);
        if (cat) {
            priceListForm.setData({
                name: cat.name,
                slug: cat.slug,
                flavors: cat.flavors ?? [],
                price_list: (cat.price_list ?? []).map((p) => ({ size: String(p.size ?? ''), price: String(p.price ?? '') })),
            });
        }
    };

    const addFlavor = (key: 'flavorsForm' | 'editForm') => {
        if (key === 'flavorsForm') flavorsForm.setData('flavors', [...flavorsForm.data.flavors, '']);
        else editForm.setData('flavors', [...editForm.data.flavors, '']);
    };
    const removeFlavor = (index: number, key: 'flavorsForm' | 'editForm') => {
        if (key === 'flavorsForm') flavorsForm.setData('flavors', flavorsForm.data.flavors.filter((_, i) => i !== index));
        else editForm.setData('flavors', editForm.data.flavors.filter((_, i) => i !== index));
    };
    const setFlavor = (index: number, value: string, key: 'flavorsForm' | 'editForm') => {
        if (key === 'flavorsForm') {
            const f = [...flavorsForm.data.flavors]; f[index] = value; flavorsForm.setData('flavors', f);
        } else {
            const f = [...editForm.data.flavors]; f[index] = value; editForm.setData('flavors', f);
        }
    };

    const addPrice = (key: 'priceListForm' | 'editForm') => {
        if (key === 'priceListForm') priceListForm.setData('price_list', [...priceListForm.data.price_list, { size: '', price: '' }]);
        else editForm.setData('price_list', [...editForm.data.price_list, { size: '', price: '' }]);
    };
    const removePrice = (index: number, key: 'priceListForm' | 'editForm') => {
        if (key === 'priceListForm') priceListForm.setData('price_list', priceListForm.data.price_list.filter((_, i) => i !== index));
        else editForm.setData('price_list', editForm.data.price_list.filter((_, i) => i !== index));
    };
    const setPrice = (index: number, field: 'size' | 'price', value: string, key: 'priceListForm' | 'editForm') => {
        if (key === 'priceListForm') {
            const p = [...priceListForm.data.price_list]; p[index] = { ...p[index], [field]: value }; priceListForm.setData('price_list', p);
        } else {
            const p = [...editForm.data.price_list]; p[index] = { ...p[index], [field]: value }; editForm.setData('price_list', p);
        }
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.transform(() => ({ name: addForm.data.name, slug: addForm.data.slug, flavors: [], price_list: [] }));
        addForm.post('/products/categories', { preserveScroll: true, onSuccess: () => addForm.reset() });
    };

    const handleSaveFlavors = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryIdForFlavors) return;
        const flavors = flavorsForm.data.flavors.filter((f) => String(f ?? '').trim() !== '');
        const priceList = (flavorsForm.data.price_list ?? [])
            .filter((p) => String(p.size ?? '').trim() !== '')
            .map((p) => ({ size: String(p.size).trim(), price: Number(p.price) || 0 }));
        flavorsForm.transform(() => ({ name: flavorsForm.data.name, slug: flavorsForm.data.slug, flavors, price_list: priceList }));
        flavorsForm.put(`/products/categories/${selectedCategoryIdForFlavors}`, {
            preserveScroll: true,
            onSuccess: () => setSelectedCategoryIdForFlavors(''),
        });
    };

    const handleSavePriceList = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryIdForPriceList) return;
        const priceList = priceListForm.data.price_list
            .filter((x) => String(x.size ?? '').trim() !== '')
            .map((x) => ({ size: String(x.size).trim(), price: Number(x.price) || 0 }));
        priceListForm.transform(() => ({ name: priceListForm.data.name, slug: priceListForm.data.slug, flavors: priceListForm.data.flavors ?? [], price_list: priceList }));
        priceListForm.put(`/products/categories/${selectedCategoryIdForPriceList}`, {
            preserveScroll: true,
            onSuccess: () => setSelectedCategoryIdForPriceList(''),
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        const priceList = editForm.data.price_list
            .filter((x) => String(x.size ?? '').trim() !== '')
            .map((x) => ({ size: String(x.size).trim(), price: Number(x.price) || 0 }));
        const flavors = editForm.data.flavors.filter((f) => String(f ?? '').trim() !== '');
        editForm.transform(() => ({ name: editForm.data.name, slug: editForm.data.slug, flavors, price_list: priceList }));
        editForm.put(`/products/categories/${editing.id}`, { preserveScroll: true, onSuccess: () => setEditing(null) });
    };

    const handleDelete = (cat: Category) => {
        if (!confirm(`Delete category "${cat.name}"? Products in this category will also be deleted.`)) return;
        router.delete(`/products/categories/${cat.id}`, { preserveScroll: true });
        setEditing(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                    <p className="text-sm text-muted-foreground">
                        Add a food category, then set its flavors and sizes/prices. Products use these when you add them.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* ── Card 1: Food Category ─────────────────────────────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="size-5" />
                                Food Category
                            </CardTitle>
                            <CardDescription>These appear when adding a product. Add new categories below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="min-h-16 rounded-lg border bg-muted/20 px-3 py-2.5">
                                {categories.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No categories yet.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                        {categories.map((cat) => (
                                            <span key={cat.id} className="inline-flex items-center rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <form onSubmit={handleAdd} className="space-y-3">
                                <FormErrors errors={addForm.errors} />
                                <div className="space-y-1.5">
                                    <Label htmlFor="cat-name" className="text-xs">Add category</Label>
                                    <Input id="cat-name" placeholder="e.g. Banana Chips" value={addForm.data.name} onChange={(e) => addForm.setData('name', e.target.value)} />
                                    <InputError message={addForm.errors.name} />
                                </div>
                                <Input id="cat-slug" placeholder="Slug (optional)" value={addForm.data.slug} onChange={(e) => addForm.setData('slug', e.target.value)} className="text-sm" />
                                <Button type="submit" className="w-full" disabled={addForm.processing}>
                                    {addForm.processing ? 'Saving...' : 'Save category'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* ── Card 2: Flavor Category ───────────────────────────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ListChecks className="size-5" />
                                Flavor Category
                            </CardTitle>
                            <CardDescription>Pick a food category, then manage its flavors.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="flavors-category" className="text-xs">Category</Label>
                                <StyledSelect
                                    id="flavors-category"
                                    value={String(selectedCategoryIdForFlavors)}
                                    onChange={handleSelectCategoryForFlavors}
                                    placeholder="Select a category"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </StyledSelect>
                            </div>

                            {selectedCategoryForFlavors ? (
                                <form onSubmit={handleSaveFlavors} className="space-y-4">
                                    {/* Flavor chips */}
                                    <div className="min-h-12 rounded-lg border bg-muted/10 p-2.5">
                                        {flavorsForm.data.flavors.filter((f) => String(f ?? '').trim()).length === 0 ? (
                                            <p className="py-1 text-center text-sm text-muted-foreground">No flavors yet. Add one below.</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {flavorsForm.data.flavors.map((f, i) => {
                                                    if (!String(f ?? '').trim()) return null;
                                                    return (
                                                        <span key={i} className="group inline-flex items-center gap-1 rounded-full border bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-primary/10">
                                                            {f}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFlavor(i, 'flavorsForm')}
                                                                className="ml-0.5 inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                                                            >
                                                                <X className="size-3" />
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Add flavor input */}
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="e.g. BBQ, Cheese, Original"
                                            value={newFlavorInput}
                                            onChange={(e) => setNewFlavorInput(e.target.value)}
                                            className="h-9 flex-1 min-w-0 text-sm"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const v = newFlavorInput.trim();
                                                    if (v) flavorsForm.setData('flavors', [...flavorsForm.data.flavors, v]);
                                                    setNewFlavorInput('');
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="shrink-0"
                                            onClick={() => {
                                                const v = newFlavorInput.trim();
                                                if (v) flavorsForm.setData('flavors', [...flavorsForm.data.flavors, v]);
                                                setNewFlavorInput('');
                                            }}
                                        >
                                            <Plus className="mr-1 size-4" /> Add
                                        </Button>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={flavorsForm.processing}>
                                        {flavorsForm.processing ? 'Saving...' : 'Save flavors'}
                                    </Button>
                                    <FormErrors errors={flavorsForm.errors} />
                                </form>
                            ) : (
                                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed bg-muted/5 py-8 text-center">
                                    <ListChecks className="size-8 text-muted-foreground/40" />
                                    <p className="text-sm text-muted-foreground">Select a category above to manage its flavors.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── Card 3: Size & Price Category ─────────────────────────── */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CircleDollarSign className="size-5" />
                                Size & Price
                            </CardTitle>
                            <CardDescription>Pick a food category, then manage sizes and prices.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="price-category" className="text-xs">Category</Label>
                                <StyledSelect
                                    id="price-category"
                                    value={String(selectedCategoryIdForPriceList)}
                                    onChange={handleSelectCategoryForPriceList}
                                    placeholder="Select a category"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </StyledSelect>
                            </div>

                            {selectedCategoryForPriceList ? (
                                <form onSubmit={handleSavePriceList} className="space-y-4">
                                    <div className="space-y-2">
                                        {priceListForm.data.price_list.length === 0 ? (
                                            <div className="rounded-lg border border-dashed bg-muted/5 px-4 py-6 text-center text-sm text-muted-foreground">
                                                No sizes yet. Add one below.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {priceListForm.data.price_list.map((p, i) => (
                                                    <div key={i} className="flex items-center gap-2 rounded-lg border bg-background p-2 shadow-sm">
                                                        <div className="flex flex-1 items-center min-w-0">
                                                            <Input
                                                                placeholder="Size"
                                                                value={p.size}
                                                                onChange={(e) => setPrice(i, 'size', e.target.value, 'priceListForm')}
                                                                className="h-9 rounded-r-none border-r-0 text-sm"
                                                            />
                                                            <span className="flex h-9 shrink-0 items-center rounded-r-md border border-l-0 bg-muted/50 px-2 text-xs font-semibold text-muted-foreground">
                                                                g
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="flex h-9 shrink-0 items-center rounded-l-md border border-r-0 bg-muted/50 px-2 text-xs font-semibold text-muted-foreground">
                                                                ₱
                                                            </span>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={0}
                                                                placeholder="0.00"
                                                                value={p.price}
                                                                onChange={(e) => setPrice(i, 'price', e.target.value, 'priceListForm')}
                                                                className="h-9 w-24 rounded-l-none text-sm"
                                                            />
                                                        </div>
                                                        <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => removePrice(i, 'priceListForm')} aria-label="Remove row">
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => addPrice('priceListForm')}>
                                            <Plus className="mr-1 size-4" /> Add size & price
                                        </Button>
                                        <Button type="submit" size="sm" disabled={priceListForm.processing}>
                                            {priceListForm.processing ? 'Saving...' : 'Save prices'}
                                        </Button>
                                    </div>
                                    <FormErrors errors={priceListForm.errors} />
                                </form>
                            ) : (
                                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed bg-muted/5 py-8 text-center">
                                    <CircleDollarSign className="size-8 text-muted-foreground/40" />
                                    <p className="text-sm text-muted-foreground">Select a category above to manage sizes and prices.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Summary table ──────────────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your categories</CardTitle>
                        <CardDescription>Overview of all categories. Click edit to change everything at once.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categories.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">No categories yet. Add one above.</p>
                        ) : (
                            <ul className="divide-y rounded-lg border">
                                {categories.map((cat) => {
                                    const flavorCount = (cat.flavors ?? []).length;
                                    const sizeCount = (cat.price_list ?? []).length;
                                    return (
                                        <li key={cat.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 first:rounded-t-lg last:rounded-b-lg hover:bg-muted/30 sm:flex-nowrap">
                                            <div className="min-w-0 flex-1">
                                                <span className="font-semibold">{cat.name}</span>
                                                <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                                                    <span>{flavorCount} flavor{flavorCount !== 1 ? 's' : ''}</span>
                                                    <span>{sizeCount} size{sizeCount !== 1 ? 's' : ''}</span>
                                                    <span>{cat.products_count} product{cat.products_count !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 gap-1">
                                                <Button variant="ghost" size="icon" className="size-8" aria-label="Edit" onClick={() => openEdit(cat)}>
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label="Delete" onClick={() => handleDelete(cat)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                {/* ── Edit dialog ────────────────────────────────────────────── */}
                <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit category</DialogTitle>
                            <p className="text-sm text-muted-foreground">Update name, slug, flavors, and price list.</p>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-5">
                            <FormErrors errors={editForm.errors} />
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} />
                                <InputError message={editForm.errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input value={editForm.data.slug} onChange={(e) => editForm.setData('slug', e.target.value)} />
                                <InputError message={editForm.errors.slug} />
                            </div>

                            {/* Flavors */}
                            <div className="space-y-2">
                                <Label>Flavors</Label>
                                {editForm.data.flavors.map((f, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input placeholder="e.g. BBQ" value={f} onChange={(e) => setFlavor(i, e.target.value, 'editForm')} />
                                        <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive" onClick={() => removeFlavor(i, 'editForm')}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addFlavor('editForm')}>
                                    <Plus className="mr-1 size-4" /> Add flavor
                                </Button>
                            </div>

                            {/* Sizes & prices */}
                            <div className="space-y-2">
                                <Label>Price list (size & price)</Label>
                                {editForm.data.price_list.map((p, i) => (
                                    <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/5 p-2">
                                        <div className="flex items-center">
                                            <Input placeholder="Size" value={p.size} onChange={(e) => setPrice(i, 'size', e.target.value, 'editForm')} className="h-9 w-24 rounded-r-none border-r-0" />
                                            <span className="flex h-9 shrink-0 items-center rounded-r-md border border-l-0 bg-muted/50 px-2 text-xs font-semibold text-muted-foreground">g</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="flex h-9 shrink-0 items-center rounded-l-md border border-r-0 bg-muted/50 px-2 text-xs font-semibold text-muted-foreground">₱</span>
                                            <Input type="number" step="0.01" min={0} placeholder="0.00" value={p.price} onChange={(e) => setPrice(i, 'price', e.target.value, 'editForm')} className="h-9 w-24 rounded-l-none" />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => removePrice(i, 'editForm')} aria-label="Remove row">
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addPrice('editForm')}>
                                    <Plus className="mr-1 size-4" /> Add size & price
                                </Button>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                                <Button type="submit" disabled={editForm.processing}>{editForm.processing ? 'Saving...' : 'Update'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
