import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/settings/general' },
    { title: 'Landing Page', href: '/settings/landing' },
];

type HeroContent = {
    badge?: string;
    titleLine1?: string;
    titleLine2?: string;
    subtitle?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
    stat1Num?: string;
    stat1Label?: string;
    stat2Num?: string;
    stat2Label?: string;
    stat3Num?: string;
    stat3Label?: string;
};

type ProductItem = { name: string; price: string; unit: string; category: string; icon: string; badge: string; color: string };
type BenefitItem = { icon: string; title: string; desc: string };
type StepItem = { step: string; title: string; desc: string };
type LocationItem = { name: string; address: string; city: string; phone: string; hours: string; tag: string };

type LandingContent = {
    hero?: HeroContent;
    products?: { badge?: string; title?: string; subtitle?: string; catalogueLabel?: string; items?: ProductItem[] };
    benefits?: { badge?: string; title?: string; subtitle?: string; items?: BenefitItem[] };
    howItWorks?: { badge?: string; title?: string; subtitle?: string; steps?: StepItem[] };
    locations?: { badge?: string; title?: string; subtitle?: string; items?: LocationItem[] };
    aboutUs?: {
        badge?: string;
        title?: string;
        subtitle?: string;
        paragraph1?: string;
        paragraph2?: string;
        stat1Num?: string;
        stat1Label?: string;
        stat2Num?: string;
        stat2Label?: string;
        stat3Num?: string;
        stat3Label?: string;
        farmToTableTitle?: string;
        farmToTableDesc?: string;
    };
    contactUs?: { badge?: string; title?: string; subtitle?: string; email?: string; phone?: string; address?: string; footerNote?: string };
};

function SectionCard({
    title,
    description,
    open: defaultOpen = false,
    children,
}: {
    title: string;
    description: string;
    open?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Card className="border-border shadow-sm">
            <CardHeader
                className="cursor-pointer select-none py-3"
                onClick={() => setOpen((o) => !o)}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        <CardDescription className="text-xs">{description}</CardDescription>
                    </div>
                    {open ? <ChevronUp className="size-4 shrink-0" /> : <ChevronDown className="size-4 shrink-0" />}
                </div>
            </CardHeader>
            {open && <CardContent className="space-y-3 border-t border-border pt-3">{children}</CardContent>}
        </Card>
    );
}

const defaultProductItem = (): ProductItem => ({
    name: '',
    price: '',
    unit: '',
    category: '',
    icon: '🛒',
    badge: '',
    color: '#dcfce7',
});
const defaultBenefitItem = (): BenefitItem => ({ icon: '🍃', title: '', desc: '' });
const defaultStepItem = (): StepItem => ({ step: '01', title: '', desc: '' });
const defaultLocationItem = (): LocationItem => ({
    name: '',
    address: '',
    city: '',
    phone: '',
    hours: '',
    tag: '',
});

