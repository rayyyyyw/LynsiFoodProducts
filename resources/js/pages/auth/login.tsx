import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

const LOGO_URL = '/mylogo/logopng%20(1).png';

const P = {
    primary: '#065f46',
    secondary: '#047857',
    accent: '#10b981',
    muted: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    light: '#d1fae5',
    dark: '#022c22',
    white: '#ffffff',
} as const;

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Sign In – Lynsi Food Products">
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
            </Head>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html { -webkit-tap-highlight-color: transparent; }
                body { font-family: 'Inter', sans-serif; background: ${P.bg}; overflow-x: hidden; }

                .lynsi-auth-left { display: none; }
                @media (min-width: 1024px) {
                    .lynsi-auth-left { display: flex; }
                    .lynsi-mobile-logo { display: none !important; }
                }

                .lynsi-field:focus {
                    border-color: ${P.accent} !important;
                    background: #fff !important;
                    box-shadow: 0 0 0 3px rgba(16,185,129,0.15) !important;
                    outline: none !important;
                }
                .lynsi-submit-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(6,95,70,0.4) !important;
                }
                .lynsi-google-btn:hover { filter: brightness(0.97); }
                .lynsi-google-btn:active { transform: scale(0.99); }
                @keyframes lynsi-spin { to { transform: rotate(360deg); } }
            `}</style>

            {/* Outer: row on desktop, column on mobile (left panel hidden on mobile via CSS) */}
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {/* ── LEFT PANEL (desktop only) ─────────────────────────────────── */}
                <div
                    className="lynsi-auth-left"
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '52px 48px',
                        flex: '0 0 44%',
                        background: `linear-gradient(150deg, ${P.dark} 0%, ${P.primary} 55%, ${P.secondary} 100%)`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: -80,
                            right: -80,
                            width: 320,
                            height: 320,
                            borderRadius: '50%',
                            background: 'rgba(16,185,129,0.12)',
                            pointerEvents: 'none',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: -60,
                            left: -60,
                            width: 240,
                            height: 240,
                            borderRadius: '50%',
                            background: 'rgba(16,185,129,0.08)',
                            pointerEvents: 'none',
                        }}
                    />

                    <Link
                        href="/"
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                            textDecoration: 'none',
                        }}
                    >
                        <img
                            src={LOGO_URL}
                            alt=""
                            style={{
                                height: 44,
                                width: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                        <span
                            style={{
                                fontWeight: 800,
                                fontSize: 20,
                                color: P.white,
                            }}
                        >
                            Lynsi
                            <span style={{ color: P.accent }}>
                                FoodProducts
                            </span>
                        </span>
                    </Link>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2
                            style={{
                                fontSize: 36,
                                fontWeight: 900,
                                color: P.white,
                                lineHeight: 1.22,
                                marginBottom: 16,
                                letterSpacing: '-0.5px',
                            }}
                        >
                            Welcome back to
                            <br />
                            <span style={{ color: P.accent }}>
                                fresh, organic living
                            </span>
                        </h2>
                        <p
                            style={{
                                fontSize: 15,
                                color: 'rgba(167,243,208,0.85)',
                                lineHeight: 1.75,
                                marginBottom: 36,
                            }}
                        >
                            Sign in to track your orders, manage your account,
                            and discover 500+ certified organic products
                            delivered to your door.
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14,
                            }}
                        >
                            {[
                                {
                                    icon: '🛒',
                                    label: 'Track your orders in real time',
                                },
                                {
                                    icon: '💚',
                                    label: 'Exclusive member discounts',
                                },
                                {
                                    icon: '🚚',
                                    label: 'Same-day delivery available',
                                },
                                {
                                    icon: '🌱',
                                    label: '100% certified organic products',
                                },
                            ].map(({ icon, label }) => (
                                <div
                                    key={label}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 10,
                                            background: 'rgba(16,185,129,0.18)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 18,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {icon}
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 14,
                                            color: 'rgba(167,243,208,0.9)',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                background: 'rgba(16,185,129,0.15)',
                                border: '1px solid rgba(16,185,129,0.3)',
                                borderRadius: 50,
                                padding: '8px 18px',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 13,
                                    color: P.accent,
                                    fontWeight: 600,
                                }}
                            >
                                🌿 Philippines #1 Organic Platform
                            </span>
                        </div>
                        <p
                            style={{
                                marginTop: 12,
                                fontSize: 12,
                                color: 'rgba(167,243,208,0.5)',
                            }}
                        >
                            Trusted by 50,000+ happy customers
                        </p>
                    </div>
                </div>

                {/* ── RIGHT FORM PANEL ──────────────────────────────────────────── */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding:
                            'max(16px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left))',
                        background: P.bg,
                        minHeight: '100vh',
                    }}
                >
                    {/* Mobile logo */}
                    <div
                        className="lynsi-mobile-logo"
                        style={{ marginBottom: 16 }}
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
                                style={{ height: 36, objectFit: 'contain' }}
                            />
                            <span
                                style={{
                                    fontWeight: 800,
                                    fontSize: 17,
                                    color: P.primary,
                                }}
                            >
                                Lynsi
                                <span style={{ color: P.accent }}>
                                    FoodProducts
                                </span>
                            </span>
                        </Link>
                    </div>

                    {/* Card */}
                    <div
                        style={{
                            width: '100%',
                            maxWidth: 420,
                            background: P.white,
                            borderRadius: 18,
                            padding: '28px 24px',
                            boxShadow: '0 8px 40px rgba(6,95,70,0.12)',
                            border: `1px solid ${P.border}`,
                        }}
                    >
                        <div style={{ marginBottom: 20 }}>
                            <h1
                                style={{
                                    fontSize: 24,
                                    fontWeight: 800,
                                    color: P.primary,
                                    marginBottom: 4,
                                    letterSpacing: '-0.3px',
                                }}
                            >
                                Sign in
                            </h1>
                            <p style={{ fontSize: 14, color: P.muted }}>
                                Enter your email and password to access your
                                account
                            </p>
                        </div>

                        {status && (
                            <div
                                style={{
                                    marginBottom: 16,
                                    padding: '10px 14px',
                                    background: '#dcfce7',
                                    border: '1px solid #86efac',
                                    borderRadius: 10,
                                    fontSize: 13,
                                    color: '#166534',
                                    fontWeight: 500,
                                }}
                            >
                                {status}
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col"
                            style={{ gap: 14 } as React.CSSProperties}
                        >
                            {({
                                processing,
                                errors,
                            }: {
                                processing: boolean;
                                errors: Record<string, string>;
                            }) => (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                    }}
                                >
                                    <div>
                                        <label
                                            htmlFor="email"
                                            style={{
                                                display: 'block',
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: P.primary,
                                                marginBottom: 5,
                                            }}
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            tabIndex={1}
                                            className="lynsi-field"
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                fontSize: 14,
                                                border: `1.5px solid ${errors.email ? '#fca5a5' : P.border}`,
                                                borderRadius: 10,
                                                background: P.bg,
                                                color: P.primary,
                                                transition: 'all 0.2s',
                                                fontFamily:
                                                    "'Inter', sans-serif",
                                            }}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: 5,
                                            }}
                                        >
                                            <label
                                                htmlFor="password"
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: P.primary,
                                                }}
                                            >
                                                Password
                                            </label>
                                            {canResetPassword && (
                                                <Link
                                                    href={request()}
                                                    tabIndex={5}
                                                    style={{
                                                        fontSize: 12,
                                                        color: P.accent,
                                                        textDecoration: 'none',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    Forgot password?
                                                </Link>
                                            )}
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            tabIndex={2}
                                            className="lynsi-field"
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                fontSize: 14,
                                                border: `1.5px solid ${errors.password ? '#fca5a5' : P.border}`,
                                                borderRadius: 10,
                                                background: P.bg,
                                                color: P.primary,
                                                transition: 'all 0.2s',
                                                fontFamily:
                                                    "'Inter', sans-serif",
                                            }}
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <button
                                        type="submit"
                                        tabIndex={4}
                                        disabled={processing}
                                        className="lynsi-submit-btn"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: 15,
                                            fontWeight: 700,
                                            background: `linear-gradient(135deg, ${P.secondary} 0%, ${P.primary} 100%)`,
                                            color: P.white,
                                            border: 'none',
                                            borderRadius: 12,
                                            cursor: processing
                                                ? 'not-allowed'
                                                : 'pointer',
                                            opacity: processing ? 0.8 : 1,
                                            boxShadow:
                                                '0 4px 14px rgba(6,95,70,0.3)',
                                            transition: 'all 0.25s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8,
                                            fontFamily: "'Inter', sans-serif",
                                            minHeight: 44,
                                        }}
                                    >
                                        {processing && (
                                            <span
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    border: '2px solid rgba(255,255,255,0.35)',
                                                    borderTopColor: '#fff',
                                                    borderRadius: '50%',
                                                    display: 'inline-block',
                                                    animation:
                                                        'lynsi-spin 0.8s linear infinite',
                                                }}
                                            />
                                        )}
                                        {processing
                                            ? 'Signing in…'
                                            : 'Sign in to your account'}
                                    </button>

                                    <a
                                        href="/auth/google"
                                        className="lynsi-google-btn"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 10,
                                            width: '100%',
                                            minHeight: 44,
                                            padding: '10px 14px',
                                            borderRadius: 12,
                                            border: '2px solid #e5e7eb',
                                            background: P.white,
                                            color: '#374151',
                                            textDecoration: 'none',
                                            fontSize: 14,
                                            fontWeight: 600,
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            style={{ flexShrink: 0 }}
                                        >
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Login using Google
                                    </a>

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                        }}
                                    >
                                        <div
                                            style={{
                                                flex: 1,
                                                height: 1,
                                                background: P.border,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 12,
                                                color: '#94a3b8',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            New to Lynsi?
                                        </span>
                                        <div
                                            style={{
                                                flex: 1,
                                                height: 1,
                                                background: P.border,
                                            }}
                                        />
                                    </div>

                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            tabIndex={6}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '10px',
                                                textAlign: 'center',
                                                fontSize: 14,
                                                fontWeight: 700,
                                                color: P.primary,
                                                border: `2px solid ${P.border}`,
                                                borderRadius: 12,
                                                textDecoration: 'none',
                                                background: P.bg,
                                                transition: 'all 0.2s',
                                                minHeight: 44,
                                                lineHeight: '24px',
                                            }}
                                            onMouseEnter={(e) => {
                                                (
                                                    e.currentTarget as HTMLAnchorElement
                                                ).style.borderColor = P.accent;
                                                (
                                                    e.currentTarget as HTMLAnchorElement
                                                ).style.background = P.light;
                                            }}
                                            onMouseLeave={(e) => {
                                                (
                                                    e.currentTarget as HTMLAnchorElement
                                                ).style.borderColor = P.border;
                                                (
                                                    e.currentTarget as HTMLAnchorElement
                                                ).style.background = P.bg;
                                            }}
                                        >
                                            Create Your Account Now →
                                        </Link>
                                    )}
                                </div>
                            )}
                        </Form>
                    </div>

                    <Link
                        href="/"
                        style={{
                            marginTop: 16,
                            fontSize: 13,
                            color: '#94a3b8',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                        }}
                    >
                        ← Back to Lynsi Food Products
                    </Link>
                </div>
            </div>
        </>
    );
}
