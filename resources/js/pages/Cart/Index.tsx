import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const LOGO_URL = '/mylogo/logopng%20(1).png';

const P = {
    primary:   '#065f46',
    secondary: '#047857',
    accent:    '#10b981',
    bg:        '#f0fdf4',
    card:      '#ffffff',
    border:    '#d1fae5',
    borderGray:'#e5e7eb',
    accentBg:  '#ecfdf5',
    text:      '#111827',
    textMuted: '#6b7280',
    textLight: '#9ca3af',
    danger:    '#ef4444',
    dangerBg:  '#fef2f2',
    white:     '#ffffff',
} as const;

type Variant = {
    id: number;
    size: string | null;
    flavor: string | null;
    price: number;
    stock_quantity: number;
    display_name: string;
};

type CartItemData = {
    id: number;
    quantity: number;
    variant: Variant;
    product: {
        id: number;
        name: string;
        slug: string;
        image_url: string | null;
        category: string | null;
    };
};

function formatPrice(n: number) {
    return `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Qty({ item }: { item: CartItemData }) {
    const max = item.variant.stock_quantity || 99;
    const [draft, setDraft] = useState(String(item.quantity));

    /* Keep draft in sync if the server updates item.quantity from outside */
    const serverQty = String(item.quantity);
    if (draft !== serverQty && document.activeElement?.id !== `qty-${item.id}`) {
        setDraft(serverQty);
    }

    function commit(raw: string) {
        const parsed = parseInt(raw, 10);
        if (isNaN(parsed) || parsed < 1) { setDraft(serverQty); return; }
        const clamped = Math.min(parsed, max);
        setDraft(String(clamped));
        if (clamped !== item.quantity) {
            router.patch(`/cart/${item.id}`, { quantity: clamped }, { preserveScroll: true });
        }
    }

    function patch(qty: number) {
        const clamped = Math.min(Math.max(1, qty), max);
        setDraft(String(clamped));
        router.patch(`/cart/${item.id}`, { quantity: clamped }, { preserveScroll: true });
    }

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', border: `1.5px solid ${P.borderGray}`, borderRadius: 10, overflow: 'hidden', background: P.white }}>
            <button
                type="button"
                disabled={item.quantity <= 1}
                onClick={() => patch(item.quantity - 1)}
                style={{ width: 34, height: 34, background: 'none', border: 'none', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', fontSize: 18, color: item.quantity <= 1 ? P.textLight : P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (item.quantity > 1) (e.currentTarget as HTMLButtonElement).style.background = P.accentBg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
            >−</button>

            <input
                id={`qty-${item.id}`}
                type="number"
                min={1}
                max={max}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onBlur={e => commit(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { (e.currentTarget as HTMLInputElement).blur(); } }}
                style={{
                    width: 44, height: 34, border: 'none', textAlign: 'center',
                    fontWeight: 700, fontSize: 14, color: P.text,
                    background: 'transparent', outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                    MozAppearance: 'textfield',
                }}
            />

            <button
                type="button"
                disabled={item.quantity >= max}
                onClick={() => patch(item.quantity + 1)}
                style={{ width: 34, height: 34, background: 'none', border: 'none', cursor: item.quantity >= max ? 'not-allowed' : 'pointer', fontSize: 18, color: item.quantity >= max ? P.textLight : P.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (item.quantity < max) (e.currentTarget as HTMLButtonElement).style.background = P.accentBg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
            >+</button>
        </div>
    );
}

export default function CartIndex({ items }: { items: CartItemData[] }) {
    const { auth } = usePage().props as { auth: { user: { name: string; profile_photo_url?: string | null } | null } };
    const user = auth?.user;

    const subtotal = items.reduce((s, i) => s + i.variant.price * i.quantity, 0);
    const totalQty = items.reduce((s, i) => s + i.quantity, 0);

    function removeItem(id: number) {
        router.delete(`/cart/${id}`, { preserveScroll: true });
    }

    function clearCart() {
        if (window.confirm('Remove all items from your cart?')) {
            router.delete('/cart', { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="My Cart – Lynsi Food Products" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', sans-serif; background: ${P.bg}; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
                .cart-row { animation: fade-in 0.2s ease; }
                input[type=number]::-webkit-inner-spin-button,
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                input[type=number] { -moz-appearance: textfield; }
            `}</style>

            {/* ── HEADER ── */}
            <header style={{ position: 'sticky', top: 0, zIndex: 100, background: `linear-gradient(135deg, #022c22 0%, ${P.primary} 100%)`, boxShadow: '0 2px 12px rgba(2,44,34,0.3)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 58, gap: 16 }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                        <img src={LOGO_URL} alt="" style={{ height: 28, objectFit: 'contain' }} />
                        <span style={{ fontWeight: 800, fontSize: 15, color: P.white, letterSpacing: '-0.3px' }}>
                            Lynsi<span style={{ color: '#6ee7b7' }}>FoodProducts</span>
                        </span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Link href="/shop" style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', padding: '7px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, transition: 'background 0.15s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                        >← Continue Shopping</Link>
                        {user && (
                            <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 50, textDecoration: 'none' }}>
                                <div style={{ width: 26, height: 26, borderRadius: '50%', background: P.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: P.white, overflow: 'hidden' }}>
                                    {user.profile_photo_url
                                        ? <img src={user.profile_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : user.name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* ── BODY ── */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px' }}>
                {/* Page title */}
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: P.primary, letterSpacing: '-0.5px' }}>
                        🛒 My Cart
                        {totalQty > 0 && <span style={{ fontSize: 14, fontWeight: 600, color: P.textMuted, marginLeft: 10 }}>({totalQty} {totalQty === 1 ? 'item' : 'items'})</span>}
                    </h1>
                </div>

                {items.length === 0 ? (
                    /* Empty state */
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: P.card, borderRadius: 18, border: `1px solid ${P.border}` }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: P.text, marginBottom: 8 }}>Your cart is empty</h2>
                        <p style={{ fontSize: 14, color: P.textMuted, marginBottom: 28 }}>Discover fresh products and add them to your cart.</p>
                        <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`, color: P.white, borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14, boxShadow: '0 2px 8px rgba(6,95,70,0.25)' }}>
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                        {/* ── Item list ── */}
                        <div style={{ flex: '1 1 500px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {items.map(item => (
                                <div key={item.id} className="cart-row" style={{ display: 'flex', gap: 16, background: P.card, borderRadius: 16, border: `1px solid ${P.border}`, padding: 16, alignItems: 'center' }}>
                                    {/* Product image */}
                                    <Link href={`/shop/product/${item.product.slug}`} style={{ flexShrink: 0 }}>
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt={item.product.name} style={{ width: 76, height: 76, borderRadius: 12, objectFit: 'cover', border: `1px solid ${P.border}` }} />
                                        ) : (
                                            <div style={{ width: 76, height: 76, borderRadius: 12, background: P.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🥬</div>
                                        )}
                                    </Link>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {item.product.category && (
                                            <div style={{ fontSize: 11, fontWeight: 700, color: P.accent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.product.category}</div>
                                        )}
                                        <Link href={`/shop/product/${item.product.slug}`} style={{ fontSize: 15, fontWeight: 700, color: P.text, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.product.name}
                                        </Link>
                                        {item.variant.display_name !== 'Default' && (
                                            <div style={{ fontSize: 12, color: P.textMuted, marginTop: 2 }}>{item.variant.display_name}</div>
                                        )}
                                        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                            <Qty item={item} />
                                            <span style={{ fontSize: 13, color: P.textLight }}>× {formatPrice(item.variant.price)}</span>
                                            {/* Stock limit pill */}
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                fontSize: 11, fontWeight: 600,
                                                padding: '2px 8px', borderRadius: 50,
                                                background: item.variant.stock_quantity <= item.quantity
                                                    ? '#fef3c7'
                                                    : P.accentBg,
                                                color: item.variant.stock_quantity <= item.quantity
                                                    ? '#b45309'
                                                    : P.primary,
                                                border: `1px solid ${item.variant.stock_quantity <= item.quantity ? '#fde68a' : P.border}`,
                                            }}>
                                                {item.variant.stock_quantity <= item.quantity && <>⚠ </>}
                                                {item.variant.stock_quantity} left
                                            </span>
                                        </div>
                                    </div>

                                    {/* Line total + remove */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                                        <span style={{ fontSize: 16, fontWeight: 800, color: P.primary }}>{formatPrice(item.variant.price * item.quantity)}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            title="Remove item"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: P.textLight, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 8, transition: 'all 0.15s' }}
                                            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = P.danger; b.style.background = P.dangerBg; }}
                                            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = P.textLight; b.style.background = 'none'; }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button type="button" onClick={clearCart}
                                style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: P.danger, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: 5, padding: '6px 4px' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                                Clear cart
                            </button>
                        </div>

                        {/* ── Order summary ── */}
                        <div style={{ width: 300, flexShrink: 0, position: 'sticky', top: 76 }}>
                            <div style={{ background: P.card, borderRadius: 18, border: `1px solid ${P.border}`, padding: 24, boxShadow: '0 2px 12px rgba(6,95,70,0.07)' }}>
                                <h2 style={{ fontSize: 16, fontWeight: 800, color: P.text, marginBottom: 18 }}>Order Summary</h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: P.textMuted }}>
                                        <span>Subtotal ({totalQty} {totalQty === 1 ? 'item' : 'items'})</span>
                                        <span style={{ fontWeight: 600, color: P.text }}>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: P.textMuted }}>
                                        <span>Shipping</span>
                                        <span style={{ fontWeight: 500, color: P.accent }}>Calculated at checkout</span>
                                    </div>
                                </div>

                                <div style={{ height: 1, background: P.borderGray, marginBottom: 16 }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: P.text, marginBottom: 20 }}>
                                    <span>Total</span>
                                    <span style={{ color: P.primary }}>{formatPrice(subtotal)}</span>
                                </div>

                                <button type="button"
                                    style={{ width: '100%', padding: '13px', background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`, color: P.white, border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 2px 8px rgba(6,95,70,0.28)', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(6,95,70,0.32)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(6,95,70,0.28)'; }}
                                >
                                    Proceed to Checkout
                                </button>

                                <Link href="/shop" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: P.textMuted, textDecoration: 'none' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = P.primary; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = P.textMuted; }}
                                >
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </>
    );
}
