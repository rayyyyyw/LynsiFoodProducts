import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Products', href: '/products/products' },
];

type Category = { id: number; name: string; slug: string };
type Variant = { id?: number; size: string | null; flavor: string | null; price: string; sku: string | null; stock_quantity: number };
type Product = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_path: string | null;
    expiry: string | null;
    featured: boolean;
    category: Category;
    variants: Variant[];
};

export default function Products({
    products = [],
}: {
    products: Product[];
    categories?: Category[];
}) {
    const handleDelete = (product: Product) => {
        if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
        router.delete(`/products/products/${product.id}`, { preserveScroll: true });
    };

    const minPrice = (p: Product) => {
        if (!p.variants?.length) return null;
        const prices = p.variants.map((v) => Number(v.price));
        return Math.min(...prices);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your product catalog. Add products with sizes, flavors, and prices.
                    </p>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle>All products</CardTitle>
                            <CardDescription>View and manage your product list.</CardDescription>
                        </div>
                        <Button asChild className="inline-flex items-center gap-2">
                            <Link href="/products/products/create">
                                <Plus className="size-4" />
                                Add product
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Category</th>
                                        <th className="px-4 py-3 text-left font-medium">Variants</th>
                                        <th className="px-4 py-3 text-left font-medium">From</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                No products yet.{' '}
                                                <Link href="/products/products/create" className="text-primary underline">
                                                    Add your first product
                                                </Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30">
                                                <td className="px-4 py-3 font-medium">{product.name}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{product.category?.name ?? '—'}</td>
                                                <td className="px-4 py-3">{product.variants?.length ?? 0}</td>
                                                <td className="px-4 py-3">
                                                    {minPrice(product) != null ? `₱${minPrice(product)!.toFixed(2)}` : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" className="size-8" asChild>
                                                            <Link href={`/products/products/${product.id}/edit`} aria-label="Edit">
                                                                <Pencil className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive hover:text-destructive"
                                                            aria-label="Delete"
                                                            onClick={() => handleDelete(product)}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
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
