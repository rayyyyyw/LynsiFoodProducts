import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { login } from '@/routes';
import { store } from '@/routes/register';

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

export default function Register() {
    return (
        <>
            <Head title="Create Account – Lynsi Food Products" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', sans-serif; background: ${P.bg}; }
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
                @keyframes lynsi-spin { to { transform: rotate(360deg); } }
            `}</style>

            <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

                {/* ── LEFT PANEL ───────────────────────────────────────────────── */}
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
                    <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(16,185,129,0.08)', pointerEvents: 'none' }} />

                    {/* Logo */}
                    <Link href="/" style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <img src={LOGO_URL} alt="" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
                        <span style={{ fontWeight: 800, fontSize: 20, color: P.white }}>
                            Lynsi<span style={{ color: P.accent }}>FoodProducts</span>
                        </span>
                    </Link>

                    {/* Hero copy */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: 36, fontWeight: 900, color: P.white, lineHeight: 1.22, marginBottom: 16, letterSpacing: '-0.5px' }}>
                            Join 50,000+<br />
                            <span style={{ color: P.accent }}>happy organic shoppers</span>
                        </h2>
                        <p style={{ fontSize: 15, color: 'rgba(167,243,208,0.85)', lineHeight: 1.75, marginBottom: 36 }}>
                            Create your free buyer account and start enjoying fresh, certified organic products delivered straight to your door.
                        </p>

                        {/* Benefits list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                                { icon: '🌿', label: '500+ certified organic products' },
                                { icon: '🚚', label: 'Same-day delivery to your door' },
                                { icon: '💚', label: 'Exclusive member deals & discounts' },
                                { icon: '🔒', label: '100% satisfaction guarantee' },
                            ].map(({ icon, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(16,185,129,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                                        {icon}
                                    </div>
                                    <span style={{ fontSize: 14, color: 'rgba(167,243,208,0.9)', fontWeight: 500 }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom badge */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 50, padding: '8px 18px' }}>
                            <span style={{ fontSize: 13, color: P.accent, fontWeight: 600 }}>🌿 Philippines #1 Organic Platform</span>
                        </div>
                        <p style={{ marginTop: 12, fontSize: 12, color: 'rgba(167,243,208,0.5)' }}>
                            No credit card required · Free forever
                        </p>
                    </div>
                </div>

                {/* ── RIGHT FORM PANEL ─────────────────────────────────────────── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: P.bg, minHeight: '100vh' }}>

                    {/* Mobile logo */}
                    <div className="lynsi-mobile-logo" style={{ marginBottom: 28 }}>
                        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                            <img src={LOGO_URL} alt="" style={{ height: 40, objectFit: 'contain' }} />
                            <span style={{ fontWeight: 800, fontSize: 18, color: P.primary }}>
                                Lynsi<span style={{ color: P.accent }}>FoodProducts</span>
                            </span>
                        </Link>
                    </div>

                    {/* Card */}
                    <div style={{ width: '100%', maxWidth: 440, background: P.white, borderRadius: 20, padding: '40px 36px', boxShadow: '0 8px 40px rgba(6,95,70,0.12)', border: `1px solid ${P.border}` }}>

                        {/* Header */}
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: P.light, border: `1px solid ${P.border}`, borderRadius: 50, padding: '4px 12px', marginBottom: 14 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: P.primary, letterSpacing: '0.5px', textTransform: 'uppercase' }}>🛍️ Buyer Account</span>
                            </div>
                            <h1 style={{ fontSize: 26, fontWeight: 800, color: P.primary, marginBottom: 6, letterSpacing: '-0.3px' }}>Create your free account</h1>
                            <p style={{ fontSize: 14, color: P.muted }}>Fill in your details below to get started</p>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="flex flex-col"
                        >
                            {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}>

                                    {/* Full name */}
                                    <div>
                                        <label htmlFor="name" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: P.primary, marginBottom: 6 }}>
                                            Full Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            required
                                            autoFocus
                                            autoComplete="name"
                                            placeholder="Juan dela Cruz"
                                            tabIndex={1}
                                            className="lynsi-field"
                                            style={{
                                                width: '100%', padding: '11px 14px', fontSize: 14,
                                                border: `1.5px solid ${errors.name ? '#fca5a5' : P.border}`,
                                                borderRadius: 10, background: P.bg, color: P.primary,
                                                transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
                                            }}
                                        />
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: P.primary, marginBottom: 6 }}>
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            tabIndex={2}
                                            className="lynsi-field"
                                            style={{
                                                width: '100%', padding: '11px 14px', fontSize: 14,
                                                border: `1.5px solid ${errors.email ? '#fca5a5' : P.border}`,
                                                borderRadius: 10, background: P.bg, color: P.primary,
                                                transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
                                            }}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label htmlFor="password" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: P.primary, marginBottom: 6 }}>
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            autoComplete="new-password"
                                            placeholder="Minimum 8 characters"
                                            tabIndex={3}
                                            className="lynsi-field"
                                            style={{
                                                width: '100%', padding: '11px 14px', fontSize: 14,
                                                border: `1.5px solid ${errors.password ? '#fca5a5' : P.border}`,
                                                borderRadius: 10, background: P.bg, color: P.primary,
                                                transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
                                            }}
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Confirm password */}
                                    <div>
                                        <label htmlFor="password_confirmation" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: P.primary, marginBottom: 6 }}>
                                            Confirm Password
                                        </label>
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            required
                                            autoComplete="new-password"
                                            placeholder="Re-enter your password"
                                            tabIndex={4}
                                            className="lynsi-field"
                                            style={{
                                                width: '100%', padding: '11px 14px', fontSize: 14,
                                                border: `1.5px solid ${errors.password_confirmation ? '#fca5a5' : P.border}`,
                                                borderRadius: 10, background: P.bg, color: P.primary,
                                                transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
                                            }}
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    {/* Terms note */}
                                    <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
                                        By creating an account, you agree to our{' '}
                                        <a href="#" style={{ color: P.accent, textDecoration: 'none', fontWeight: 500 }}>Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" style={{ color: P.accent, textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>.
                                    </p>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        tabIndex={5}
                                        disabled={processing}
                                        className="lynsi-submit-btn"
                                        style={{
                                            width: '100%', padding: '13px', fontSize: 15, fontWeight: 700,
                                            background: `linear-gradient(135deg, ${P.secondary} 0%, ${P.primary} 100%)`,
                                            color: P.white, border: 'none', borderRadius: 12,
                                            cursor: processing ? 'not-allowed' : 'pointer',
                                            opacity: processing ? 0.8 : 1,
                                            boxShadow: '0 4px 14px rgba(6,95,70,0.3)',
                                            transition: 'all 0.25s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            fontFamily: "'Inter', sans-serif",
                                        }}
                                    >
                                        {processing && (
                                            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'lynsi-spin 0.8s linear infinite' }} />
                                        )}
                                        {processing ? 'Creating account…' : '🛍️ Create my buyer account'}
                                    </button>

                                    {/* Login link */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ flex: 1, height: 1, background: P.border }} />
                                        <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>Already have an account?</span>
                                        <div style={{ flex: 1, height: 1, background: P.border }} />
                                    </div>

                                    <Link
                                        href={login()}
                                        tabIndex={6}
                                        style={{
                                            display: 'block', width: '100%', padding: '12px', textAlign: 'center',
                                            fontSize: 14, fontWeight: 700, color: P.primary,
                                            border: `2px solid ${P.border}`, borderRadius: 12,
                                            textDecoration: 'none', background: P.bg, transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = P.accent; (e.currentTarget as HTMLAnchorElement).style.background = P.light; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = P.border; (e.currentTarget as HTMLAnchorElement).style.background = P.bg; }}
                                    >
                                        Sign in instead →
                                    </Link>
                                </div>
                            )}
                        </Form>
                    </div>

                    {/* Back to home */}
                    <Link href="/" style={{ marginTop: 24, fontSize: 13, color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        ← Back to Lynsi Food Products
                    </Link>
                </div>
            </div>
        </>
    );
}
