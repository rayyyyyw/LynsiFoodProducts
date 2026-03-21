import { Link, router, usePage } from '@inertiajs/react';
import { Home, ShoppingBag, MapPin, Info, Mail, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const LOGO_URL = '/mylogo/logopng%20(1).png';

/** Matches welcome.tsx — nav uses restrained neutrals on dark (less green noise) */
const PALETTE = {
    forest: '#031a0c',
    deep: '#052e16',
    emerald: '#065f46',
    jade: '#047857',
    mint: '#10b981',
    sage: '#34d399',
    foam: '#d1fae5',
    mist: '#f0fdf4',
    white: '#ffffff',
    onDark: '#d1fae5',
    onDarkMuted: '#6ee7b7',
    strokeDark: 'rgba(52,211,153,0.22)',
    navGlass:
        'linear-gradient(180deg, rgba(3,26,12,0.94) 0%, rgba(3,26,12,0.88) 100%)',
    /** Subtle neutrals — active state stays calm */
    navText: 'rgba(255,255,255,0.68)',
    navTextHover: 'rgba(255,255,255,0.88)',
    navTextActive: 'rgba(255,255,255,0.96)',
    navUnderline: 'rgba(255,255,255,0.42)',
    hoverBg: 'rgba(255,255,255,0.06)',
    activeBg: 'rgba(255,255,255,0.06)',
    dropdownBg: 'rgba(5,46,22,0.98)',
    /** CTA: soft, not loud green */
    ctaBg: 'rgba(255,255,255,0.11)',
    ctaBorder: 'rgba(255,255,255,0.22)',
    ctaHoverBg: 'rgba(255,255,255,0.16)',
} as const;

const NAV_ITEMS: {
    id: string;
    label: string;
    href: string;
    icon: typeof Home;
}[] = [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'products', label: 'Products', href: '/shop', icon: ShoppingBag },
    {
        id: 'our-locations',
        label: 'Our Locations',
        href: '/locations',
        icon: MapPin,
    },
    { id: 'about-us', label: 'About Us', href: '/about', icon: Info },
    { id: 'contact-us', label: 'Contact Us', href: '/contact', icon: Mail },
];

type AuthUser = {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
    profile_photo_url?: string | null;
} | null;

