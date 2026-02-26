import { Link } from '@inertiajs/react';
import { Home, ShoppingBag, MapPin, Info, Mail } from 'lucide-react';

const LOGO_URL = '/mylogo/logopng%20(1).png';

const PALETTE = {
    primary: '#065f46',
    accent: '#10b981',
    muted: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    white: '#ffffff',
} as const;

const NAV_ITEMS: { id: string; label: string; href: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'products', label: 'Products', href: '/shop', icon: ShoppingBag },
    { id: 'our-locations', label: 'Our Locations', href: '/#our-locations', icon: MapPin },
    { id: 'about-us', label: 'About Us', href: '/#about-us', icon: Info },
    { id: 'contact-us', label: 'Contact Us', href: '/#contact-us', icon: Mail },
];

type Props = {
    /** Which nav item is active (e.g. 'products' when on /shop) */
    activeId: string;
    auth: { user: unknown } | null;
    canRegister?: boolean;
};

export function LandingNav({ activeId, auth, canRegister = true }: Props) {
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
                        style={{
                            height: 40,
                            width: 'auto',
                            maxWidth: 140,
                            objectFit: 'contain',
                            display: 'block',
                            flexShrink: 1,
                        }}
                    />
                    <span
                        style={{
                            fontWeight: 800,
                            fontSize: 18,
                            color: PALETTE.primary,
                            letterSpacing: '-0.5px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Lynsi<span style={{ color: PALETTE.accent }}>FoodProducts</span>
                    </span>
                </Link>

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

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {auth?.user ? (
                        <Link
                            href="/dashboard"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '10px 20px',
                                fontSize: 14,
                                fontWeight: 600,
                                minHeight: 44,
                                background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                                color: PALETTE.white,
                                borderRadius: 10,
                                textDecoration: 'none',
                            }}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden md:inline"
                                style={{
                                    color: PALETTE.muted,
                                    fontWeight: 500,
                                    fontSize: 14,
                                    textDecoration: 'none',
                                }}
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href="/register"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '10px 20px',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        minHeight: 44,
                                        background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                                        color: PALETTE.white,
                                        borderRadius: 10,
                                        textDecoration: 'none',
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
