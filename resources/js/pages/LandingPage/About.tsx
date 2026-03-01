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

type AboutUsSection = {
    badge?: string;
    title?: string;
    subtitle?: string;
    paragraph1?: string;
    paragraph2?: string;
    stat1Num?: string;
    stat1Label?: string;
    stat2Num?: string;
    stat2Label?: string;
    stat3Num?: string;
    stat3Label?: string;
    farmToTableTitle?: string;
    farmToTableDesc?: string;
};

export default function About() {
    const page = usePage();
    const { auth } = page.props as { auth: { user: { name?: string; role?: string } | null } };
    const props = page.props as {
        aboutUs?: AboutUsSection;
        canRegister?: boolean;
    };
    const aboutUs = props.aboutUs ?? {};
    const canRegister = props.canRegister !== false;

    useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === 'visible') router.reload({ only: ['aboutUs'] });
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, []);

    return (
        <>
            <div className="flex min-h-screen flex-col" style={{ background: PALETTE.bg }}>
                <Head title="About Us – Lynsi Food Products" />
                <LandingNav activeId="about-us" auth={auth ?? { user: null }} canRegister={canRegister} />

                <main className="min-h-0 flex-1 px-4 py-10">
                    <div className="mx-auto" style={{ maxWidth: '1100px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            {aboutUs.badge && (
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
                                    {aboutUs.badge}
                                </div>
                            )}
                            <h1 style={{
                                fontSize: 'clamp(28px, 4vw, 36px)',
                                fontWeight: 800,
                                color: PALETTE.primary,
                                marginBottom: '12px',
                                letterSpacing: '-0.02em',
                            }}>
                                About <span style={{ background: `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Lynsi Food Products</span>
                            </h1>
                            <p style={{
                                color: PALETTE.muted,
                                maxWidth: '640px',
                                margin: '0 auto',
                                lineHeight: 1.7,
                                fontSize: '15px',
                            }}>
                                {aboutUs.subtitle ?? "We're on a mission to make fresh, organic food accessible to every Filipino family."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:items-center">
                            <div>
                                {aboutUs.paragraph1 && (
                                    <p style={{ color: PALETTE.primary, lineHeight: 1.8, marginBottom: '16px', fontSize: '15px' }}>
                                        {aboutUs.paragraph1}
                                    </p>
                                )}
                                {aboutUs.paragraph2 && (
                                    <p style={{ color: PALETTE.primary, lineHeight: 1.8, marginBottom: '24px', fontSize: '15px' }}>
                                        {aboutUs.paragraph2}
                                    </p>
                                )}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                    {[
                                        { num: aboutUs.stat1Num, label: aboutUs.stat1Label },
                                        { num: aboutUs.stat2Num, label: aboutUs.stat2Label },
                                        { num: aboutUs.stat3Num, label: aboutUs.stat3Label },
                                    ].filter(({ num }) => num).map(({ num, label }) => (
                                        <div key={label}>
                                            <div style={{ fontSize: '22px', fontWeight: 800, color: PALETTE.primary }}>{num}</div>
                                            <div style={{ fontSize: '12px', color: PALETTE.muted, fontWeight: 600 }}>{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{
                                borderRadius: '20px',
                                background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                padding: '40px 24px',
                                textAlign: 'center',
                                border: `1px solid ${PALETTE.border}`,
                            }}>
                                <div style={{ fontSize: '64px', marginBottom: '12px' }}>🌱</div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: PALETTE.primary, marginBottom: '10px' }}>
                                    {aboutUs.farmToTableTitle ?? 'Farm to Table'}
                                </h3>
                                <p style={{ fontSize: '14px', color: PALETTE.muted, lineHeight: 1.7 }}>
                                    {aboutUs.farmToTableDesc ?? 'Every product is traceable to our partner farms. Quality you can trust.'}
                                </p>
                            </div>
                        </div>

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
