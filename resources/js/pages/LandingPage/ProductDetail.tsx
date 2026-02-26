import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Home, ShoppingBag, MapPin, Info, Mail, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';

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

const NAV_ITEMS: { id: string; label: string; href: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'products', label: 'Products', href: '/shop', icon: ShoppingBag },
    { id: 'our-locations', label: 'Our Locations', href: '/#our-locations', icon: MapPin },
    { id: 'about-us', label: 'About Us', href: '/#about-us', icon: Info },
    { id: 'contact-us', label: 'Contact Us', href: '/#contact-us', icon: Mail },
];

function formatPrice(price: number): string {
    return `₱${Number(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getVariantLabel(v: Variant): string {
    const parts = [v.flavor, v.size].filter(Boolean);
    return parts.length ? parts.join(' – ') : 'Default';
}

export default function ProductDetail() {
    const page = usePage();
    const { auth } = page.props as { auth: { user: unknown } | null };
    const { product, canRegister = true } = page.props as {
        product: ProductData;
        canRegister?: boolean;
    };

    const hasVariants = product.variants.length > 1;
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const variant = product.variants[selectedVariantIndex];
    const price = variant ? variant.price : 0;
    const stock = variant ? variant.stock_quantity : 0;
    const maxQty = Math.max(1, stock);
    const qty = Math.min(Math.max(1, quantity), maxQty);

    const categoryName = product.category?.name ?? 'Uncategorized';

    return (
        <div className="flex min-h-screen flex-col bg-[#ecfdf5]">
            <Head title={`${product.name} – Lynsi Food Products`} />

            <nav
                className="sticky top-0 z-50 border-b bg-white"
                style={{ borderColor: PALETTE.border, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/mylogo/logopng%20(1).png" alt="Lynsi" className="h-9 w-auto object-contain" />
                        <span style={{ fontWeight: 800, fontSize: '18px', color: PALETTE.primary }}>
                            Lynsi<span style={{ color: PALETTE.accent }}>FoodProducts</span>
                        </span>
                    </Link>
                    <div className="hidden items-center gap-2 md:flex">
                        {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => (
                            <Link
                                key={id}
                                href={href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: href === '/shop' ? '8px 14px' : '8px 0',
                                    borderRadius: 10,
                                    color: href === '/shop' ? PALETTE.primary : PALETTE.muted,
                                    fontWeight: href === '/shop' ? 600 : 500,
                                    textDecoration: 'none',
                                    background: href === '/shop' ? PALETTE.bg : 'transparent',
                                    border: `1px solid ${href === '/shop' ? PALETTE.border : 'transparent'}`,
                                }}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                            </Link>
                        ))}
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
                                <Link href="/login" style={{ color: PALETTE.muted, fontWeight: 500, textDecoration: 'none', fontSize: 14 }}>
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
                                    <span className="text-sm text-neutral-500">{stock} available</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white min-w-[140px]"
                                    style={{ background: PALETTE.primary }}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Add to Cart
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 font-semibold min-w-[140px]"
                                    style={{ borderColor: PALETTE.border, color: PALETTE.primary, background: PALETTE.white }}
                                >
                                    <Heart className="h-5 w-5" />
                                    Add to Wishlist
                                </button>
                            </div>

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
        </div>
    );
}
