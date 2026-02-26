import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Home, ShoppingBag, MapPin, Info, Mail, Search, Heart } from 'lucide-react';

const PALETTE = {
    primary: '#065f46',
    secondary: '#047857',
    accent: '#10b981',
    muted: '#059669',
    light: '#d1fae5',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    dark: '#022c22',
    white: '#ffffff',
    red: '#dc2626',
} as const;

type Variant = { id: number; size: string | null; flavor: string | null; price: number; stock_quantity: number };
type CategoryRef = { id: number; name: string; slug: string } | null;
type ProductItem = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    featured: boolean;
    category: CategoryRef;
    variants: Variant[];
};

type SortKey = 'popular' | 'latest' | 'top_sales' | 'price_asc' | 'price_desc';

const NAV_ITEMS: { id: string; label: string; href: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'products', label: 'Products', href: '/shop', icon: ShoppingBag },
    { id: 'our-locations', label: 'Our Locations', href: '/#our-locations', icon: MapPin },
    { id: 'about-us', label: 'About Us', href: '/#about-us', icon: Info },
    { id: 'contact-us', label: 'Contact Us', href: '/#contact-us', icon: Mail },
];

function getDisplayPrice(product: ProductItem): number {
    if (!product.variants?.length) return 0;
    return Math.min(...product.variants.map((v) => v.price));
}

