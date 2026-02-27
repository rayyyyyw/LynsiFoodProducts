import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Heart, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useMemo, useState, useRef, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';

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

function getDisplayPrice(product: ProductItem): number {
    if (!product.variants?.length) return 0;
    return Math.min(...product.variants.map((v) => v.price));
}

function formatPrice(price: number): string {
    return `₱${Number(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Shop() {
    const page = usePage();
    const { auth } = page.props as { auth: { user: { name?: string; email?: string; role?: string; profile_photo_url?: string | null } | null } };
    const props = page.props as {
        products?: ProductItem[];
        categories?: { id: number; name: string; slug: string }[];
        canRegister?: boolean;
    };
    const products = useMemo(
        () => (Array.isArray(props.products) ? props.products : []),
        [props.products],
    );
    const categories = Array.isArray(props.categories) ? props.categories : [];
    const canRegister = props.canRegister !== false;

    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<number | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortKey>('latest');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [priceRangeApplied, setPriceRangeApplied] = useState(false);

    /* Cart state */
    const [addingId,         setAddingId]         = useState<number | null>(null);
    const [addedId,          setAddedId]           = useState<number | null>(null);
    const [picker,           setPicker]            = useState<ProductItem | null>(null);
    const [pickerVariantIdx, setPickerVariantIdx]  = useState(0);
    const [pickerQty,        setPickerQty]         = useState(1);
    const pickerRef = useRef<HTMLDivElement>(null);

    /* Derived: current variant + its stock cap inside the picker */
    const pickerVariant = picker?.variants[pickerVariantIdx] ?? null;
    const pickerMaxQty  = pickerVariant?.stock_quantity || 99;

    useEffect(() => {
        if (!picker) return;
        const h = (e: MouseEvent) => { if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPicker(null); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [picker]);

    /* Reset qty to 1 when variant changes */
    useEffect(() => { setPickerQty(1); }, [pickerVariantIdx]);

    function addToCart(variantId: number, productId: number, qty: number) {
        if (!auth.user) { router.visit('/login'); return; }
        setAddingId(variantId);
        router.post('/cart', { variant_id: variantId, quantity: qty }, {
            preserveScroll: true,
            onSuccess: () => {
                setAddingId(null);
                setAddedId(productId);
                setPicker(null);
                setPickerQty(1);
                setTimeout(() => setAddedId(null), 1800);
            },
            onError: () => setAddingId(null),
        });
    }

    /* Always open picker so buyer can choose quantity (and variant if multiple) */
    function handleCardCartClick(e: React.MouseEvent, product: ProductItem) {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.user) { router.visit('/login'); return; }
        setPickerVariantIdx(0);
        setPickerQty(1);
        setPicker(product);
    }

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
        <>
        <div className="flex min-h-screen flex-col bg-[#ecfdf5]">
            <Head title="Products – Lynsi Food Products" />

            <LandingNav activeId="products" auth={auth ?? { user: null }} canRegister={canRegister} />

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
                                    const isAdded = addedId === product.id;
                                    const isAdding = product.variants.some(v => addingId === v.id);
                                    return (
                                        <div
                                            key={product.id}
                                            className="overflow-hidden rounded-xl border bg-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-emerald-400"
                                            style={{ borderColor: PALETTE.border, display: 'flex', flexDirection: 'column' }}
                                        >
                                            {/* Clickable image area */}
                                            <Link href={`/shop/product/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                                                <div className="relative flex justify-center bg-neutral-100 px-6 pt-6 pb-2">
                                                    <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md" style={{ borderColor: PALETTE.border }}>
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-neutral-400" style={{ background: PALETTE.bg }}>
                                                                <ShoppingBag className="h-12 w-12" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                        className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow hover:bg-white" aria-label="Wishlist">
                                                        <Heart className="h-4 w-4 text-neutral-600" />
                                                    </button>
                                                </div>
                                                <div className="px-3 pt-3 pb-1">
                                                    <span className="mb-1 inline-block text-xs font-medium uppercase tracking-wide" style={{ color: PALETTE.accent }}>
                                                        {categoryName.length > 12 ? `${categoryName.slice(0, 12)}…` : categoryName}
                                                    </span>
                                                    <h3 className="mb-1 line-clamp-2 font-medium text-neutral-900">{product.name}</h3>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg font-semibold" style={{ color: PALETTE.primary }}>{formatPrice(price)}</span>
                                                        {product.variants.length > 1 && (
                                                            <span className="text-xs text-neutral-500">from {product.variants.length} variants</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Add to Cart button */}
                                            <div style={{ padding: '8px 12px 12px', marginTop: 'auto' }}>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleCardCartClick(e, product)}
                                                    disabled={isAdding}
                                                    style={{
                                                        width: '100%', padding: '9px 14px',
                                                        background: isAdded
                                                            ? '#d1fae5'
                                                            : `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.primary})`,
                                                        color: isAdded ? PALETTE.primary : PALETTE.white,
                                                        border: 'none', borderRadius: 10, cursor: isAdding ? 'wait' : 'pointer',
                                                        fontWeight: 600, fontSize: 13, fontFamily: "'Inter', sans-serif",
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                        transition: 'all 0.2s', opacity: isAdding ? 0.7 : 1,
                                                    }}
                                                >
                                                    {isAdded ? (
                                                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added!</>
                                                    ) : isAdding ? (
                                                        <><span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Adding…</>
                                                    ) : (
                                                        <><ShoppingCart size={14} /> Add to Cart</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </main>
        </div>

        {/* ── Add-to-Cart picker modal ── */}
        {picker && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(2px)' }}>
                <div ref={pickerRef} style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 400, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: "'Inter', sans-serif" }}>

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            {picker.image_url && (
                                <img src={picker.image_url} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', border: '1px solid #d1fae5', flexShrink: 0 }} />
                            )}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: PALETTE.accent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                                    {picker.category?.name ?? 'Product'}
                                </p>
                                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.3 }}>{picker.name}</h3>
                                {pickerVariant && (
                                    <p style={{ fontSize: 13, fontWeight: 700, color: PALETTE.primary, marginTop: 2 }}>
                                        ₱{Number(pickerVariant.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button type="button" onClick={() => setPicker(null)}
                            style={{ background: '#f3f4f6', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#6b7280', flexShrink: 0 }}>✕</button>
                    </div>

                    {/* Variant selector (only if more than one) */}
                    {picker.variants.length > 1 && (
                        <>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Select Variant</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 180, overflowY: 'auto', marginBottom: 18 }}>
                                {picker.variants.map((v, idx) => {
                                    const label = [v.flavor, v.size].filter(Boolean).join(' – ') || 'Default';
                                    const selected = pickerVariantIdx === idx;
                                    return (
                                        <button key={v.id} type="button" onClick={() => setPickerVariantIdx(idx)}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 13px', borderRadius: 10, border: `1.5px solid ${selected ? PALETTE.accent : '#e5e7eb'}`, background: selected ? '#ecfdf5' : '#fff', cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s' }}>
                                            <span style={{ fontSize: 14, fontWeight: selected ? 600 : 400, color: selected ? PALETTE.primary : '#374151' }}>{label}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: PALETTE.primary }}>₱{Number(v.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                                                <span style={{ fontSize: 11, color: '#9ca3af' }}>{v.stock_quantity} left</span>
                                                {selected && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={PALETTE.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Quantity stepper — capped by stock */}
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quantity</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                            <button type="button" disabled={pickerQty <= 1}
                                onClick={() => setPickerQty(q => Math.max(1, q - 1))}
                                style={{ width: 38, height: 38, background: 'none', border: 'none', cursor: pickerQty <= 1 ? 'not-allowed' : 'pointer', fontSize: 20, color: pickerQty <= 1 ? '#d1d5db' : PALETTE.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>−</button>
                            <span style={{ minWidth: 36, textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#111827' }}>{pickerQty}</span>
                            <button type="button" disabled={pickerQty >= pickerMaxQty}
                                onClick={() => setPickerQty(q => Math.min(pickerMaxQty, q + 1))}
                                style={{ width: 38, height: 38, background: 'none', border: 'none', cursor: pickerQty >= pickerMaxQty ? 'not-allowed' : 'pointer', fontSize: 20, color: pickerQty >= pickerMaxQty ? '#d1d5db' : PALETTE.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>+</button>
                        </div>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>
                            {pickerVariant ? (
                                pickerVariant.stock_quantity > 0
                                    ? <>{pickerVariant.stock_quantity} available</>
                                    : <span style={{ color: '#ef4444' }}>Out of stock</span>
                            ) : null}
                        </span>
                    </div>

                    {/* Confirm button */}
                    <button type="button"
                        disabled={addingId !== null || (pickerVariant?.stock_quantity ?? 0) === 0}
                        onClick={() => pickerVariant && addToCart(pickerVariant.id, picker.id, pickerQty)}
                        style={{ width: '100%', padding: '13px', background: `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.primary})`, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: (addingId || !pickerVariant?.stock_quantity) ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (addingId || !pickerVariant?.stock_quantity) ? 0.7 : 1 }}>
                        {addingId ? (
                            <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Adding…</>
                        ) : (pickerVariant?.stock_quantity ?? 0) === 0 ? (
                            'Out of Stock'
                        ) : (
                            <><ShoppingCart size={15} /> Add {pickerQty} to Cart — ₱{pickerVariant ? Number(pickerVariant.price * pickerQty).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '0'}</>
                        )}
                    </button>
                </div>
            </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
}