type Props = {
    activeId: string;
    auth: { user: AuthUser } | null;
    canRegister?: boolean;
    /**
     * When true (e.g. welcome hero): fully transparent bar — no fill, no blur, no edge line.
     * When false: subtle glass bar for light / mixed pages (shop, contact, etc.).
     */
    overlay?: boolean;
};

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .map((s) => s[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function LandingNav({
    activeId,
    auth,
    canRegister = true,
    overlay = false,
}: Props) {
    const user = auth?.user ?? null;
    const { cartCount = 0 } = usePage().props as { cartCount?: number };
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node))
                setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    useEffect(() => {
        if (mobileNavOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileNavOpen]);

    const favoritesKey = `lynsi_favorites_${user?.id ?? 'guest'}`;

    // Favorites count from localStorage (client-side only, per user)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const readFavorites = () => {
            try {
                const raw = window.localStorage.getItem(favoritesKey);
                const arr = raw ? JSON.parse(raw) : [];
                setFavoriteCount(Array.isArray(arr) ? arr.length : 0);
            } catch {
                setFavoriteCount(0);
            }
        };

        readFavorites();

        const handler = () => readFavorites();
        window.addEventListener('storage', handler);
        window.addEventListener(
            'lynsi:favorites-updated',
            handler as EventListener,
        );
        return () => {
            window.removeEventListener('storage', handler);
            window.removeEventListener(
                'lynsi:favorites-updated',
                handler as EventListener,
            );
        };
    }, [favoritesKey]);

    const accountHref =
        user?.role === 'admin' ? '/settings/profile' : '/account';

    return (
        <nav
            className="landing-nav-bar"
            style={{
                position: 'sticky',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: overlay ? 'transparent' : PALETTE.navGlass,
                backdropFilter: overlay ? 'none' : 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: overlay
                    ? 'none'
                    : 'blur(20px) saturate(180%)',
                border: 'none',
                boxShadow: 'none',
            }}
        >
            <div
                className="mx-auto flex min-h-14 w-full max-w-[1200px] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4 md:min-h-16 md:gap-4 md:px-5"
                style={{
                    paddingLeft: 'max(12px, env(safe-area-inset-left))',
                    paddingRight: 'max(12px, env(safe-area-inset-right))',
                }}
            >
                {/* Logo – on very small screens logo-only; then "Lynsi" only; then full name to avoid truncation */}
                <Link
                    href="/"
                    className="flex max-w-[45%] min-w-0 shrink items-center gap-1.5 sm:max-w-[50%] sm:gap-2 md:max-w-none md:flex-initial"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    aria-label="Lynsi Food Products - Home"
                >
                    <img
                        src={LOGO_URL}
                        alt=""
                        className="block h-7 w-auto max-w-[48px] shrink-0 object-contain sm:h-8 sm:max-w-[56px] md:h-10 md:max-w-[140px]"
                    />
                    {/* Mobile: "Lynsi" only to avoid truncation; sm: add "FoodProducts"; md: full text */}
                    <span
                        className="text-[13px] font-extrabold tracking-tight whitespace-nowrap sm:text-[14px] md:hidden md:text-lg"
                        style={{ color: PALETTE.navTextActive }}
                    >
                        Lynsi
                    </span>
                    <span
                        className="hidden text-[14px] font-extrabold tracking-tight whitespace-nowrap sm:inline md:hidden"
                        style={{ color: PALETTE.navTextHover }}
                    >
                        FoodProducts
                    </span>
                    <span
                        className="hidden text-lg font-extrabold tracking-tight whitespace-nowrap md:inline"
                        style={{ color: PALETTE.navTextActive }}
                    >
                        Lynsi
                        <span style={{ color: PALETTE.navText }}>
                            FoodProducts
                        </span>
                    </span>
                </Link>

                {/* Desktop nav links – nowrap so labels stay on one line */}
                <div className="hidden shrink-0 flex-nowrap items-center md:flex">
                    {NAV_ITEMS.map(({ id, label, href, icon: Icon }) => {
                        const isActive = activeId === id;
                        return (
                            <Link
                                key={id}
                                href={href}
                                className={[
                                    'group mx-2 inline-flex min-h-[44px] items-center gap-2 px-0.5 py-2 text-sm font-medium no-underline',
                                    'rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#031a0c]',
                                ].join(' ')}
                            >
                                <Icon
                                    size={18}
                                    strokeWidth={isActive ? 2 : 1.75}
                                    className="shrink-0 text-white/55 transition-opacity duration-300 ease-out"
                                    aria-hidden
                                />
                                <span
                                    className={[
                                        'relative pb-0.5 whitespace-nowrap',
                                        'border-b-[1.5px] transition-[color,border-color,font-weight] duration-300 ease-out',
                                        isActive
                                            ? 'border-white/42 font-semibold text-white'
                                            : 'border-transparent font-medium text-white/68 group-hover:border-white/28 group-hover:text-white/90',
                                    ].join(' ')}
                                >
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right side: notification bell + favorites + cart + user/login/register + hamburger (mobile) – compact on small screens */}
                <div className="flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-1.5 md:gap-2">
                    {/* Notification bell – when not logged in redirects to login */}
                    <Link
                        href={user ? '/account' : '/login'}
                        className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-lg sm:h-9 sm:w-9 md:h-10 md:w-10"
                        style={{
                            position: 'relative',
                            textDecoration: 'none',
                            color: PALETTE.navTextHover,
                            transition: 'background 0.15s',
                            opacity: 0.92,
                        }}
                        onMouseEnter={(e) => {
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.background = PALETTE.hoverBg;
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.background = 'transparent';
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.opacity = '0.92';
                        }}
                        title={
                            user
                                ? 'Notifications'
                                : 'Sign in to see notifications'
                        }
                        aria-label={user ? 'Notifications' : 'Sign in'}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </Link>
                    {/* Favorites icon – client-side favorites from localStorage */}
                    <Link
                        href="/favorites"
                        className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-lg sm:h-9 sm:w-9 md:h-10 md:w-10"
                        style={{
                            position: 'relative',
                            textDecoration: 'none',
                            color: PALETTE.navTextHover,
                            transition: 'background 0.15s',
                            opacity: 0.92,
                        }}
                        onMouseEnter={(e) => {
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.background = PALETTE.hoverBg;
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.background = 'transparent';
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.opacity = '0.92';
                        }}
                        title="Favorites"
                        aria-label="Favorites"
                    >
                        <Heart
                            width={20}
                            height={20}
                            strokeWidth={2}
                            fill={favoriteCount > 0 ? '#ef4444' : 'none'}
                            className="shrink-0"
                        />
                        {favoriteCount > 0 && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    minWidth: 16,
                                    height: 16,
                                    borderRadius: 50,
                                    background: '#ef4444',
                                    color: '#fff',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 4px',
                                    lineHeight: 1,
                                }}
                            >
                                {favoriteCount > 99 ? '99+' : favoriteCount}
                            </span>
                        )}
                    </Link>
                    {/* Cart icon – visible for everyone (guests see count from session cart; clicking goes to /cart then redirects to login if needed) */}
                    <Link
                        href="/cart"
                        className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-lg sm:h-9 sm:w-9 md:h-10 md:w-10"
                        style={{
                            position: 'relative',
                            textDecoration: 'none',
                            color: PALETTE.navTextHover,
                            transition: 'background 0.15s',
                            opacity: 0.92,
                        }}
                        onMouseEnter={(e) => {
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.background = PALETTE.hoverBg;
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.background = 'transparent';
                            (
                                e.currentTarget as HTMLAnchorElement
                            ).style.opacity = '0.92';
                        }}
                        title={
                            user
                                ? 'My Cart'
                                : 'Cart (sign in to view and checkout)'
                        }
                    >
                        <svg
                            width="20"
                            height="20"
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
                        {cartCount > 0 && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    minWidth: 16,
                                    height: 16,
                                    borderRadius: 50,
                                    background: '#ef4444',
                                    color: '#fff',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 4px',
                                    lineHeight: 1,
                                }}
                            >
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>
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
                                    background: menuOpen
                                        ? PALETTE.hoverBg
                                        : 'transparent',
                                    border: `1px solid ${menuOpen ? 'rgba(255,255,255,0.18)' : 'transparent'}`,
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: "'Inter', sans-serif",
                                    maxWidth: 200,
                                }}
                                onMouseEnter={(e) => {
                                    if (!menuOpen) {
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.background = PALETTE.hoverBg;
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.borderColor =
                                            'rgba(255,255,255,0.12)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!menuOpen) {
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.background = 'transparent';
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.borderColor = 'transparent';
                                    }
                                }}
                                aria-haspopup="true"
                                aria-expanded={menuOpen}
                            >
                                {/* Avatar: wrapper clips the circle, photo overlays initials */}
                                <div
                                    style={{
                                        position: 'relative',
                                        flexShrink: 0,
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        background: `linear-gradient(135deg, ${PALETTE.jade}, ${PALETTE.emerald})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow:
                                            '0 0 0 1px rgba(255,255,255,0.2), 0 1px 4px rgba(0,0,0,0.35)',
                                    }}
                                >
                                    <span
                                        style={{
                                            color: PALETTE.white,
                                            fontSize: 11,
                                            fontWeight: 700,
                                            userSelect: 'none',
                                        }}
                                    >
                                        {getInitials(user.name || '?')}
                                    </span>
                                    {user.profile_photo_url && (
                                        <img
                                            src={user.profile_photo_url}
                                            alt=""
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                            onError={(e) => {
                                                (
                                                    e.currentTarget as HTMLImageElement
                                                ).style.display = 'none';
                                            }}
                                        />
                                    )}
                                </div>
                                <span
                                    className="hidden md:inline"
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: PALETTE.navTextActive,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: 120,
                                    }}
                                >
                                    {user.name || 'User'}
                                </span>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    style={{
                                        color: PALETTE.navText,
                                        flexShrink: 0,
                                        transition: 'transform 0.2s',
                                        transform: menuOpen
                                            ? 'rotate(180deg)'
                                            : 'rotate(0deg)',
                                    }}
                                >
                                    <path
                                        d="M2 4l4 4 4-4"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {menuOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        right: 0,
                                        minWidth: 220,
                                        background: PALETTE.dropdownBg,
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 14,
                                        boxShadow:
                                            '0 16px 48px rgba(0,0,0,0.45)',
                                        padding: 8,
                                        zIndex: 1001,
                                        backdropFilter: 'blur(12px)',
                                    }}
                                >
                                    {/* User info */}
                                    <div
                                        style={{
                                            padding: '10px 12px 12px',
                                            borderBottom:
                                                '1px solid rgba(255,255,255,0.1)',
                                            marginBottom: 4,
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 700,
                                                color: PALETTE.navTextActive,
                                                wordBreak: 'break-word',
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {user.name || 'User'}
                                        </div>
                                        {user.email && (
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: PALETTE.navText,
                                                    marginTop: 2,
                                                    wordBreak: 'break-all',
                                                }}
                                            >
                                                {user.email}
                                            </div>
                                        )}
                                    </div>

                                    {/* My Account */}
                                    <Link
                                        href={accountHref}
                                        className="flex min-h-[44px] touch-manipulation items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium"
                                        style={{
                                            textDecoration: 'none',
                                            color: PALETTE.navTextHover,
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => {
                                            (
                                                e.currentTarget as HTMLAnchorElement
                                            ).style.background =
                                                PALETTE.hoverBg;
                                        }}
                                        onMouseLeave={(e) => {
                                            (
                                                e.currentTarget as HTMLAnchorElement
                                            ).style.background = 'transparent';
                                        }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span
                                            style={{
                                                width: 20,
                                                textAlign: 'center',
                                            }}
                                        >
                                            👤
                                        </span>
                                        My Account
                                    </Link>

                                    {/* My Purchase */}
                                    <Link
                                        href="/my-purchases"
                                        className="flex min-h-[44px] touch-manipulation items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium"
                                        style={{
                                            textDecoration: 'none',
                                            color: PALETTE.navTextHover,
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => {
                                            (
                                                e.currentTarget as HTMLAnchorElement
                                            ).style.background =
                                                PALETTE.hoverBg;
                                        }}
                                        onMouseLeave={(e) => {
                                            (
                                                e.currentTarget as HTMLAnchorElement
                                            ).style.background = 'transparent';
                                        }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span
                                            style={{
                                                width: 20,
                                                textAlign: 'center',
                                            }}
                                        >
                                            🛒
                                        </span>
                                        My Purchase
                                    </Link>

                                    {/* Dashboard for admin only */}
                                    {user.role === 'admin' && (
                                        <Link
                                            href="/dashboard"
                                            className="flex min-h-[44px] touch-manipulation items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium"
                                            style={{
                                                textDecoration: 'none',
                                                color: PALETTE.navTextHover,
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={(e) => {
                                                (
                                                    e.currentTarget as HTMLAnchorElement
                                                ).style.background =
                                                    PALETTE.hoverBg;
                                            }}
                                            onMouseLeave={(e) => {
                                                (
                                                    e.currentTarget as HTMLAnchorElement
                                                ).style.background =
                                                    'transparent';
                                            }}
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <span
                                                style={{
                                                    width: 20,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                ⚙️
                                            </span>
                                            Dashboard
                                        </Link>
                                    )}

                                    {/* Divider + Logout */}
                                    <div
                                        style={{
                                            height: 1,
                                            background: 'rgba(255,255,255,0.1)',
                                            margin: '6px 0',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            router.post('/logout');
                                        }}
                                        className="flex min-h-[44px] w-full touch-manipulation items-center gap-2.5 rounded-xl px-3 py-3 text-left text-sm font-medium"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#fca5a5',
                                            transition: 'background 0.15s',
                                            fontFamily: "'Inter', sans-serif",
                                        }}
                                        onMouseEnter={(e) => {
                                            (
                                                e.currentTarget as HTMLButtonElement
                                            ).style.background =
                                                'rgba(239,68,68,0.18)';
                                        }}
                                        onMouseLeave={(e) => {
                                            (
                                                e.currentTarget as HTMLButtonElement
                                            ).style.background = 'transparent';
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 20,
                                                textAlign: 'center',
                                            }}
                                        >
                                            🚪
                                        </span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden rounded-lg px-3 py-2 md:inline"
                                style={{
                                    color: PALETTE.navText,
                                    fontWeight: 500,
                                    fontSize: 14,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    (
                                        e.currentTarget as HTMLAnchorElement
                                    ).style.color = PALETTE.navTextHover;
                                    (
                                        e.currentTarget as HTMLAnchorElement
                                    ).style.background = PALETTE.hoverBg;
                                }}
                                onMouseLeave={(e) => {
                                    (
                                        e.currentTarget as HTMLAnchorElement
                                    ).style.color = PALETTE.navText;
                                    (
                                        e.currentTarget as HTMLAnchorElement
                                    ).style.background = 'transparent';
                                }}
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href="/register"
                                    className="inline-flex min-h-[32px] shrink-0 touch-manipulation items-center justify-center rounded-lg px-2 py-1.5 text-[11px] font-semibold whitespace-nowrap sm:min-h-[36px] sm:px-3 sm:py-2 sm:text-[12px] md:min-h-[44px] md:rounded-xl md:px-5 md:py-2.5 md:text-sm"
                                    style={{
                                        background: PALETTE.ctaBg,
                                        border: `1px solid ${PALETTE.ctaBorder}`,
                                        color: PALETTE.white,
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        boxShadow: 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        (
                                            e.currentTarget as HTMLAnchorElement
                                        ).style.transform = 'translateY(-1px)';
                                        (
                                            e.currentTarget as HTMLAnchorElement
                                        ).style.background = PALETTE.ctaHoverBg;
                                        (
                                            e.currentTarget as HTMLAnchorElement
                                        ).style.borderColor =
                                            'rgba(255,255,255,0.28)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (
                                            e.currentTarget as HTMLAnchorElement
                                        ).style.transform = '';
                                        (
                                            e.currentTarget as HTMLAnchorElement
                                        ).style.background = PALETTE.ctaBg;
                                        (
                                            e.currentTarget as HTMLAnchorElement
                                        ).style.borderColor = PALETTE.ctaBorder;
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
                        className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-lg sm:h-9 sm:w-9 md:hidden"
                        style={{
                            background: mobileNavOpen
                                ? PALETTE.hoverBg
                                : 'transparent',
                            border: `1px solid ${mobileNavOpen ? 'rgba(255,255,255,0.18)' : 'transparent'}`,
                            color: PALETTE.navTextActive,
                        }}
                        aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileNavOpen}
                    >
                        {mobileNavOpen ? (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile nav overlay – portaled to body so it always displays on top (fixes no-display on Shop, etc.) */}
            {mobileNavOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="fixed inset-0 overflow-auto md:hidden"
                        style={{
                            top: 'calc(env(safe-area-inset-top, 0px) + 56px)',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 9999,
                            background:
                                'linear-gradient(180deg, #031a0c 0%, #052e16 100%)',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            paddingTop: 16,
                            paddingBottom:
                                'max(16px, env(safe-area-inset-bottom))',
                            paddingLeft: 'max(16px, env(safe-area-inset-left))',
                            paddingRight:
                                'max(16px, env(safe-area-inset-right))',
                        }}
                        aria-modal="true"
                        role="dialog"
                        aria-label="Mobile menu"
                    >
                        <nav
                            className="flex w-full max-w-full flex-col px-4 py-4 sm:px-6"
                            aria-label="Mobile navigation"
                        >
                            {NAV_ITEMS.map(
                                ({ id, label, href, icon: Icon }) => {
                                    const isActive = activeId === id;
                                    return (
                                        <Link
                                            key={id}
                                            href={href}
                                            onClick={() =>
                                                setMobileNavOpen(false)
                                            }
                                            className="flex min-h-[48px] touch-manipulation items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
                                            style={{
                                                textDecoration: 'none',
                                                color: isActive
                                                    ? PALETTE.navTextActive
                                                    : PALETTE.navText,
                                                fontWeight: isActive
                                                    ? 600
                                                    : 500,
                                                background: isActive
                                                    ? 'rgba(255,255,255,0.06)'
                                                    : 'transparent',
                                                borderLeft: isActive
                                                    ? `3px solid ${PALETTE.navUnderline}`
                                                    : '3px solid transparent',
                                            }}
                                        >
                                            <Icon
                                                size={20}
                                                strokeWidth={
                                                    isActive ? 2 : 1.75
                                                }
                                                style={{
                                                    flexShrink: 0,
                                                    opacity: isActive ? 1 : 0.9,
                                                }}
                                            />
                                            {label}
                                        </Link>
                                    );
                                },
                            )}
                            {/* Favorites */}
                            <Link
                                href="/favorites"
                                onClick={() => setMobileNavOpen(false)}
                                className="flex min-h-[48px] touch-manipulation items-center justify-between rounded-xl px-4 py-3 text-sm font-medium"
                                style={{
                                    textDecoration: 'none',
                                    color: PALETTE.navText,
                                }}
                            >
                                <span className="flex items-center gap-3">
                                    <Heart className="h-5 w-5" />
                                    Favorites
                                </span>
                                {favoriteCount > 0 && (
                                    <span
                                        style={{
                                            minWidth: 20,
                                            height: 20,
                                            borderRadius: 50,
                                            background: '#ef4444',
                                            color: '#fff',
                                            fontSize: 11,
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0 6px',
                                        }}
                                    >
                                        {favoriteCount > 99
                                            ? '99+'
                                            : favoriteCount}
                                    </span>
                                )}
                            </Link>
                            {/* Cart – same for all; when logged in profile has My Account etc. */}
                            <Link
                                href="/cart"
                                onClick={() => setMobileNavOpen(false)}
                                className="flex min-h-[48px] touch-manipulation items-center justify-between rounded-xl px-4 py-3 text-sm font-medium"
                                style={{
                                    textDecoration: 'none',
                                    color: PALETTE.navText,
                                }}
                            >
                                <span className="flex items-center gap-3">
                                    <svg
                                        width="20"
                                        height="20"
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
                                    Cart
                                </span>
                                {cartCount > 0 && (
                                    <span
                                        style={{
                                            minWidth: 20,
                                            height: 20,
                                            borderRadius: 50,
                                            background: '#ef4444',
                                            color: '#fff',
                                            fontSize: 11,
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0 6px',
                                        }}
                                    >
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>
                            {/* When logged in, profile dropdown in navbar covers My Account / My Purchase / Logout – no duplicate section here */}
                            {!user && (
                                <>
                                    <div
                                        className="mx-1 my-3"
                                        style={{
                                            borderTop:
                                                '1px solid rgba(255,255,255,0.1)',
                                        }}
                                    />
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileNavOpen(false)}
                                        className="flex min-h-[48px] touch-manipulation items-center justify-center rounded-xl px-4 py-3 text-sm font-medium"
                                        style={{
                                            textDecoration: 'none',
                                            color: PALETTE.navTextHover,
                                        }}
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href="/register"
                                            onClick={() =>
                                                setMobileNavOpen(false)
                                            }
                                            className="mt-2 flex min-h-[48px] touch-manipulation items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
                                            style={{
                                                textDecoration: 'none',
                                                background: PALETTE.ctaBg,
                                                border: `1px solid ${PALETTE.ctaBorder}`,
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
                    document.body,
                )}
        </nav>
    );
}
