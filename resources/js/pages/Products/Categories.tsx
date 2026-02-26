import { Head, router, useForm } from '@inertiajs/react';
import { CircleDollarSign, Layers, ListChecks, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
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
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import InputError from '@/components/input-error';

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

export default function Categories({
    categories = [],
}: {
    categories: Category[];
}) {
    const [editing, setEditing] = useState<Category | null>(null);
    const [selectedCategoryIdForFlavors, setSelectedCategoryIdForFlavors] = useState<number | ''>('');
    const [selectedCategoryIdForPriceList, setSelectedCategoryIdForPriceList] = useState<number | ''>('');
    const [newFlavorInput, setNewFlavorInput] = useState('');

    const addForm = useForm({
        name: '',
        slug: '',
    });

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
        const payload = {
            name: addForm.data.name,
            slug: addForm.data.slug,
            flavors: [],
            price_list: [],
        };
        addForm.transform(() => payload);
        addForm.post('/products/categories', {
            preserveScroll: true,
            onSuccess: () => addForm.reset(),
        });
    };

    const handleSaveFlavors = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryIdForFlavors) return;
        const flavors = flavorsForm.data.flavors.filter((f) => String(f ?? '').trim() !== '');
        const priceList = (flavorsForm.data.price_list ?? [])
            .filter((p) => String(p.size ?? '').trim() !== '')
            .map((p) => ({ size: String(p.size).trim(), price: Number(p.price) || 0 }));
        const payload = {
            name: flavorsForm.data.name,
            slug: flavorsForm.data.slug,
            flavors,
            price_list: priceList,
        };
        flavorsForm.transform(() => payload);
        flavorsForm.put(`/products/categories/${selectedCategoryIdForFlavors}`, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedCategoryIdForFlavors('');
            },
        });
    };

    const handleSavePriceList = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryIdForPriceList) return;
        const priceList = priceListForm.data.price_list
            .filter((x) => String(x.size ?? '').trim() !== '')
            .map((x) => ({ size: String(x.size).trim(), price: Number(x.price) || 0 }));
        const payload = {
            name: priceListForm.data.name,
            slug: priceListForm.data.slug,
            flavors: priceListForm.data.flavors ?? [],
            price_list: priceList,
        };
        priceListForm.transform(() => payload);
        priceListForm.put(`/products/categories/${selectedCategoryIdForPriceList}`, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedCategoryIdForPriceList('');
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        const priceList = editForm.data.price_list
            .filter((x) => String(x.size ?? '').trim() !== '')
            .map((x) => ({ size: String(x.size).trim(), price: Number(x.price) || 0 }));
        const flavors = editForm.data.flavors.filter((f) => String(f ?? '').trim() !== '');
        const payload = {
            name: editForm.data.name,
            slug: editForm.data.slug,
            flavors,
            price_list: priceList,
        };
        editForm.transform(() => payload);
        editForm.put(`/products/categories/${editing.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditing(null),
        });
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
                    {/* Card 1: Food Category — list of categories + add form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="size-5" />
                                Food Category
                            </CardTitle>
                            <CardDescription>These appear when adding a product. Add new categories below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="min-h-16 list-none space-y-1.5 rounded-md border bg-muted/20 px-3 py-2">
                                {categories.length === 0 ? (
                                    <li className="text-sm text-muted-foreground">No categories yet.</li>
                                ) : (
                                    categories.map((cat) => (
                                        <li key={cat.id} className="text-sm font-medium">
                                            {cat.name}
                                        </li>
                                    ))
                                )}
                            </ul>
                            <form onSubmit={handleAdd} className="space-y-3">
                                {Object.keys(addForm.errors).length > 0 && (
                                    <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                        {Object.entries(addForm.errors).map(([k, v]) => (
                                            <div key={k}>{typeof v === 'string' ? v : Array.isArray(v) ? (v as string[]).join(', ') : String(v)}</div>
                                        ))}
                                    </div>
                                )}
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

                    {/* Card 2: Flavor Category — list of flavors for selected category */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ListChecks className="size-5" />
                                Flavor Category
                            </CardTitle>
                            <CardDescription>Pick a food category, then manage its flavors. These appear when adding a product.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="flavors-category" className="text-xs">Category</Label>
                                <select
                                    id="flavors-category"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={String(selectedCategoryIdForFlavors)}
                                    onChange={handleSelectCategoryForFlavors}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            {selectedCategoryForFlavors ? (
                                <form onSubmit={handleSaveFlavors} className="space-y-4">
                                    <ul className="min-h-12 list-none space-y-1.5 rounded-md border bg-muted/20 px-3 py-2">
                                        {flavorsForm.data.flavors.filter((f) => String(f ?? '').trim()).length === 0 ? (
                                            <li className="text-sm text-muted-foreground">No flavors. Add below.</li>
                                        ) : (
                                            flavorsForm.data.flavors
                                                .map((f, i) => ({ f, i }))
                                                .filter(({ f }) => String(f ?? '').trim())
                                                .map(({ f, i }) => (
                                                    <li key={i} className="flex items-center justify-between gap-2">
                                                        <span className="text-sm font-medium">{f}</span>
                                                        <Button type="button" variant="ghost" size="icon" className="size-7 shrink-0 text-destructive" onClick={() => removeFlavor(i, 'flavorsForm')}>
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </li>
                                                ))
                                        )}
                                    </ul>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Input
                                            placeholder="e.g. BBQ"
                                            value={newFlavorInput}
                                            onChange={(e) => setNewFlavorInput(e.target.value)}
                                            className="h-9 flex-1 min-w-24 text-sm"
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
                                            onClick={() => {
                                                const v = newFlavorInput.trim();
                                                if (v) flavorsForm.setData('flavors', [...flavorsForm.data.flavors, v]);
                                                setNewFlavorInput('');
                                            }}
                                        >
                                            <Plus className="mr-1 size-4" /> Add flavor
                                        </Button>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={flavorsForm.processing}>
                                        {flavorsForm.processing ? 'Saving...' : 'Save flavors'}
                                    </Button>
                                    {Object.keys(flavorsForm.errors).length > 0 && (
                                        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                            {Object.entries(flavorsForm.errors).map(([k, v]) => (
                                                <div key={k}>{typeof v === 'string' ? v : Array.isArray(v) ? (v as string[]).join(', ') : String(v)}</div>
                                            ))}
                                        </div>
                                    )}
                                </form>
                            ) : (
                                <p className="text-sm text-muted-foreground">Select a category to view and edit its flavors.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Card 3: Size & Price Category — list of size and price */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CircleDollarSign className="size-5" />
                                Size & Price Category
                            </CardTitle>
                            <CardDescription>Pick a food category, then manage sizes and prices. These appear when adding a product.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="price-category" className="text-xs">Category</Label>
                                <select
                                    id="price-category"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={String(selectedCategoryIdForPriceList)}
                                    onChange={handleSelectCategoryForPriceList}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            {selectedCategoryForPriceList ? (
                                <form onSubmit={handleSavePriceList} className="space-y-4">
                                    <ul className="min-h-12 list-none space-y-2">
                                        {priceListForm.data.price_list.length === 0 ? (
                                            <li className="rounded-lg border border-dashed bg-muted/10 px-4 py-3 text-center text-sm text-muted-foreground">
                                                No sizes. Add below.
                                            </li>
                                        ) : (
                                            priceListForm.data.price_list.map((p, i) => (
                                                <li key={i} className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2 shadow-sm">
                                                    <div className="flex flex-1 min-w-0 items-center">
                                                        <Input
                                                            placeholder="Size"
                                                            value={p.size}
                                                            onChange={(e) => setPrice(i, 'size', e.target.value, 'priceListForm')}
                                                            className="h-9 rounded-r-none border-r-0 text-sm"
                                                        />
                                                        <span className="flex h-9 shrink-0 items-center rounded-r-md border border-l-0 bg-muted/50 px-2.5 text-sm font-medium text-muted-foreground">
                                                            g
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="flex h-9 shrink-0 items-center rounded-l-md border border-r-0 bg-muted/50 px-2.5 text-sm font-medium text-muted-foreground">
                                                            ₱
                                                        </span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min={0}
                                                            placeholder="0"
                                                            value={p.price}
                                                            onChange={(e) => setPrice(i, 'price', e.target.value, 'priceListForm')}
                                                            className="h-9 w-24 rounded-l-none text-sm"
                                                        />
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon" className="size-9 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => removePrice(i, 'priceListForm')} aria-label="Remove row">
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => addPrice('priceListForm')}>
                                            <Plus className="mr-1 size-4" /> Add size & price
                                        </Button>
                                        <Button type="submit" disabled={priceListForm.processing}>
                                            {priceListForm.processing ? 'Saving...' : 'Save size & price'}
                                        </Button>
                                    </div>
                                    {Object.keys(priceListForm.errors).length > 0 && (
                                        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                            {Object.entries(priceListForm.errors).map(([k, v]) => (
                                                <div key={k}>{typeof v === 'string' ? v : Array.isArray(v) ? (v as string[]).join(', ') : String(v)}</div>
                                            ))}
                                        </div>
                                    )}
                                </form>
                            ) : (
                                <p className="text-sm text-muted-foreground">Select a category to view and edit its sizes and prices.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Your categories: compact summary with setup status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your categories</CardTitle>
                        <CardDescription>See which categories exist and how they’re set up. Edit to change everything, or use the cards above to change only flavors or prices.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categories.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">No categories yet. Add one in the Food category card above.</p>
                        ) : (
                            <ul className="divide-y rounded-lg border">
                                {categories.map((cat) => {
                                    const flavorCount = (cat.flavors ?? []).length;
                                    const sizeCount = (cat.price_list ?? []).length;
                                    return (
                                        <li key={cat.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 first:rounded-t-lg last:rounded-b-lg hover:bg-muted/30 sm:flex-nowrap">
                                            <div className="min-w-0 flex-1">
                                                <span className="font-medium">{cat.name}</span>
                                                <span className="ml-2 text-sm text-muted-foreground">
                                                    {flavorCount} flavor{flavorCount !== 1 ? 's' : ''} · {sizeCount} size{sizeCount !== 1 ? 's' : ''} · {cat.products_count} product{cat.products_count !== 1 ? 's' : ''}
                                                </span>
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

                <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit category</DialogTitle>
                            <p className="text-sm text-muted-foreground">Update name, slug, flavors, and price list.</p>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                            {Object.keys(editForm.errors).length > 0 && (
                                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {Object.entries(editForm.errors).map(([k, v]) => (
                                        <div key={k}>{typeof v === 'string' ? v : Array.isArray(v) ? (v as string[]).join(', ') : String(v)}</div>
                                    ))}
                                </div>
                            )}
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
                            <div className="space-y-2">
                                <Label>Price list (size & price)</Label>
                                {editForm.data.price_list.map((p, i) => (
                                    <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/5 px-3 py-2">
                                        <div className="flex items-center">
                                            <Input placeholder="Size" value={p.size} onChange={(e) => setPrice(i, 'size', e.target.value, 'editForm')} className="h-9 w-24 rounded-r-none border-r-0" />
                                            <span className="flex h-9 shrink-0 items-center rounded-r-md border border-l-0 bg-muted/50 px-2.5 text-sm font-medium text-muted-foreground">g</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="flex h-9 shrink-0 items-center rounded-l-md border border-r-0 bg-muted/50 px-2.5 text-sm font-medium text-muted-foreground">₱</span>
                                            <Input type="number" step="0.01" min={0} placeholder="0" value={p.price} onChange={(e) => setPrice(i, 'price', e.target.value, 'editForm')} className="h-9 w-24 rounded-l-none" />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" className="size-9 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => removePrice(i, 'editForm')} aria-label="Remove row">
                                            <Trash2 className="size-4" />
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
