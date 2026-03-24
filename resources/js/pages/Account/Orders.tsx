import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const LOGO_URL = '/mylogo/logopng%20(1).png';

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
    headerFrom: '#022c22',
    headerTo: '#065f46',
} as const;

type OrderRow = {
    id: number;
    order_number: string;
    status: string;
    return_status?: string;
    total: number;
    created_at: string;
    item_count: number;
};

type OrdersPaginated = {
    data: OrderRow[];
    links?: { url: string | null; label: string; active: boolean }[];
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
    pending: { bg: '#fef3c7', color: '#b45309' },
    processing: { bg: '#eff6ff', color: '#1d4ed8' },
    shipped: { bg: '#eff6ff', color: '#1d4ed8' },
    delivered: { bg: '#ecfdf5', color: P.primary },
    cancelled: { bg: '#fef2f2', color: '#dc2626' },
};

function formatPrice(n: number) {
    return `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AccountOrders({ orders }: { orders: OrdersPaginated }) {
    const [returnOrderId, setReturnOrderId] = useState<number | null>(null);
    const [returnReason, setReturnReason] = useState('');

    return (
        <>
            <Head title="My Orders – Lynsi Food Products" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', sans-serif; background: ${P.bg}; }
            `}</style>

            <div style={{ minHeight: '100vh' }}>
                {/* Header – same as Account/Profile */}
                <header
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        background: `linear-gradient(135deg, ${P.headerFrom} 0%, ${P.headerTo} 100%)`,
                        boxShadow: '0 2px 12px rgba(2,44,34,0.3)',
                    }}
                >
                    <div
                        style={{
                            maxWidth: 1100,
                            margin: '0 auto',
                            padding: '0 24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minHeight: 58,
                            gap: 16,
                        }}
                    >
                        <Link
                            href="/"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                textDecoration: 'none',
                            }}
                        >
                            <img
                                src={LOGO_URL}
                                alt=""
                                style={{ height: 28, objectFit: 'contain' }}
                            />
                            <span
                                style={{
                                    fontWeight: 800,
                                    fontSize: 15,
                                    color: P.white,
                                    letterSpacing: '-0.3px',
                                }}
                            >
                                Lynsi
                                <span style={{ color: '#6ee7b7' }}>
                                    FoodProducts
                                </span>
                            </span>
                        </Link>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            <Link
                                href="/account"
                                style={{
                                    fontSize: 13,
                                    color: 'rgba(255,255,255,0.85)',
                                    textDecoration: 'none',
                                    padding: '7px 14px',
                                    borderRadius: 8,
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    (
                                        e.currentTarget as HTMLAnchorElement
                                    ).style.background =
                                        'rgba(255,255,255,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    (
                                        e.currentTarget as HTMLAnchorElement
                                    ).style.background = 'transparent';
                                }}
                            >
                                My Account
                            </Link>
                            <Link
                                href="/shop"
                                style={{
                                    fontSize: 13,
                                    color: 'rgba(255,255,255,0.85)',
                                    textDecoration: 'none',
                                    padding: '7px 14px',
                                    borderRadius: 8,
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    (
                                        e.currentTarget as HTMLAnchorElement
                                    ).style.background =
                                        'rgba(255,255,255,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    (
                                        e.currentTarget as HTMLAnchorElement
                                    ).style.background = 'transparent';
                                }}
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </header>

                <main
                    style={{
                        maxWidth: 760,
                        margin: '0 auto',
                        padding: '32px 20px 80px',
                    }}
                >
                    <h1
                        style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: P.primary,
                            marginBottom: 6,
                        }}
                    >
                        My Orders
                    </h1>
                    <p
                        style={{
                            fontSize: 14,
                            color: P.textMuted,
                            marginBottom: 24,
                        }}
                    >
                        View and track your orders. Click an order to see full
                        details.
                    </p>

                    {!orders.data.length ? (
                        <div
                            style={{
                                background: P.card,
                                borderRadius: 16,
                                border: `1px solid ${P.border}`,
                                padding: 48,
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: 48, marginBottom: 12 }}>
                                📦
                            </div>
                            <h2
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: P.text,
                                    marginBottom: 8,
                                }}
                            >
                                No orders yet
                            </h2>
                            <p
                                style={{
                                    fontSize: 14,
                                    color: P.textMuted,
                                    marginBottom: 20,
                                }}
                            >
                                When you place an order, it will appear here.
                            </p>
                            <Link
                                href="/shop"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '12px 24px',
                                    background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                    color: P.white,
                                    borderRadius: 12,
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: 14,
                                }}
                            >
                                Browse products
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 12,
                                }}
                            >
                                {orders.data.map((order) => {
                                    const statusStyle =
                                        STATUS_STYLE[order.status] ??
                                        STATUS_STYLE.pending;
                                    return (
                                        <Link
                                            key={order.id}
                                            href={`/checkout/confirmation/${order.order_number}`}
                                            style={{
                                                display: 'block',
                                                background: P.card,
                                                borderRadius: 16,
                                                border: `1px solid ${P.border}`,
                                                padding: 20,
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                transition:
                                                    'box-shadow 0.2s, border-color 0.2s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow =
                                                    '0 4px 20px rgba(6,95,70,0.12)';
                                                e.currentTarget.style.borderColor =
                                                    P.accent;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow =
                                                    'none';
                                                e.currentTarget.style.borderColor =
                                                    P.border;
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                    gap: 12,
                                                }}
                                            >
                                                <div>
                                                    <div
                                                        style={{
                                                            fontSize: 13,
                                                            fontWeight: 700,
                                                            color: P.primary,
                                                            fontFamily:
                                                                'monospace',
                                                            letterSpacing:
                                                                '0.02em',
                                                        }}
                                                    >
                                                        {order.order_number}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 12,
                                                            color: P.textMuted,
                                                            marginTop: 2,
                                                        }}
                                                    >
                                                        {new Date(
                                                            order.created_at,
                                                        ).toLocaleString(
                                                            undefined,
                                                            {
                                                                dateStyle:
                                                                    'medium',
                                                                timeStyle:
                                                                    'short',
                                                            },
                                                        )}
                                                        {' · '}
                                                        {order.item_count}{' '}
                                                        {order.item_count === 1
                                                            ? 'item'
                                                            : 'items'}
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 12,
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            padding: '4px 10px',
                                                            borderRadius: 50,
                                                            background:
                                                                statusStyle.bg,
                                                            color: statusStyle.color,
                                                            textTransform:
                                                                'capitalize',
                                                        }}
                                                    >
                                                        {order.status}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: 16,
                                                            fontWeight: 800,
                                                            color: P.primary,
                                                        }}
                                                    >
                                                        {formatPrice(
                                                            order.total,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    marginTop: 10,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                    gap: 10,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 13,
                                                        color: P.accent,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    View order details →
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        router.post(
                                                            `/my-purchases/${order.id}/reorder`,
                                                        );
                                                    }}
                                                    style={{
                                                        border: `1px solid ${P.border}`,
                                                        borderRadius: 999,
                                                        background: P.accentBg,
                                                        color: P.primary,
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        padding: '6px 10px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Reorder
                                                </button>
                                                {order.status === 'delivered' &&
                                                    (order.return_status ??
                                                        'none') === 'none' && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setReturnOrderId(
                                                                    order.id,
                                                                );
                                                                setReturnReason(
                                                                    '',
                                                                );
                                                            }}
                                                            style={{
                                                                border: `1px solid #fecaca`,
                                                                borderRadius: 999,
                                                                background:
                                                                    '#fef2f2',
                                                                color: '#b91c1c',
                                                                fontSize: 12,
                                                                fontWeight: 700,
                                                                padding:
                                                                    '6px 10px',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            Request Return
                                                        </button>
                                                    )}
                                                {order.return_status &&
                                                    order.return_status !==
                                                        'none' && (
                                                        <span
                                                            style={{
                                                                border: `1px solid ${P.border}`,
                                                                borderRadius: 999,
                                                                background:
                                                                    P.accentBg,
                                                                color: P.primary,
                                                                fontSize: 12,
                                                                fontWeight: 700,
                                                                padding:
                                                                    '6px 10px',
                                                            }}
                                                        >
                                                            Return:{' '}
                                                            {
                                                                order.return_status
                                                            }
                                                        </span>
                                                    )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {orders.links && orders.links.length > 1 && (
                                <div
                                    style={{
                                        marginTop: 24,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        gap: 8,
                                    }}
                                >
                                    {orders.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            style={{
                                                padding: '8px 14px',
                                                borderRadius: 8,
                                                fontSize: 13,
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                background: link.active
                                                    ? P.primary
                                                    : P.accentBg,
                                                color: link.active
                                                    ? P.white
                                                    : P.primary,
                                                border: link.active
                                                    ? 'none'
                                                    : `1px solid ${P.border}`,
                                                opacity: link.url ? 1 : 0.5,
                                                pointerEvents: link.url
                                                    ? 'auto'
                                                    : 'none',
                                            }}
                                            preserveScroll
                                        >
                                            {link.label
                                                .replace('&laquo;', '«')
                                                .replace('&raquo;', '»')}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
            {returnOrderId && (
                <div
                    onClick={() => setReturnOrderId(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15,23,42,0.55)',
                        display: 'grid',
                        placeItems: 'center',
                        zIndex: 200,
                        padding: 16,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: 520,
                            background: P.card,
                            border: `1px solid ${P.border}`,
                            borderRadius: 14,
                            padding: 16,
                        }}
                    >
                        <h3
                            style={{
                                fontSize: 16,
                                fontWeight: 800,
                                color: P.text,
                            }}
                        >
                            Request return
                        </h3>
                        <p
                            style={{
                                marginTop: 6,
                                fontSize: 13,
                                color: P.textMuted,
                            }}
                        >
                            Tell us why you want to return this order.
                        </p>
                        <textarea
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            placeholder="Example: wrong item variant delivered."
                            rows={4}
                            style={{
                                marginTop: 10,
                                width: '100%',
                                resize: 'vertical',
                                border: `1px solid ${P.borderGray}`,
                                borderRadius: 10,
                                padding: 10,
                                fontSize: 13,
                                fontFamily: 'inherit',
                            }}
                        />
                        <div
                            style={{
                                marginTop: 12,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 8,
                            }}
                        >
                            <button
                                type="button"
                                style={{
                                    border: `1px solid ${P.borderGray}`,
                                    borderRadius: 10,
                                    background: '#fff',
                                    color: P.text,
                                    padding: '8px 12px',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                                onClick={() => setReturnOrderId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                style={{
                                    border: 'none',
                                    borderRadius: 10,
                                    background: P.primary,
                                    color: '#fff',
                                    padding: '8px 12px',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    const reason = returnReason.trim();
                                    if (!reason) return;
                                    router.post(
                                        `/my-purchases/${returnOrderId}/return-request`,
                                        {
                                            return_reason: reason,
                                        },
                                    );
                                    setReturnOrderId(null);
                                }}
                            >
                                Submit request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
