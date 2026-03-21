import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';

const PALETTE = {
    primary: '#065f46',
    secondary: '#047857',
    accent: '#10b981',
    muted: '#059669',
    light: '#d1fae5',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    dark: '#022c22',
    white: '#ffffff',
} as const;

type LocationItem = {
    name: string;
    address?: string;
    city?: string;
    phone?: string;
    hours?: string;
    tag?: string;
    image_url?: string;
};

type LocationsSection = {
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: LocationItem[];
};

export default function Locations() {
    const page = usePage();
    const { auth } = page.props as {
        auth: { user: { name?: string; role?: string } | null };
    };
    const props = page.props as {
        locations?: LocationsSection;
        canRegister?: boolean;
    };
    const locations = props.locations ?? { items: [] };
    const items = Array.isArray(locations.items) ? locations.items : [];
    const canRegister = props.canRegister !== false;

    useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === 'visible')
                router.reload({ only: ['locations'] });
        };
        document.addEventListener('visibilitychange', onVisible);
        return () =>
            document.removeEventListener('visibilitychange', onVisible);
    }, []);

    return (
        <>
            <div className="flex min-h-screen flex-col bg-[#ecfdf5]">
                <Head title="Our Locations – Lynsi Food Products" />
                <LandingNav
                    activeId="our-locations"
                    auth={auth ?? { user: null }}
                    canRegister={canRegister}
                />

                <main className="min-h-0 flex-1 px-3 py-6 sm:px-4 sm:py-8 md:py-10">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-8 text-center sm:mb-10 md:mb-12">
                            {locations.badge && (
                                <div
                                    style={{
                                        display: 'inline-block',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: PALETTE.secondary,
                                        background: PALETTE.light,
                                        padding: '6px 14px',
                                        borderRadius: '50px',
                                        marginBottom: '12px',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    {locations.badge}
                                </div>
                            )}
                            <h1
                                style={{
                                    fontSize: 'clamp(24px, 5vw, 36px)',
                                    fontWeight: 800,
                                    color: PALETTE.primary,
                                    marginBottom: '12px',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                {locations.title ?? 'Our Locations'}
                            </h1>
                            <p
                                style={{
                                    color: PALETTE.muted,
                                    maxWidth: '560px',
                                    margin: '0 auto',
                                    lineHeight: 1.7,
                                    fontSize: 'clamp(14px, 2vw, 15px)',
                                }}
                            >
                                {locations.subtitle ??
                                    'Find a Lynsi store near you.'}
                            </p>
                        </div>

                        <div
                            className="grid gap-4 sm:gap-6 md:gap-6"
                            style={{
                                gridTemplateColumns:
                                    'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                            }}
                        >
                            {items.map((loc, idx) => (
                                <div
                                    key={loc.name || idx}
                                    className="rounded-2xl hover:shadow-lg"
                                    style={{
                                        background: PALETTE.white,
                                        border: `1px solid ${PALETTE.border}`,
                                        position: 'relative',
                                        padding: '28px 24px',
                                        boxShadow:
                                            '0 4px 20px rgba(6,95,70,0.08)',
                                        transition: 'box-shadow 0.2s',
                                    }}
                                >
                                    {loc.tag && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '20px',
                                                right: '20px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                color: PALETTE.secondary,
                                                background: PALETTE.light,
                                                padding: '5px 12px',
                                                borderRadius: '50px',
                                            }}
                                        >
                                            {loc.tag}
                                        </span>
                                    )}
                                    {loc.image_url?.trim() ? (
                                        <div
                                            style={{
                                                width: '100%',
                                                aspectRatio: '16/10',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                marginBottom: '20px',
                                                background: PALETTE.light,
                                            }}
                                        >
                                            <img
                                                src={loc.image_url.trim()}
                                                alt={loc.name || 'Location'}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '22px',
                                                marginBottom: '20px',
                                            }}
                                        >
                                            📍
                                        </div>
                                    )}
                                    <div style={{ padding: '0 2px' }}>
                                        <h3
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 700,
                                                color: PALETTE.primary,
                                                marginBottom: '12px',
                                                marginTop: 0,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {loc.name}
                                        </h3>
                                        {loc.address && (
                                            <p
                                                style={{
                                                    fontSize: '14px',
                                                    color: PALETTE.primary,
                                                    lineHeight: 1.65,
                                                    marginBottom: '10px',
                                                }}
                                            >
                                                {loc.address}
                                            </p>
                                        )}
                                        {loc.city && (
                                            <p
                                                style={{
                                                    fontSize: '13px',
                                                    color: PALETTE.muted,
                                                    fontWeight: 600,
                                                    marginBottom: '14px',
                                                }}
                                            >
                                                {loc.city}
                                            </p>
                                        )}
                                        {loc.phone && (
                                            <a
                                                href={`tel:${(loc.phone ?? '').replace(/\s/g, '')}`}
                                                style={{
                                                    fontSize: '14px',
                                                    color: PALETTE.accent,
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                    display: 'block',
                                                    marginBottom: '10px',
                                                }}
                                            >
                                                {loc.phone}
                                            </a>
                                        )}
                                        {loc.hours && (
                                            <p
                                                style={{
                                                    fontSize: '13px',
                                                    color: PALETTE.muted,
                                                    marginBottom: 0,
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {loc.hours}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {items.length === 0 && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '48px 24px',
                                    background: PALETTE.white,
                                    borderRadius: '16px',
                                    border: `1px dashed ${PALETTE.border}`,
                                    color: PALETTE.muted,
                                }}
                            >
                                No locations added yet. Check back soon or visit
                                our Contact page.
                            </div>
                        )}

                        <div className="mt-8 text-center sm:mt-10">
                            <Link
                                href="/"
                                className="inline-flex min-h-[44px] touch-manipulation items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold sm:px-6 sm:py-3 sm:text-base"
                                style={{
                                    background: PALETTE.primary,
                                    color: PALETTE.white,
                                    textDecoration: 'none',
                                }}
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
