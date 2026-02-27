import { Head, Link, router, usePage } from '@inertiajs/react';
import { Heart, Minus, Plus, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
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
type ProductData = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    expiry: string | null;
    featured: boolean;
    category: CategoryRef;
    variants: Variant[];
};

function formatPrice(price: number): string {
    return `₱${Number(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getVariantLabel(v: Variant): string {
    const parts = [v.flavor, v.size].filter(Boolean);
    return parts.length ? parts.join(' – ') : 'Default';
}

export default function ProductDetail() {
    const page = usePage();
    const { auth } = page.props as { auth: { user: { name?: string; email?: string; role?: string; profile_photo_url?: string | null } | null } | null };
    const { product, canRegister = true } = page.props as {
        product: ProductData;
        canRegister?: boolean;
    };

    const hasVariants = product.variants.length > 1;
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [cartAdding, setCartAdding] = useState(false);
    const [cartAdded,  setCartAdded]  = useState(false);

    /* Reset qty to 1 whenever the selected variant changes */
    useEffect(() => { setQuantity(1); }, [selectedVariantIndex]);

    function addToCart() {
        if (!auth?.user) { router.visit('/login'); return; }
        if (!variant) return;
        setCartAdding(true);
        router.post('/cart', { variant_id: variant.id, quantity: qty }, {
            preserveScroll: true,
            onSuccess: () => {
                setCartAdding(false);
                setCartAdded(true);
                setTimeout(() => setCartAdded(false), 2000);
            },
            onError: () => setCartAdding(false),
        });
    }

    const variant = product.variants[selectedVariantIndex];
    const price = variant ? variant.price : 0;
    const stock = variant ? variant.stock_quantity : 0;
    const maxQty = Math.max(1, stock);
    const qty = Math.min(Math.max(1, quantity), maxQty);

    const categoryName = product.category?.name ?? 'Uncategorized';

    return (
        <div className="flex min-h-screen flex-col bg-[#ecfdf5]">
            <Head title={`${product.name} – Lynsi Food Products`} />

            <LandingNav activeId="products" auth={auth ?? { user: null }} canRegister={canRegister} />

            <main className="flex-1 px-4 py-8">
                <div className="mx-auto max-w-6xl">
                    <Link
                        href="/shop"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium"
                        style={{ color: PALETTE.muted }}
                    >
                        ← Back to shop
                    </Link>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Left: product image */}
                        <div
                            className="overflow-hidden rounded-2xl border bg-white"
                            style={{ borderColor: PALETTE.border, aspectRatio: '1', maxHeight: '560px' }}
                        >
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div
                                    className="flex h-full w-full items-center justify-center"
                                    style={{ background: PALETTE.bg }}
                                >
                                    <ShoppingBag className="h-24 w-24 text-neutral-400" />
                                </div>
                            )}
                        </div>

                        {/* Right: details */}
                        <div className="flex flex-col">
                            <span
                                className="mb-2 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                                style={{ background: PALETTE.light, color: PALETTE.primary }}
                            >
                                {categoryName}
                            </span>
                            <h1 className="mb-2 text-2xl font-bold text-neutral-900 md:text-3xl">{product.name}</h1>
                            <p className="mb-4 text-sm text-neutral-500">by Lynsi Food Products</p>

                            <div className="mb-6">
                                <span className="text-3xl font-bold" style={{ color: PALETTE.primary }}>
                                    {formatPrice(price)}
                                </span>
                            </div>

                            {product.description && (
                                <p className="mb-6 text-neutral-600 leading-relaxed">{product.description}</p>
                            )}

                            {/* Variant selector (if multiple) */}
                            {hasVariants && (
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                                        Variant
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.map((v, i) => (
                                            <button
                                                key={v.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedVariantIndex(i);
                                                    setQuantity(1);
                                                }}
                                                className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
                                                style={{
                                                    borderColor: selectedVariantIndex === i ? PALETTE.accent : PALETTE.border,
                                                    background: selectedVariantIndex === i ? PALETTE.bg : PALETTE.white,
                                                    color: selectedVariantIndex === i ? PALETTE.primary : PALETTE.muted,
                                                }}
                                            >
                                                {getVariantLabel(v)} – {formatPrice(v.price)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-neutral-700">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center rounded-lg border bg-white" style={{ borderColor: PALETTE.border }}>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            disabled={qty <= 1}
                                            className="flex h-11 w-11 items-center justify-center text-neutral-600 disabled:opacity-50"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="min-w-10 text-center font-medium">{qty}</span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                                            disabled={qty >= maxQty}
                                            className="flex h-11 w-11 items-center justify-center text-neutral-600 disabled:opacity-50"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {stock > 0
                                        ? <span className="text-sm text-neutral-500">{stock} available</span>
                                        : <span className="text-sm font-semibold" style={{ color: '#ef4444' }}>Out of stock</span>
                                    }
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={addToCart}
                                    disabled={cartAdding || stock === 0}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold min-w-[140px] transition-all"
                                    style={{
                                        background: cartAdded ? PALETTE.light : PALETTE.primary,
                                        color: cartAdded ? PALETTE.primary : PALETTE.white,
                                        opacity: (cartAdding || stock === 0) ? 0.7 : 1,
                                        cursor: (cartAdding || stock === 0) ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {cartAdded ? (
                                        <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added to Cart!</>
                                    ) : cartAdding ? (
                                        <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Adding…</>
                                    ) : stock === 0 ? (
                                        'Out of Stock'
                                    ) : (
                                        <><ShoppingCart className="h-5 w-5" /> Add to Cart</>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 font-semibold min-w-[140px]"
                                    style={{ borderColor: PALETTE.border, color: PALETTE.primary, background: PALETTE.white }}
                                >
                                    <Heart className="h-5 w-5" />
                                    Wishlist
                                </button>
                            </div>
                            {cartAdded && (
                                <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                                    <Link href="/cart" className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: PALETTE.primary, textDecoration: 'none' }}>
                                        View Cart →
                                    </Link>
                                    <Link href="/shop" className="rounded-lg border px-4 py-2 text-sm font-semibold" style={{ borderColor: PALETTE.border, color: PALETTE.primary, textDecoration: 'none' }}>
                                        Continue Shopping
                                    </Link>
                                </div>
                            )}

                            {/* Optional: expiry */}
                            {product.expiry && (
                                <div className="mt-8 border-t pt-6" style={{ borderColor: PALETTE.border }}>
                                    <h3 className="mb-1 text-sm font-semibold text-neutral-700">Best before</h3>
                                    <p className="text-sm text-neutral-600">{product.expiry}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
