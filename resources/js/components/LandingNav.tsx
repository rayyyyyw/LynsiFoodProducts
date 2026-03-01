import { Link, router, usePage } from '@inertiajs/react';
import { Home, ShoppingBag, MapPin, Info, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const LOGO_URL = '/mylogo/logopng%20(1).png';

const PALETTE = {
    primary: '#065f46',
    accent: '#10b981',
    muted: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    light: '#d1fae5',
    white: '#ffffff',
} as const;

const NAV_ITEMS: { id: string; label: string; href: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'products', label: 'Products', href: '/shop', icon: ShoppingBag },
    { id: 'our-locations', label: 'Our Locations', href: '/locations', icon: MapPin },
    { id: 'about-us', label: 'About Us', href: '/about', icon: Info },
    { id: 'contact-us', label: 'Contact Us', href: '/contact', icon: Mail },
];

type AuthUser = { name?: string; email?: string; role?: string; profile_photo_url?: string | null } | null;

type Props = {
    activeId: string;
    auth: { user: AuthUser } | null;
    canRegister?: boolean;
};

function getInitials(name: string) {
    return name.trim().split(/\s+/).map(s => s[0]).join('').toUpperCase().slice(0, 2);
}

export function LandingNav({ activeId, auth, canRegister = true }: Props) {
    const user = auth?.user ?? null;
    const { cartCount = 0 } = usePage().props as { cartCount?: number };
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    const linkBase = {
        display: 'inline-flex' as const,
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        minHeight: 44,
        borderRadius: 10,
        fontWeight: 500,
        fontSize: 14,
        textDecoration: 'none' as const,
        transition: 'all 0.2s',
        borderBottom: '2px solid transparent',
    };

    const accountHref = user?.role === 'admin' ? '/settings/profile' : '/account';

    return (
        <nav
            style={{
                position: 'sticky',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${PALETTE.border}`,
                boxShadow: '0 2px 20px rgba(6,95,70,0.08)',
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: '0 20px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 64,
                    gap: 12,
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textDecoration: 'none',
                        color: 'inherit',
                        minWidth: 0,
                    }}
                    aria-label="Lynsi Food Products - Home"
                >
                    <img
                        src={LOGO_URL}
                        alt=""
                        style={{ height: 40, width: 'auto', maxWidth: 140, objectFit: 'contain', display: 'block', flexShrink: 1 }}
                    />
                    <span style={{ fontWeight: 800, fontSize: 18, color: PALETTE.primary, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
                        Lynsi<span style={{ color: PALETTE.accent }}>FoodProducts</span>
                    </span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12 }}>
                    {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
                        const isActive = activeId === id;
                        return (
                            <Link
                                key={id}
                                href={href}
                                style={{
                                    ...linkBase,
                                    color: isActive ? PALETTE.primary : '#64748b',
                                    background: isActive ? PALETTE.bg : 'transparent',
                                    borderBottomColor: isActive ? PALETTE.accent : 'transparent',
                                }}
                            >
                                <Icon size={18} style={{ flexShrink: 0 }} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right side: cart + user dropdown or login/register */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Cart icon – always visible when logged in */}
                    {user && (
                        <Link href="/cart" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, textDecoration: 'none', color: PALETTE.primary, transition: 'background 0.15s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = PALETTE.bg; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                            title="My Cart"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.94-1.51L23 6H6"/></svg>
                            {cartCount > 0 && (
                                <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 50, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', lineHeight: 1 }}>
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                    )}
                    {user ? (
                        <div ref={menuRef} style={{ position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(!menuOpen)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '7px 12px',
                                    minHeight: 44,
                                    background: menuOpen ? PALETTE.bg : 'transparent',
                                    border: `1px solid ${menuOpen ? PALETTE.border : 'transparent'}`,
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: "'Inter', sans-serif",
                                    maxWidth: 200,
                                }}
                                onMouseEnter={e => { if (!menuOpen) { (e.currentTarget as HTMLButtonElement).style.background = PALETTE.bg; (e.currentTarget as HTMLButtonElement).style.borderColor = PALETTE.border; } }}
                                onMouseLeave={e => { if (!menuOpen) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; } }}
                                aria-haspopup="true"
                                aria-expanded={menuOpen}
                            >
                                {/* Avatar: wrapper clips the circle, photo overlays initials */}
                                <div style={{
                                    position: 'relative', flexShrink: 0,
                                    width: 32, height: 32, borderRadius: '50%',
                                    overflow: 'hidden',
                                    background: `linear-gradient(135deg, #047857, ${PALETTE.primary})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: `0 0 0 2px ${PALETTE.border}, 0 1px 4px rgba(6,95,70,0.18)`,
                                }}>
                                    <span style={{ color: PALETTE.white, fontSize: 11, fontWeight: 700, userSelect: 'none' }}>
                                        {getInitials(user.name || '?')}
                                    </span>
                                    {user.profile_photo_url && (
                                        <img
                                            src={user.profile_photo_url}
                                            alt=""
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    )}
                                </div>
                                <span
                                    className="hidden md:inline"
                                    style={{
                                        fontSize: 14, fontWeight: 600, color: PALETTE.primary,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        maxWidth: 120,
                                    }}
                                >
                                    {user.name || 'User'}
                                </span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: PALETTE.muted, flexShrink: 0, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {menuOpen && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                    minWidth: 220, background: PALETTE.white,
                                    border: `1px solid ${PALETTE.border}`, borderRadius: 14,
                                    boxShadow: '0 8px 32px rgba(6,95,70,0.14)',
                                    padding: 8, zIndex: 1001,
                                }}>
                                    {/* User info */}
                                    <div style={{ padding: '10px 12px 12px', borderBottom: `1px solid ${PALETTE.border}`, marginBottom: 4 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: PALETTE.primary, wordBreak: 'break-word', lineHeight: 1.3 }}>
                                            {user.name || 'User'}
                                        </div>
                                        {user.email && (
                                            <div style={{ fontSize: 12, color: PALETTE.muted, marginTop: 2, wordBreak: 'break-all' }}>
                                                {user.email}
                                            </div>
                                        )}
                                    </div>

                                    {/* My Account */}
                                    <Link
                                        href={accountHref}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '10px 12px', borderRadius: 10,
                                            textDecoration: 'none', color: PALETTE.primary,
                                            fontSize: 14, fontWeight: 500, transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = PALETTE.bg; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span style={{ width: 20, textAlign: 'center' }}>👤</span>
                                        My Account
                                    </Link>

                                    {/* My Purchase */}
                                    <Link
                                        href="/my-purchases"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '10px 12px', borderRadius: 10,
                                            textDecoration: 'none', color: PALETTE.primary,
                                            fontSize: 14, fontWeight: 500, transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = PALETTE.bg; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span style={{ width: 20, textAlign: 'center' }}>🛒</span>
                                        My Purchase
                                    </Link>

                                    {/* Dashboard for admin only */}
                                    {user.role === 'admin' && (
                                        <Link
                                            href="/dashboard"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '10px 12px', borderRadius: 10,
                                                textDecoration: 'none', color: PALETTE.primary,
                                                fontSize: 14, fontWeight: 500, transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = PALETTE.bg; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <span style={{ width: 20, textAlign: 'center' }}>⚙️</span>
                                            Dashboard
                                        </Link>
                                    )}

                                    {/* Divider + Logout */}
                                    <div style={{ height: 1, background: PALETTE.border, margin: '6px 0' }} />
                                    <button
                                        type="button"
                                        onClick={() => { setMenuOpen(false); router.post('/logout'); }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                                            padding: '10px 12px', borderRadius: 10,
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: '#ef4444', fontSize: 14, fontWeight: 500,
                                            textAlign: 'left', transition: 'background 0.15s',
                                            fontFamily: "'Inter', sans-serif",
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                    >
                                        <span style={{ width: 20, textAlign: 'center' }}>🚪</span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden md:inline"
                                style={{ color: PALETTE.muted, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href="/register"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '10px 20px', fontSize: 14, fontWeight: 600,
                                        whiteSpace: 'nowrap', minHeight: 44,
                                        background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                                        color: PALETTE.white, borderRadius: 10, textDecoration: 'none',
                                    }}
                                >
                                    Get Started Free
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