function formatPrice(price: number): string {
    return `₱${Number(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Shop() {
    const page = usePage();
    const { auth } = page.props as { auth: { user: { name?: string; profile_photo_url?: string; avatar?: string } | null } };
    const props = page.props as {
        products?: ProductItem[];
        categories?: { id: number; name: string; slug: string }[];
        canRegister?: boolean;
    };
    const products = Array.isArray(props.products) ? props.products : [];
    const categories = Array.isArray(props.categories) ? props.categories : [];
    const canRegister = props.canRegister !== false;

    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<number | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortKey>('latest');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [priceRangeApplied, setPriceRangeApplied] = useState(false);

    const filteredAndSorted = useMemo(() => {
        let list = [...products];

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category?.name?.toLowerCase().includes(q) ||
                    (p.description && p.description.toLowerCase().includes(q)),
            );
        }

        if (categoryId !== 'all') {
            list = list.filter((p) => p.category?.id === categoryId);
        }

        if (priceRangeApplied && (priceMin !== '' || priceMax !== '')) {
            const min = priceMin === '' ? -Infinity : parseFloat(priceMin);
            const max = priceMax === '' ? Infinity : parseFloat(priceMax);
            list = list.filter((p) => {
                const price = getDisplayPrice(p);
                return price >= min && price <= max;
            });
        }

        switch (sortBy) {
            case 'latest':
                list = list.slice().reverse();
                break;
            case 'price_asc':
                list.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
                break;
            case 'price_desc':
                list.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
                break;
            case 'popular':
            case 'top_sales':
                list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
            default:
                break;
        }
        return list;
    }, [products, search, categoryId, sortBy, priceRangeApplied, priceMin, priceMax]);

    return (
        <div className="flex min-h-screen flex-col bg-[#ecfdf5]">
            <Head title="Products – Lynsi Food Products" />

            <nav
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    background: PALETTE.white,
                    borderBottom: `1px solid ${PALETTE.border}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/mylogo/logopng%20(1).png"
                            alt="Lynsi"
                            className="h-9 w-auto object-contain"
                        />
                        <span style={{ fontWeight: 800, fontSize: '18px', color: PALETTE.primary }}>
                            Lynsi<span style={{ color: PALETTE.accent }}>FoodProducts</span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-2 md:flex">
                        {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
                            const isActive = href === '/shop';
                            return (
                                <Link
                                    key={id}
                                    href={href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: isActive ? '8px 14px' : '8px 0',
                                        borderRadius: 10,
                                        color: isActive ? PALETTE.primary : PALETTE.muted,
                                        fontWeight: isActive ? 600 : 500,
                                        textDecoration: 'none',
                                        background: isActive ? PALETTE.bg : 'transparent',
                                        border: isActive ? `1px solid ${PALETTE.border}` : '1px solid transparent',
                                    }}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                style={{
                                    padding: '8px 16px',
                                    background: PALETTE.primary,
                                    color: PALETTE.white,
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    fontSize: 14,
                                }}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    style={{
                                        color: PALETTE.muted,
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        fontSize: 14,
                                    }}
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href="/register"
                                        style={{
                                            padding: '8px 16px',
                                            background: PALETTE.primary,
                                            color: PALETTE.white,
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            fontSize: 14,
                                        }}
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="min-h-0 flex-1 px-4 py-6">
                <div className="mx-auto max-w-7xl">
                {/* Search */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
                            aria-hidden
                        />
                        <input
                            type="search"
                            placeholder="Search products or categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-neutral-900 placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                    <button
                        type="button"
                        className="rounded-lg px-4 py-2.5 font-medium text-white"
                        style={{ background: PALETTE.primary }}
                    >
                        Search
                    </button>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Filters sidebar */}
                    <aside
                        className="w-full shrink-0 rounded-xl border p-4 lg:w-64"
                        style={{ borderColor: PALETTE.border, background: PALETTE.white }}
                    >
                        <h3 className="mb-3 text-sm font-semibold text-neutral-900">Filters</h3>

                        <div className="mb-4">
                            <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                                CATEGORY
                            </h4>
                            <div className="flex flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={() => setCategoryId('all')}
                                    className="rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
                                    style={{
                                        background: categoryId === 'all' ? PALETTE.bg : 'transparent',
                                        color: categoryId === 'all' ? PALETTE.primary : PALETTE.muted,
                                        border: categoryId === 'all' ? `1px solid ${PALETTE.accent}` : '1px solid transparent',
                                    }}
                                >
                                    All Categories
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategoryId(cat.id)}
                                        className="rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-100"
                                        style={{
                                            background: categoryId === cat.id ? PALETTE.bg : 'transparent',
                                            color: categoryId === cat.id ? PALETTE.primary : PALETTE.muted,
                                            border: categoryId === cat.id ? `1px solid ${PALETTE.accent}` : '1px solid transparent',
                                        }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                                PRICE RANGE
                            </h4>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-neutral-600">₱</span>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        placeholder="Min"
                                        value={priceMin}
                                        onChange={(e) => setPriceMin(e.target.value)}
                                        className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-neutral-600">₱</span>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        placeholder="Max"
                                        value={priceMax}
                                        onChange={(e) => setPriceMax(e.target.value)}
                                        className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPriceRangeApplied(true);
                                    }}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-white"
                                    style={{ background: PALETTE.accent }}
                                >
                                    Apply Price Range
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main content: sort + grid */}
                    <div className="min-w-0 flex-1">
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-neutral-700">Sort by</span>
                            {(
                                [
                                    { key: 'popular' as const, label: 'Popular' },
                                    { key: 'latest' as const, label: 'Latest' },
                                    { key: 'top_sales' as const, label: 'Top Sales' },
                                    { key: 'price_asc' as const, label: 'Price (low–high)' },
                                    { key: 'price_desc' as const, label: 'Price (high–low)' },
                                ] as const
                            ).map(({ key, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSortBy(key)}
                                    className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                                    style={{
                                        background: sortBy === key ? PALETTE.dark : PALETTE.white,
                                        color: sortBy === key ? PALETTE.white : PALETTE.muted,
                                        border: `1px solid ${sortBy === key ? PALETTE.dark : PALETTE.border}`,
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {filteredAndSorted.length === 0 ? (
                            <div
                                className="rounded-xl border border-dashed py-16 text-center text-neutral-600"
                                style={{ borderColor: PALETTE.border }}
                            >
                                No products match your filters. Try adjusting search or category.
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredAndSorted.map((product) => {
                                    const price = getDisplayPrice(product);
                                    const categoryName = product.category?.name ?? 'Uncategorized';
                                    return (
                                        <Link
                                            key={product.id}
                                            href={`/shop/product/${product.slug}`}
                                            className="overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md"
                                            style={{ borderColor: PALETTE.border }}
                                        >
                                            <div className="relative flex justify-center bg-neutral-100 px-6 pt-6 pb-2">
                                                <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md" style={{ borderColor: PALETTE.border }}>
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="flex h-full w-full items-center justify-center text-neutral-400"
                                                            style={{ background: PALETTE.bg }}
                                                        >
                                                            <ShoppingBag className="h-12 w-12" />
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                    className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                                                    aria-label="Add to wishlist"
                                                >
                                                    <Heart className="h-4 w-4 text-neutral-600" />
                                                </button>
                                            </div>
                                            <div className="p-3">
                                                <span
                                                    className="mb-1 inline-block text-xs font-medium uppercase tracking-wide"
                                                    style={{ color: PALETTE.accent }}
                                                >
                                                    {categoryName.length > 12 ? `${categoryName.slice(0, 12)}…` : categoryName}
                                                </span>
                                                <h3 className="mb-1 line-clamp-2 font-medium text-neutral-900">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-semibold" style={{ color: PALETTE.primary }}>
                                                        {formatPrice(price)}
                                                    </span>
                                                    {product.variants.length > 1 && (
                                                        <span className="text-xs text-neutral-500">
                                                            from {product.variants.length} variants
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </main>
        </div>
    );
}
