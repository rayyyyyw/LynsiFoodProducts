import { Form, Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';

const LOGO_URL = '/mylogo/logopng%20(1).png';

const P = {
    primary:      '#065f46',
    secondary:    '#047857',
    accent:       '#10b981',
    accentHover:  '#059669',
    bg:           '#f0fdf4',
    card:         '#ffffff',
    border:       '#d1fae5',
    borderGray:   '#e5e7eb',
    borderInput:  '#d1d5db',
    light:        '#d1fae5',
    accentBg:     '#ecfdf5',
    white:        '#ffffff',
    text:         '#111827',
    textSub:      '#374151',
    textMuted:    '#6b7280',
    textLight:    '#9ca3af',
    danger:       '#ef4444',
    dangerBg:     '#fef2f2',
    dangerBorder: '#fecaca',
    headerFrom:   '#022c22',
    headerTo:     '#065f46',
} as const;

const PH_PROVINCES = [
    'Abra','Agusan del Norte','Agusan del Sur','Aklan','Albay','Antique','Apayao','Aurora',
    'Basilan','Bataan','Batanes','Batangas','Benguet','Biliran','Bohol','Bukidnon',
    'Bulacan','Cagayan','Camarines Norte','Camarines Sur','Camiguin','Capiz','Catanduanes',
    'Cavite','Cebu','Compostela Valley','Cotabato','Davao del Norte','Davao del Sur',
    'Davao Occidental','Davao Oriental','Dinagat Islands','Eastern Samar','Guimaras',
    'Ifugao','Ilocos Norte','Ilocos Sur','Iloilo','Isabela','Kalinga','La Union','Laguna',
    'Lanao del Norte','Lanao del Sur','Leyte','Maguindanao','Marinduque','Masbate',
    'Metro Manila','Misamis Occidental','Misamis Oriental','Mountain Province','Negros Occidental',
    'Negros Oriental','Northern Samar','Nueva Ecija','Nueva Vizcaya','Occidental Mindoro',
    'Oriental Mindoro','Palawan','Pampanga','Pangasinan','Quezon','Quirino','Rizal',
    'Romblon','Samar','Sarangani','Siquijor','Sorsogon','South Cotabato','Southern Leyte',
    'Sultan Kudarat','Sulu','Surigao del Norte','Surigao del Sur','Tarlac','Tawi-Tawi',
    'Zambales','Zamboanga del Norte','Zamboanga del Sur','Zamboanga Sibugay',
];

type AuthUser = {
    name: string;
    email: string;
    profile_photo_url?: string | null;
    email_verified_at?: string | null;
    role?: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    zip?: string | null;
};

type Tab = 'profile' | 'password' | 'delete';

function getInitials(name: string) {
    return name.trim().split(/\s+/).map(s => s[0]).join('').toUpperCase().slice(0, 2);
}

/* ── Reusable input ──────────────────────────────────────────────────────── */
function Field({
    label, id, name, type = 'text', defaultValue, placeholder,
    disabled, autoComplete, error, hint, required,
}: {
    label: string; id: string; name: string; type?: string;
    defaultValue?: string; placeholder?: string; disabled?: boolean;
    autoComplete?: string; error?: string; hint?: string; required?: boolean;
}) {
    return (
        <div>
            <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: P.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
                {label}
            </label>
            <input
                id={id} name={name} type={type}
                defaultValue={defaultValue} placeholder={placeholder}
                disabled={disabled} autoComplete={autoComplete}
                required={required}
                className="acc-input"
                style={{ borderColor: error ? '#fca5a5' : P.borderInput }}
            />
            {error  && <p style={{ fontSize: 12, color: P.danger,    marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {error}</p>}
            {hint   && !error && <p style={{ fontSize: 12, color: P.textLight, marginTop: 5 }}>{hint}</p>}
        </div>
    );
}

/* ── Green pill badge ────────────────────────────────────────────────────── */
function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: P.accentBg, color: P.primary, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 50, border: `1px solid ${P.border}`, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {children}
        </span>
    );
}

/* ── Green action button ─────────────────────────────────────────────────── */
function ActionBtn({ children, type = 'submit', disabled, onClick, variant = 'primary' }: {
    children: React.ReactNode; type?: 'submit' | 'button'; disabled?: boolean;
    onClick?: () => void; variant?: 'primary' | 'ghost' | 'danger';
}) {
    const styles: Record<string, React.CSSProperties> = {
        primary: { background: `linear-gradient(135deg, ${P.secondary} 0%, ${P.primary} 100%)`, color: P.white, border: 'none', boxShadow: '0 2px 8px rgba(6,95,70,0.25)' },
        ghost:   { background: P.white, color: P.primary, border: `1.5px solid ${P.border}` },
        danger:  { background: P.danger, color: P.white, border: 'none', boxShadow: '0 2px 8px rgba(239,68,68,0.22)' },
    };
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className="acc-btn"
            style={{
                padding: '10px 28px', fontSize: 14, fontWeight: 600, borderRadius: 10,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.65 : 1, transition: 'all 0.2s',
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                ...styles[variant],
            }}
        >
            {children}
        </button>
    );
}

