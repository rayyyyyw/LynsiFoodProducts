import { Head, Link, router, usePage } from '@inertiajs/react';
import { Send } from 'lucide-react';
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

    const cardStyle = {
        display: 'flex' as const,
        alignItems: 'center' as const,
        gap: '16px',
        padding: '24px 20px',
        background: PALETTE.white,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: '16px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.25s',
        minHeight: '44px',
    };

    return (
        <>
            <div className="flex min-h-screen flex-col" style={{ background: PALETTE.bg }}>
                <Head title="Contact Us – Lynsi Food Products" />
                <LandingNav activeId="contact-us" auth={auth ?? { user: null }} canRegister={canRegister} />

                <main className="min-h-0 flex-1 px-4 py-10">
                    <div className="mx-auto" style={{ maxWidth: '1100px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
                                fontSize: 'clamp(28px, 4vw, 36px)',
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

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                            {/* Contact info cards */}
                            <div className="lg:col-span-2 space-y-4">
                                <h2 style={{ fontSize: '18px', fontWeight: 700, color: PALETTE.primary, marginBottom: '16px' }}>
                                    Get in touch
                                </h2>
                                {contactUs.email && (
                                    <a href={`mailto:${contactUs.email}`} style={cardStyle} className="hover:shadow-md">
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px',
                                            background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '22px', flexShrink: 0,
                                        }}>✉️</div>
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, marginBottom: '2px' }}>Email</div>
                                            <div style={{ fontSize: '15px', fontWeight: 600, color: PALETTE.primary }}>{contactUs.email}</div>
                                        </div>
                                    </a>
                                )}
                                {contactUs.phone && (
                                    <a href={`tel:${(contactUs.phone ?? '').replace(/\s/g, '')}`} style={cardStyle} className="hover:shadow-md">
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px',
                                            background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '22px', flexShrink: 0,
                                        }}>📞</div>
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, marginBottom: '2px' }}>Phone</div>
                                            <div style={{ fontSize: '15px', fontWeight: 600, color: PALETTE.primary }}>{contactUs.phone}</div>
                                        </div>
                                    </a>
                                )}
                                {contactUs.address && (
                                    <div style={{ ...cardStyle, cursor: 'default' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px',
                                            background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '22px', flexShrink: 0,
                                        }}>📍</div>
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, marginBottom: '2px' }}>Address</div>
                                            <div style={{ fontSize: '15px', fontWeight: 600, color: PALETTE.primary }}>{contactUs.address}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Query form (requires login) */}
                            <div className="lg:col-span-3">
                                <div style={{
                                    background: PALETTE.white,
                                    border: `1px solid ${PALETTE.border}`,
                                    borderRadius: '20px',
                                    padding: '32px 28px',
                                    boxShadow: '0 4px 24px rgba(6,95,70,0.08)',
                                }}>
                                    {auth?.user ? (
                                        <>
                                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: PALETTE.primary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Send size={20} /> Send us a message
                                            </h2>
                                            <p style={{ fontSize: '14px', color: PALETTE.muted, marginBottom: '24px', lineHeight: 1.6 }}>
                                                Have a question, feedback, or need help? Fill out the form below and we’ll get back to you within 24 hours.
                                            </p>
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                            disabled={sending}
                                            style={{
                                                width: '100%',
                                                padding: '14px 24px',
                                                background: sending ? PALETTE.muted : `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.primary})`,
                                                color: PALETTE.white,
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontWeight: 700,
                                                fontSize: '15px',
                                                cursor: sending ? 'wait' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                            }}
                                        >
                                            {sending ? (
                                                <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Sending…</>
                                            ) : (
                                                <><Send size={18} /> Send message</>
                                            )}
                                        </button>
                                    </form>
                                        </>
                                    ) : (
                                        <>
                                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: PALETTE.primary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Send size={20} /> Send us a message
                                            </h2>
                                            <p style={{ fontSize: '14px', color: PALETTE.muted, marginBottom: '20px', lineHeight: 1.6 }}>
                                                You need to be signed in to send a message. Log in to your account or create one to get in touch with us.
                                            </p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <Link
                                                    href="/login"
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                        padding: '14px 24px', background: `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.primary})`,
                                                        color: PALETTE.white, borderRadius: '12px', fontWeight: 700, fontSize: '15px',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    Sign in to your account
                                                </Link>
                                                {canRegister && (
                                                    <Link
                                                        href="/register"
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                            padding: '14px 24px', background: PALETTE.white, color: PALETTE.primary,
                                                            border: `2px solid ${PALETTE.border}`, borderRadius: '12px', fontWeight: 600, fontSize: '15px',
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        Create an account
                                                    </Link>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {contactUs.footerNote && (
                            <p style={{ textAlign: 'center', color: PALETTE.muted, lineHeight: 1.7, fontSize: '14px', marginTop: '32px' }}>
                                {contactUs.footerNote}
                            </p>
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
