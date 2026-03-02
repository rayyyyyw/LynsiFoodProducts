import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

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
    danger:     '#ef4444',
    dangerBg:   '#fef2f2',
    white:      '#ffffff',
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

type Props = {
    items: CartItemData[];
    user: { name: string; email: string };
};

function formatPrice(n: number) {
    return `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const PAYMENT_METHODS = [
    { id: 'cod',           label: 'Cash on Delivery',  icon: '💵', desc: 'Pay when your order arrives.' },
    { id: 'gcash',         label: 'GCash',             icon: '📱', desc: 'Pay via GCash mobile wallet.' },
    { id: 'bank_transfer', label: 'Bank Transfer',     icon: '🏦', desc: 'Direct bank deposit or online transfer.' },
];

const PH_PROVINCES = [
    'Abra','Agusan del Norte','Agusan del Sur','Aklan','Albay','Antique','Apayao','Aurora',
    'Basilan','Bataan','Batanes','Batangas','Benguet','Biliran','Bohol','Bukidnon',
    'Bulacan','Cagayan','Camarines Norte','Camarines Sur','Camiguin','Capiz','Catanduanes',
    'Cavite','Cebu','Compostela Valley','Cotabato','Davao del Norte','Davao del Sur',
    'Davao Occidental','Davao Oriental','Dinagat Islands','Eastern Samar','Guimaras',
    'Ifugao','Ilocos Norte','Ilocos Sur','Iloilo','Isabela','Kalinga','La Union','Laguna',
    'Lanao del Norte','Lanao del Sur','Leyte','Maguindanao','Marinduque','Masbate',
    'Metro Manila','Misamis Occidental','Misamis Oriental','Mountain Province','Negros Occidental',
    'Negros Oriental','Northern Samar','Nueva Ecija','Nueva Vizcaya','Occidental Mindoro',
    'Oriental Mindoro','Palawan','Pampanga','Pangasinan','Quezon','Quirino','Rizal',
    'Romblon','Samar','Sarangani','Siquijor','Sorsogon','South Cotabato','Southern Leyte',
    'Sultan Kudarat','Sulu','Surigao del Norte','Surigao del Sur','Tarlac','Tawi-Tawi',
    'Zambales','Zamboanga del Norte','Zamboanga del Sur','Zamboanga Sibugay',
];

type CheckoutFormData = {
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_province: string;
    shipping_zip: string;
    payment_method: string;
    notes: string;
};

function CheckoutField({
    data,
    setData,
    errors,
    label,
    name,
    type = 'text',
    placeholder,
    required = false,
    as,
}: {
    data: CheckoutFormData;
    setData: (k: keyof CheckoutFormData, v: string) => void;
    errors: Record<string, string>;
    label: string;
    name: keyof CheckoutFormData;
    type?: string;
    placeholder?: string;
    required?: boolean;
    as?: 'textarea' | 'select';
}) {
    const error = errors[name];
    const baseStyle: React.CSSProperties = {
        width: '100%', padding: '10px 14px',
        border: `1.5px solid ${error ? P.danger : P.borderGray}`,
        borderRadius: 10, fontSize: 14, color: P.text, background: P.white,
        outline: 'none', fontFamily: "'Inter', sans-serif",
        transition: 'border-color 0.15s', boxSizing: 'border-box',
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {label ? (
                <label style={{ fontSize: 13, fontWeight: 600, color: P.text }}>
                    {label} {required ? <span style={{ color: P.danger }}>*</span> : null}
                </label>
            ) : null}
            {as === 'textarea' ? (
                <textarea value={data[name]} onChange={e => setData(name, e.target.value)}
                    placeholder={placeholder} rows={3}
                    style={{ ...baseStyle, resize: 'vertical', minHeight: 80 }} />
            ) : as === 'select' ? (
                <select value={data[name]} onChange={e => setData(name, e.target.value)}
                    style={{ ...baseStyle, cursor: 'pointer' }}>
                    <option value="">Select province…</option>
                    {PH_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            ) : (
                <input type={type} value={data[name]}
                    onChange={e => setData(name, e.target.value)}
                    placeholder={placeholder} style={baseStyle} />
            )}
            {error ? <span style={{ fontSize: 12, color: P.danger }}>{error}</span> : null}
        </div>
    );
}

export default function CheckoutIndex({ items, user }: Props) {
    const { auth } = usePage().props as { auth: { user: { name: string; profile_photo_url?: string | null } | null } };
    const authUser = auth?.user;

    const subtotal    = items.reduce((s, i) => s + i.variant.price * i.quantity, 0);
    const shippingFee = 0;
    const total       = subtotal + shippingFee;
    const totalQty    = items.reduce((s, i) => s + i.quantity, 0);

    const { data, setData, post, processing, errors } = useForm({
        shipping_name:     user.name ?? '',
        shipping_phone:    '',
        shipping_address:  '',
        shipping_city:     '',
        shipping_province: '',
        shipping_zip:      '',
        payment_method:    'cod',
        notes:             '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/checkout');
    }

    return (
        <>
            <Head title="Checkout – Lynsi Food Products">
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
            </Head>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', sans-serif; background: ${P.bg}; }
                input:focus, textarea:focus, select:focus { border-color: ${P.accent} !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
                @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
                .fade-in { animation: fade-in 0.25s ease; }

                @media (max-width: 768px) {
                    .co-header-inner { padding: 0 12px !important; min-height: 52px !important; }
                    .co-progress     { padding: 10px 12px !important; }
                    .co-body         { padding: 16px 12px 60px !important; }
                    .co-title        { font-size: 20px !important; margin-bottom: 20px !important; }
                    .co-wrap         { flex-direction: column !important; gap: 20px !important; }
                    .co-form         { flex: none !important; width: 100% !important; }
                    .co-sidebar      { width: 100% !important; max-width: 100% !important; position: static !important; }
                    .co-grid-2       { grid-template-columns: 1fr !important; }
                    .co-grid-3       { grid-template-columns: 1fr !important; }
                    .co-section      { padding: 18px !important; }
                }
                @media (max-width: 480px) {
                    .co-title { font-size: 18px !important; }
                }
            `}</style>

            {/* ── HEADER ── */}
            <header style={{ position: 'sticky', top: 0, zIndex: 100, background: `linear-gradient(135deg, #022c22 0%, ${P.primary} 100%)`, boxShadow: '0 2px 12px rgba(2,44,34,0.3)' }}>
                <div className="co-header-inner" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 58, gap: 16 }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                        <img src={LOGO_URL} alt="" style={{ height: 28, objectFit: 'contain' }} />
                        <span style={{ fontWeight: 800, fontSize: 15, color: P.white, letterSpacing: '-0.3px' }}>
                            Lynsi<span style={{ color: '#6ee7b7' }}>FoodProducts</span>
                        </span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Link href="/cart" style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', padding: '7px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, transition: 'background 0.15s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                        >← Back to Cart</Link>
                        {authUser && (
                            <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 50, textDecoration: 'none' }}>
                                <div style={{ width: 26, height: 26, borderRadius: '50%', background: P.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: P.white, overflow: 'hidden' }}>
                                    {authUser.profile_photo_url
                                        ? <img src={authUser.profile_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : authUser.name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{authUser.name.split(' ')[0]}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* ── PROGRESS INDICATOR ── */}
            <div className="co-progress" style={{ background: P.white, borderBottom: `1px solid ${P.border}` }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    {[
                        { label: '1  Cart', done: true, active: false },
                        { label: '2  Checkout', done: false, active: true },
                        { label: '3  Confirmation', done: false, active: false },
                    ].map((step, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {i > 0 && <span style={{ color: P.borderGray, fontSize: 16 }}>›</span>}
                            <span style={{
                                fontWeight: step.active ? 700 : step.done ? 500 : 400,
                                color: step.active ? P.primary : step.done ? P.accent : P.textLight,
                            }}>{step.label}</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* ── BODY ── */}
            <div className="co-body" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px' }}>
                <h1 className="co-title" style={{ fontSize: 26, fontWeight: 800, color: P.primary, letterSpacing: '-0.5px', marginBottom: 28 }}>
                    Checkout
                </h1>

                <form onSubmit={submit}>
                    <div className="co-wrap" style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                        {/* ── LEFT: Form ── */}
                        <div className="co-form" style={{ flex: '1 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* Delivery Details */}
                            <section className="fade-in co-section" style={{ background: P.card, borderRadius: 18, border: `1px solid ${P.border}`, padding: 24, boxShadow: '0 1px 6px rgba(6,95,70,0.05)' }}>
                                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`, color: P.white, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>1</span>
                                    Delivery Details
                                </h2>

                                <div style={{ display: 'grid', gap: 16 }}>
                                    <div className="co-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <CheckoutField data={data} setData={setData} errors={errors} label="Full Name"   name="shipping_name"  placeholder="Juan Dela Cruz" required />
                                        <CheckoutField data={data} setData={setData} errors={errors} label="Phone Number" name="shipping_phone" placeholder="09XXXXXXXXX" required />
                                    </div>
                                    <CheckoutField data={data} setData={setData} errors={errors} label="Street Address" name="shipping_address" placeholder="House/Unit no., Street, Barangay" required />
                                    <div className="co-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 14 }}>
                                        <CheckoutField data={data} setData={setData} errors={errors} label="City / Municipality" name="shipping_city"  placeholder="City or municipality" required />
                                        <CheckoutField data={data} setData={setData} errors={errors} label="Province"            name="shipping_province" as="select" required />
                                        <CheckoutField data={data} setData={setData} errors={errors} label="ZIP Code"            name="shipping_zip"  placeholder="4000" />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="fade-in co-section" style={{ background: P.card, borderRadius: 18, border: `1px solid ${P.border}`, padding: 24, boxShadow: '0 1px 6px rgba(6,95,70,0.05)' }}>
                                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`, color: P.white, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>2</span>
                                    Payment Method
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {PAYMENT_METHODS.map(pm => {
                                        const selected = data.payment_method === pm.id;
                                        return (
                                            <label key={pm.id} style={{
                                                display: 'flex', alignItems: 'center', gap: 14,
                                                padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                                                border: `2px solid ${selected ? P.accent : P.borderGray}`,
                                                background: selected ? P.accentBg : P.white,
                                                transition: 'all 0.15s',
                                            }}>
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={pm.id}
                                                    checked={selected}
                                                    onChange={() => setData('payment_method', pm.id)}
                                                    style={{ accentColor: P.accent, width: 18, height: 18 }}
                                                />
                                                <span style={{ fontSize: 22 }}>{pm.icon}</span>
                                                <div>
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: P.text }}>{pm.label}</div>
                                                    <div style={{ fontSize: 12, color: P.textMuted, marginTop: 1 }}>{pm.desc}</div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Order Notes */}
                            <section className="fade-in co-section" style={{ background: P.card, borderRadius: 18, border: `1px solid ${P.border}`, padding: 24, boxShadow: '0 1px 6px rgba(6,95,70,0.05)' }}>
                                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`, color: P.white, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>3</span>
                                    Order Notes <span style={{ fontSize: 12, fontWeight: 400, color: P.textLight }}>(optional)</span>
                                </h2>
                                <CheckoutField data={data} setData={setData} errors={errors} label="" name="notes" as="textarea" placeholder="Special instructions, landmark, or delivery notes…" />
                            </section>
                        </div>

                        {/* ── RIGHT: Order Summary ── */}
                        <div className="co-sidebar" style={{ width: 320, flexShrink: 0, position: 'sticky', top: 76 }}>
                            <div className="fade-in" style={{ background: P.card, borderRadius: 18, border: `1px solid ${P.border}`, padding: 24, boxShadow: '0 2px 12px rgba(6,95,70,0.07)' }}>
                                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.text, marginBottom: 18 }}>
                                    Order Summary
                                    <span style={{ fontSize: 12, fontWeight: 500, color: P.textMuted, marginLeft: 8 }}>({totalQty} {totalQty === 1 ? 'item' : 'items'})</span>
                                </h2>

                                {/* Items */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                                    {items.map(item => (
                                        <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                {item.product.image_url ? (
                                                    <img src={item.product.image_url} alt={item.product.name}
                                                        style={{ width: 46, height: 46, borderRadius: 8, objectFit: 'cover', border: `1px solid ${P.border}` }} />
                                                ) : (
                                                    <div style={{ width: 46, height: 46, borderRadius: 8, background: P.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🥬</div>
                                                )}
                                                <span style={{
                                                    position: 'absolute', top: -6, right: -6,
                                                    background: P.primary, color: P.white,
                                                    borderRadius: '50%', width: 18, height: 18,
                                                    fontSize: 10, fontWeight: 800,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>{item.quantity}</span>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: P.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</div>
                                                {item.variant.display_name !== 'Default' && (
                                                    <div style={{ fontSize: 11, color: P.textMuted }}>{item.variant.display_name}</div>
                                                )}
                                            </div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: P.primary, flexShrink: 0 }}>
                                                {formatPrice(item.variant.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ height: 1, background: P.borderGray, marginBottom: 14 }} />

                                {/* Pricing breakdown */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: P.textMuted }}>
                                        <span>Subtotal</span>
                                        <span style={{ fontWeight: 600, color: P.text }}>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: P.textMuted }}>
                                        <span>Shipping</span>
                                        <span style={{ fontWeight: 500, color: P.accent }}>
                                            {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ height: 1, background: P.borderGray, marginBottom: 14 }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: P.text, marginBottom: 20 }}>
                                    <span>Total</span>
                                    <span style={{ color: P.primary }}>{formatPrice(total)}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        width: '100%', padding: '13px',
                                        background: processing
                                            ? P.textLight
                                            : `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                        color: P.white, border: 'none', borderRadius: 12,
                                        fontWeight: 700, fontSize: 15, cursor: processing ? 'not-allowed' : 'pointer',
                                        fontFamily: "'Inter', sans-serif",
                                        boxShadow: processing ? 'none' : '0 2px 8px rgba(6,95,70,0.28)',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { if (!processing) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(6,95,70,0.32)'; } }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = processing ? 'none' : '0 2px 8px rgba(6,95,70,0.28)'; }}
                                >
                                    {processing ? 'Placing Order…' : 'Place Order'}
                                </button>

                                <p style={{ textAlign: 'center', fontSize: 11, color: P.textLight, marginTop: 10 }}>
                                    🔒 Your order is safe and secure
                                </p>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </>
    );
}