export default function Landing({ content, status }: { content: LandingContent; status?: string | null }) {
    const [successMessage, setSuccessMessage] = useState<string | null>(status ?? null);
    const { data, setData, put, processing, errors } = useForm<{ content: LandingContent }>({
        content: content ?? {},
    });

    useEffect(() => {
        if (status) setSuccessMessage(status);
    }, [status]);

    useEffect(() => {
        if (!successMessage) return;
        const timer = setTimeout(() => setSuccessMessage(null), 5000);
        return () => clearTimeout(timer);
    }, [successMessage]);

    const update = (path: string, value: unknown) => {
        setData((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            const keys = path.split('.');
            let cur: Record<string, unknown> = next.content as Record<string, unknown>;
            for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                if (!(k in cur)) cur[k] = {};
                cur = cur[k] as Record<string, unknown>;
            }
            cur[keys[keys.length - 1]] = value;
            return next;
        });
    };

    const get = (path: string): unknown => {
        const keys = path.split('.');
        let cur: unknown = data.content;
        for (const k of keys) {
            cur = (cur as Record<string, unknown>)?.[k];
        }
        return cur;
    };

    const updateArray = (section: string, key: string, index: number, field: string, value: string) => {
        const base = (data.content as Record<string, unknown>)[section] as Record<string, unknown> | undefined;
        const arr = (base?.[key] as unknown[]) ?? [];
        const copy = [...arr];
        if (!copy[index]) return;
        (copy[index] as Record<string, unknown>)[field] = value;
        update(section, { ...base, [key]: copy });
    };

    const addArrayItem = (section: string, key: string, defaultItem: () => unknown) => {
        const base = (data.content as Record<string, unknown>)[section] as Record<string, unknown> | undefined;
        const arr = (base?.[key] as unknown[]) ?? [];
        update(section, { ...base, [key]: [...arr, defaultItem()] });
    };

    const removeArrayItem = (section: string, key: string, index: number) => {
        const base = (data.content as Record<string, unknown>)[section] as Record<string, unknown> | undefined;
        const arr = (base?.[key] as unknown[]) ?? [];
        const copy = arr.filter((_, i) => i !== index);
        update(section, { ...base, [key]: copy });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/landing', { preserveScroll: true });
    };

    const products = (data.content?.products?.items ?? []) as ProductItem[];
    const benefits = (data.content?.benefits?.items ?? []) as BenefitItem[];
    const steps = (data.content?.howItWorks?.steps ?? []) as StepItem[];
    const locations = (data.content?.locations?.items ?? []) as LocationItem[];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Landing Page Settings" />
            <SettingsLayout>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {successMessage && (
                        <Alert className="border-green-500/50 bg-green-50 text-green-800 dark:border-green-500/30 dark:bg-green-950/30 dark:text-green-200">
                            <CheckCircle2 className="size-4" />
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}
                    {errors.content && (
                        <p className="text-sm text-destructive">{errors.content}</p>
                    )}
                    <div className="flex justify-end pb-1">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save landing page content'}
                        </Button>
                    </div>

                    {/* Products */}
                    <SectionCard title="Products" description="Featured products section.">
                        <div className="space-y-3">
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <Label>Section badge</Label>
                                    <Input
                                        value={(get('products.badge') as string) ?? ''}
                                        onChange={(e) => update('products', { ...data.content?.products, badge: e.target.value })}
                                        placeholder="🛒 Fresh Arrivals"
                                    />
                                </div>
                                <div>
                                    <Label>Section title</Label>
                                    <Input
                                        value={(get('products.title') as string) ?? ''}
                                        onChange={(e) => update('products', { ...data.content?.products, title: e.target.value })}
                                        placeholder="Featured Products"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Input
                                    value={(get('products.subtitle') as string) ?? ''}
                                    onChange={(e) => update('products', { ...data.content?.products, subtitle: e.target.value })}
                                    placeholder="Hand-picked, certified organic..."
                                />
                            </div>
                            <div>
                                <Label>Catalogue button label</Label>
                                <Input
                                    value={(get('products.catalogueLabel') as string) ?? ''}
                                    onChange={(e) => update('products', { ...data.content?.products, catalogueLabel: e.target.value })}
                                    placeholder="View Full Catalogue →"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Product items</Label>
                                {products.map((p, i) => (
                                    <div key={i} className="mb-4 flex flex-wrap gap-2 rounded-lg border p-3">
                                        <Input
                                            className="flex-1 min-w-[120px]"
                                            placeholder="Name"
                                            value={p.name}
                                            onChange={(e) => updateArray('products', 'items', i, 'name', e.target.value)}
                                        />
                                        <Input
                                            className="w-24"
                                            placeholder="Price"
                                            value={p.price}
                                            onChange={(e) => updateArray('products', 'items', i, 'price', e.target.value)}
                                        />
                                        <Input
                                            className="w-20"
                                            placeholder="Unit"
                                            value={p.unit}
                                            onChange={(e) => updateArray('products', 'items', i, 'unit', e.target.value)}
                                        />
                                        <Input
                                            className="flex-1 min-w-[100px]"
                                            placeholder="Category"
                                            value={p.category}
                                            onChange={(e) => updateArray('products', 'items', i, 'category', e.target.value)}
                                        />
                                        <Input
                                            className="w-14"
                                            placeholder="Icon"
                                            value={p.icon}
                                            onChange={(e) => updateArray('products', 'items', i, 'icon', e.target.value)}
                                        />
                                        <Input
                                            placeholder="Badge"
                                            value={p.badge}
                                            onChange={(e) => updateArray('products', 'items', i, 'badge', e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0"
                                            onClick={() => removeArrayItem('products', 'items', i)}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addArrayItem('products', 'items', defaultProductItem)}
                                >
                                    <Plus className="mr-1 size-4" /> Add product
                                </Button>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Benefits */}
                    <SectionCard title="Benefits" description="Why Choose Lynsi section.">
                        <div className="space-y-3">
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <Label>Section badge</Label>
                                    <Input
                                        value={(get('benefits.badge') as string) ?? ''}
                                        onChange={(e) => update('benefits', { ...data.content?.benefits, badge: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Section title</Label>
                                    <Input
                                        value={(get('benefits.title') as string) ?? ''}
                                        onChange={(e) => update('benefits', { ...data.content?.benefits, title: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Input
                                    value={(get('benefits.subtitle') as string) ?? ''}
                                    onChange={(e) => update('benefits', { ...data.content?.benefits, subtitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Benefit items</Label>
                                {benefits.map((b, i) => (
                                    <div key={i} className="mb-4 flex flex-wrap gap-2 rounded-lg border p-3">
                                        <Input
                                            className="w-14"
                                            placeholder="Icon"
                                            value={b.icon}
                                            onChange={(e) => updateArray('benefits', 'items', i, 'icon', e.target.value)}
                                        />
                                        <Input
                                            className="flex-1 min-w-[140px]"
                                            placeholder="Title"
                                            value={b.title}
                                            onChange={(e) => updateArray('benefits', 'items', i, 'title', e.target.value)}
                                        />
                                        <Input
                                            className="flex-2 min-w-[200px]"
                                            placeholder="Description"
                                            value={b.desc}
                                            onChange={(e) => updateArray('benefits', 'items', i, 'desc', e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0"
                                            onClick={() => removeArrayItem('benefits', 'items', i)}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addArrayItem('benefits', 'items', defaultBenefitItem)}
                                >
                                    <Plus className="mr-1 size-4" /> Add benefit
                                </Button>
                            </div>
                        </div>
                    </SectionCard>

                    {/* How it works */}
                    <SectionCard title="How It Works" description="Process steps section.">
                        <div className="space-y-3">
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <Label>Section badge</Label>
                                    <Input
                                        value={(get('howItWorks.badge') as string) ?? ''}
                                        onChange={(e) => update('howItWorks', { ...data.content?.howItWorks, badge: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Section title</Label>
                                    <Input
                                        value={(get('howItWorks.title') as string) ?? ''}
                                        onChange={(e) => update('howItWorks', { ...data.content?.howItWorks, title: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Input
                                    value={(get('howItWorks.subtitle') as string) ?? ''}
                                    onChange={(e) => update('howItWorks', { ...data.content?.howItWorks, subtitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Steps</Label>
                                {steps.map((s, i) => (
                                    <div key={i} className="mb-4 flex flex-wrap gap-2 rounded-lg border p-3">
                                        <Input
                                            className="w-14"
                                            placeholder="Step #"
                                            value={s.step}
                                            onChange={(e) => updateArray('howItWorks', 'steps', i, 'step', e.target.value)}
                                        />
                                        <Input
                                            className="flex-1 min-w-[160px]"
                                            placeholder="Step title"
                                            value={s.title}
                                            onChange={(e) => updateArray('howItWorks', 'steps', i, 'title', e.target.value)}
                                        />
                                        <Input
                                            className="flex-2 min-w-[200px]"
                                            placeholder="Description"
                                            value={s.desc}
                                            onChange={(e) => updateArray('howItWorks', 'steps', i, 'desc', e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0"
                                            onClick={() => removeArrayItem('howItWorks', 'steps', i)}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addArrayItem('howItWorks', 'steps', defaultStepItem)}
                                >
                                    <Plus className="mr-1 size-4" /> Add step
                                </Button>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Our Locations */}
                    <SectionCard title="Our Locations" description="Store locations section.">
                        <div className="space-y-3">
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <Label>Section badge</Label>
                                    <Input
                                        value={(get('locations.badge') as string) ?? ''}
                                        onChange={(e) => update('locations', { ...data.content?.locations, badge: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Section title</Label>
                                    <Input
                                        value={(get('locations.title') as string) ?? ''}
                                        onChange={(e) => update('locations', { ...data.content?.locations, title: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Input
                                    value={(get('locations.subtitle') as string) ?? ''}
                                    onChange={(e) => update('locations', { ...data.content?.locations, subtitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Location items</Label>
                                {locations.map((loc, i) => (
                                    <div key={i} className="mb-4 space-y-2 rounded-lg border p-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Input
                                                className="flex-1 min-w-[160px]"
                                                placeholder="Location name"
                                                value={loc.name}
                                                onChange={(e) => updateArray('locations', 'items', i, 'name', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Tag"
                                                value={loc.tag}
                                                onChange={(e) => updateArray('locations', 'items', i, 'tag', e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0"
                                                onClick={() => removeArrayItem('locations', 'items', i)}
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                        <Input
                                            placeholder="Address"
                                            value={loc.address}
                                            onChange={(e) => updateArray('locations', 'items', i, 'address', e.target.value)}
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            <Input
                                                className="flex-1 min-w-[100px]"
                                                placeholder="City"
                                                value={loc.city}
                                                onChange={(e) => updateArray('locations', 'items', i, 'city', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Phone"
                                                value={loc.phone}
                                                onChange={(e) => updateArray('locations', 'items', i, 'phone', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Hours"
                                                value={loc.hours}
                                                onChange={(e) => updateArray('locations', 'items', i, 'hours', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addArrayItem('locations', 'items', defaultLocationItem)}
                                >
                                    <Plus className="mr-1 size-4" /> Add location
                                </Button>
                            </div>
                        </div>
                    </SectionCard>

                    {/* About Us */}
                    <SectionCard title="About Us" description="Our story and values.">
                        <div className="space-y-3">
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <Label>Section badge</Label>
                                    <Input
                                        value={(get('aboutUs.badge') as string) ?? ''}
                                        onChange={(e) => update('aboutUs', { ...data.content?.aboutUs, badge: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Section title</Label>
                                    <Input
                                        value={(get('aboutUs.title') as string) ?? ''}
                                        onChange={(e) => update('aboutUs', { ...data.content?.aboutUs, title: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Input
                                    value={(get('aboutUs.subtitle') as string) ?? ''}
                                    onChange={(e) => update('aboutUs', { ...data.content?.aboutUs, subtitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Paragraph 1</Label>
                                <textarea
                                    className={cn(
                                        'border-input flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    )}
                                    value={(get('aboutUs.paragraph1') as string) ?? ''}
                                    onChange={(e) => update('aboutUs', { ...data.content?.aboutUs, paragraph1: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label>Paragraph 2</Label>
                                <textarea
                                    className={cn(
                                        'border-input flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    )}
                                    value={(get('aboutUs.paragraph2') as string) ?? ''}
                                    onChange={(e) => update('aboutUs', { ...data.content?.aboutUs, paragraph2: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="grid gap-2 sm:grid-cols-3">
                                {(['stat1', 'stat2', 'stat3'] as const).map((s) => (
                                    <div key={s} className="flex gap-2">
                                        <Input
                                            placeholder="Number"
                                            value={(get(`aboutUs.${s}Num`) as string) ?? ''}
                                            onChange={(e) => update('aboutUs', { ...data.content?.aboutUs, [`${s}Num`]: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Label"
                                            value={(get(`aboutUs.${s}Label`) as string) ?? ''}
                                            onChange={(e) => update('aboutUs', { ...data.content?.aboutUs, [`${s}Label`]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <Label>Farm to Table title</Label>
                                <Input
                                    value={(get('aboutUs.farmToTableTitle') as string) ?? ''}
                                    onChange={(e) => update('aboutUs', { ...data.content?.aboutUs, farmToTableTitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Farm to Table description</Label>
                                <Input
                                    value={(get('aboutUs.farmToTableDesc') as string) ?? ''}
                                    onChange={(e) => update('aboutUs', { ...data.content?.aboutUs, farmToTableDesc: e.target.value })}
                                />
                            </div>
                        </div>
                    </SectionCard>

                    {/* Contact Us */}
                    <SectionCard title="Contact Us" description="Contact section and details.">
                        <div className="space-y-3">
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <Label>Section badge</Label>
                                    <Input
                                        value={(get('contactUs.badge') as string) ?? ''}
                                        onChange={(e) => update('contactUs', { ...data.content?.contactUs, badge: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Section title</Label>
                                    <Input
                                        value={(get('contactUs.title') as string) ?? ''}
                                        onChange={(e) => update('contactUs', { ...data.content?.contactUs, title: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Input
                                    value={(get('contactUs.subtitle') as string) ?? ''}
                                    onChange={(e) => update('contactUs', { ...data.content?.contactUs, subtitle: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={(get('contactUs.email') as string) ?? ''}
                                        onChange={(e) => update('contactUs', { ...data.content?.contactUs, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <Input
                                        value={(get('contactUs.phone') as string) ?? ''}
                                        onChange={(e) => update('contactUs', { ...data.content?.contactUs, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Address</Label>
                                <Input
                                    value={(get('contactUs.address') as string) ?? ''}
                                    onChange={(e) => update('contactUs', { ...data.content?.contactUs, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Footer note (below contact cards)</Label>
                                <textarea
                                    className={cn(
                                        'border-input flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    )}
                                    value={(get('contactUs.footerNote') as string) ?? ''}
                                    onChange={(e) => update('contactUs', { ...data.content?.contactUs, footerNote: e.target.value })}
                                    rows={2}
                                />
                            </div>
                        </div>
                    </SectionCard>

                </form>
            </SettingsLayout>
        </AppLayout>
    );
}
