import { Head } from '@inertiajs/react';
import { Package, AlertTriangle, Plus, Minus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Inventory', href: '/products/inventory' },
];

const placeholderInventory = [
    { id: '1', name: 'Organic Hass Avocados', sku: 'AVO-001', stock: 45, lowStockAt: 10, status: 'ok' },
    { id: '2', name: 'Farm-Fresh Tomatoes', sku: 'TOM-002', stock: 8, lowStockAt: 15, status: 'low' },
    { id: '3', name: 'Free-Range Brown Eggs', sku: 'EGG-003', stock: 120, lowStockAt: 20, status: 'ok' },
    { id: '4', name: 'Artisan Sourdough', sku: 'BRD-004', stock: 0, lowStockAt: 5, status: 'out' },
    { id: '5', name: 'Organic Coconut Oil', sku: 'OIL-005', stock: 32, lowStockAt: 10, status: 'ok' },
];

export default function Inventory() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-sm text-muted-foreground">
                        Track stock levels, set low-stock alerts, and adjust quantities.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Stock levels</CardTitle>
                        <CardDescription>Current inventory by product. Adjust quantities as you receive or sell stock.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-lg border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Product</th>
                                        <th className="px-4 py-3 text-left font-medium">SKU</th>
                                        <th className="px-4 py-3 text-left font-medium">Stock</th>
                                        <th className="px-4 py-3 text-left font-medium">Low stock at</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Adjust</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {placeholderInventory.map((item) => (
                                        <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3 font-medium">{item.name}</td>
                                            <td className="px-4 py-3 font-mono text-muted-foreground">{item.sku}</td>
                                            <td className="px-4 py-3">{item.stock}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{item.lowStockAt}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                                        item.status === 'ok' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                                                        item.status === 'low' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                                                        item.status === 'out' && 'bg-destructive/10 text-destructive',
                                                    )}
                                                >
                                                    {item.status === 'low' && <AlertTriangle className="size-3" />}
                                                    {item.status === 'ok' ? 'In stock' : item.status === 'low' ? 'Low stock' : 'Out of stock'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="outline" size="icon" className="size-8" aria-label="Decrease">
                                                        <Minus className="size-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="size-8" aria-label="Increase">
                                                        <Plus className="size-4" />
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
                            Adjust stock
                        </CardTitle>
                        <CardDescription>Enter a quantity change for a product by SKU.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="inv-sku">SKU</Label>
                                <Input id="inv-sku" placeholder="e.g. AVO-001" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="inv-qty">Quantity change (+ or -)</Label>
                                <Input id="inv-qty" type="number" placeholder="e.g. 10 or -5" />
                            </div>
                        </div>
                        <Button type="submit">Update stock</Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
