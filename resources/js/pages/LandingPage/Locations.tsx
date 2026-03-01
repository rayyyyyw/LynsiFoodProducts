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
    const { auth } = page.props as { auth: { user: { name?: string; role?: string } | null } };
    const props = page.props as {
        locations?: LocationsSection;
        canRegister?: boolean;
    };
    const locations = props.locations ?? { items: [] };
    const items = Array.isArray(locations.items) ? locations.items : [];
    const canRegister = props.canRegister !== false;

    useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === 'visible') router.reload({ only: ['locations'] });
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, []);

    return (
        <>
            <div className="flex min-h-screen flex-col bg-[#ecfdf5]">
                <Head title="Our Locations – Lynsi Food Products" />
                <LandingNav activeId="our-locations" auth={auth ?? { user: null }} canRegister={canRegister} />

                <main className="min-h-0 flex-1 px-4 py-10">
                    <div className="mx-auto max-w-6xl">
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            {locations.badge && (
                                <div style={{
                                    display: 'inline-block',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: PALETTE.secondary,
                                    background: PALETTE.light,
                                    padding: '6px 14px',
                                    borderRadius: '50px',
                                    marginBottom: '12px',
                                    letterSpacing: '0.04em',
                                }}>
                                    {locations.badge}
                                </div>
                            )}
                            <h1 style={{
                                fontSize: 'clamp(28px, 4vw, 36px)',
                                fontWeight: 800,
                                color: PALETTE.primary,
                                marginBottom: '12px',
                                letterSpacing: '-0.02em',
                            }}>
                                {locations.title ?? 'Our Locations'}
                            </h1>
                            <p style={{
                                color: PALETTE.muted,
                                maxWidth: '560px',
                                margin: '0 auto',
                                lineHeight: 1.7,
                                fontSize: '15px',
                            }}>
                                {locations.subtitle ?? 'Find a Lynsi store near you.'}
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '24px',
                        }}>
                            {items.map((loc, idx) => (
                                <div
                                    key={loc.name || idx}
                                    style={{
                                        background: PALETTE.white,
                                        border: `1px solid ${PALETTE.border}`,
                                        borderRadius: '16px',
                                        padding: '24px',
                                        position: 'relative',
                                        boxShadow: '0 4px 20px rgba(6,95,70,0.08)',
                                        transition: 'box-shadow 0.2s',
                                    }}
                                    className="hover:shadow-lg"
                                >
                                    {loc.tag && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: PALETTE.secondary,
                                            background: PALETTE.light,
                                            padding: '4px 10px',
                                            borderRadius: '50px',
                                        }}>
                                            {loc.tag}
                                        </span>
                                    )}
                                    {loc.image_url?.trim() ? (
                                        <div style={{
                                            width: '100%',
                                            aspectRatio: '16/10',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            marginBottom: '16px',
                                            background: PALETTE.light,
                                        }}>
                                            <img
                                                src={loc.image_url.trim()}
                                                alt={loc.name || 'Location'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '22px',
                                            marginBottom: '16px',
                                        }}>
                                            📍
                                        </div>
                                    )}
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: PALETTE.primary, marginBottom: '10px' }}>
                                        {loc.name}
                                    </h3>
                                    {loc.address && (
                                        <p style={{ fontSize: '14px', color: PALETTE.primary, lineHeight: 1.6, marginBottom: '8px' }}>
                                            {loc.address}
                                        </p>
                                    )}
                                    {loc.city && (
                                        <p style={{ fontSize: '13px', color: PALETTE.muted, fontWeight: 600, marginBottom: '12px' }}>
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
                                                marginBottom: '6px',
                                            }}
                                        >
                                            {loc.phone}
                                        </a>
                                    )}
                                    {loc.hours && (
                                        <p style={{ fontSize: '13px', color: PALETTE.muted }}>{loc.hours}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {items.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                padding: '48px 24px',
                                background: PALETTE.white,
                                borderRadius: '16px',
                                border: `1px dashed ${PALETTE.border}`,
                                color: PALETTE.muted,
                            }}>
                                No locations added yet. Check back soon or visit our Contact page.
                            </div>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <Link
                                href="/"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 24px',
                                    background: PALETTE.primary,
                                    color: PALETTE.white,
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    fontSize: '14px',
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
