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
    const { auth } = page.props as {
        auth: { user: { name?: string; role?: string } | null };
    };
    const props = page.props as {
        aboutUs?: AboutUsSection;
        canRegister?: boolean;
    };
    const aboutUs = props.aboutUs ?? {};
    const canRegister = props.canRegister !== false;

    useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === 'visible')
                router.reload({ only: ['aboutUs'] });
        };
        document.addEventListener('visibilitychange', onVisible);
        return () =>
            document.removeEventListener('visibilitychange', onVisible);
    }, []);

    return (
        <>
            <div
                className="flex min-h-screen flex-col"
                style={{ background: PALETTE.bg }}
            >
                <Head title="About Us – Lynsi Food Products" />
                <LandingNav
                    activeId="about-us"
                    auth={auth ?? { user: null }}
                    canRegister={canRegister}
                />

                <main className="min-h-0 flex-1 px-3 py-6 sm:px-4 sm:py-8 md:py-10">
                    <div className="mx-auto max-w-[1100px]">
                        <div className="mb-8 text-center sm:mb-10 md:mb-12">
                            {aboutUs.badge && (
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
                                    {aboutUs.badge}
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
                                About{' '}
                                <span
                                    style={{
                                        background: `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.accent})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    Lynsi Food Products
                                </span>
                            </h1>
                            <p
                                style={{
                                    color: PALETTE.muted,
                                    maxWidth: '640px',
                                    margin: '0 auto',
                                    lineHeight: 1.7,
                                    fontSize: '15px',
                                }}
                            >
                                {aboutUs.subtitle ??
                                    "We're on a mission to make fresh, organic food accessible to every Filipino family."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:gap-7 lg:grid-cols-2 lg:items-center">
                            <div className="min-w-0">
                                {aboutUs.paragraph1 && (
                                    <p
                                        style={{
                                            color: PALETTE.primary,
                                            lineHeight: 1.8,
                                            marginBottom: '16px',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {aboutUs.paragraph1}
                                    </p>
                                )}
                                {aboutUs.paragraph2 && (
                                    <p
                                        style={{
                                            color: PALETTE.primary,
                                            lineHeight: 1.8,
                                            marginBottom: '24px',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {aboutUs.paragraph2}
                                    </p>
                                )}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '20px',
                                    }}
                                >
                                    {[
                                        {
                                            num: aboutUs.stat1Num,
                                            label: aboutUs.stat1Label,
                                        },
                                        {
                                            num: aboutUs.stat2Num,
                                            label: aboutUs.stat2Label,
                                        },
                                        {
                                            num: aboutUs.stat3Num,
                                            label: aboutUs.stat3Label,
                                        },
                                    ]
                                        .filter(({ num }) => num)
                                        .map(({ num, label }) => (
                                            <div key={label}>
                                                <div
                                                    style={{
                                                        fontSize: '22px',
                                                        fontWeight: 800,
                                                        color: PALETTE.primary,
                                                    }}
                                                >
                                                    {num}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '12px',
                                                        color: PALETTE.muted,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {label}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div
                                className="rounded-2xl p-6 text-center sm:p-8 md:p-10"
                                style={{
                                    background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                    border: `1px solid ${PALETTE.border}`,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '64px',
                                        marginBottom: '12px',
                                    }}
                                >
                                    🌱
                                </div>
                                <h3
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        color: PALETTE.primary,
                                        marginBottom: '10px',
                                    }}
                                >
                                    {aboutUs.farmToTableTitle ??
                                        'Farm to Table'}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '14px',
                                        color: PALETTE.muted,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {aboutUs.farmToTableDesc ??
                                        'Every product is traceable to our partner farms. Quality you can trust.'}
                                </p>
                            </div>
                        </div>

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
