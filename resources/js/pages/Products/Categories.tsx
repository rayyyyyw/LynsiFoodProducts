import { Head } from '@inertiajs/react';
import { Layers, Plus, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Categories', href: '/products/categories' },
];

const placeholderCategories = [
    { id: '1', name: 'Fresh Fruits', slug: 'fresh-fruits', productCount: 24 },
    { id: '2', name: 'Vegetables', slug: 'vegetables', productCount: 18 },
    { id: '3', name: 'Dairy & Eggs', slug: 'dairy-eggs', productCount: 12 },
    { id: '4', name: 'Bakery', slug: 'bakery', productCount: 8 },
    { id: '5', name: 'Pantry', slug: 'pantry', productCount: 15 },
];

export default function Categories() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                    <p className="text-sm text-muted-foreground">
                        Organize your products into categories. Manage names, slugs, and product counts.
                    </p>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle>All categories</CardTitle>
                            <CardDescription>View and manage product categories.</CardDescription>
                        </div>
                        <Button className="inline-flex items-center gap-2">
                            <Plus className="size-4" />
                            Add category
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-lg border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Slug</th>
                                        <th className="px-4 py-3 text-left font-medium">Products</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {placeholderCategories.map((cat) => (
                                        <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium">{cat.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                                            <td className="px-4 py-3">{cat.productCount}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="size-8" aria-label="Edit">
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label="Delete">
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
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
                        <CardTitle className="flex items-center gap-2">
                            <Layers className="size-5" />
                            Add new category
                        </CardTitle>
                        <CardDescription>Create a category. Slug will be used in URLs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="cat-name">Name</Label>
                                <Input id="cat-name" placeholder="e.g. Beverages" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cat-slug">Slug</Label>
                                <Input id="cat-slug" placeholder="e.g. beverages" />
                            </div>
                        </div>
                        <Button type="submit">Save category</Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
