import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { LandingNav } from '@/components/LandingNav';

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

function getInitials(name?: string | null) {
    if (!name) return 'U';
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('');
}

export default function AccountOrders({ orders }: { orders: OrdersPaginated }) {
    const page = usePage<{
        auth?: {
            user?: {
                name?: string | null;
                email?: string | null;
                profile_photo_url?: string | null;
            } | null;
        };
    }>();
    const authUser = page.props.auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [returnOrderId, setReturnOrderId] = useState<number | null>(null);
    const [returnReason, setReturnReason] = useState('');

    useEffect(() => {
        const onDocClick = (event: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    return (
        <>
            <Head title="My Orders – Lynsi Food Products" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                .orders-root, .orders-root * { box-sizing: border-box; }
                .orders-root { font-family: 'Inter', sans-serif; background: ${P.bg}; }

                @media (max-width: 640px) {
                    .orders-header-inner {
                        padding: 8px 10px !important;
                        min-height: 54px !important;
                        gap: 8px !important;
                        flex-wrap: nowrap !important;
                    }
                    .orders-brand-text {
                        font-size: 13px !important;
                    }
                    .orders-header-sep,
                    .orders-header-label {
                        display: none !important;
                    }
                    .orders-nav-actions {
                        width: auto !important;
                        display: flex !important;
                        gap: 8px !important;
                        margin-left: auto !important;
                    }
                    .orders-nav-link {
                        justify-content: center !important;
                        text-align: center;
                        padding: 7px 12px !important;
                        font-size: 12px !important;
                    }
                    .orders-avatar-link {
                        justify-content: center !important;
                        padding: 6px 8px !important;
                    }
                    .orders-avatar-name {
                        display: none !important;
                    }
                    .orders-main {
                        padding: 18px 12px 64px !important;
                    }
                    .orders-page-title {
                        font-size: 20px !important;
                    }
                    .orders-card {
                        padding: 14px !important;
                    }
                    .orders-card-top {
                        gap: 8px !important;
                    }
                    .orders-card-meta {
                        width: 100%;
                        justify-content: space-between;
                    }
                    .orders-card-actions {
                        justify-content: flex-start !important;
                        flex-wrap: wrap !important;
                        row-gap: 8px !important;
                    }
                    .orders-card-view {
                        width: 100%;
                    }
                }
            `}</style>

            <div className="orders-root" style={{ minHeight: '100vh' }}>
                <LandingNav activeId="" auth={{ user: authUser ?? null }} />
                {/* Header – same as Account/Profile */}
                <header
                    style={{
                        display: 'none',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        background: `linear-gradient(135deg, ${P.headerFrom} 0%, ${P.headerTo} 100%)`,
                        boxShadow: '0 2px 12px rgba(2,44,34,0.3)',
                    }}
                >
                    <div
                        className="orders-header-inner"
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
                                className="orders-brand-text"
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
                        <span
                            className="orders-header-sep"
                            style={{
                                fontSize: 13,
                                color: 'rgba(255,255,255,0.35)',
                            }}
                        >
                            |
                        </span>
                        <span
                            className="orders-header-label"
                            style={{
                                fontSize: 13,
                                color: 'rgba(255,255,255,0.75)',
                                fontWeight: 500,
                            }}
                        >
                            My Account
                        </span>
                        <div
                            className="orders-nav-actions"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                marginLeft: 'auto',
                            }}
                        >
                            <Link
                                href="/shop"
                                className="orders-nav-link"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
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
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.94-1.51L23 6H6" />
                                </svg>
                                Shop
                            </Link>
                            <div ref={menuRef} style={{ position: 'relative' }}>
                                <button
                                    type="button"
                                    className="orders-avatar-link"
                                    onClick={() => setMenuOpen((v) => !v)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '6px 12px 6px 8px',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 50,
                                        color: P.white,
                                        cursor: 'pointer',
                                    }}
                                    title="Account menu"
                                >
                                    {authUser?.profile_photo_url ? (
                                        <img
                                            src={authUser.profile_photo_url}
                                            alt=""
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                flexShrink: 0,
                                                border: '1px solid rgba(255,255,255,0.3)',
                                            }}
                                        />
                                    ) : (
                                        <span
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background:
                                                    'rgba(255,255,255,0.2)',
                                                fontSize: 11,
                                                fontWeight: 800,
                                                color: P.white,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {getInitials(authUser?.name)}
                                        </span>
                                    )}
                                    <span
                                        className="orders-avatar-name"
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: 'rgba(255,255,255,0.9)',
                                        }}
                                    >
                                        My Account
                                    </span>
                                    <span
                                        style={{ fontSize: 10, opacity: 0.85 }}
                                    >
                                        {menuOpen ? '▴' : '▾'}
                                    </span>
                                </button>
                                {menuOpen && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 8px)',
                                            right: 0,
                                            minWidth: 210,
                                            background: P.white,
                                            border: `1px solid ${P.borderGray}`,
                                            borderRadius: 14,
                                            boxShadow:
                                                '0 12px 36px rgba(0,0,0,0.16)',
                                            padding: 6,
                                            zIndex: 200,
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: '10px 12px',
                                                borderBottom: `1px solid ${P.borderGray}`,
                                                marginBottom: 4,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    color: P.text,
                                                }}
                                            >
                                                {authUser?.name ?? 'User'}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: P.textMuted,
                                                }}
                                            >
                                                {authUser?.email ?? ''}
                                            </div>
                                        </div>
                                        <Link
                                            href="/account"
                                            onClick={() => setMenuOpen(false)}
                                            style={{
                                                display: 'block',
                                                padding: '9px 10px',
                                                borderRadius: 10,
                                                textDecoration: 'none',
                                                color: P.text,
                                                fontSize: 14,
                                            }}
                                        >
                                            My Account
                                        </Link>
                                        <Link
                                            href="/my-purchases"
                                            onClick={() => setMenuOpen(false)}
                                            style={{
                                                display: 'block',
                                                padding: '9px 10px',
                                                borderRadius: 10,
                                                textDecoration: 'none',
                                                color: P.text,
                                                fontSize: 14,
                                            }}
                                        >
                                            My Purchase
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post('/logout')
                                            }
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                border: 'none',
                                                background: 'transparent',
                                                padding: '9px 10px',
                                                borderRadius: 10,
                                                color: '#dc2626',
                                                fontSize: 14,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main
                    className="orders-main"
                    style={{
                        maxWidth: 760,
                        margin: '0 auto',
                        padding: '32px 20px 80px',
                    }}
                >
                    <h1
                        className="orders-page-title"
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
                                            className="orders-card"
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
                                                className="orders-card-top"
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
                                                    className="orders-card-meta"
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
                                                className="orders-card-actions"
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
                                                    className="orders-card-view"
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
