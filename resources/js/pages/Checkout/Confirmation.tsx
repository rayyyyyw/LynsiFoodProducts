import { Head, Link, usePage } from '@inertiajs/react';
import { useCallback, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';

const P = {
    primary: '#065f46',
    secondary: '#047857',
    accent: '#10b981',
    bg: '#f0fdf4',
    card: '#ffffff',
    border: '#d1fae5',
    borderGray: '#e5e7eb',
    accentBg: '#ecfdf5',
    text: '#111827',
    textMuted: '#6b7280',
    textLight: '#9ca3af',
    white: '#ffffff',
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
    return_status?: string;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_province: string;
    shipping_zip: string | null;
    subtotal: number;
    shipping_fee: number;
    discount_amount?: number;
    total: number;
    coupon_code?: string | null;
    notes: string | null;
    created_at: string;
    items: OrderItem[];
};

function formatPrice(n: number) {
    return `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const PAYMENT_LABELS: Record<string, string> = {
    cod: 'Cash on Delivery',
    gcash: 'GCash',
    bank_transfer: 'Bank Transfer',
};

const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; bg: string }
> = {
    pending: { label: 'Pending', color: '#b45309', bg: '#fef3c7' },
    confirmed: {
        label: 'Confirmed',
        color: P.primary,
        bg: P.accentBg,
    },
    processing: {
        label: 'Processing',
        color: '#1d4ed8',
        bg: '#eff6ff',
    },
    shipped: { label: 'Shipped', color: '#7c3aed', bg: '#f5f3ff' },
    delivered: {
        label: 'Delivered',
        color: P.primary,
        bg: P.accentBg,
    },
    cancelled: {
        label: 'Cancelled',
        color: '#dc2626',
        bg: '#fef2f2',
    },
};

type AuthUser = {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
    profile_photo_url?: string | null;
} | null;

function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function CheckIcon({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export default function CheckoutConfirmation({ order }: { order: Order }) {
    const { auth } = usePage().props as { auth: { user: AuthUser | null } };
    const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
    const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

    const placedDate = new Date(order.created_at).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    const timeline = [
        { key: 'placed', label: 'Order placed', done: true, date: placedDate },
        {
            key: 'processing',
            label: 'Processing',
            done: ['processing', 'shipped', 'delivered'].includes(order.status),
        },
        {
            key: 'shipping',
            label: 'Shipped',
            done: ['shipped', 'delivered'].includes(order.status),
        },
        {
            key: 'delivered',
            label: 'Delivered',
            done: order.status === 'delivered',
        },
    ];

    const downloadReceipt = useCallback(() => {
        if (typeof window === 'undefined') return;

        const rows = order.items
            .map(
                (item) => `
                <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                        <div style="font-weight:600;color:#111827;">${escapeHtml(item.product_name)}</div>
                        ${
                            item.variant_display_name
                                ? `<div style="font-size:12px;color:#6b7280;">${escapeHtml(item.variant_display_name)}</div>`
                                : ''
                        }
                    </td>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center;color:#374151;">${item.quantity}</td>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:#111827;">${formatPrice(item.line_total)}</td>
                </tr>
            `,
            )
            .join('');

        const receiptHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Receipt ${escapeHtml(order.order_number)}</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; padding: 24px; color: #111827; }
    .card { max-width: 820px; margin: 0 auto; border: 1px solid #d1fae5; border-radius: 14px; padding: 24px; }
    .muted { color: #6b7280; }
    .row { display: flex; justify-content: space-between; gap: 10px; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
    .total { font-size: 18px; font-weight: 800; color: #065f46; margin-top: 8px; }
    @media print { body { padding: 0; } .card { border: none; } }
  </style>
</head>
<body>
  <div class="card">
    <h1 style="margin:0 0 6px;font-size:24px;color:#065f46;">Lynsi Food Products</h1>
    <div class="muted" style="margin-bottom:16px;">Official Order Receipt</div>
    <div class="row"><strong>Order #</strong><strong>${escapeHtml(order.order_number)}</strong></div>
    <div class="row"><span class="muted">Date</span><span>${escapeHtml(placedDate)}</span></div>
    <div class="row"><span class="muted">Customer</span><span>${escapeHtml(order.shipping_name)}</span></div>
    <div class="row"><span class="muted">Phone</span><span>${escapeHtml(order.shipping_phone)}</span></div>
    <div class="row"><span class="muted">Payment Method</span><span>${escapeHtml(PAYMENT_LABELS[order.payment_method] ?? order.payment_method)}</span></div>
    <table>
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 0;border-bottom:1px solid #d1d5db;">Item</th>
          <th style="text-align:center;padding:8px 0;border-bottom:1px solid #d1d5db;">Qty</th>
          <th style="text-align:right;padding:8px 0;border-bottom:1px solid #d1d5db;">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:14px;">
      <div class="row"><span class="muted">Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
      <div class="row"><span class="muted">Shipping</span><span>${order.shipping_fee === 0 ? 'Free' : formatPrice(order.shipping_fee)}</span></div>
      ${
          order.coupon_code
              ? `<div class="row"><span class="muted">Coupon (${escapeHtml(order.coupon_code)})</span><span>-${formatPrice(order.discount_amount ?? 0)}</span></div>`
              : ''
      }
      <div class="row total"><span>Total</span><span>${formatPrice(order.total)}</span></div>
    </div>
  </div>
</body>
</html>`;

        const popup = window.open(
            '',
            '_blank',
            'noopener,noreferrer,width=960,height=900',
        );
        if (!popup) return;
        popup.document.open();
        popup.document.write(receiptHtml);
        popup.document.close();
        popup.focus();
        window.setTimeout(() => popup.print(), 350);
    }, [order, placedDate]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('download') !== '1') return;
        window.setTimeout(() => downloadReceipt(), 120);
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
    }, [downloadReceipt]);

    return (
        <>
            <Head title={`Order ${order.order_number} – Lynsi Food Products`}>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
            </Head>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                .confirmation-root, .confirmation-root * { box-sizing: border-box; }
                .confirmation-root { font-family: 'Inter', sans-serif; background: #f6fbf8; min-height: 100vh; }
                @keyframes pop-in { 0% { opacity: 0; transform: scale(0.85) translateY(20px); } 100% { opacity: 1; transform: none; } }
                @keyframes fade-up { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: none; } }
                .pop-in   { animation: pop-in  0.4s cubic-bezier(.34,1.56,.64,1) both; }
                .fade-up  { animation: fade-up 0.4s ease both; }
                .delay-1  { animation-delay: 0.1s; }
                .delay-2  { animation-delay: 0.2s; }
                .delay-3  { animation-delay: 0.3s; }
                .conf-card { box-shadow: 0 8px 26px rgba(15,23,42,0.06); border-color: #dbeee5 !important; }

                @media (max-width: 768px) {
                    .conf-header-inner { padding: 0 12px !important; min-height: 52px !important; }
                    .conf-wizard ol    { padding: 12px 16px !important; max-width: 100% !important; }
                    .conf-wizard span  { font-size: 11px !important; }
                    .conf-body         { padding: 24px 16px 60px !important; }
                    .conf-title        { font-size: 22px !important; }
                    .conf-badges       { flex-direction: column !important; gap: 8px !important; }
                    .conf-grid-2       { grid-template-columns: 1fr !important; gap: 16px !important; }
                    .conf-main-grid    { grid-template-columns: 1fr !important; gap: 16px !important; }
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

            <LandingNav activeId="" auth={auth} />

            <div className="confirmation-root">
                {/* ── WIZARD STEPS ── */}
                <div
                    role="navigation"
                    aria-label="Checkout progress"
                    className="conf-wizard"
                    style={{
                        background: P.white,
                        borderBottom: `1px solid ${P.border}`,
                        width: '100%',
                    }}
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
                                top: 'calc(16px + 16px)' /* top padding + half circle */,
                                height: 3,
                                background: P.accent,
                                borderRadius: 2,
                                zIndex: 0,
                            }}
                        />

                        {[
                            {
                                num: 1,
                                label: 'Cart',
                                done: true,
                                active: false,
                            },
                            {
                                num: 2,
                                label: 'Checkout',
                                done: true,
                                active: false,
                            },
                            {
                                num: 3,
                                label: 'Confirmation',
                                done: true,
                                active: true,
                            },
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
                                        background: step.active
                                            ? P.primary
                                            : P.accent,
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
                                    <CheckIcon size={14} />
                                </div>
                                {/* Label sits cleanly below the circle / line */}
                                <span
                                    style={{
                                        fontWeight: step.active ? 700 : 500,
                                        fontSize: 12,
                                        color: step.active
                                            ? P.primary
                                            : P.accent,
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
                <div
                    className="conf-body"
                    style={{
                        maxWidth: 1160,
                        margin: '0 auto',
                        padding: '26px 20px 44px',
                    }}
                >
                    {/* Success + Final confirmation */}
                    <div
                        className="pop-in"
                        style={{ textAlign: 'center', marginBottom: 18 }}
                    >
                        <div
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${P.accent}, ${P.primary})`,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 34,
                                marginBottom: 10,
                                boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
                            }}
                        >
                            <CheckIcon size={28} />
                        </div>
                        <h1
                            className="conf-title"
                            style={{
                                fontSize: 32,
                                fontWeight: 800,
                                color: P.primary,
                                letterSpacing: '-0.5px',
                                marginBottom: 4,
                            }}
                        >
                            Order Placed Successfully!
                        </h1>
                        <p
                            style={{
                                fontSize: 14,
                                color: P.textMuted,
                                marginBottom: 10,
                            }}
                        >
                            Thank you, <strong>{order.shipping_name}</strong>!
                            We've received your order and will process it
                            shortly.
                        </p>
                        <div
                            className="conf-badges"
                            style={{
                                display: 'inline-flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '8px 18px',
                                    background: P.accentBg,
                                    border: `1px solid ${P.border}`,
                                    borderRadius: 50,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: P.primary,
                                    }}
                                >
                                    Order #
                                </span>
                                <span
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 800,
                                        color: P.primary,
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {order.order_number}
                                </span>
                            </div>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '7px 14px',
                                    borderRadius: 50,
                                    background: status.bg,
                                    color: status.color,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    border: `1px solid ${status.color}22`,
                                }}
                            >
                                {status.label}
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: 12,
                                color: P.textLight,
                                marginTop: 10,
                            }}
                        >
                            {placedDate}
                        </div>
                    </div>

                    {/* Review your order – final confirmation */}
                    <div style={{ height: 4 }} />

                    <section
                        className="fade-up conf-section conf-card delay-1"
                        style={{
                            background: P.card,
                            borderRadius: 18,
                            border: `1px solid ${P.border}`,
                            padding: 18,
                            marginBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: 10,
                            }}
                        >
                            {timeline.map((t) => (
                                <div
                                    key={t.key}
                                    style={{
                                        borderRadius: 10,
                                        border: `1px solid ${t.done ? '#86efac' : P.borderGray}`,
                                        background: t.done ? '#ecfdf5' : '#fff',
                                        padding: '10px 12px',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: t.done
                                                ? P.primary
                                                : P.textLight,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {t.label}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: P.textMuted,
                                            marginTop: 2,
                                        }}
                                    >
                                        {t.date ??
                                            (t.done ? 'Completed' : 'Pending')}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {order.return_status &&
                            order.return_status !== 'none' && (
                                <div
                                    style={{
                                        marginTop: 10,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: '#b45309',
                                    }}
                                >
                                    Return workflow: {order.return_status}
                                </div>
                            )}
                    </section>

                    <div
                        className="conf-main-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1.25fr 0.75fr',
                            alignItems: 'start',
                            gap: 20,
                        }}
                    >
                        {/* Items */}
                        <section
                            className="fade-up conf-section conf-card delay-1"
                            style={{
                                background: P.card,
                                borderRadius: 18,
                                border: `1px solid ${P.border}`,
                                padding: 24,
                                boxShadow: '0 1px 6px rgba(6,95,70,0.05)',
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: P.text,
                                    marginBottom: 12,
                                }}
                            >
                                Items ordered ({totalQty})
                            </h3>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 12,
                                }}
                            >
                                {order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="conf-item-row"
                                        style={{
                                            display: 'flex',
                                            gap: 12,
                                            alignItems: 'center',
                                            paddingBottom:
                                                idx < order.items.length - 1
                                                    ? 12
                                                    : 0,
                                            borderBottom:
                                                idx < order.items.length - 1
                                                    ? `1px solid ${P.borderGray}`
                                                    : 'none',
                                        }}
                                    >
                                        <div style={{ flexShrink: 0 }}>
                                            {item.product_image_url ? (
                                                <img
                                                    src={item.product_image_url}
                                                    alt={item.product_name}
                                                    style={{
                                                        width: 52,
                                                        height: 52,
                                                        borderRadius: 10,
                                                        objectFit: 'cover',
                                                        border: `1px solid ${P.border}`,
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: 52,
                                                        height: 52,
                                                        borderRadius: 10,
                                                        background: P.accentBg,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        color: P.primary,
                                                        border: `1px solid ${P.border}`,
                                                    }}
                                                >
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z" />
                                                        <path d="M7 8V6a5 5 0 0 1 10 0v2" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    color: P.text,
                                                }}
                                            >
                                                {item.product_name}
                                            </div>
                                            {item.variant_display_name && (
                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        color: P.textMuted,
                                                    }}
                                                >
                                                    {item.variant_display_name}
                                                </div>
                                            )}
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: P.textLight,
                                                    marginTop: 2,
                                                }}
                                            >
                                                Qty {item.quantity} ×{' '}
                                                {formatPrice(item.unit_price)}
                                            </div>
                                        </div>
                                        <div
                                            className="conf-item-price"
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 800,
                                                color: P.primary,
                                            }}
                                        >
                                            {formatPrice(item.line_total)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div
                            className="conf-grid-2"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: 16,
                            }}
                        >
                            {/* Delivery Info */}
                            <section
                                className="fade-up conf-section conf-card delay-2"
                                style={{
                                    background: P.card,
                                    borderRadius: 18,
                                    border: `1px solid ${P.border}`,
                                    padding: 24,
                                    boxShadow: '0 1px 6px rgba(6,95,70,0.05)',
                                }}
                            >
                                <h2
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 800,
                                        color: P.text,
                                        marginBottom: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M14 16V8a2 2 0 0 0-2-2H1v10h2" />
                                        <path d="M15 8h4l3 3v5h-2" />
                                        <circle cx="5.5" cy="18.5" r="2.5" />
                                        <circle cx="18.5" cy="18.5" r="2.5" />
                                    </svg>
                                    Delivery Address
                                </h2>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 4,
                                        fontSize: 13,
                                        color: P.textMuted,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 700,
                                            color: P.text,
                                            fontSize: 14,
                                        }}
                                    >
                                        {order.shipping_name}
                                    </span>
                                    <span>{order.shipping_phone}</span>
                                    <span>{order.shipping_address}</span>
                                    <span>
                                        {order.shipping_city},{' '}
                                        {order.shipping_province}
                                        {order.shipping_zip
                                            ? ` ${order.shipping_zip}`
                                            : ''}
                                    </span>
                                </div>
                                {order.notes && (
                                    <div
                                        style={{
                                            marginTop: 12,
                                            padding: '10px 12px',
                                            background: P.accentBg,
                                            borderRadius: 8,
                                            fontSize: 12,
                                            color: P.textMuted,
                                            border: `1px solid ${P.border}`,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: P.primary,
                                            }}
                                        >
                                            Note:{' '}
                                        </span>
                                        {order.notes}
                                    </div>
                                )}
                            </section>

                            {/* Payment & Total */}
                            <section
                                className="fade-up conf-section conf-card delay-2"
                                style={{
                                    background: P.card,
                                    borderRadius: 18,
                                    border: `1px solid ${P.border}`,
                                    padding: 24,
                                    boxShadow: '0 1px 6px rgba(6,95,70,0.05)',
                                }}
                            >
                                <h2
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 800,
                                        color: P.text,
                                        marginBottom: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect
                                            x="2"
                                            y="5"
                                            width="20"
                                            height="14"
                                            rx="2"
                                        />
                                        <path d="M2 10h20" />
                                    </svg>
                                    Payment
                                </h2>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 13,
                                        }}
                                    >
                                        <span style={{ color: P.textMuted }}>
                                            Method
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: P.text,
                                            }}
                                        >
                                            {PAYMENT_LABELS[
                                                order.payment_method
                                            ] ?? order.payment_method}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 13,
                                        }}
                                    >
                                        <span style={{ color: P.textMuted }}>
                                            Subtotal
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: P.text,
                                            }}
                                        >
                                            {formatPrice(order.subtotal)}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 13,
                                        }}
                                    >
                                        <span style={{ color: P.textMuted }}>
                                            Shipping
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: 500,
                                                color: P.accent,
                                            }}
                                        >
                                            {order.shipping_fee === 0
                                                ? 'Free'
                                                : formatPrice(
                                                      order.shipping_fee,
                                                  )}
                                        </span>
                                    </div>
                                    {order.coupon_code && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: 13,
                                            }}
                                        >
                                            <span
                                                style={{ color: P.textMuted }}
                                            >
                                                Coupon ({order.coupon_code})
                                            </span>
                                            <span
                                                style={{
                                                    fontWeight: 600,
                                                    color: P.accent,
                                                }}
                                            >
                                                -
                                                {formatPrice(
                                                    order.discount_amount ?? 0,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            height: 1,
                                            background: P.borderGray,
                                            margin: '4px 0',
                                        }}
                                    />
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 15,
                                            fontWeight: 800,
                                        }}
                                    >
                                        <span style={{ color: P.text }}>
                                            Total
                                        </span>
                                        <span style={{ color: P.primary }}>
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Actions */}
                        <div
                            className="fade-up conf-actions delay-3"
                            style={{
                                display: 'flex',
                                gap: 12,
                                justifyContent: 'flex-start',
                                flexWrap: 'wrap',
                                marginTop: 0,
                            }}
                        >
                            <Link
                                href="/my-purchases"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '12px 28px',
                                    background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                    color: P.white,
                                    borderRadius: 12,
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: 14,
                                    boxShadow: '0 2px 8px rgba(6,95,70,0.25)',
                                }}
                            >
                                View my orders
                            </Link>
                            <Link
                                href="/shop"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '12px 28px',
                                    background: P.white,
                                    color: P.primary,
                                    borderRadius: 12,
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    border: `2px solid ${P.border}`,
                                }}
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