/* ── Spinner ─────────────────────────────────────────────────────────────── */
function Spin() {
    return <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'acc-spin 0.75s linear infinite', flexShrink: 0 }} />;
}

export default function BuyerProfile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage().props as { auth: { user: AuthUser } };
    const user = auth.user;
    const fileRef   = useRef<HTMLInputElement>(null);
    const menuRef   = useRef<HTMLDivElement>(null);
    const [tab,           setTab]           = useState<Tab>('profile');
    const [menuOpen,      setMenuOpen]      = useState(false);
    const [mobileOpen,    setMobileOpen]    = useState(false);
    const [preview,       setPreview]       = useState<string | null>(user.profile_photo_url ?? null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoError,    setPhotoError]    = useState<string | null>(null);

    /* Profile form (name/email + delivery info) */
    const profileForm = useForm({
        name:     user.name,
        email:    user.email,
        phone:    user.phone    ?? '',
        address:  user.address  ?? '',
        city:     user.city     ?? '',
        province: user.province ?? '',
        zip:      user.zip      ?? '',
    });

    /* Auto-upload photo immediately on file select, show instant local preview */
    function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoError(null);

        /* Instant local preview — shown before the server responds */
        const blobUrl = URL.createObjectURL(file);
        setPreview(blobUrl);
        setPhotoUploading(true);

        const fd = new FormData();
        fd.append('name',          profileForm.data.name);
        fd.append('email',         profileForm.data.email);
        fd.append('profile_photo', file);
        fd.append('_method',       'PATCH');

        router.post('/settings/profile', fd, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { setPhotoUploading(false); },
            onError: (errs) => {
                setPreview(user.profile_photo_url ?? null);
                setPhotoUploading(false);
                setPhotoError(errs.profile_photo ?? 'Upload failed. Please try again.');
            },
            onFinish: () => setPhotoUploading(false),
        });

        /* Reset the input so the same file can be re-selected */
        e.target.value = '';
    }

    useEffect(() => {
        const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    /* ── Sidebar ── */
    const NAV = [
        { section: 'My Account', icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        ), tabs: [
            { key: 'profile'  as Tab, label: 'Profile' },
            { key: 'password' as Tab, label: 'Change Password' },
        ]},
    ];

    const sidebar = (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Avatar card */}
            <div style={{ padding: '28px 20px 22px', textAlign: 'center', background: `linear-gradient(160deg, ${P.accentBg} 0%, ${P.white} 100%)`, borderBottom: `1px solid ${P.border}` }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
                    {preview ? (
                        <img src={preview} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${P.white}`, boxShadow: '0 4px 14px rgba(6,95,70,0.18)', opacity: photoUploading ? 0.6 : 1, transition: 'opacity 0.2s' }} />
                    ) : (
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.white, fontSize: 22, fontWeight: 800, border: `3px solid ${P.white}`, boxShadow: '0 4px 14px rgba(6,95,70,0.22)' }}>
                            {getInitials(user.name)}
                        </div>
                    )}
                    {photoUploading && (
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(6,95,70,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'acc-spin 0.75s linear infinite' }} />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => { setTab('profile'); fileRef.current?.click(); }}
                        title="Change photo"
                        style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: P.accent, border: `2px solid ${P.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                    >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    </button>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: P.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: P.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 10 }}>{user.email}</div>
                <Badge>🛍️ Buyer</Badge>
            </div>

            {/* Nav items */}
            <nav style={{ padding: '10px 0' }}>
                {NAV.map(s => (
                    <div key={s.section}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 20px', fontSize: 12, fontWeight: 700, color: P.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            <span style={{ color: P.accent }}>{s.icon}</span>
                            {s.section}
                        </div>
                        {s.tabs.map(t => {
                            const active = tab === t.key;
                            return (
                                <button key={t.key} type="button"
                                    onClick={() => { setTab(t.key); setMobileOpen(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        width: '100%', padding: '10px 20px 10px 36px',
                                        background: active ? P.accentBg : 'none',
                                        border: 'none',
                                        borderLeft: active ? `3px solid ${P.accent}` : '3px solid transparent',
                                        color: active ? P.primary : P.textMuted,
                                        fontSize: 14, fontWeight: active ? 600 : 400,
                                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                    onMouseEnter={e => { if (!active) { const b = e.currentTarget as HTMLButtonElement; b.style.background = P.accentBg; b.style.color = P.primary; } }}
                                    onMouseLeave={e => { if (!active) { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'none'; b.style.color = P.textMuted; } }}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                ))}

                <div style={{ height: 1, background: P.borderGray, margin: '8px 16px' }} />

                <Link href="/my-purchases"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', textDecoration: 'none', color: P.textMuted, fontSize: 14, fontWeight: 400, transition: 'all 0.15s' }}
                    onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = P.primary; a.style.background = P.accentBg; }}
                    onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = P.textMuted; a.style.background = 'none'; }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: P.accent, flexShrink: 0 }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.94-1.51L23 6H6"/></svg>
                    My Purchase
                </Link>
            </nav>
        </div>
    );

    return (
        <>
            <Head title="My Account – Lynsi Food Products" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', sans-serif; background: ${P.bg}; }

                .acc-input {
                    display: block; width: 100%;
                    padding: 11px 14px; font-size: 14px; line-height: 1.5;
                    border: 1.5px solid; border-radius: 10px;
                    background: ${P.white}; color: ${P.text};
                    transition: border-color 0.18s, box-shadow 0.18s;
                    font-family: 'Inter', sans-serif;
                    -webkit-appearance: none;
                }
                .acc-input:focus {
                    outline: none;
                    border-color: ${P.accent} !important;
                    box-shadow: 0 0 0 3.5px rgba(16,185,129,0.14);
                }
                .acc-input:disabled {
                    background: #f9fafb; color: ${P.textMuted};
                    cursor: not-allowed; border-color: ${P.borderGray} !important;
                }
                .acc-select {
                    display: block; width: 100%;
                    padding: 11px 14px; font-size: 14px; line-height: 1.5;
                    border: 1.5px solid ${P.borderInput}; border-radius: 10px;
                    background: ${P.white}; color: ${P.text};
                    transition: border-color 0.18s, box-shadow 0.18s;
                    font-family: 'Inter', sans-serif; cursor: pointer;
                    -webkit-appearance: none; appearance: none;
                }
                .acc-select:focus {
                    outline: none;
                    border-color: ${P.accent} !important;
                    box-shadow: 0 0 0 3.5px rgba(16,185,129,0.14);
                }
                .acc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .acc-grid-3 { display: grid; grid-template-columns: 1fr 1fr 110px; gap: 16px; }
                @media (max-width: 600px) {
                    .acc-grid-2 { grid-template-columns: 1fr; }
                    .acc-grid-3 { grid-template-columns: 1fr; }
                }
                .acc-btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.06); }
                .acc-btn:active:not(:disabled) { transform: none; filter: brightness(0.96); }
                .acc-sidebar { display: none; }
                @media (min-width: 768px) {
                    .acc-sidebar { display: block; }
                    .acc-fab { display: none !important; }
                }
                .acc-mobile-drawer { position: fixed; inset: 0; z-index: 999; background: rgba(0,0,0,0.35); display: flex; backdrop-filter: blur(2px); }
                @media (min-width: 768px) { .acc-mobile-drawer { display: none !important; } }
                @keyframes acc-spin { to { transform: rotate(360deg); } }
                @keyframes acc-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
                .acc-panel { animation: acc-fade-in 0.22s ease; }
            `}</style>

            <div style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

                {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
                <header style={{
                    position: 'sticky', top: 0, zIndex: 100,
                    background: `linear-gradient(135deg, ${P.headerFrom} 0%, ${P.headerTo} 100%)`,
                    boxShadow: '0 2px 12px rgba(2,44,34,0.3)',
                }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 58, gap: 12 }}>
                        {/* Brand */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                                <img src={LOGO_URL} alt="" style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
                                <span style={{ fontWeight: 800, fontSize: 15, color: P.white, letterSpacing: '-0.3px' }}>
                                    Lynsi<span style={{ color: '#6ee7b7' }}>FoodProducts</span>
                                </span>
                            </Link>
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>|</span>
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>My Account</span>
                        </div>

                        {/* Right actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'background 0.15s', border: '1px solid rgba(255,255,255,0.1)' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.94-1.51L23 6H6"/></svg>
                                Shop
                            </Link>

                            {/* User pill dropdown */}
                            <div ref={menuRef} style={{ position: 'relative' }}>
                                <button type="button" onClick={() => setMenuOpen(!menuOpen)}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 50, cursor: 'pointer', transition: 'background 0.15s', maxWidth: 200, fontFamily: "'Inter', sans-serif" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
                                >
                                    {preview
                                        ? <img src={preview} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                        : <div style={{ width: 28, height: 28, borderRadius: '50%', background: P.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.white, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{getInitials(user.name)}</div>
                                    }
                                    <span style={{ fontSize: 13, fontWeight: 600, color: P.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 }}>{user.name}</span>
                                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ color: 'rgba(255,255,255,0.5)', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
                                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>

                                {menuOpen && (
                                    <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, minWidth: 210, background: P.white, border: `1px solid ${P.borderGray}`, borderRadius: 14, boxShadow: '0 12px 36px rgba(0,0,0,0.14)', padding: 6, zIndex: 200, animation: 'acc-fade-in 0.16s ease' }}>
                                        <div style={{ padding: '12px 14px 13px', borderBottom: `1px solid ${P.borderGray}`, marginBottom: 4 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: P.text, wordBreak: 'break-word', lineHeight: 1.3 }}>{user.name}</div>
                                            <div style={{ fontSize: 12, color: P.textMuted, marginTop: 3, wordBreak: 'break-all' }}>{user.email}</div>
                                        </div>
                                        {[
                                            { icon: '👤', label: 'My Account',  href: '/account' },
                                            { icon: '🛒', label: 'My Purchase', href: '/my-purchases' },
                                        ].map(item => (
                                            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, textDecoration: 'none', color: P.textSub, fontSize: 13, fontWeight: 500, transition: 'background 0.12s' }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = P.accentBg; (e.currentTarget as HTMLAnchorElement).style.color = P.primary; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = P.textSub; }}
                                            >
                                                <span>{item.icon}</span>{item.label}
                                            </Link>
                                        ))}
                                        <div style={{ height: 1, background: P.borderGray, margin: '4px 2px' }} />
                                        <button type="button" onClick={() => { setMenuOpen(false); router.post('/logout'); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: P.danger, fontSize: 13, fontWeight: 500, fontFamily: "'Inter', sans-serif", textAlign: 'left', transition: 'background 0.12s' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = P.dangerBg; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                        >
                                            <span>🚪</span> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── BODY ───────────────────────────────────────────────────────── */}
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

                    {/* FAB for mobile */}
                    <button type="button" className="acc-fab" onClick={() => setMobileOpen(true)}
                        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 90, width: 50, height: 50, borderRadius: '50%', background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`, color: P.white, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(6,95,70,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>

                    {/* Mobile drawer */}
                    {mobileOpen && (
                        <div className="acc-mobile-drawer" onClick={() => setMobileOpen(false)}>
                            <div onClick={e => e.stopPropagation()} style={{ width: 270, background: P.white, overflowY: 'auto', boxShadow: '6px 0 24px rgba(0,0,0,0.12)' }}>
                                {sidebar}
                            </div>
                        </div>
                    )}

                    {/* ── SIDEBAR ────────────────────────────────────────────────── */}
                    <aside className="acc-sidebar" style={{ width: 230, flexShrink: 0, position: 'sticky', top: 82, background: P.white, borderRadius: 16, border: `1px solid ${P.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(6,95,70,0.07)' }}>
                        {sidebar}
                    </aside>

                    {/* ── MAIN PANEL ─────────────────────────────────────────────── */}
                    <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Success banner */}
                        {status === 'profile-updated' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', background: P.accentBg, border: `1px solid ${P.border}`, borderRadius: 12, fontSize: 13, color: P.primary, fontWeight: 500 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={P.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                Profile updated successfully.
                            </div>
                        )}

                        {/* ── PROFILE PANEL ────────────────────────────────────── */}
                        {tab === 'profile' && (
                            <div className="acc-panel" style={{ background: P.white, borderRadius: 16, border: `1px solid ${P.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(6,95,70,0.07)' }}>
                                {/* Panel header */}
                                <div style={{ padding: '22px 28px', borderBottom: `1px solid ${P.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `linear-gradient(90deg, ${P.accentBg} 0%, ${P.white} 100%)` }}>
                                    <div>
                                        <h1 style={{ fontSize: 20, fontWeight: 800, color: P.text, letterSpacing: '-0.3px', margin: 0 }}>My Profile</h1>
                                        <p style={{ fontSize: 13, color: P.textMuted, marginTop: 3 }}>Manage and protect your account</p>
                                    </div>
                                    <Badge>✔ Active</Badge>
                                </div>

                                <div style={{ padding: '32px 28px' }}>
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            profileForm.patch('/settings/profile', { preserveScroll: true });
                                        }}
                                    >
                                        {/* Two-column: form left, avatar right */}
                                        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>

                                            {/* Form fields */}
                                            <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                                {/* Name */}
                                                <div>
                                                    <label htmlFor="name" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: P.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>Full Name</label>
                                                    <input
                                                        id="name" type="text" autoComplete="name" required
                                                        className="acc-input"
                                                        style={{ borderColor: profileForm.errors.name ? '#fca5a5' : P.borderInput }}
                                                        value={profileForm.data.name}
                                                        onChange={e => profileForm.setData('name', e.target.value)}
                                                    />
                                                    {profileForm.errors.name && <p style={{ fontSize: 12, color: P.danger, marginTop: 5 }}>⚠ {profileForm.errors.name}</p>}
                                                </div>

                                                {/* Email (read-only display) */}
                                                <div>
                                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: P.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>Email Address</label>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', border: `1.5px solid ${P.borderGray}`, borderRadius: 10, background: '#f9fafb', color: P.textMuted, fontSize: 14 }}>
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: P.textLight }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                                        {user.email.replace(/(.{2})(.*)(@.*)/, (_m, a, b, c) => a + b.replace(/./g, '•') + c)}
                                                    </div>
                                                    <p style={{ fontSize: 11, color: P.textLight, marginTop: 5 }}>Email address cannot be changed</p>
                                                    {mustVerifyEmail && user.email_verified_at === null && (
                                                        <p style={{ fontSize: 12, color: '#d97706', marginTop: 5 }}>
                                                            ⚠ Not verified —{' '}
                                                            <a href="/email/verification-notification" style={{ color: P.accent, textDecoration: 'underline', fontWeight: 600 }}>Resend link</a>
                                                        </p>
                                                    )}
                                                </div>

                                                {/* ── Delivery Information ── */}
                                                <div style={{ borderTop: `1px solid ${P.borderGray}`, paddingTop: 22, marginTop: 4 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={P.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                                        <span style={{ fontSize: 12, fontWeight: 700, color: P.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Delivery Information</span>
                                                        <span style={{ fontSize: 11, color: P.textLight, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— used to pre-fill checkout</span>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                                        {/* Phone */}
                                                        <div>
                                                            <label htmlFor="phone" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: P.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>Phone Number</label>
                                                            <input
                                                                id="phone" type="tel" placeholder="09XXXXXXXXX"
                                                                className="acc-input"
                                                                style={{ borderColor: profileForm.errors.phone ? '#fca5a5' : P.borderInput }}
                                                                value={profileForm.data.phone}
                                                                onChange={e => profileForm.setData('phone', e.target.value)}
                                                            />
                                                            {profileForm.errors.phone && <p style={{ fontSize: 12, color: P.danger, marginTop: 5 }}>⚠ {profileForm.errors.phone}</p>}
                                                        </div>

                                                        {/* Street address */}
                                                        <div>
                                                            <label htmlFor="address" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: P.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>Street Address</label>
                                                            <input
                                                                id="address" type="text" placeholder="House/Unit no., Street, Barangay"
                                                                className="acc-input"
                                                                style={{ borderColor: profileForm.errors.address ? '#fca5a5' : P.borderInput }}
                                                                value={profileForm.data.address}
                                                                onChange={e => profileForm.setData('address', e.target.value)}
                                                            />
                                                            {profileForm.errors.address && <p style={{ fontSize: 12, color: P.danger, marginTop: 5 }}>⚠ {profileForm.errors.address}</p>}
                                                        </div>

                                                        {/* City + Province + ZIP */}
                                                        <div className="acc-grid-3">
                                                            <div>
                                                                <label htmlFor="city" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: P.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>City / Municipality</label>
                                                                <input
                                                                    id="city" type="text" placeholder="City or municipality"
                                                                    className="acc-input"
                                                                    style={{ borderColor: profileForm.errors.city ? '#fca5a5' : P.borderInput }}
                                                                    value={profileForm.data.city}
                                                                    onChange={e => profileForm.setData('city', e.target.value)}
                                                                />
                                                                {profileForm.errors.city && <p style={{ fontSize: 12, color: P.danger, marginTop: 5 }}>⚠ {profileForm.errors.city}</p>}
                                                            </div>

                                                            <div>
                                                                <label htmlFor="province" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: P.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>Province</label>
                                                                <div style={{ position: 'relative' }}>
                                                                    <select
                                                                        id="province"
                                                                        className="acc-select"
                                                                        style={{ borderColor: profileForm.errors.province ? '#fca5a5' : P.borderInput, paddingRight: 36 }}
                                                                        value={profileForm.data.province}
                                                                        onChange={e => profileForm.setData('province', e.target.value)}
                                                                    >
                                                                        <option value="">Select…</option>
                                                                        {PH_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                                                    </select>
                                                                    <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: P.textLight }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                                                </div>
                                                                {profileForm.errors.province && <p style={{ fontSize: 12, color: P.danger, marginTop: 5 }}>⚠ {profileForm.errors.province}</p>}
                                                            </div>

                                                            <div>
                                                                <label htmlFor="zip" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: P.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>ZIP Code</label>
                                                                <input
                                                                    id="zip" type="text" placeholder="4000"
                                                                    className="acc-input"
                                                                    style={{ borderColor: profileForm.errors.zip ? '#fca5a5' : P.borderInput }}
                                                                    value={profileForm.data.zip}
                                                                    onChange={e => profileForm.setData('zip', e.target.value)}
                                                                />
                                                                {profileForm.errors.zip && <p style={{ fontSize: 12, color: P.danger, marginTop: 5 }}>⚠ {profileForm.errors.zip}</p>}
                                                            </div>
                                                        </div>

                                                        {/* Completeness hint */}
                                                        {(!profileForm.data.phone || !profileForm.data.address || !profileForm.data.city || !profileForm.data.province) && (
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10 }}>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                                                <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
                                                                    Fill in your delivery details to speed up checkout — they'll be pre-filled automatically.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{ paddingTop: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <ActionBtn type="submit" disabled={profileForm.processing}>
                                                        {profileForm.processing ? <><Spin /> Saving…</> : <>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                            Save Changes
                                                        </>}
                                                    </ActionBtn>
                                                    {profileForm.recentlySuccessful && (
                                                        <span style={{ fontSize: 13, color: P.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                            Saved!
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ── Avatar upload ── */}
                                            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                                                {/* Hidden file input */}
                                                <input
                                                    ref={fileRef}
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                                    style={{ display: 'none' }}
                                                    onChange={handlePhotoSelect}
                                                />

                                                {/* Clickable avatar circle */}
                                                <div
                                                    onClick={() => fileRef.current?.click()}
                                                    title="Click to change photo"
                                                    style={{ position: 'relative', width: 110, height: 110, cursor: 'pointer' }}
                                                >
                                                    {preview ? (
                                                        <img
                                                            src={preview}
                                                            alt="Profile"
                                                            style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${P.border}`, boxShadow: '0 4px 16px rgba(6,95,70,0.15)', display: 'block', opacity: photoUploading ? 0.5 : 1, transition: 'opacity 0.2s' }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: 110, height: 110, borderRadius: '50%', background: `linear-gradient(135deg, ${P.accentBg}, #e0f2fe)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${P.border}`, boxShadow: '0 2px 8px rgba(6,95,70,0.08)' }}>
                                                            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={P.border} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                                        </div>
                                                    )}

                                                    {/* Upload spinner overlay */}
                                                    {photoUploading && (
                                                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(6,95,70,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <span style={{ width: 26, height: 26, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'acc-spin 0.75s linear infinite' }} />
                                                        </div>
                                                    )}

                                                    {/* Hover overlay (shown via CSS) */}
                                                    {!photoUploading && (
                                                        <div className="acc-avatar-overlay" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(6,95,70,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                                        </div>
                                                    )}
                                                </div>

                                                <ActionBtn type="button" variant="ghost" disabled={photoUploading} onClick={() => fileRef.current?.click()}>
                                                    {photoUploading ? <><Spin /> Uploading…</> : <>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                                        Select Image
                                                    </>}
                                                </ActionBtn>

                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{ fontSize: 11, color: P.textLight, lineHeight: 1.7 }}>Max size: 2 MB<br />JPEG · PNG · GIF · WEBP</p>
                                                </div>

                                                {photoError && (
                                                    <p style={{ fontSize: 12, color: P.danger, textAlign: 'center', maxWidth: 130 }}>⚠ {photoError}</p>
                                                )}
                                            </div>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* ── PASSWORD PANEL ───────────────────────────────────── */}
                        {tab === 'password' && (
                            <div className="acc-panel" style={{ background: P.white, borderRadius: 16, border: `1px solid ${P.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(6,95,70,0.07)' }}>
                                <div style={{ padding: '22px 28px', borderBottom: `1px solid ${P.border}`, background: `linear-gradient(90deg, ${P.accentBg} 0%, ${P.white} 100%)` }}>
                                    <h1 style={{ fontSize: 20, fontWeight: 800, color: P.text, letterSpacing: '-0.3px', margin: 0 }}>Change Password</h1>
                                    <p style={{ fontSize: 13, color: P.textMuted, marginTop: 3 }}>For your account's security, do not share your password with anyone</p>
                                </div>
                                <div style={{ padding: '32px 28px' }}>
                                    <Form
                                        {...PasswordController.update.form()}
                                        options={{ preserveScroll: true }}
                                        resetOnError={['password', 'password_confirmation', 'current_password']}
                                        resetOnSuccess
                                    >
                                        {({ processing, errors, recentlySuccessful }: { processing: boolean; errors: Record<string, string>; recentlySuccessful: boolean }) => (
                                            <div style={{ maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                                <Field id="current_password" name="current_password" label="Current Password" type="password" autoComplete="current-password" placeholder="Enter your current password" error={errors.current_password} />
                                                <Field id="password" name="password" label="New Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" error={errors.password} />
                                                <Field id="password_confirmation" name="password_confirmation" label="Confirm New Password" type="password" autoComplete="new-password" placeholder="Re-enter new password" error={errors.password_confirmation} />

                                                <div style={{ paddingTop: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <ActionBtn type="submit" disabled={processing}>
                                                        {processing ? <><Spin /> Updating…</> : <>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                                                            Update Password
                                                        </>}
                                                    </ActionBtn>
                                                    {recentlySuccessful && (
                                                        <span style={{ fontSize: 13, color: P.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                            Updated!
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        )}

                        {/* ── DELETE PANEL ─────────────────────────────────────── */}
                        {tab === 'delete' && (
                            <div className="acc-panel" style={{ background: P.white, borderRadius: 16, border: `1px solid ${P.dangerBorder}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(239,68,68,0.07)' }}>
                                <div style={{ padding: '22px 28px', borderBottom: `1px solid ${P.dangerBorder}`, background: P.dangerBg }}>
                                    <h1 style={{ fontSize: 20, fontWeight: 800, color: '#991b1b', margin: 0 }}>Delete Account</h1>
                                    <p style={{ fontSize: 13, color: '#b91c1c', marginTop: 3 }}>Permanent and irreversible action</p>
                                </div>
                                <div style={{ padding: '32px 28px' }}>
                                    <div style={{ maxWidth: 480, padding: '20px', background: P.dangerBg, borderRadius: 12, border: `1px solid ${P.dangerBorder}`, marginBottom: 24 }}>
                                        <p style={{ fontSize: 14, color: '#7f1d1d', lineHeight: 1.75 }}>
                                            Once deleted, all your data — orders, saved addresses, and profile information — will be <strong>permanently removed</strong> and cannot be recovered.
                                        </p>
                                    </div>
                                    <ActionBtn type="button" variant="danger" onClick={() => {
                                        if (window.confirm('Are you absolutely sure? This permanently deletes your account.')) {
                                            router.delete('/settings/profile');
                                        }
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                        Delete My Account
                                    </ActionBtn>
                                </div>
                            </div>
                        )}

                        {/* Delete nudge (shown on profile & password tabs) */}
                        {tab !== 'delete' && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: P.white, borderRadius: 12, border: `1px solid ${P.borderGray}`, flexWrap: 'wrap', gap: 10 }}>
                                <p style={{ fontSize: 13, color: P.textMuted }}>Want to remove your account?</p>
                                <button type="button" onClick={() => setTab('delete')}
                                    style={{ fontSize: 13, color: P.danger, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Inter', sans-serif", padding: '4px 10px', borderRadius: 6, transition: 'background 0.15s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = P.dangerBg; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                                    Delete Account
                                </button>
                            </div>
                        )}

                    </main>
                </div>
            </div>
            <style>{`
                label:hover .acc-avatar-overlay { opacity: 1 !important; }
            `}</style>
        </>
    );
}
