import { Link, router, usePage } from '@inertiajs/react';
import { Home, ShoppingBag, MapPin, Info, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

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
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    useEffect(() => {
        if (mobileNavOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileNavOpen]);

    const linkBase = {
        display: 'inline-flex' as const,
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        minHeight: 44,
        borderRadius: 10,
        fontWeight: 500,
        fontSize: 14,
        textDecoration: 'none' as const,
        transition: 'all 0.2s',
        borderBottom: '2px solid transparent',
        whiteSpace: 'nowrap' as const,
        flexShrink: 0,
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
                className="w-full max-w-[1200px] mx-auto flex items-center justify-between gap-1 sm:gap-2 md:gap-4 min-h-12 sm:min-h-14 md:min-h-16 px-2 sm:px-3 md:px-5"
            >
                {/* Logo – shrink on mobile so hamburger + CTA stay visible */}
                <Link
                    href="/"
                    className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 md:flex-initial max-w-[55%] md:max-w-none"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    aria-label="Lynsi Food Products - Home"
                >
                    <img
                        src={LOGO_URL}
                        alt=""
                        className="h-6 w-auto max-w-[56px] sm:h-7 sm:max-w-[72px] md:h-10 md:max-w-[140px] object-contain block shrink"
                    />
                    <span className="font-extrabold text-[11px] sm:text-[13px] md:text-lg tracking-tight truncate" style={{ color: PALETTE.primary }}>
                        Lynsi<span style={{ color: PALETTE.accent }}>FoodProducts</span>
                    </span>
                </Link>

                {/* Desktop nav links – nowrap so labels stay on one line */}
                <div className="hidden md:flex flex-nowrap shrink-0" style={{ alignItems: 'center', gap: 8 }}>
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
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(6,95,70,0.06)';
                                        (e.currentTarget as HTMLAnchorElement).style.color = PALETTE.primary;
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                                        (e.currentTarget as HTMLAnchorElement).style.color = '#64748b';
                                    }
                                }}
                            >
                                <Icon size={18} style={{ flexShrink: 0 }} />
                                <span className="whitespace-nowrap">{label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right side: notification bell + cart + user/login/register + hamburger (mobile) */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    {/* Notification bell – when not logged in redirects to login */}
                    <Link
                        href={user ? '/account' : '/login'}
                        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0"
                        style={{ position: 'relative', textDecoration: 'none', color: PALETTE.primary, transition: 'background 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = PALETTE.bg; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                        title={user ? 'Notifications' : 'Sign in to see notifications'}
                        aria-label={user ? 'Notifications' : 'Sign in'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </Link>
                    {/* Cart icon – always visible when logged in */}
                    {user && (
                        <Link href="/cart" className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0" style={{ position: 'relative', textDecoration: 'none', color: PALETTE.primary, transition: 'background 0.15s' }}
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
                                        className="min-h-[44px] flex items-center gap-2.5 py-3 px-3 rounded-xl text-sm font-medium touch-manipulation"
                                        style={{
                                            textDecoration: 'none', color: PALETTE.primary,
                                            transition: 'background 0.15s',
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
                                        className="min-h-[44px] flex items-center gap-2.5 py-3 px-3 rounded-xl text-sm font-medium touch-manipulation"
                                        style={{
                                            textDecoration: 'none', color: PALETTE.primary,
                                            transition: 'background 0.15s',
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
                                            className="min-h-[44px] flex items-center gap-2.5 py-3 px-3 rounded-xl text-sm font-medium touch-manipulation"
                                            style={{
                                                textDecoration: 'none', color: PALETTE.primary,
                                                transition: 'background 0.15s',
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
                                        className="min-h-[44px] w-full flex items-center gap-2.5 py-3 px-3 rounded-xl text-sm font-medium touch-manipulation text-left"
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: '#ef4444',
                                            transition: 'background 0.15s',
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
                                className="hidden md:inline rounded-lg px-3 py-2"
                                style={{ color: PALETTE.muted, fontWeight: 500, fontSize: 14, textDecoration: 'none', transition: 'all 0.2s' }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.color = PALETTE.primary;
                                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(6,95,70,0.06)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.color = PALETTE.muted;
                                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                                }}
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center min-h-[32px] py-1 px-2 sm:min-h-[36px] sm:py-1.5 sm:px-2.5 md:min-h-[44px] md:py-2.5 md:px-5 rounded-md md:rounded-xl font-semibold text-[10px] sm:text-[11px] md:text-sm whitespace-nowrap touch-manipulation shrink-0"
                                    style={{
                                        background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                                        color: PALETTE.white, textDecoration: 'none',
                                        transition: 'all 0.25s ease',
                                        boxShadow: '0 4px 14px rgba(6,95,70,0.35)',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(6,95,70,0.4)';
                                        (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.transform = '';
                                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(6,95,70,0.35)';
                                        (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(135deg, #047857 0%, #065f46 100%)';
                                    }}
                                >
                                    Get Started
                                </Link>
                            )}
                        </>
                    )}

                    {/* Mobile hamburger – always visible on small screens */}
                    <button
                        type="button"
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                        className="md:hidden flex items-center justify-center w-10 h-10 shrink-0 rounded-lg touch-manipulation"
                        style={{ background: mobileNavOpen ? PALETTE.bg : 'transparent', border: `1px solid ${mobileNavOpen ? PALETTE.border : 'transparent'}`, color: PALETTE.primary }}
                        aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileNavOpen}
                    >
                        {mobileNavOpen ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile nav overlay – portaled to body so it always displays on top (fixes no-display on Shop, etc.) */}
            {mobileNavOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="md:hidden fixed inset-0 bg-white overflow-auto"
                    style={{
                        top: 56,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        borderTop: `1px solid ${PALETTE.border}`,
                        boxShadow: '0 8px 32px rgba(6,95,70,0.15)',
                        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                        paddingLeft: 'max(16px, env(safe-area-inset-left))',
                        paddingRight: 'max(16px, env(safe-area-inset-right))',
                    }}
                    aria-modal="true"
                    role="dialog"
                    aria-label="Mobile menu"
                >
                    <nav className="flex flex-col py-4 px-4 sm:px-6 w-full max-w-full" aria-label="Mobile navigation">
                        {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
                            const isActive = activeId === id;
                            return (
                                <Link
                                    key={id}
                                    href={href}
                                    onClick={() => setMobileNavOpen(false)}
                                    className="flex items-center gap-3 min-h-[48px] px-4 py-3 rounded-xl text-sm font-medium touch-manipulation"
                                    style={{
                                        textDecoration: 'none',
                                        color: isActive ? PALETTE.primary : '#475569',
                                        background: isActive ? PALETTE.bg : 'transparent',
                                    }}
                                >
                                    <Icon size={20} style={{ flexShrink: 0, color: isActive ? PALETTE.primary : undefined }} />
                                    {label}
                                </Link>
                            );
                        })}
                        {/* When logged in, profile dropdown in navbar covers My Account / My Purchase / Logout – no duplicate section here */}
                        {!user && (
                            <>
                                <div className="border-t border-[#a7f3d0] my-3 mx-1" />
                                <Link
                                    href="/login"
                                    onClick={() => setMobileNavOpen(false)}
                                    className="flex items-center justify-center min-h-[48px] px-4 py-3 rounded-xl font-medium text-sm touch-manipulation"
                                    style={{ textDecoration: 'none', color: PALETTE.primary }}
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileNavOpen(false)}
                                        className="flex items-center justify-center min-h-[48px] mt-2 px-4 py-3 rounded-xl font-semibold text-sm touch-manipulation"
                                        style={{
                                            textDecoration: 'none',
                                            background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                                            color: PALETTE.white,
                                        }}
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </div>,
                document.body
            )}
        </nav>
    );
}
