import { Head, Link, router, usePage } from '@inertiajs/react';
import { Send, Mail, Phone, MapPin, Facebook } from 'lucide-react';
import { useEffect, useState } from 'react';
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

type ContactUsSection = {
    badge?: string;
    title?: string;
    subtitle?: string;
    email?: string;
    phone?: string;
    address?: string;
    facebook?: string;
    footerNote?: string;
};

export default function Contact() {
    const page = usePage();
    const { auth, flash } = page.props as {
        auth: { user: { name?: string; email?: string; role?: string } | null };
        flash?: { status?: string };
    };
    const props = page.props as {
        contactUs?: ContactUsSection;
        canRegister?: boolean;
        errors?: Record<string, string>;
    };
    const contactUs = props.contactUs ?? {};
    const canRegister = props.canRegister !== false;
    const status = flash?.status ?? null;
    const errors = props.errors ?? {};

    const [name, setName] = useState(auth?.user?.name ?? '');
    const [email, setEmail] = useState(auth?.user?.email ?? '');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (auth?.user) {
            if (!name) setName(auth.user.name ?? '');
            if (!email) setEmail(auth.user.email ?? '');
        }
    }, [auth?.user, name, email]);

    useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === 'visible') router.reload({ only: ['contactUs'] });
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!auth?.user) {
            router.visit('/login');
            return;
        }
        setSending(true);
        router.post('/contact', { name, email, subject, message }, {
            preserveScroll: true,
            onFinish: () => setSending(false),
            onSuccess: () => {
                setName(auth?.user?.name ?? '');
                setEmail(auth?.user?.email ?? '');
                setSubject('');
                setMessage('');
            },
        });
    }

    const canSubmit = !!auth?.user;

    const getInTouchCardStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px 18px',
        background: PALETTE.white,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: '14px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        minHeight: '44px',
    };

    const iconWrapStyle: React.CSSProperties = {
        width: '48px', height: '48px', borderRadius: '12px',
        background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    };

    return (
        <>
            <div className="flex min-h-screen flex-col" style={{ background: PALETTE.bg }}>
                <Head title="Contact Us – Lynsi Food Products" />
                <LandingNav activeId="contact-us" auth={auth ?? { user: null }} canRegister={canRegister} />

                <main className="min-h-0 flex-1 px-3 py-6 sm:px-4 sm:py-8 md:py-10">
                    <div className="mx-auto max-w-[1100px]">
                        <div className="text-center mb-6 sm:mb-8 md:mb-12">
                            {contactUs.badge && (
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
                                    {contactUs.badge}
                                </div>
                            )}
                            <h1 style={{
                                fontSize: 'clamp(24px, 5vw, 36px)',
                                fontWeight: 800,
                                color: PALETTE.primary,
                                marginBottom: '12px',
                                letterSpacing: '-0.02em',
                            }}>
                                Reach <span style={{ background: `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Us</span> Out
                            </h1>
                            <p style={{
                                color: PALETTE.muted,
                                lineHeight: 1.7,
                                fontSize: '15px',
                                maxWidth: '560px',
                                margin: '0 auto',
                            }}>
                                {contactUs.subtitle ?? "Have questions, feedback, or need support? We'd love to hear from you."}
                            </p>
                        </div>

                        {status && (
                            <div style={{
                                marginBottom: '24px',
                                padding: '16px 20px',
                                background: PALETTE.light,
                                border: `1px solid ${PALETTE.border}`,
                                borderRadius: '12px',
                                color: PALETTE.primary,
                                fontWeight: 500,
                                textAlign: 'center',
                            }}>
                                {status}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-5 lg:items-stretch">
                            {/* Get in touch – same card container as "Send us a message" for alignment */}
                            <div className="lg:col-span-2 flex flex-col">
                                <div className="rounded-2xl p-4 sm:p-5 md:p-[28px_24px] lg:p-[32px_28px] flex-1 flex flex-col" style={{
                                    background: PALETTE.white,
                                    border: `1px solid ${PALETTE.border}`,
                                    boxShadow: '0 4px 24px rgba(6,95,70,0.08)',
                                }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: PALETTE.primary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        Get in touch
                                    </h2>
                                    <div className="space-y-3 sm:space-y-4 flex-1">
                                        {contactUs.email && (
                                            <a
                                                href={`mailto:${contactUs.email}`}
                                                style={getInTouchCardStyle}
                                                className="cursor-pointer"
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.transform = 'scale(1.03)';
                                                    e.currentTarget.style.boxShadow = `0 12px 32px rgba(6,95,70,0.15), 0 0 24px rgba(16,185,129,0.25)`;
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.transform = '';
                                                    e.currentTarget.style.boxShadow = '';
                                                }}
                                            >
                                                <div style={iconWrapStyle}><Mail size={22} style={{ color: PALETTE.primary }} /></div>
                                                <div>
                                                    <div style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, marginBottom: '2px' }}>Email</div>
                                                    <div style={{ fontSize: '15px', fontWeight: 600, color: PALETTE.primary }}>{contactUs.email}</div>
                                                </div>
                                            </a>
                                        )}
                                        {contactUs.phone && (
                                            <a
                                                href={`tel:${(contactUs.phone ?? '').replace(/\s/g, '')}`}
                                                style={getInTouchCardStyle}
                                                className="cursor-pointer"
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.transform = 'scale(1.03)';
                                                    e.currentTarget.style.boxShadow = `0 12px 32px rgba(6,95,70,0.15), 0 0 24px rgba(16,185,129,0.25)`;
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.transform = '';
                                                    e.currentTarget.style.boxShadow = '';
                                                }}
                                            >
                                                <div style={iconWrapStyle}><Phone size={22} style={{ color: PALETTE.primary }} /></div>
                                                <div>
                                                    <div style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, marginBottom: '2px' }}>Phone</div>
                                                    <div style={{ fontSize: '15px', fontWeight: 600, color: PALETTE.primary }}>{contactUs.phone}</div>
                                                </div>
                                            </a>
                                        )}
                                        {contactUs.address && (
                                            <div
                                                style={getInTouchCardStyle}
                                                className="cursor-default"
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.transform = 'scale(1.03)';
                                                    e.currentTarget.style.boxShadow = `0 12px 32px rgba(6,95,70,0.15), 0 0 24px rgba(16,185,129,0.25)`;
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.transform = '';
                                                    e.currentTarget.style.boxShadow = '';
                                                }}
                                            >
                                                <div style={iconWrapStyle}><MapPin size={22} style={{ color: PALETTE.primary }} /></div>
                                                <div>
                                                    <div style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, marginBottom: '2px' }}>Address</div>
                                                    <div style={{ fontSize: '15px', fontWeight: 600, color: PALETTE.primary }}>{contactUs.address}</div>
                                                </div>
                                            </div>
                                        )}
                                        {/* Facebook – always show and clickable; use settings URL or default Lynsi search link */}
                                        {(() => {
                                            const defaultFbUrl = 'https://web.facebook.com/lynsi3579';
                                            const url = contactUs.facebook?.trim() || defaultFbUrl;
                                            const href = url.startsWith('http') ? url : `https://facebook.com/${url.replace(/^\/+|\/+$/g, '')}`;
                                            return (
                                                <a
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={getInTouchCardStyle}
                                                    className="cursor-pointer"
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.transform = 'scale(1.03)';
                                                        e.currentTarget.style.boxShadow = `0 12px 32px rgba(6,95,70,0.15), 0 0 24px rgba(16,185,129,0.25)`;
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.transform = '';
                                                        e.currentTarget.style.boxShadow = '';
                                                    }}
                                                >
                                                    <div style={iconWrapStyle}><Facebook size={22} style={{ color: PALETTE.primary }} /></div>
                                                    <div>
                                                        <div style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, marginBottom: '2px' }}>Facebook</div>
                                                        <div style={{ fontSize: '15px', fontWeight: 600, color: PALETTE.primary }}>Visit our page</div>
                                                    </div>
                                                </a>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Query form (submit requires login) */}
                            <div className="lg:col-span-3">
                                <div className="rounded-2xl p-4 sm:p-5 md:p-[28px_24px] lg:p-[32px_28px]" style={{
                                    background: PALETTE.white,
                                    border: `1px solid ${PALETTE.border}`,
                                    boxShadow: '0 4px 24px rgba(6,95,70,0.08)',
                                }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: PALETTE.primary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Send size={20} /> Send us a message
                                    </h2>
                                    <p style={{ fontSize: '14px', color: PALETTE.muted, marginBottom: '24px', lineHeight: 1.6 }}>
                                        Have a question, feedback, or need help? Fill out the form below and we’ll get back to you within 24 hours.
                                    </p>
                                    {!canSubmit && (
                                        <div style={{
                                            marginBottom: '20px', padding: '14px 18px', background: PALETTE.light,
                                            border: `1px solid ${PALETTE.border}`, borderRadius: '12px',
                                            fontSize: '14px', color: PALETTE.primary,
                                        }}>
                                            You must be signed in to send a message.{' '}
                                            <Link href="/login" style={{ fontWeight: 600, color: PALETTE.accent, textDecoration: 'underline' }}>Sign in</Link>
                                            {canRegister && <> or <Link href="/register" style={{ fontWeight: 600, color: PALETTE.accent, textDecoration: 'underline' }}>create an account</Link></>}.
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="contact-name" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: PALETTE.primary, marginBottom: '6px' }}>
                                                    Name *
                                                </label>
                                                <input
                                                    id="contact-name"
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Your name"
                                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                    style={{ fontSize: '14px' }}
                                                />
                                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="contact-email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: PALETTE.primary, marginBottom: '6px' }}>
                                                    Email *
                                                </label>
                                                <input
                                                    id="contact-email"
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                    style={{ fontSize: '14px' }}
                                                />
                                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="contact-subject" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: PALETTE.primary, marginBottom: '6px' }}>
                                                Subject
                                            </label>
                                            <input
                                                id="contact-subject"
                                                type="text"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                placeholder="e.g. Order support, Product question"
                                                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                style={{ fontSize: '14px' }}
                                            />
                                            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="contact-message" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: PALETTE.primary, marginBottom: '6px' }}>
                                                Message *
                                            </label>
                                            <textarea
                                                id="contact-message"
                                                required
                                                rows={5}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="How can we help?"
                                                className="w-full resize-y rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                style={{ fontSize: '14px', minHeight: '120px' }}
                                            />
                                            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={sending || !canSubmit}
                                            style={{
                                                width: '100%',
                                                padding: '14px 24px',
                                                background: !canSubmit ? PALETTE.border : sending ? PALETTE.muted : `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.primary})`,
                                                color: PALETTE.white,
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontWeight: 700,
                                                fontSize: '15px',
                                                cursor: canSubmit && !sending ? 'pointer' : 'not-allowed',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                opacity: canSubmit ? 1 : 0.8,
                                            }}
                                        >
                                            {sending ? (
                                                <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Sending…</>
                                            ) : !canSubmit ? (
                                                <>Sign in to send message</>
                                            ) : (
                                                <><Send size={18} /> Send message</>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {contactUs.footerNote && (
                            <p style={{ textAlign: 'center', color: PALETTE.muted, lineHeight: 1.7, fontSize: '14px', marginTop: '32px' }}>
                                {contactUs.footerNote}
                            </p>
                        )}

                        <div className="text-center mt-8 sm:mt-10">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 py-3 px-5 sm:py-3 sm:px-6 rounded-xl font-semibold text-sm sm:text-base min-h-[44px] touch-manipulation"
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
