import { Head, Link } from '@inertiajs/react';

const LOGO_URL = '/mylogo/logopng%20(1).png';

const P = {
    primary:    '#065f46',
    secondary:  '#047857',
    accent:     '#10b981',
    bg:         '#f0fdf4',
    card:       '#ffffff',
    border:     '#d1fae5',
    borderGray: '#e5e7eb',
    accentBg:   '#ecfdf5',
    text:       '#111827',
    textMuted:  '#6b7280',
    textLight:  '#9ca3af',
    white:      '#ffffff',
} as const;

type OrderItem = {
    product_name: string;
    variant_display_name: string | null;
    product_image_url: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
};

type Order = {
    order_number: string;
    status: string;
    payment_method: string;
    payment_status: string;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_province: string;
    shipping_zip: string | null;
    subtotal: number;
    shipping_fee: number;
    total: number;
    notes: string | null;
    created_at: string;
    items: OrderItem[];
};

function formatPrice(n: number) {
    return `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const PAYMENT_LABELS: Record<string, string> = {
    cod:           'Cash on Delivery',
    gcash:         'GCash',
    bank_transfer: 'Bank Transfer',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    pending:    { label: 'Pending',    color: '#b45309', bg: '#fef3c7', icon: '⏳' },
    confirmed:  { label: 'Confirmed',  color: P.primary, bg: P.accentBg, icon: '✅' },
    processing: { label: 'Processing', color: '#1d4ed8', bg: '#eff6ff', icon: '⚙️' },
    shipped:    { label: 'Shipped',    color: '#7c3aed', bg: '#f5f3ff', icon: '🚚' },
    delivered:  { label: 'Delivered',  color: P.primary, bg: P.accentBg, icon: '📦' },
    cancelled:  { label: 'Cancelled',  color: '#dc2626', bg: '#fef2f2', icon: '✗' },
};

export default function CheckoutConfirmation({ order }: { order: Order }) {
    const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
    const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

    const placedDate = new Date(order.created_at).toLocaleDateString('en-PH', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

    return (
        <>
            <Head title={`Order ${order.order_number} – Lynsi Food Products`}>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
            </Head>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', sans-serif; background: ${P.bg}; }
                @keyframes pop-in { 0% { opacity: 0; transform: scale(0.85) translateY(20px); } 100% { opacity: 1; transform: none; } }
                @keyframes fade-up { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: none; } }
                .pop-in   { animation: pop-in  0.4s cubic-bezier(.34,1.56,.64,1) both; }
                .fade-up  { animation: fade-up 0.4s ease both; }
                .delay-1  { animation-delay: 0.1s; }
                .delay-2  { animation-delay: 0.2s; }
                .delay-3  { animation-delay: 0.3s; }

                @media (max-width: 768px) {
                    .conf-header-inner { padding: 0 12px !important; min-height: 52px !important; }
                    .conf-wizard ol    { padding: 12px 16px !important; max-width: 100% !important; }
                    .conf-wizard span  { font-size: 11px !important; }
                    .conf-body         { padding: 24px 16px 60px !important; }
                    .conf-title        { font-size: 22px !important; }
                    .conf-badges       { flex-direction: column !important; gap: 8px !important; }
                    .conf-grid-2       { grid-template-columns: 1fr !important; gap: 16px !important; }
                    .conf-actions      { flex-direction: column !important; width: 100% !important; }
                    .conf-actions a    { width: 100% !important; justify-content: center !important; box-sizing: border-box !important; }
                    .conf-item-row     { flex-wrap: wrap !important; gap: 8px !important; }
                    .conf-item-price   { width: 100% !important; text-align: left !important; }
                }
                @media (max-width: 480px) {
                    .conf-title { font-size: 20px !important; }
                    .conf-section { padding: 18px !important; }
                }
            `}</style>

            {/* ── HEADER ── */}
            <header style={{ position: 'sticky', top: 0, zIndex: 100, background: `linear-gradient(135deg, #022c22 0%, ${P.primary} 100%)`, boxShadow: '0 2px 12px rgba(2,44,34,0.3)' }}>
                <div className="conf-header-inner" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 58, gap: 16 }}>
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
                        >Continue Shopping</Link>
                    </div>
                </div>
            </header>

            {/* ── WIZARD STEPS ── */}
            <div
                role="navigation"
                aria-label="Checkout progress"
                className="conf-wizard"
                style={{ background: P.white, borderBottom: `1px solid ${P.border}`, width: '100%' }}
            >
                <ol
                    style={{
                        listStyle: 'none',
                        margin: '0 auto',
                        padding: '16px 24px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        maxWidth: 900,
                        boxSizing: 'border-box',
                    }}
                >
                    {/* Connecting line — sits only at circle-row height, never near labels */}
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            /* left/right push inward so the line starts at the edge of the first/last circle */
                            left: 'calc(24px + 16px)',
                            right: 'calc(24px + 16px)',
                            top: 'calc(16px + 16px)',    /* top padding + half circle */
                            height: 3,
                            background: P.accent,
                            borderRadius: 2,
                            zIndex: 0,
                        }}
                    />

                    {[
                        { num: 1, label: 'Cart',         done: true, active: false },
                        { num: 2, label: 'Checkout',     done: true, active: false },
                        { num: 3, label: 'Confirmation', done: true, active: true  },
                    ].map((step, i) => (
                        <li
                            key={i}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 6,
                                position: 'relative',
                                zIndex: 1,
                            }}
                            aria-current={step.active ? 'step' : undefined}
                        >
                            {/* Circle — sits above the line */}
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: step.active ? P.primary : P.accent,
                                    color: P.white,
                                    fontSize: 14,
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    /* white halo isolates circle from the line */
                                    boxShadow: step.active
                                        ? `0 0 0 4px ${P.white}, 0 0 0 6px ${P.primary}`
                                        : `0 0 0 4px ${P.white}`,
                                }}
                            >
                                ✓
                            </div>
                            {/* Label sits cleanly below the circle / line */}
                            <span
                                style={{
                                    fontWeight: step.active ? 700 : 500,
                                    fontSize: 12,
                                    color: step.active ? P.primary : P.accent,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {step.label}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>

            {/* ── BODY ── */}
            <div className="conf-body" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 80px' }}>

                {/* Success + Final confirmation */}
                <div className="pop-in" style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${P.accent}, ${P.primary})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, marginBottom: 16, boxShadow: '0 4px 20px rgba(16,185,129,0.4)' }}>
                        ✓
                    </div>
                    <h1 className="conf-title" style={{ fontSize: 26, fontWeight: 800, color: P.primary, letterSpacing: '-0.5px', marginBottom: 6 }}>
                        Order Placed Successfully!
                    </h1>
                    <p style={{ fontSize: 14, color: P.textMuted, marginBottom: 16 }}>
                        Thank you, <strong>{order.shipping_name}</strong>! We've received your order and will process it shortly.
                    </p>
                    <div className="conf-badges" style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: P.accentBg, border: `1px solid ${P.border}`, borderRadius: 50 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: P.primary }}>Order #</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: P.primary, letterSpacing: '0.5px' }}>{order.order_number}</span>
                        </div>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '7px 14px', borderRadius: 50,
                            background: status.bg, color: status.color,
                            fontSize: 12, fontWeight: 700,
                            border: `1px solid ${status.color}22`,
                        }}>
                            {status.icon} {status.label}
                        </span>
                    </div>
                    <div style={{ fontSize: 12, color: P.textLight, marginTop: 10 }}>{placedDate}</div>
                </div>

                {/* Review your order – final confirmation */}
                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.text, marginBottom: 16, letterSpacing: '-0.3px' }}>
                    Review your order
                </h2>
                <p style={{ fontSize: 13, color: P.textMuted, marginBottom: 20 }}>
                    Below is a summary of your order. You can track its status in your account.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Items */}
                    <section className="fade-up delay-1 conf-section" style={{ background: P.card, borderRadius: 18, border: `1px solid ${P.border}`, padding: 24, boxShadow: '0 1px 6px rgba(6,95,70,0.05)' }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: P.text, marginBottom: 16 }}>
                            Items ordered ({totalQty})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="conf-item-row" style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: idx < order.items.length - 1 ? 12 : 0, borderBottom: idx < order.items.length - 1 ? `1px solid ${P.borderGray}` : 'none' }}>
                                    <div style={{ flexShrink: 0 }}>
                                        {item.product_image_url ? (
                                            <img src={item.product_image_url} alt={item.product_name}
                                                style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', border: `1px solid ${P.border}` }} />
                                        ) : (
                                            <div style={{ width: 52, height: 52, borderRadius: 10, background: P.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🥬</div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: P.text }}>{item.product_name}</div>
                                        {item.variant_display_name && (
                                            <div style={{ fontSize: 12, color: P.textMuted }}>{item.variant_display_name}</div>
                                        )}
                                        <div style={{ fontSize: 12, color: P.textLight, marginTop: 2 }}>
                                            Qty {item.quantity} × {formatPrice(item.unit_price)}
                                        </div>
                                    </div>
                                    <div className="conf-item-price" style={{ fontSize: 14, fontWeight: 800, color: P.primary }}>
                                        {formatPrice(item.line_total)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="conf-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                        {/* Delivery Info */}
                        <section className="fade-up delay-2 conf-section" style={{ background: P.card, borderRadius: 18, border: `1px solid ${P.border}`, padding: 24, boxShadow: '0 1px 6px rgba(6,95,70,0.05)' }}>
                            <h2 style={{ fontSize: 14, fontWeight: 800, color: P.text, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                                🚚 Delivery Address
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: P.textMuted }}>
                                <span style={{ fontWeight: 700, color: P.text, fontSize: 14 }}>{order.shipping_name}</span>
                                <span>{order.shipping_phone}</span>
                                <span>{order.shipping_address}</span>
                                <span>{order.shipping_city}, {order.shipping_province}{order.shipping_zip ? ` ${order.shipping_zip}` : ''}</span>
                            </div>
                            {order.notes && (
                                <div style={{ marginTop: 12, padding: '10px 12px', background: P.accentBg, borderRadius: 8, fontSize: 12, color: P.textMuted, border: `1px solid ${P.border}` }}>
                                    <span style={{ fontWeight: 600, color: P.primary }}>Note: </span>{order.notes}
                                </div>
                            )}
                        </section>

                        {/* Payment & Total */}
                        <section className="fade-up delay-2 conf-section" style={{ background: P.card, borderRadius: 18, border: `1px solid ${P.border}`, padding: 24, boxShadow: '0 1px 6px rgba(6,95,70,0.05)' }}>
                            <h2 style={{ fontSize: 14, fontWeight: 800, color: P.text, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                                💳 Payment
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: P.textMuted }}>Method</span>
                                    <span style={{ fontWeight: 600, color: P.text }}>{PAYMENT_LABELS[order.payment_method] ?? order.payment_method}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: P.textMuted }}>Subtotal</span>
                                    <span style={{ fontWeight: 600, color: P.text }}>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: P.textMuted }}>Shipping</span>
                                    <span style={{ fontWeight: 500, color: P.accent }}>{order.shipping_fee === 0 ? 'Free' : formatPrice(order.shipping_fee)}</span>
                                </div>
                                <div style={{ height: 1, background: P.borderGray, margin: '4px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800 }}>
                                    <span style={{ color: P.text }}>Total</span>
                                    <span style={{ color: P.primary }}>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Actions */}
                    <div className="fade-up delay-3 conf-actions" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
                        <Link href="/my-purchases" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px',
                            background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                            color: P.white, borderRadius: 12, textDecoration: 'none',
                            fontWeight: 700, fontSize: 14,
                            boxShadow: '0 2px 8px rgba(6,95,70,0.25)',
                        }}>
                            View my orders
                        </Link>
                        <Link href="/shop" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px',
                            background: P.white,
                            color: P.primary, borderRadius: 12, textDecoration: 'none',
                            fontWeight: 600, fontSize: 14,
                            border: `2px solid ${P.border}`,
                        }}>
                            Continue Shopping
                        </Link>
                        <Link href="/account" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px',
                            background: P.white,
                            color: P.primary, borderRadius: 12, textDecoration: 'none',
                            fontWeight: 600, fontSize: 14,
                            border: `2px solid ${P.border}`,
                        }}>
                            My Account
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}
