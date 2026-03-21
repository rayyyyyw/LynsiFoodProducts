import { Head, Link, router, usePage } from '@inertiajs/react';
import { Heart, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
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

function getDisplayPrice(product: ProductItem): number {
    if (!product.variants?.length) return 0;
    return Math.min(...product.variants.map((v) => v.price));
}

function formatPrice(price: number): string {
    return `₱${Number(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Favorites() {
    const page = usePage();
    const { auth } = page.props as { auth: { user: { id?: number; name?: string; email?: string; role?: string; profile_photo_url?: string | null } | null } };
    const props = page.props as {
        products?: ProductItem[];
        canRegister?: boolean;
    };

    const products = useMemo(
        () => (Array.isArray(props.products) ? props.products : []),
        [props.products],
    );
    const canRegister = props.canRegister !== false;

    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

    const favoritesKey = `lynsi_favorites_${auth?.user?.id ?? 'guest'}`;

    // Picker state (reuse from shop for quantity & variant choice)
    const [addingId, setAddingId] = useState<number | null>(null);
    const [addedId, setAddedId] = useState<number | null>(null);
    const [picker, setPicker] = useState<ProductItem | null>(null);
    const [pickerVariantIdx, setPickerVariantIdx] = useState(0);
    const [pickerQty, setPickerQty] = useState(1);
    const pickerRef = useRef<HTMLDivElement>(null);

    const pickerVariant = picker?.variants[pickerVariantIdx] ?? null;
    const pickerMaxQty = pickerVariant?.stock_quantity || 99;

    useEffect(() => {
        if (!picker) return;
        const h = (e: MouseEvent) => { if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPicker(null); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [picker]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = window.localStorage.getItem(favoritesKey);
            const arr = raw ? JSON.parse(raw) : [];
            const safeIds = Array.isArray(arr)
                ? (arr as unknown[]).filter((id): id is number => typeof id === 'number')
                : [];
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFavoriteIds(safeIds);
        } catch {
             
            setFavoriteIds([]);
        }
    }, [favoritesKey]);

    function syncFavorites(next: number[]) {
        setFavoriteIds(next);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(favoritesKey, JSON.stringify(next));
            window.dispatchEvent(new CustomEvent('lynsi:favorites-updated'));
        }
    }

    function toggleFavorite(productId: number) {
        setFavoriteIds(prev => {
            const set = new Set(prev);
            if (set.has(productId)) set.delete(productId);
            else set.add(productId);
            const next = Array.from(set);
            syncFavorites(next);
            return next;
        });
    }

    const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
    const favoriteProducts = useMemo(
        () => products.filter((p) => favoriteIdSet.has(p.id)),
        [products, favoriteIdSet],
    );

    function addToCart(variantId: number, productId: number, qty: number) {
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

    function handleOpenPicker(e: React.MouseEvent, product: ProductItem) {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.user) { router.visit('/login'); return; }
        setPickerVariantIdx(0);
        setPickerQty(1);
        setPicker(product);
    }

    return (
        <>
            <div className="flex min-h-screen flex-col" style={{ background: PALETTE.bg }}>
                <Head title="Favorites – Lynsi Food Products" />

                <LandingNav activeId="products" auth={auth ?? { user: null }} canRegister={canRegister} />

                <main className="min-h-0 flex-1 px-3 py-4 sm:px-4 sm:py-6">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
                                    Favorites
                                </h1>
                                <p className="text-xs text-neutral-500 sm:text-sm">
                                    Quick access to products you love. Review variant options, then add to cart.
                                </p>
                            </div>
                            {favoriteProducts.length > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                    <Heart className="h-4 w-4" />
                                    {favoriteProducts.length} saved
                                </span>
                            )}
                        </div>

                        {favoriteProducts.length === 0 ? (
                            <div
                                className="rounded-xl border border-dashed py-12 px-4 text-center text-neutral-600"
                                style={{ borderColor: PALETTE.border }}
                            >
                                <div className="mb-3 flex justify-center">
                                    <Heart className="h-8 w-8 text-neutral-300" />
                                </div>
                                <p className="mb-2 text-sm font-semibold text-neutral-800">
                                    No favorites yet.
                                </p>
                                <p className="mb-4 text-xs text-neutral-500 sm:text-sm">
                                    Tap the heart icon on any product to save it here for later.
                                </p>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                                    style={{ background: PALETTE.primary, textDecoration: 'none' }}
                                >
                                    Browse products →
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {favoriteProducts.map((product) => {
                                    const price = getDisplayPrice(product);
                                    const categoryName = product.category?.name ?? 'Uncategorized';
                                    const isAdded = addedId === product.id;
                                    const isAdding = product.variants.some(v => addingId === v.id);

                                    const primaryVariant = product.variants[0];
                                    const flavorLabel = primaryVariant?.flavor ?? null;
                                    const rawSize = primaryVariant?.size ?? null;
                                    const sizeLabel = rawSize && /^[0-9]+(\.[0-9]+)?$/.test(rawSize) ? `${rawSize}g` : rawSize;

                                    return (
                                        <div
                                            key={product.id}
                                            className="overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-emerald-400"
                                            style={{ borderColor: PALETTE.border, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                                        >
                                            {/* Clickable image area */}
                                            <Link href={`/shop/product/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                                                <div className="relative flex justify-center bg-neutral-100 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                                                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md sm:h-32 sm:w-32 lg:h-36 lg:w-36" style={{ borderColor: PALETTE.border }}>
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-neutral-400" style={{ background: PALETTE.bg }}>
                                                                <ShoppingBag className="h-12 w-12" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id); }}
                                                        className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                                                        aria-label="Remove from favorites"
                                                    >
                                                        <Heart className="h-4 w-4 text-red-500" fill="#ef4444" />
                                                    </button>
                                                </div>
                                                <div className="px-2.5 pt-2.5 pb-1 sm:px-3 sm:pt-3">
                                                    <span className="mb-1 inline-block text-xs font-medium uppercase tracking-wide text-slate-500">
                                                        {categoryName.length > 12 ? `${categoryName.slice(0, 12)}…` : categoryName}
                                                    </span>
                                                    <h3 className="mb-1 line-clamp-2 font-semibold text-slate-800">{product.name}</h3>
                                                    {(flavorLabel || sizeLabel) && (
                                                        <div className="mb-1.5 text-xs leading-snug space-y-0.5">
                                                            {flavorLabel && (
                                                                <div className="text-slate-600">{flavorLabel}</div>
                                                            )}
                                                            {sizeLabel && (
                                                                <div className="font-medium text-slate-500">{sizeLabel}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg font-semibold text-emerald-700">{formatPrice(price)}</span>
                                                        {product.variants.length > 1 && (
                                                            <span className="text-xs text-slate-400">from {product.variants.length} variants</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Add to Cart button */}
                                            <div className="px-3 pb-3 pt-1 sm:px-3 sm:pb-3 sm:pt-2" style={{ marginTop: 'auto' }}>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleOpenPicker(e, product)}
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
                </main>
            </div>

            {/* ── Add-to-Cart picker modal ── */}
            {picker && (
                <div className="flex items-center justify-center p-3 sm:p-5" style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}>
                    <div ref={pickerRef} className="w-full max-w-[400px] rounded-2xl p-4 sm:p-6" style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: "'Inter', sans-serif", maxHeight: 'min(90vh, 520px)', overflowY: 'auto' }}>

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
                                            <button key={v.id} type="button" onClick={() => { setPickerVariantIdx(idx); setPickerQty(1); }}
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

