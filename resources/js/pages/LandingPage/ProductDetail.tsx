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

type Variant = {
    id: number;
    size: string | null;
    flavor: string | null;
    price: number;
    stock_quantity: number;
};
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

type RelatedProduct = {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    category: string | null;
    price: number;
};

type ProductReview = {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user: { name: string };
};

function formatPrice(price: number): string {
    return `₱${Number(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getVariantLabel(v: Variant): string {
    const parts = [v.flavor, v.size].filter(Boolean);
    return parts.length ? parts.join(' – ') : 'Default';
}

function getSizeLabel(size: string | null): string | null {
    if (!size) return null;
    return /^[0-9]+(\.[0-9]+)?$/.test(size) ? `${size}g` : size;
}

export default function ProductDetail() {
    const page = usePage();
    const { auth } = page.props as {
        auth: {
            user: {
                id?: number;
                name?: string;
                email?: string;
                role?: string;
                profile_photo_url?: string | null;
            } | null;
        } | null;
    };
    const {
        product,
        relatedProducts = [],
        reviews = [],
        canRegister = true,
    } = page.props as {
        product: ProductData;
        relatedProducts?: RelatedProduct[];
        reviews?: ProductReview[];
        canRegister?: boolean;
    };

    const hasVariants = product.variants.length > 1;
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [cartAdding, setCartAdding] = useState(false);
    const [cartAdded, setCartAdded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    const favoritesKey = `lynsi_favorites_${auth?.user?.id ?? 'guest'}`;

    function addToCart() {
        if (!variant) return;
        setCartAdding(true);
        router.post(
            '/cart',
            { variant_id: variant.id, quantity: qty },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCartAdding(false);
                    setCartAdded(true);
                    setTimeout(() => setCartAdded(false), 2000);
                },
                onError: () => setCartAdding(false),
            },
        );
    }

    const variant = product.variants[selectedVariantIndex];
    const price = variant ? variant.price : 0;
    const stock = variant ? variant.stock_quantity : 0;
    const maxQty = Math.max(1, stock);
    const qty = Math.min(Math.max(1, quantity), maxQty);

    const categoryName = product.category?.name ?? 'Uncategorized';

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = window.localStorage.getItem(favoritesKey);
            const arr = raw ? JSON.parse(raw) : [];
            const safeIds = Array.isArray(arr)
                ? (arr as unknown[]).filter(
                      (id): id is number => typeof id === 'number',
                  )
                : [];
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsFavorite(safeIds.includes(product.id));
        } catch {
            setIsFavorite(false);
        }
    }, [product.id, favoritesKey]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const key = 'lynsi_recently_viewed';
        try {
            const raw = window.localStorage.getItem(key);
            const arr = raw ? JSON.parse(raw) : [];
            const ids = Array.isArray(arr)
                ? (arr as unknown[]).filter(
                      (id): id is number => typeof id === 'number',
                  )
                : [];
            const next = [
                product.id,
                ...ids.filter((id) => id !== product.id),
            ].slice(0, 12);
            window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
            // ignore
        }
    }, [product.id]);

    function toggleFavorite() {
        if (typeof window === 'undefined') return;
        try {
            const raw = window.localStorage.getItem(favoritesKey);
            const arr: number[] =
                raw && Array.isArray(JSON.parse(raw))
                    ? (JSON.parse(raw) as unknown[]).filter(
                          (id): id is number => typeof id === 'number',
                      )
                    : [];
            let next: number[];
            if (arr.includes(product.id)) {
                next = arr.filter((id) => id !== product.id);
                setIsFavorite(false);
            } else {
                next = [...arr, product.id];
                setIsFavorite(true);
            }
            window.localStorage.setItem(favoritesKey, JSON.stringify(next));
            window.dispatchEvent(new CustomEvent('lynsi:favorites-updated'));
        } catch {
            // ignore
        }
    }

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    function submitReview(e: React.FormEvent) {
        e.preventDefault();
        if (!auth?.user) {
            router.visit('/login');
            return;
        }
        setReviewSubmitting(true);
        router.post(
            `/shop/product/${product.slug}/reviews`,
            { rating, comment: reviewComment.trim() || null },
            {
                preserveScroll: true,
                onFinish: () => setReviewSubmitting(false),
                onSuccess: () => setReviewComment(''),
            },
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#ecfdf5]">
            <Head title={`${product.name} – Lynsi Food Products`} />

            <LandingNav
                activeId="products"
                auth={auth ?? { user: null }}
                canRegister={canRegister}
            />

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
                            style={{
                                borderColor: PALETTE.border,
                                aspectRatio: '1',
                                maxHeight: '560px',
                            }}
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
                                className="mb-2 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase"
                                style={{
                                    background: PALETTE.light,
                                    color: PALETTE.primary,
                                }}
                            >
                                {categoryName}
                            </span>
                            <h1 className="mb-2 text-2xl font-bold text-neutral-900 md:text-3xl">
                                {product.name}
                            </h1>
                            <p className="mb-3 text-sm text-neutral-500">
                                by Lynsi Food Products
                            </p>

                            {variant && (variant.flavor || variant.size) && (
                                <div className="mb-4 flex flex-col gap-1">
                                    {variant.flavor && (
                                        <div className="font-medium text-slate-600">
                                            {variant.flavor}
                                        </div>
                                    )}
                                    {getSizeLabel(variant.size) && (
                                        <div className="text-sm text-slate-500">
                                            {getSizeLabel(variant.size)}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mb-6">
                                <span
                                    className="text-3xl font-bold"
                                    style={{ color: PALETTE.primary }}
                                >
                                    {formatPrice(price)}
                                </span>
                            </div>

                            {product.description && (
                                <p className="mb-6 leading-relaxed text-neutral-600">
                                    {product.description}
                                </p>
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
                                                    borderColor:
                                                        selectedVariantIndex ===
                                                        i
                                                            ? PALETTE.accent
                                                            : PALETTE.border,
                                                    background:
                                                        selectedVariantIndex ===
                                                        i
                                                            ? PALETTE.bg
                                                            : PALETTE.white,
                                                    color:
                                                        selectedVariantIndex ===
                                                        i
                                                            ? PALETTE.primary
                                                            : PALETTE.muted,
                                                }}
                                            >
                                                {getVariantLabel(v)} –{' '}
                                                {formatPrice(v.price)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-neutral-700">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex items-center rounded-lg border bg-white"
                                        style={{ borderColor: PALETTE.border }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity((q) =>
                                                    Math.max(1, q - 1),
                                                )
                                            }
                                            disabled={qty <= 1}
                                            className="flex h-11 w-11 items-center justify-center text-neutral-600 disabled:opacity-50"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="min-w-10 text-center font-medium">
                                            {qty}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity((q) =>
                                                    Math.min(maxQty, q + 1),
                                                )
                                            }
                                            disabled={qty >= maxQty}
                                            className="flex h-11 w-11 items-center justify-center text-neutral-600 disabled:opacity-50"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {stock > 0 ? (
                                        <span className="text-sm text-neutral-500">
                                            {stock} available
                                        </span>
                                    ) : (
                                        <span
                                            className="text-sm font-semibold"
                                            style={{ color: '#ef4444' }}
                                        >
                                            Out of stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={addToCart}
                                    disabled={cartAdding || stock === 0}
                                    className="flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition-all"
                                    style={{
                                        background: cartAdded
                                            ? PALETTE.light
                                            : PALETTE.primary,
                                        color: cartAdded
                                            ? PALETTE.primary
                                            : PALETTE.white,
                                        opacity:
                                            cartAdding || stock === 0 ? 0.7 : 1,
                                        cursor:
                                            cartAdding || stock === 0
                                                ? 'not-allowed'
                                                : 'pointer',
                                    }}
                                >
                                    {cartAdded ? (
                                        <>
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>{' '}
                                            Added to Cart!
                                        </>
                                    ) : cartAdding ? (
                                        <>
                                            <span
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    border: '2.5px solid rgba(255,255,255,0.4)',
                                                    borderTopColor: '#fff',
                                                    borderRadius: '50%',
                                                    display: 'inline-block',
                                                    animation:
                                                        'spin 0.7s linear infinite',
                                                }}
                                            />{' '}
                                            Adding…
                                        </>
                                    ) : stock === 0 ? (
                                        'Out of Stock'
                                    ) : (
                                        <>
                                            <ShoppingCart className="h-5 w-5" />{' '}
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleFavorite}
                                    className="flex min-w-[140px] items-center justify-center gap-2 rounded-xl border px-6 py-3.5 font-semibold"
                                    style={{
                                        borderColor: isFavorite
                                            ? '#ef4444'
                                            : PALETTE.border,
                                        color: isFavorite
                                            ? '#ef4444'
                                            : PALETTE.primary,
                                        background: PALETTE.white,
                                    }}
                                >
                                    <Heart
                                        className="h-5 w-5"
                                        color={
                                            isFavorite
                                                ? '#ef4444'
                                                : PALETTE.primary
                                        }
                                        fill={isFavorite ? '#ef4444' : 'none'}
                                    />
                                    {isFavorite
                                        ? 'Favorited'
                                        : 'Add to Favorites'}
                                </button>
                            </div>
                            {cartAdded && (
                                <div
                                    style={{
                                        marginTop: 12,
                                        display: 'flex',
                                        gap: 10,
                                    }}
                                >
                                    <Link
                                        href="/cart"
                                        className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                                        style={{
                                            background: PALETTE.primary,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        View Cart →
                                    </Link>
                                    <Link
                                        href="/shop"
                                        className="rounded-lg border px-4 py-2 text-sm font-semibold"
                                        style={{
                                            borderColor: PALETTE.border,
                                            color: PALETTE.primary,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            )}

                            {/* Optional: expiry */}
                            {product.expiry && (
                                <div
                                    className="mt-8 border-t pt-6"
                                    style={{ borderColor: PALETTE.border }}
                                >
                                    <h3 className="mb-1 text-sm font-semibold text-neutral-700">
                                        Best before
                                    </h3>
                                    <p className="text-sm text-neutral-600">
                                        {product.expiry}
                                    </p>
                                </div>
                            )}

                            <div
                                className="mt-8 border-t pt-6"
                                style={{ borderColor: PALETTE.border }}
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-neutral-700">
                                        Reviews
                                    </h3>
                                    <span className="text-sm text-neutral-600">
                                        {reviews.length > 0
                                            ? `${averageRating.toFixed(1)} / 5 (${reviews.length})`
                                            : 'No reviews yet'}
                                    </span>
                                </div>
                                <form
                                    onSubmit={submitReview}
                                    className="mb-4 rounded-lg border p-3"
                                    style={{ borderColor: PALETTE.border }}
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        <label className="text-sm text-neutral-700">
                                            Your rating
                                        </label>
                                        <select
                                            value={rating}
                                            onChange={(e) =>
                                                setRating(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="rounded-md border px-2 py-1 text-sm"
                                            style={{
                                                borderColor: PALETTE.border,
                                            }}
                                        >
                                            {[5, 4, 3, 2, 1].map((r) => (
                                                <option key={r} value={r}>
                                                    {r} star{r > 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) =>
                                            setReviewComment(e.target.value)
                                        }
                                        placeholder="Share your experience with this product..."
                                        className="mb-2 w-full rounded-md border p-2 text-sm"
                                        style={{
                                            borderColor: PALETTE.border,
                                        }}
                                        rows={3}
                                    />
                                    <button
                                        type="submit"
                                        disabled={reviewSubmitting}
                                        className="rounded-md px-3 py-2 text-sm font-semibold text-white"
                                        style={{
                                            background: PALETTE.primary,
                                            opacity: reviewSubmitting ? 0.7 : 1,
                                        }}
                                    >
                                        {reviewSubmitting
                                            ? 'Submitting...'
                                            : 'Submit review'}
                                    </button>
                                </form>
                                <div className="space-y-2">
                                    {reviews.slice(0, 5).map((r) => (
                                        <div
                                            key={r.id}
                                            className="rounded-md border p-3"
                                            style={{
                                                borderColor: PALETTE.border,
                                            }}
                                        >
                                            <div className="mb-1 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-neutral-800">
                                                    {r.user.name}
                                                </span>
                                                <span className="text-xs text-neutral-500">
                                                    {'★'.repeat(r.rating)}
                                                </span>
                                            </div>
                                            {r.comment && (
                                                <p className="text-sm text-neutral-600">
                                                    {r.comment}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {relatedProducts.length > 0 && (
                        <section className="mt-10">
                            <h2 className="mb-3 text-xl font-bold text-neutral-900">
                                Related products
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                                {relatedProducts.map((rp) => (
                                    <Link
                                        key={rp.id}
                                        href={`/shop/product/${rp.slug}`}
                                        className="rounded-xl border bg-white p-3 no-underline transition hover:shadow-md"
                                        style={{
                                            borderColor: PALETTE.border,
                                            color: 'inherit',
                                        }}
                                    >
                                        <div className="mb-2 h-28 overflow-hidden rounded-lg bg-neutral-100">
                                            {rp.image_url ? (
                                                <img
                                                    src={rp.image_url}
                                                    alt={rp.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : null}
                                        </div>
                                        <div className="line-clamp-1 text-sm font-semibold text-neutral-800">
                                            {rp.name}
                                        </div>
                                        <div className="text-xs text-neutral-500">
                                            {rp.category ?? 'Uncategorized'}
                                        </div>
                                        <div className="mt-1 text-sm font-bold text-emerald-700">
                                            {formatPrice(rp.price)}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
