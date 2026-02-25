import { Head } from '@inertiajs/react';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Products', href: '/products/products' },
];

const placeholderProducts = [
    { id: '1', name: 'Organic Hass Avocados', category: 'Fresh Fruits', price: '₱350', unit: '/kg', status: 'Active' },
    { id: '2', name: 'Farm-Fresh Tomatoes', category: 'Vegetables', price: '₱120', unit: '/kg', status: 'Active' },
    { id: '3', name: 'Free-Range Brown Eggs', category: 'Dairy & Eggs', price: '₱240', unit: '/doz', status: 'Active' },
    { id: '4', name: 'Artisan Sourdough', category: 'Bakery', price: '₱180', unit: '/loaf', status: 'Draft' },
    { id: '5', name: 'Organic Coconut Oil', category: 'Pantry', price: '₱420', unit: '/bottle', status: 'Active' },
];

export default function Products() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your product catalog. Add, edit, and organize products for your store.
                    </p>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle>All products</CardTitle>
                            <CardDescription>View and manage your product list.</CardDescription>
                        </div>
                        <Button className="inline-flex items-center gap-2">
                            <Plus className="size-4" />
                            Add product
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-lg border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Category</th>
                                        <th className="px-4 py-3 text-left font-medium">Price</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {placeholderProducts.map((product) => (
                                        <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium">{product.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
                                            <td className="px-4 py-3">
                                                {product.price}
                                                <span className="text-muted-foreground">{product.unit}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        product.status === 'Active'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {product.status}
                                                </span>
                                            </td>
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
                            <Package className="size-5" />
                            Add new product
                        </CardTitle>
                        <CardDescription>Create a product. Set name, category, price, and unit.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="prod-name">Product name</Label>
                                <Input id="prod-name" placeholder="e.g. Organic Mangoes" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prod-category">Category</Label>
                                <Input id="prod-category" placeholder="e.g. Fresh Fruits" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prod-price">Price (₱)</Label>
                                <Input id="prod-price" type="number" placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prod-unit">Unit</Label>
                                <Input id="prod-unit" placeholder="e.g. /kg, /doz" />
                            </div>
                        </div>
                        <Button type="submit">Save product</Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
