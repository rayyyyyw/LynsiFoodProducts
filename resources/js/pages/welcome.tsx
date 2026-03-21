import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';

// ─── Palette ────────────────────────────────────────────────────────────────
const P = {
    forest: '#031a0c',
    deep: '#052e16',
    emerald: '#065f46',
    jade: '#047857',
    mint: '#10b981',
    sage: '#34d399',
    foam: '#d1fae5',
    mist: '#f0fdf4',
    white: '#ffffff',
    glassLight: 'rgba(255,255,255,0.72)',
    glassDark: 'rgba(3,26,12,0.55)',
    glassStroke: 'rgba(255,255,255,0.18)',
    glassStrokeDark: 'rgba(52,211,153,0.18)',
    textDark: '#031a0c',
    textMuted: '#047857',
    onDark: '#d1fae5',
    onDarkMuted: '#6ee7b7',
} as const;

const LOGO_URL = '/mylogo/logopng%20(1).png';

const LOCATIONS = [
    {
        name: 'Lynsi Manila Hub',
        address: '123 Organic Way, Bonifacio Global City',
        city: 'Metro Manila',
        phone: '+63 2 8123 4567',
        hours: 'Mon–Sat 7AM–8PM',
        tag: 'Headquarters',
        image_url: '',
    },
    {
        name: 'Lynsi Cebu Store',
        address: '456 Fresh Farm Road, Cebu Business Park',
        city: 'Cebu City',
        phone: '+63 32 412 3456',
        hours: 'Mon–Sat 8AM–7PM',
        tag: 'Pick-up & Delivery',
        image_url: '',
    },
    {
        name: 'Lynsi Davao Branch',
        address: '789 Eco Street, Lanang',
        city: 'Davao City',
        phone: '+63 82 221 5678',
        hours: 'Mon–Sat 7AM–7PM',
        tag: 'Full Service',
        image_url: '',
    },
];

const PRODUCTS = [
    {
        name: 'Organic Hass Avocados',
        price: '₱350',
        unit: '/kg',
        category: 'Fresh Fruits',
        icon: '🥑',
        badge: 'Bestseller',
        color: '#bbf7d0',
    },
    {
        name: 'Farm-Fresh Tomatoes',
        price: '₱120',
        unit: '/kg',
        category: 'Vegetables',
        icon: '🍅',
        badge: 'Harvested Today',
        color: '#fecaca',
    },
    {
        name: 'Free-Range Brown Eggs',
        price: '₱240',
        unit: '/doz',
        category: 'Dairy & Eggs',
        icon: '🥚',
        badge: 'Organic',
        color: '#fef3c7',
    },
    {
        name: 'Artisan Sourdough',
        price: '₱180',
        unit: '/loaf',
        category: 'Bakery',
        icon: '🥖',
        badge: 'Fresh Baked',
        color: '#fed7aa',
    },
];

const PARTNERS = [
    'FreshMart',
    'GreenLeaf Co.',
    'NaturaBite',
    'OrganicHub',
    'EcoFarm',
    'PureGrown',
    'HarvestPlus',
    'VerdeFoods',
];

const BENEFITS = [
    {
        icon: '🍃',
        title: '100% Organic',
        desc: 'Every product is certified organic — no pesticides, no additives, just pure goodness from farm to table.',
    },
    {
        icon: '🚚',
        title: 'Same-Day Delivery',
        desc: 'Order before noon and get your fresh produce delivered to your door the very same day.',
    },
    {
        icon: '🌱',
        title: 'Sustainably Sourced',
        desc: 'We partner directly with local eco-farms to reduce food miles and support sustainable agriculture.',
    },
    {
        icon: '💚',
        title: 'Health-First Selection',
        desc: 'Every product is hand-picked by nutritionists to ensure maximum health benefits for your family.',
    },
    {
        icon: '♻️',
        title: 'Zero-Waste Packaging',
        desc: 'All packaging is 100% compostable or recyclable — because we care about the planet as much as you do.',
    },
    {
        icon: '🔒',
        title: 'Quality Guarantee',
        desc: 'Not satisfied? We offer a full refund, no questions asked. Your satisfaction is our promise.',
    },
];

const STEPS = [
    {
        step: '01',
        title: 'Choose Your Products',
        desc: 'Browse our curated selection of over 500 fresh, organic food products sourced from certified local farms.',
    },
    {
        step: '02',
        title: 'We Pack & Prepare',
        desc: 'Our team carefully handpicks, inspects, and packs your order in eco-friendly, temperature-controlled packaging.',
    },
    {
        step: '03',
        title: 'Delivered Fresh to You',
        desc: 'Receive your fresh order right at your doorstep within hours — guaranteed fresh or your money back.',
    },
];

const TESTIMONIALS = [
    {
        name: 'Maria Santos',
        role: 'Home Chef, Manila',
        avatar: '👩‍🍳',
        stars: 5,
        text: 'Lynsi Food Products has completely transformed how I cook. The freshness is unbeatable and I love knowing exactly where my food comes from. Highly recommend!',
    },
    {
        name: 'Carlos Reyes',
        role: 'Fitness Coach, Cebu',
        avatar: '🏋️',
        stars: 5,
        text: 'As a fitness coach, I recommend Lynsi to all my clients. The organic quality is top-notch and my clients have seen real improvements in their energy levels.',
    },
    {
        name: 'Ana Lim',
        role: 'Mother of 3, Davao',
        avatar: '👩‍👧',
        stars: 5,
        text: 'I feel so much better knowing my kids are eating clean food. The same-day delivery is a game changer for our busy family schedule. We love Lynsi!',
    },
];

function mergeWithDefaults(
    incoming: ReturnType<typeof getDefaultLandingContent> | null | undefined,
): ReturnType<typeof getDefaultLandingContent> {
    const d = getDefaultLandingContent();
    if (!incoming || typeof incoming !== 'object') return d;
    return {
        hero: { ...d.hero, ...incoming.hero },
        products: {
            ...d.products,
            ...incoming.products,
            items: incoming.products?.items ?? d.products?.items,
        },
        benefits: {
            ...d.benefits,
            ...incoming.benefits,
            items: incoming.benefits?.items ?? d.benefits?.items,
        },
        howItWorks: {
            ...d.howItWorks,
            ...incoming.howItWorks,
            steps: incoming.howItWorks?.steps ?? d.howItWorks?.steps,
        },
        locations: {
            ...d.locations,
            ...incoming.locations,
            items: incoming.locations?.items ?? d.locations?.items,
        },
        aboutUs: { ...d.aboutUs, ...incoming.aboutUs },
        contactUs: { ...d.contactUs, ...incoming.contactUs },
        partners: {
            ...d.partners,
            ...incoming.partners,
            title: incoming.partners?.title ?? d.partners?.title,
            items: Array.isArray(incoming.partners?.items)
                ? incoming.partners.items
                : (d.partners?.items ?? []),
        },
    };
}

function getDefaultLandingContent() {
    return {
        hero: {
            badge: '🌿 Philippines #1 Organic Food Platform',
            titleLine1: 'Lynsi Food Products,',
            titleLine2: 'Taste Beyond Compare',
            subtitle:
                'Discover over 500+ certified organic products from trusted local farms. Healthier eating, starting today — no compromises.',
            ctaPrimary: '🛒 Shop Now',
            ctaSecondary: '▶ How It Works',
            stat1Num: '500+',
            stat1Label: 'Products',
            stat2Num: '50k+',
            stat2Label: 'Happy Customers',
            stat3Num: '100%',
            stat3Label: 'Organic Certified',
        },
        products: {
            badge: '🛒 Fresh Arrivals',
            title: 'Featured Products',
            subtitle:
                'Hand-picked, certified organic produce fresh from our local farm partners to your table.',
            catalogueLabel: 'View Full Catalogue →',
            items: [...PRODUCTS],
        },
        benefits: {
            badge: '🌿 Why Choose Lynsi',
            title: 'Benefits That Matter to You',
            subtitle:
                "We don't just deliver food — we deliver a healthier, greener, more conscious lifestyle straight to your home.",
            items: [...BENEFITS],
        },
        howItWorks: {
            badge: '⚡ Simple Process',
            title: 'How It Works',
            subtitle:
                'From browse to doorstep in 3 effortless steps. Fresh food has never been this easy.',
            steps: [...STEPS],
        },
        locations: {
            badge: '📍 Visit Us',
            title: 'Our Locations',
            subtitle:
                'Find a Lynsi store near you. Walk in for fresh picks or order ahead for same-day pickup and delivery.',
            items: [...LOCATIONS],
        },
        aboutUs: {
            badge: '🌿 Our Story',
            title: 'About Lynsi Food Products',
            subtitle:
                "We're on a mission to make fresh, organic food accessible to every Filipino family.",
            paragraph1:
                'Lynsi Food Products started with a simple belief: everyone deserves access to clean, nutritious food straight from the farm. We partner directly with certified organic growers across the Philippines to bring you over 500+ products — from fresh produce to pantry staples — delivered to your doorstep.',
            paragraph2:
                "Our values are rooted in sustainability, transparency, and community. We're committed to zero-waste packaging, fair partnerships with local farmers, and the highest quality standards so you can eat with confidence.",
            stat1Num: '500+',
            stat1Label: 'Organic Products',
            stat2Num: '50k+',
            stat2Label: 'Happy Families',
            stat3Num: '100%',
            stat3Label: 'Philippine Sourced',
            farmToTableTitle: 'Farm to Table',
            farmToTableDesc:
                'Every product is traceable to our partner farms. Quality you can trust.',
        },
        contactUs: {
            badge: '📬 Get in Touch',
            title: 'Contact Us',
            subtitle:
                "Have questions, feedback, or need support? We'd love to hear from you.",
            email: 'hello@lynsi.com',
            phone: '+63 2 8123 4567',
            address: 'Metro Manila, Philippines',
            footerNote:
                'We typically respond within 24 hours. For orders and delivery support, you can also reach us through your account dashboard after signing in.',
        },
        partners: {
            title: 'Trusted by leading food brands & retailers',
            items: [...PARTNERS],
        },
    };
}

function Stars({ count }: { count: number }) {
    return (
        <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} style={{ color: '#f59e0b', fontSize: '15px' }}>
                    ★
                </span>
            ))}
        </div>
    );
}

// ─── Leaf SVG decoration ─────────────────────────────────────────────────────
function LeafOrb({
    size = 300,
    opacity = 0.06,
    top = 'auto',
    left = 'auto',
    right = 'auto',
    bottom = 'auto',
    rotate = 0,
    color = P.mint,
}: {
    size?: number;
    opacity?: number;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    rotate?: number;
    color?: string;
}) {
    return (
        <div
            style={{
                position: 'absolute',
                top,
                left,
                right,
                bottom,
                width: size,
                height: size,
                opacity,
                transform: `rotate(${rotate}deg)`,
                pointerEvents: 'none',
                zIndex: 0,
            }}
        >
            <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '100%' }}
            >
                <path
                    d="M 100 10 Q 170 10 190 80 Q 200 120 160 160 Q 120 200 70 180 Q 20 155 10 100 Q -5 40 60 15 Q 80 8 100 10 Z"
                    fill={color}
                />
                <path
                    d="M100 10 L100 180"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                />
                <path
                    d="M100 60 Q 130 80 100 100 Q 70 80 100 60 Z"
                    fill="rgba(255,255,255,0.15)"
                />
                <path
                    d="M100 90 Q 140 110 100 135 Q 60 110 100 90 Z"
                    fill="rgba(255,255,255,0.12)"
                />
            </svg>
        </div>
    );
}

// ─── Types ───────────────────────────────────────────────────────────────────
type LandingContent = ReturnType<typeof getDefaultLandingContent>;
type FeaturedProduct = {
    id: number;
    slug?: string;
    name: string;
    description: string | null;
    expiry: string | null;
    image_url: string | null;
    category: string | null;
    variants: {
        id: number;
        size: string | null;
        flavor: string | null;
        price: string;
        stock_quantity: number;
    }[];
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Welcome({
    canRegister = true,
    landingContent,
    featuredProducts = [],
}: {
    canRegister?: boolean;
    landingContent?: LandingContent | null;
    featuredProducts?: FeaturedProduct[];
}) {
    const { auth } = usePage().props as {
        auth: {
            user: {
                name: string;
                email: string;
                role?: string;
                profile_photo_url?: string | null;
            } | null;
        };
    };
    const content = mergeWithDefaults(landingContent);

    useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === 'visible')
                router.reload({ only: ['landingContent', 'featuredProducts'] });
        };
        document.addEventListener('visibilitychange', onVisible);
        return () =>
            document.removeEventListener('visibilitychange', onVisible);
    }, []);

    const scrollToSection = (id: string) => {
        document
            .getElementById(id)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <Head title="Lynsi Food Products – Fresh Organic Delivered to You">
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <style>{`
                    *, *::before, *::after { box-sizing: border-box; }
                    html { scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; }
                    body { overflow-x: hidden; margin: 0; }
                    section[id] { scroll-margin-top: 68px; }

                    :root {
                        --forest:      #031a0c;
                        --deep:        #052e16;
                        --emerald:     #065f46;
                        --jade:        #047857;
                        --mint:        #10b981;
                        --sage:        #34d399;
                        --foam:        #d1fae5;
                        --mist:        #f0fdf4;
                        --white:       #ffffff;
                        --glass-light: rgba(255,255,255,0.70);
                        --glass-dark:  rgba(3,26,12,0.50);
                        --stroke-light: rgba(255,255,255,0.80);
                        --stroke-dark:  rgba(52,211,153,0.20);
                        --text-dark:   #031a0c;
                        --text-muted:  #047857;
                        --on-dark:     #d1fae5;
                        --on-dark-muted: #6ee7b7;
                        --blur: blur(20px) saturate(180%);
                    }

                    /* ── TYPOGRAPHY ─────────────────────────────────────────── */
                    .lynsi-root { font-family: 'Plus Jakarta Sans', sans-serif; color: var(--text-dark); }
                    .display { font-family: 'Playfair Display', serif; }
                    .display-italic { font-family: 'Playfair Display', serif; font-style: italic; }

                    /* ── LAYOUT ─────────────────────────────────────────────── */
                    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; width: 100%; }
                    @media (min-width: 768px) { .container { padding: 0 40px; } }
                    @media (min-width: 1024px) { .container { padding: 0 48px; } }

                    .section { padding: 80px 20px; position: relative; overflow: hidden; }
                    @media (min-width: 768px) { .section { padding: 100px 40px; } }
                    @media (min-width: 1024px) { .section { padding: 120px 48px; } }

                    /* ── GLASS CARDS ────────────────────────────────────────── */
                    .glass-light {
                        background: var(--glass-light);
                        backdrop-filter: var(--blur);
                        -webkit-backdrop-filter: var(--blur);
                        border: 1px solid var(--stroke-light);
                        box-shadow: 0 8px 40px rgba(3,26,12,0.06), inset 0 1px 0 rgba(255,255,255,0.95);
                    }
                    .glass-dark {
                        background: var(--glass-dark);
                        backdrop-filter: var(--blur);
                        -webkit-backdrop-filter: var(--blur);
                        border: 1px solid var(--stroke-dark);
                        box-shadow: 0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(52,211,153,0.12);
                    }
                    .glass-mint {
                        background: rgba(16,185,129,0.12);
                        backdrop-filter: var(--blur);
                        -webkit-backdrop-filter: var(--blur);
                        border: 1px solid rgba(52,211,153,0.30);
                        box-shadow: 0 8px 32px rgba(16,185,129,0.10);
                    }

                    /* ── BADGE ─────────────────────────────────────────────── */
                    .badge {
                        display: inline-flex; align-items: center; gap: 6px;
                        padding: 6px 16px; border-radius: 50px;
                        font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
                    }
                    .badge-light {
                        background: rgba(16,185,129,0.12); color: var(--jade);
                        border: 1px solid rgba(16,185,129,0.25);
                    }
                    .badge-dark {
                        background: rgba(52,211,153,0.12); color: var(--sage);
                        border: 1px solid rgba(52,211,153,0.25);
                    }

                    /* ── BUTTONS ────────────────────────────────────────────── */
                    .btn-primary {
                        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                        padding: 14px 32px; min-height: 52px;
                        background: linear-gradient(135deg, var(--mint) 0%, var(--jade) 100%);
                        color: var(--white); font-weight: 700; font-size: 15px; font-family: inherit;
                        border-radius: 14px; border: none; cursor: pointer; text-decoration: none;
                        box-shadow: 0 6px 24px rgba(16,185,129,0.40), 0 2px 8px rgba(16,185,129,0.20);
                        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                        position: relative; overflow: hidden;
                    }
                    .btn-primary::after {
                        content: ''; position: absolute; inset: 0;
                        background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%);
                        border-radius: inherit;
                    }
                    .btn-primary:hover {
                        transform: translateY(-3px) scale(1.02);
                        box-shadow: 0 12px 36px rgba(16,185,129,0.50), 0 4px 12px rgba(16,185,129,0.25);
                    }

                    .btn-ghost-light {
                        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                        padding: 13px 30px; min-height: 52px;
                        background: rgba(255,255,255,0.15);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        color: var(--white); font-weight: 600; font-size: 15px; font-family: inherit;
                        border-radius: 14px; border: 1px solid rgba(255,255,255,0.35);
                        cursor: pointer; text-decoration: none;
                        transition: all 0.25s ease;
                    }
                    .btn-ghost-light:hover {
                        background: rgba(255,255,255,0.25); transform: translateY(-2px);
                    }

                    .btn-ghost-dark {
                        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                        padding: 13px 30px; min-height: 52px;
                        background: transparent;
                        color: var(--jade); font-weight: 600; font-size: 15px; font-family: inherit;
                        border-radius: 14px; border: 2px solid rgba(16,185,129,0.40);
                        cursor: pointer; text-decoration: none;
                        transition: all 0.25s ease;
                    }
                    .btn-ghost-dark:hover {
                        background: rgba(16,185,129,0.08); border-color: var(--mint);
                        transform: translateY(-2px);
                    }

                    /* Hero — compact vertical rhythm (less “full-screen” height) */
                    .hero-section {
                        padding:
                            calc(env(safe-area-inset-top, 0px) + 52px + clamp(8px, 2vw, 20px))
                            20px
                            clamp(36px, 6vw, 64px);
                    }
                    .hero-cta .btn-primary,
                    .hero-cta .btn-ghost-light {
                        padding: 11px 22px;
                        min-height: 44px;
                        font-size: 14px;
                        border-radius: 12px;
                    }
                    .hero-headline {
                        font-size: clamp(28px, 4.8vw, 52px);
                        line-height: 1.08;
                        letter-spacing: -0.02em;
                    }
                    .hero-sub {
                        font-size: clamp(14px, 1.75vw, 16px);
                        line-height: 1.65;
                    }
                    /* Trusted brands row (hero) — wordmark strip, calm on dark */
                    .hero-trusted-label {
                        font-size: 10px;
                        font-weight: 700;
                        letter-spacing: 0.14em;
                        text-transform: uppercase;
                        color: rgba(209, 250, 229, 0.55);
                        margin: 0 0 14px;
                    }
                    .hero-trusted-track {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px 20px;
                        justify-content: center;
                        align-items: center;
                    }
                    .hero-trusted-name {
                        font-size: clamp(12px, 1.5vw, 14px);
                        font-weight: 600;
                        letter-spacing: 0.03em;
                        color: rgba(255, 255, 255, 0.42);
                        white-space: nowrap;
                        transition: color 0.2s ease;
                    }
                    .hero-trusted-name:hover {
                        color: rgba(255, 255, 255, 0.72);
                    }

                    /* ── SECTION HEADING ────────────────────────────────────── */
                    .section-title {
                        font-family: 'Playfair Display', serif;
                        font-size: clamp(32px, 4.5vw, 54px);
                        font-weight: 700; line-height: 1.15; letter-spacing: -0.02em;
                        margin: 12px 0;
                    }
                    .section-sub {
                        font-size: clamp(15px, 2vw, 17px); font-weight: 400; line-height: 1.75;
                    }
                    .grad-text {
                        background: linear-gradient(135deg, var(--mint) 0%, var(--sage) 100%);
                        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    .grad-text-dark {
                        background: linear-gradient(135deg, var(--emerald) 0%, var(--mint) 100%);
                        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    /* ── ANIMATIONS ─────────────────────────────────────────── */
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        33%       { transform: translateY(-14px) rotate(2deg); }
                        66%       { transform: translateY(-6px) rotate(-1deg); }
                    }
                    @keyframes floatSlow {
                        0%, 100% { transform: translateY(0px) scale(1); }
                        50%       { transform: translateY(-20px) scale(1.02); }
                    }
                    @keyframes shimmer {
                        0%   { background-position: -200% center; }
                        100% { background-position: 200% center; }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(28px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to   { opacity: 1; }
                    }
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to   { transform: rotate(360deg); }
                    }
                    @keyframes pulse-glow {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
                        50%       { box-shadow: 0 0 0 16px rgba(16,185,129,0); }
                    }

                    /* ── FALLING LEAF KEYFRAMES ──────────────────────────────── */
                    @keyframes leafFall1 {
                        0%   { transform: translateY(-80px) translateX(0px)   rotate(0deg)   scale(1);    opacity: 0; }
                        5%   { opacity: 0.85; }
                        25%  { transform: translateY(25vh)  translateX(45px)  rotate(90deg)  scale(0.95); }
                        50%  { transform: translateY(50vh)  translateX(-35px) rotate(180deg) scale(0.9);  }
                        75%  { transform: translateY(75vh)  translateX(55px)  rotate(270deg) scale(0.85); }
                        95%  { opacity: 0.4; }
                        100% { transform: translateY(115vh) translateX(10px)  rotate(360deg) scale(0.8);  opacity: 0; }
                    }
                    @keyframes leafFall2 {
                        0%   { transform: translateY(-80px) translateX(0px)   rotate(20deg)  scale(0.85); opacity: 0; }
                        8%   { opacity: 0.75; }
                        30%  { transform: translateY(30vh)  translateX(-55px) rotate(115deg) scale(0.8);  }
                        55%  { transform: translateY(55vh)  translateX(65px)  rotate(205deg) scale(0.75); }
                        80%  { transform: translateY(80vh)  translateX(-25px) rotate(300deg) scale(0.7);  }
                        92%  { opacity: 0.3; }
                        100% { transform: translateY(115vh) translateX(30px)  rotate(390deg) scale(0.65); opacity: 0; }
                    }
                    @keyframes leafFall3 {
                        0%   { transform: translateY(-80px) translateX(0px)   rotate(-15deg) scale(1.1);  opacity: 0; }
                        6%   { opacity: 0.9; }
                        20%  { transform: translateY(20vh)  translateX(35px)  rotate(55deg)  scale(1.05); }
                        45%  { transform: translateY(45vh)  translateX(-45px) rotate(140deg) scale(1);    }
                        70%  { transform: translateY(70vh)  translateX(60px)  rotate(225deg) scale(0.95); }
                        90%  { opacity: 0.35; }
                        100% { transform: translateY(115vh) translateX(-20px) rotate(310deg) scale(0.9);  opacity: 0; }
                    }
                    @keyframes leafFall4 {
                        0%   { transform: translateY(-80px) translateX(0px)   rotate(45deg)  scale(0.75); opacity: 0; }
                        10%  { opacity: 0.7; }
                        35%  { transform: translateY(35vh)  translateX(-65px) rotate(140deg) scale(0.7);  }
                        60%  { transform: translateY(60vh)  translateX(50px)  rotate(235deg) scale(0.65); }
                        85%  { transform: translateY(85vh)  translateX(-35px) rotate(325deg) scale(0.6);  }
                        93%  { opacity: 0.25; }
                        100% { transform: translateY(115vh) translateX(20px)  rotate(415deg) scale(0.55); opacity: 0; }
                    }
                    @keyframes leafFall5 {
                        0%   { transform: translateY(-80px) translateX(0px)   rotate(-30deg) scale(1.15); opacity: 0; }
                        7%   { opacity: 0.8; }
                        28%  { transform: translateY(28vh)  translateX(60px)  rotate(65deg)  scale(1.1);  }
                        52%  { transform: translateY(52vh)  translateX(-40px) rotate(155deg) scale(1.05); }
                        77%  { transform: translateY(77vh)  translateX(45px)  rotate(245deg) scale(1);    }
                        91%  { opacity: 0.4; }
                        100% { transform: translateY(115vh) translateX(-15px) rotate(335deg) scale(0.95); opacity: 0; }
                    }

                    /* ── LEAF ELEMENTS ───────────────────────────────────────── */
                    .hero-leaf {
                        position: absolute;
                        top: -80px;
                        pointer-events: none;
                        z-index: 1;
                        will-change: transform, opacity;
                    }
                    .leaf-1  { left: 5%;   animation: leafFall1 9s  linear 0s    infinite; }
                    .leaf-2  { left: 14%;  animation: leafFall2 12s linear 1.8s  infinite; }
                    .leaf-3  { left: 24%;  animation: leafFall3 8s  linear 3.5s  infinite; }
                    .leaf-4  { left: 35%;  animation: leafFall4 13s linear 0.6s  infinite; }
                    .leaf-5  { left: 46%;  animation: leafFall1 10s linear 5.0s  infinite; }
                    .leaf-6  { left: 57%;  animation: leafFall2 7s  linear 2.3s  infinite; }
                    .leaf-7  { left: 67%;  animation: leafFall5 14s linear 6.1s  infinite; }
                    .leaf-8  { left: 77%;  animation: leafFall3 9s  linear 1.2s  infinite; }
                    .leaf-9  { left: 87%;  animation: leafFall4 11s linear 7.0s  infinite; }
                    .leaf-10 { left: 93%;  animation: leafFall5 8s  linear 4.2s  infinite; }
                    .leaf-11 { left: 2%;   animation: leafFall2 15s linear 8.5s  infinite; }
                    .leaf-12 { left: 20%;  animation: leafFall1 11s linear 2.7s  infinite; }
                    .leaf-13 { left: 42%;  animation: leafFall5 10s linear 0.3s  infinite; }
                    .leaf-14 { left: 63%;  animation: leafFall3 12s linear 5.6s  infinite; }
                    .leaf-15 { left: 81%;  animation: leafFall4 9s  linear 9.1s  infinite; }

                    .anim-float     { animation: float 7s ease-in-out infinite; }
                    .anim-float-slow{ animation: floatSlow 10s ease-in-out infinite; }
                    .anim-fadein    { animation: fadeIn 0.7s ease both; }
                    .anim-fadeinup  { animation: fadeInUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
                    .anim-d1 { animation-delay: 0.1s; }
                    .anim-d2 { animation-delay: 0.2s; }
                    .anim-d3 { animation-delay: 0.3s; }
                    .anim-d4 { animation-delay: 0.4s; }
                    .anim-d5 { animation-delay: 0.5s; }
                    .anim-d6 { animation-delay: 0.6s; }

                    /* ── PRODUCT CARD ────────────────────────────────────────── */
                    .product-card {
                        border-radius: 24px; padding: 24px;
                        cursor: pointer; text-decoration: none; color: inherit;
                        transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                        display: flex; flex-direction: column;
                        position: relative; overflow: hidden;
                    }
                    .product-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 24px 60px rgba(3,26,12,0.12), 0 8px 24px rgba(16,185,129,0.10) !important;
                    }
                    .product-card::before {
                        content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
                        background: linear-gradient(90deg, transparent, var(--mint), transparent);
                        opacity: 0; transition: opacity 0.3s ease;
                    }
                    .product-card:hover::before { opacity: 1; }

                    .product-img {
                        height: 150px; border-radius: 16px;
                        display: flex; align-items: center; justify-content: center;
                        font-size: 60px; margin-bottom: 18px;
                        transition: transform 0.35s ease;
                        overflow: hidden;
                    }
                    .product-card:hover .product-img { transform: scale(1.04); }

                    /* ── BENEFIT CARD ────────────────────────────────────────── */
                    .benefit-card {
                        border-radius: 20px; padding: 28px 24px;
                        transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                        position: relative; overflow: hidden;
                    }
                    .benefit-card:hover { transform: translateY(-6px); }

                    /* ── STEP CARD ───────────────────────────────────────────── */
                    .step-card {
                        border-radius: 24px; padding: 36px 28px;
                        text-align: center;
                        transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                        position: relative; overflow: hidden;
                    }
                    .step-card:hover { transform: translateY(-6px); }

                    /* ── TESTIMONIAL CARD ────────────────────────────────────── */
                    .testimonial-card {
                        border-radius: 20px; padding: 28px;
                        transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                    }
                    .testimonial-card:hover { transform: translateY(-5px); }

                    /* ── PARTNER BADGE ───────────────────────────────────────── */
                    .partner-chip {
                        display: inline-flex; align-items: center;
                        padding: 8px 20px; border-radius: 50px;
                        font-size: 13px; font-weight: 600; white-space: nowrap;
                        transition: all 0.25s ease;
                    }
                    .partner-chip:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 24px rgba(16,185,129,0.20);
                    }

                    /* ── GRIDS ───────────────────────────────────────────────── */
                    .grid-products { display: grid; grid-template-columns: 1fr; gap: 20px; }
                    @media (min-width: 480px) { .grid-products { grid-template-columns: repeat(2, 1fr); } }
                    @media (min-width: 900px) { .grid-products { grid-template-columns: repeat(4, 1fr); } }

                    .grid-benefits { display: grid; grid-template-columns: 1fr; gap: 20px; }
                    @media (min-width: 640px) { .grid-benefits { grid-template-columns: repeat(2, 1fr); } }
                    @media (min-width: 1024px) { .grid-benefits { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

                    .grid-steps { display: grid; grid-template-columns: 1fr; gap: 24px; }
                    @media (min-width: 768px) { .grid-steps { grid-template-columns: repeat(3, 1fr); } }

                    .grid-testi { display: grid; grid-template-columns: 1fr; gap: 20px; }
                    @media (min-width: 640px) { .grid-testi { grid-template-columns: repeat(2, 1fr); } }
                    @media (min-width: 1024px) { .grid-testi { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

                    .grid-locs { display: grid; grid-template-columns: 1fr; gap: 20px; }
                    @media (min-width: 640px) { .grid-locs { grid-template-columns: repeat(2, 1fr); } }
                    @media (min-width: 1024px) { .grid-locs { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

                    .grid-contact { display: grid; grid-template-columns: 1fr; gap: 16px; }
                    @media (min-width: 640px) { .grid-contact { grid-template-columns: repeat(3, 1fr); } }

                    .footer-grid { display: grid; grid-template-columns: 1fr; gap: 40px; }
                    @media (min-width: 640px)  { .footer-grid { grid-template-columns: repeat(2, 1fr); } }
                    @media (min-width: 1024px) { .footer-grid { grid-template-columns: repeat(4, 1fr); gap: 56px; } }

                    .hero-inner { display: flex; flex-direction: column; gap: 48px; align-items: flex-start; }
                    @media (min-width: 900px) { .hero-inner { flex-direction: row; align-items: center; justify-content: space-between; gap: 64px; } }

                    .about-inner { display: grid; grid-template-columns: 1fr; gap: 40px; }
                    @media (min-width: 900px) { .about-inner { grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; } }

                    /* ── CONTACT CARD HOVER ─────────────────────────────────── */
                    .contact-card {
                        display: flex; align-items: center; gap: 16px;
                        padding: 22px 20px; border-radius: 20px;
                        text-decoration: none; color: inherit;
                        transition: all 0.3s ease;
                    }
                    .contact-card:hover { transform: translateY(-4px); }

                    /* ── ADD TO CART BTN ─────────────────────────────────────── */
                    .add-btn {
                        width: 44px; height: 44px; min-width: 44px; min-height: 44px;
                        border-radius: 12px; border: none; font-size: 20px;
                        display: flex; align-items: center; justify-content: center;
                        cursor: pointer; transition: all 0.25s ease;
                        background: rgba(16,185,129,0.12); color: var(--emerald);
                    }
                    .add-btn:hover { background: var(--mint); color: white; transform: scale(1.1); }
                    .add-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                    .add-btn:disabled:hover { transform: none; background: rgba(16,185,129,0.12); color: var(--emerald); }

                    /* ── NOISE OVERLAY ──────────────────────────────────────── */
                    .noise-overlay::after {
                        content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 1;
                        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
                        opacity: 0.035; mix-blend-mode: overlay;
                    }

                    /* ── SECTION BG HELPERS ─────────────────────────────────── */
                    .bg-forest {
                        background:
                            radial-gradient(ellipse 70% 70% at 15% 40%, rgba(16,185,129,0.14) 0%, transparent 70%),
                            radial-gradient(ellipse 50% 50% at 85% 15%, rgba(52,211,153,0.08) 0%, transparent 60%),
                            radial-gradient(ellipse 40% 40% at 60% 85%, rgba(6,95,70,0.12) 0%, transparent 55%),
                            #031a0c;
                    }
                    .bg-mist {
                        background:
                            radial-gradient(ellipse 60% 60% at 80% 20%, rgba(209,250,229,0.70) 0%, transparent 60%),
                            radial-gradient(ellipse 50% 50% at 20% 80%, rgba(167,243,208,0.40) 0%, transparent 55%),
                            #f0fdf4;
                    }
                    .bg-white { background: var(--white); }
                    .bg-foam {
                        background:
                            radial-gradient(ellipse 50% 50% at 100% 0%, rgba(209,250,229,0.80) 0%, transparent 50%),
                            radial-gradient(ellipse 40% 40% at 0% 100%, rgba(167,243,208,0.50) 0%, transparent 50%),
                            #ecfdf5;
                    }

                    @media (max-width: 640px) {
                        .section-title { font-size: clamp(26px, 7vw, 36px); }
                        .btn-primary, .btn-ghost-light, .btn-ghost-dark { width: 100%; justify-content: center; }
                        .hero-btns { flex-direction: column; }
                    }
                `}</style>
            </Head>

            <div
                className="lynsi-root bg-forest"
                style={{ minHeight: '100vh', overflowX: 'hidden' }}
            >
                <LandingNav
                    overlay
                    activeId="home"
                    auth={auth ?? { user: null }}
                    canRegister={canRegister}
                />

                {/* ══════════════════════════════════════════════════════════════
                    HERO — Dark Forest, Glassmorphic visual card
                ══════════════════════════════════════════════════════════════ */}
                <section
                    id="home"
                    className="bg-forest noise-overlay hero-section"
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    {/* ── Ambient glow orbs ─────────────────────────────────── */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '15%',
                            left: '10%',
                            width: 400,
                            height: 400,
                            borderRadius: '50%',
                            background:
                                'radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 70%)',
                            filter: 'blur(50px)',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '10%',
                            right: '8%',
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background:
                                'radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)',
                            filter: 'blur(40px)',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '25%',
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background:
                                'radial-gradient(circle, rgba(6,95,70,0.20) 0%, transparent 70%)',
                            filter: 'blur(30px)',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    />

                    {/* ── Falling SVG Leaves ────────────────────────────────── */}
                    {/* Leaf shape A — classic pointed */}
                    {[1, 2, 4, 7, 10, 13].map((n) => (
                        <div key={n} className={`hero-leaf leaf-${n}`}>
                            <svg
                                width={n % 3 === 0 ? 22 : n % 3 === 1 ? 18 : 26}
                                height={
                                    n % 3 === 0 ? 32 : n % 3 === 1 ? 28 : 38
                                }
                                viewBox="0 0 26 38"
                                fill="none"
                            >
                                <path
                                    d="M13 1 C20 1 25 8 25 16 C25 26 18 35 13 37 C8 35 1 26 1 16 C1 8 6 1 13 1Z"
                                    fill={
                                        n % 2 === 0
                                            ? 'rgba(52,211,153,0.55)'
                                            : 'rgba(16,185,129,0.50)'
                                    }
                                />
                                <line
                                    x1="13"
                                    y1="3"
                                    x2="13"
                                    y2="35"
                                    stroke="rgba(255,255,255,0.30)"
                                    strokeWidth="0.8"
                                />
                                <path
                                    d="M13 12 Q18 18 13 22 Q8 18 13 12Z"
                                    fill="rgba(255,255,255,0.15)"
                                />
                            </svg>
                        </div>
                    ))}
                    {/* Leaf shape B — wide oval */}
                    {[3, 6, 9, 12, 15].map((n) => (
                        <div key={n} className={`hero-leaf leaf-${n}`}>
                            <svg
                                width={n % 2 === 0 ? 30 : 24}
                                height={n % 2 === 0 ? 20 : 16}
                                viewBox="0 0 30 20"
                                fill="none"
                            >
                                <path
                                    d="M15 1 C25 1 29 6 29 10 C29 14 25 19 15 19 C5 19 1 14 1 10 C1 6 5 1 15 1Z"
                                    fill={
                                        n % 3 === 0
                                            ? 'rgba(34,197,94,0.45)'
                                            : 'rgba(52,211,153,0.40)'
                                    }
                                />
                                <line
                                    x1="15"
                                    y1="2"
                                    x2="15"
                                    y2="18"
                                    stroke="rgba(255,255,255,0.25)"
                                    strokeWidth="0.7"
                                />
                                <path
                                    d="M8 10 Q15 6 22 10"
                                    stroke="rgba(255,255,255,0.20)"
                                    strokeWidth="0.6"
                                    fill="none"
                                />
                            </svg>
                        </div>
                    ))}
                    {/* Leaf shape C — maple-ish */}
                    {[5, 8, 11, 14].map((n) => (
                        <div key={n} className={`hero-leaf leaf-${n}`}>
                            <svg
                                width="20"
                                height="22"
                                viewBox="0 0 20 22"
                                fill="none"
                            >
                                <path
                                    d="M10 1 C14 4 19 4 17 8 C19 9 20 12 17 12 C18 15 16 18 13 17 L10 21 L7 17 C4 18 2 15 3 12 C0 12 1 9 3 8 C1 4 6 4 10 1Z"
                                    fill="rgba(16,185,129,0.48)"
                                />
                                <line
                                    x1="10"
                                    y1="5"
                                    x2="10"
                                    y2="20"
                                    stroke="rgba(255,255,255,0.25)"
                                    strokeWidth="0.7"
                                />
                            </svg>
                        </div>
                    ))}

                    {/* ── Centered hero content ─────────────────────────────── */}
                    <div
                        className="container"
                        style={{ position: 'relative', zIndex: 2 }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                maxWidth: 680,
                                margin: '0 auto',
                            }}
                        >
                            {/* Social proof row */}
                            <div
                                className="anim-fadeinup"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginBottom: 16,
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={{ display: 'flex' }}>
                                    {['#10b981', '#34d399', '#6ee7b7'].map(
                                        (c, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: '50%',
                                                    background: `radial-gradient(circle at 35% 35%, ${c}, #065f46)`,
                                                    border: '2px solid #031a0c',
                                                    marginLeft: i ? -8 : 0,
                                                    boxShadow:
                                                        '0 2px 8px rgba(0,0,0,0.35)',
                                                }}
                                            />
                                        ),
                                    )}
                                </div>
                                <span
                                    style={{
                                        color: P.onDarkMuted,
                                        fontSize: 13,
                                        fontWeight: 500,
                                    }}
                                >
                                    {content.hero.stat2Num}{' '}
                                    {content.hero.stat2Label}
                                </span>
                                <span
                                    style={{
                                        color: P.onDark,
                                        fontSize: 12,
                                        opacity: 0.4,
                                    }}
                                >
                                    ·
                                </span>
                                <span
                                    style={{
                                        color: P.onDarkMuted,
                                        fontSize: 13,
                                        fontWeight: 500,
                                    }}
                                >
                                    {content.hero.stat3Num}{' '}
                                    {content.hero.stat3Label}
                                </span>
                            </div>

                            {/* Badge */}
                            <div
                                className="badge badge-dark anim-fadeinup anim-d1"
                                style={{
                                    marginBottom: 14,
                                    padding: '5px 14px',
                                    fontSize: 10.5,
                                    letterSpacing: '0.06em',
                                }}
                            >
                                {content.hero.badge}
                            </div>

                            {/* Headline */}
                            <h1
                                className="section-title display hero-headline anim-fadeinup anim-d2"
                                style={{ color: P.white, margin: '0 0 4px' }}
                            >
                                {content.hero.titleLine1}
                            </h1>
                            <h1
                                className="section-title display-italic hero-headline anim-fadeinup anim-d3"
                                style={{ margin: '0 0 20px' }}
                            >
                                <span className="grad-text">
                                    {content.hero.titleLine2}
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p
                                className="hero-sub anim-fadeinup anim-d4"
                                style={{
                                    color: P.onDarkMuted,
                                    maxWidth: 480,
                                    margin: '0 auto 28px',
                                }}
                            >
                                {content.hero.subtitle}
                            </p>

                            {/* CTA buttons — centered */}
                            <div
                                className="hero-cta anim-fadeinup anim-d5"
                                style={{
                                    display: 'flex',
                                    gap: 12,
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 40,
                                }}
                            >
                                <a
                                    href="#products"
                                    className="btn-primary"
                                    style={{ minWidth: 140 }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection('products');
                                    }}
                                >
                                    {content.hero.ctaPrimary}
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="btn-ghost-light"
                                    style={{ minWidth: 140 }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection('how-it-works');
                                    }}
                                >
                                    {content.hero.ctaSecondary}
                                </a>
                            </div>

                            {/* Trusted brands — replaces hero stats strip */}
                            {(content.partners?.items?.length ?? 0) > 0 && (
                                <div
                                    className="anim-fadeinup anim-d6"
                                    style={{
                                        width: '100%',
                                        maxWidth: 920,
                                        margin: '0 auto',
                                        paddingTop: 22,
                                        borderTop:
                                            '1px solid rgba(255,255,255,0.08)',
                                    }}
                                >
                                    <p className="hero-trusted-label">
                                        {content.partners?.title}
                                    </p>
                                    <div className="hero-trusted-track">
                                        {(content.partners?.items ?? [])
                                            .filter(
                                                (p): p is string => !!p?.trim(),
                                            )
                                            .map((name, i) => (
                                                <span
                                                    key={`${name}-${i}`}
                                                    className="hero-trusted-name"
                                                >
                                                    {name}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════
                    PRODUCTS — Light mist bg
                ══════════════════════════════════════════════════════════════ */}
                <section id="products" className="section bg-mist">
                    <LeafOrb
                        size={260}
                        opacity={0.07}
                        top="-30px"
                        right="-20px"
                        rotate={15}
                        color={P.mint}
                    />
                    <div
                        className="container"
                        style={{ position: 'relative', zIndex: 1 }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                gap: 20,
                                marginBottom: 52,
                            }}
                        >
                            <div>
                                <div className="badge badge-light">
                                    {content.products.badge}
                                </div>
                                <h2
                                    className="section-title"
                                    style={{ color: P.textDark }}
                                >
                                    {content.products.title?.replace(
                                        /\s*Products\s*$/,
                                        '',
                                    )}
                                    <span className="grad-text-dark">
                                        {' '}
                                        Products
                                    </span>
                                </h2>
                                <p
                                    className="section-sub"
                                    style={{
                                        color: P.textMuted,
                                        maxWidth: 480,
                                    }}
                                >
                                    {content.products.subtitle}
                                </p>
                            </div>
                            <Link
                                href="/shop"
                                className="btn-ghost-dark"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {content.products.catalogueLabel}
                            </Link>
                        </div>

                        <div className="grid-products">
                            {featuredProducts && featuredProducts.length > 0
                                ? featuredProducts.map((p) => {
                                      const minPrice = p.variants?.length
                                          ? Math.min(
                                                ...p.variants.map((v) =>
                                                    Number(v.price),
                                                ),
                                            )
                                          : null;
                                      const firstVariant = p.variants?.[0];
                                      const canAdd = !!(
                                          firstVariant &&
                                          firstVariant.stock_quantity > 0
                                      );
                                      const addToCart = (
                                          e: React.MouseEvent,
                                      ) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (!canAdd) return;
                                          router.post('/cart', {
                                              variant_id: firstVariant!.id,
                                              quantity: 1,
                                          });
                                      };
                                      const inner = (
                                          <>
                                              <div
                                                  className="product-img"
                                                  style={{
                                                      background: '#ecfdf5',
                                                  }}
                                              >
                                                  {p.image_url ? (
                                                      <img
                                                          src={p.image_url}
                                                          alt={p.name}
                                                          style={{
                                                              width: '100%',
                                                              height: '100%',
                                                              objectFit:
                                                                  'cover',
                                                          }}
                                                      />
                                                  ) : (
                                                      '🛒'
                                                  )}
                                              </div>
                                              <div
                                                  style={{
                                                      flex: 1,
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                  }}
                                              >
                                                  {p.category && (
                                                      <div
                                                          style={{
                                                              fontSize: 11,
                                                              color: P.textMuted,
                                                              fontWeight: 700,
                                                              textTransform:
                                                                  'uppercase',
                                                              letterSpacing:
                                                                  '0.6px',
                                                              marginBottom: 6,
                                                          }}
                                                      >
                                                          {p.category}
                                                      </div>
                                                  )}
                                                  <h3
                                                      style={{
                                                          fontSize: 16,
                                                          fontWeight: 700,
                                                          color: P.textDark,
                                                          marginBottom: 8,
                                                          lineHeight: 1.4,
                                                      }}
                                                  >
                                                      {p.name}
                                                  </h3>
                                                  {p.description && (
                                                      <p
                                                          style={{
                                                              fontSize: 13,
                                                              color: P.textMuted,
                                                              lineHeight: 1.6,
                                                              marginBottom: 12,
                                                              display:
                                                                  '-webkit-box',
                                                              WebkitLineClamp: 2,
                                                              WebkitBoxOrient:
                                                                  'vertical',
                                                              overflow:
                                                                  'hidden',
                                                          }}
                                                      >
                                                          {p.description}
                                                      </p>
                                                  )}
                                                  <div
                                                      style={{
                                                          marginTop: 'auto',
                                                          display: 'flex',
                                                          alignItems:
                                                              'flex-end',
                                                          justifyContent:
                                                              'space-between',
                                                          gap: 12,
                                                      }}
                                                  >
                                                      <div>
                                                          {minPrice != null && (
                                                              <>
                                                                  <span
                                                                      style={{
                                                                          fontSize: 13,
                                                                          color: P.textMuted,
                                                                      }}
                                                                  >
                                                                      From{' '}
                                                                  </span>
                                                                  <span
                                                                      className="display"
                                                                      style={{
                                                                          fontSize: 22,
                                                                          fontWeight: 700,
                                                                          color: P.emerald,
                                                                      }}
                                                                  >
                                                                      ₱
                                                                      {minPrice.toFixed(
                                                                          2,
                                                                      )}
                                                                  </span>
                                                              </>
                                                          )}
                                                      </div>
                                                      <button
                                                          className="add-btn"
                                                          onClick={addToCart}
                                                          disabled={!canAdd}
                                                          aria-label={
                                                              canAdd
                                                                  ? `Add ${p.name} to cart`
                                                                  : `${p.name} out of stock`
                                                          }
                                                      >
                                                          +
                                                      </button>
                                                  </div>
                                              </div>
                                          </>
                                      );
                                      return p.slug ? (
                                          <Link
                                              key={p.id}
                                              href={`/shop/product/${p.slug}`}
                                              className="product-card glass-light"
                                          >
                                              {inner}
                                          </Link>
                                      ) : (
                                          <div
                                              key={p.id}
                                              className="product-card glass-light"
                                          >
                                              {inner}
                                          </div>
                                      );
                                  })
                                : (content.products.items ?? []).map((p) => (
                                      <div
                                          key={p.name}
                                          className="product-card glass-light"
                                          style={{ cursor: 'default' }}
                                      >
                                          <div
                                              style={{
                                                  position: 'absolute',
                                                  top: 16,
                                                  right: 16,
                                                  background: P.white,
                                                  color: P.jade,
                                                  fontSize: 10,
                                                  fontWeight: 700,
                                                  padding: '4px 12px',
                                                  borderRadius: '50px',
                                                  boxShadow:
                                                      '0 2px 10px rgba(3,26,12,0.08)',
                                              }}
                                          >
                                              {p.badge}
                                          </div>
                                          <div
                                              className="product-img"
                                              style={{ background: p.color }}
                                          >
                                              {p.icon}
                                          </div>
                                          <div
                                              style={{
                                                  fontSize: 11,
                                                  color: P.textMuted,
                                                  fontWeight: 700,
                                                  textTransform: 'uppercase',
                                                  letterSpacing: '0.6px',
                                                  marginBottom: 6,
                                              }}
                                          >
                                              {p.category}
                                          </div>
                                          <h3
                                              style={{
                                                  fontSize: 16,
                                                  fontWeight: 700,
                                                  color: P.textDark,
                                                  marginBottom: 12,
                                                  lineHeight: 1.4,
                                              }}
                                          >
                                              {p.name}
                                          </h3>
                                          <div
                                              style={{
                                                  marginTop: 'auto',
                                                  display: 'flex',
                                                  alignItems: 'flex-end',
                                                  justifyContent:
                                                      'space-between',
                                                  gap: 12,
                                              }}
                                          >
                                              <div>
                                                  <span
                                                      className="display"
                                                      style={{
                                                          fontSize: 22,
                                                          fontWeight: 700,
                                                          color: P.emerald,
                                                      }}
                                                  >
                                                      {p.price}
                                                  </span>
                                                  <span
                                                      style={{
                                                          fontSize: 13,
                                                          color: P.textMuted,
                                                      }}
                                                  >
                                                      {p.unit}
                                                  </span>
                                              </div>
                                              <button
                                                  className="add-btn"
                                                  aria-label={`Add ${p.name} to cart`}
                                              >
                                                  +
                                              </button>
                                          </div>
                                      </div>
                                  ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════
                    BENEFITS — Dark Forest
                ══════════════════════════════════════════════════════════════ */}
                <section
                    id="services"
                    className="section bg-forest noise-overlay"
                >
                    <LeafOrb
                        size={350}
                        opacity={0.06}
                        bottom="-60px"
                        right="-40px"
                        rotate={-40}
                        color={P.sage}
                    />
                    <LeafOrb
                        size={200}
                        opacity={0.05}
                        top="10%"
                        left="5%"
                        rotate={20}
                        color={P.mint}
                    />
                    <div
                        className="container"
                        style={{ position: 'relative', zIndex: 2 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <div className="badge badge-dark">
                                {content.benefits.badge}
                            </div>
                            <h2
                                className="section-title"
                                style={{ color: P.white }}
                            >
                                {content.benefits.title}
                            </h2>
                            <p
                                className="section-sub"
                                style={{
                                    color: P.onDarkMuted,
                                    maxWidth: 520,
                                    margin: '0 auto',
                                }}
                            >
                                {content.benefits.subtitle}
                            </p>
                        </div>
                        <div className="grid-benefits">
                            {(content.benefits.items ?? []).map((b, i) => (
                                <div
                                    key={b.title}
                                    className="benefit-card glass-dark"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    <div
                                        style={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: 16,
                                            background: 'rgba(16,185,129,0.15)',
                                            border: '1px solid rgba(52,211,153,0.20)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 26,
                                            marginBottom: 18,
                                        }}
                                    >
                                        {b.icon}
                                    </div>
                                    <h3
                                        style={{
                                            fontSize: 17,
                                            fontWeight: 700,
                                            color: P.white,
                                            marginBottom: 10,
                                        }}
                                    >
                                        {b.title}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: 14,
                                            color: P.onDarkMuted,
                                            lineHeight: 1.75,
                                        }}
                                    >
                                        {b.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════
                    HOW IT WORKS — Light
                ══════════════════════════════════════════════════════════════ */}
                <section id="how-it-works" className="section bg-white">
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <div className="badge badge-light">
                                {content.howItWorks.badge}
                            </div>
                            <h2
                                className="section-title"
                                style={{ color: P.textDark }}
                            >
                                {content.howItWorks.title}
                            </h2>
                            <p
                                className="section-sub"
                                style={{
                                    color: P.textMuted,
                                    maxWidth: 480,
                                    margin: '0 auto',
                                }}
                            >
                                {content.howItWorks.subtitle}
                            </p>
                        </div>
                        <div
                            className="grid-steps"
                            style={{ position: 'relative' }}
                        >
                            {/* Connector line — desktop only */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 56,
                                    left: '17%',
                                    right: '17%',
                                    height: 1,
                                    background:
                                        'linear-gradient(90deg, transparent, rgba(16,185,129,0.25), rgba(16,185,129,0.25), transparent)',
                                    pointerEvents: 'none',
                                }}
                            />
                            {(content.howItWorks.steps ?? []).map((s) => (
                                <div
                                    key={s.step}
                                    className="step-card glass-light"
                                >
                                    {/* Glow behind step number */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 20,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            background:
                                                'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 18,
                                            background: `linear-gradient(135deg, ${P.mint} 0%, ${P.emerald} 100%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 24px',
                                            boxShadow:
                                                '0 8px 24px rgba(16,185,129,0.35)',
                                            position: 'relative',
                                        }}
                                    >
                                        <span
                                            className="display"
                                            style={{
                                                fontSize: 20,
                                                fontWeight: 800,
                                                color: P.white,
                                            }}
                                        >
                                            {s.step}
                                        </span>
                                    </div>
                                    <h3
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 700,
                                            color: P.textDark,
                                            marginBottom: 12,
                                        }}
                                    >
                                        {s.title}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: 14,
                                            color: P.textMuted,
                                            lineHeight: 1.75,
                                        }}
                                    >
                                        {s.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════
                    LOCATIONS — Foam bg
                ══════════════════════════════════════════════════════════════ */}
                <section id="our-locations" className="section bg-foam">
                    <LeafOrb
                        size={300}
                        opacity={0.08}
                        top="-20px"
                        left="-30px"
                        rotate={10}
                        color={P.emerald}
                    />
                    <div
                        className="container"
                        style={{ position: 'relative', zIndex: 1 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <div className="badge badge-light">
                                {content.locations.badge}
                            </div>
                            <h2
                                className="section-title"
                                style={{ color: P.textDark }}
                            >
                                {content.locations.title}
                            </h2>
                            <p
                                className="section-sub"
                                style={{
                                    color: P.textMuted,
                                    maxWidth: 520,
                                    margin: '0 auto',
                                }}
                            >
                                {content.locations.subtitle}
                            </p>
                        </div>
                        <div className="grid-locs">
                            {(content.locations.items ?? []).map((loc, idx) => (
                                <div
                                    key={idx}
                                    className="benefit-card glass-light"
                                    style={{
                                        textAlign: 'left',
                                        padding: '28px 24px',
                                    }}
                                >
                                    {loc.tag && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: 20,
                                                right: 20,
                                                fontSize: 10,
                                                fontWeight: 700,
                                                color: P.jade,
                                                background:
                                                    'rgba(16,185,129,0.10)',
                                                padding: '5px 12px',
                                                borderRadius: '50px',
                                                border: '1px solid rgba(16,185,129,0.20)',
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
                                                borderRadius: 16,
                                                overflow: 'hidden',
                                                marginBottom: 20,
                                            }}
                                        >
                                            <img
                                                src={loc.image_url.trim()}
                                                alt={loc.name}
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
                                                width: 52,
                                                height: 52,
                                                borderRadius: 16,
                                                background:
                                                    'rgba(16,185,129,0.12)',
                                                border: '1px solid rgba(16,185,129,0.20)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 24,
                                                marginBottom: 20,
                                            }}
                                        >
                                            📍
                                        </div>
                                    )}
                                    <h3
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 700,
                                            color: P.textDark,
                                            marginBottom: 10,
                                        }}
                                    >
                                        {loc.name}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: 14,
                                            color: P.textDark,
                                            lineHeight: 1.65,
                                            marginBottom: 6,
                                        }}
                                    >
                                        {loc.address}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 13,
                                            color: P.textMuted,
                                            fontWeight: 600,
                                            marginBottom: 14,
                                        }}
                                    >
                                        {loc.city}
                                    </p>
                                    <a
                                        href={`tel:${loc.phone.replace(/\s/g, '')}`}
                                        style={{
                                            fontSize: 14,
                                            color: P.mint,
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            display: 'block',
                                            marginBottom: 8,
                                        }}
                                    >
                                        {loc.phone}
                                    </a>
                                    <p
                                        style={{
                                            fontSize: 13,
                                            color: P.textMuted,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {loc.hours}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════
                    ABOUT US — White with split layout
                ══════════════════════════════════════════════════════════════ */}
                <section id="about-us" className="section bg-white">
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <div className="badge badge-light">
                                {content.aboutUs.badge}
                            </div>
                            <h2
                                className="section-title"
                                style={{ color: P.textDark }}
                            >
                                About{' '}
                                <span className="grad-text-dark">
                                    Lynsi Food Products
                                </span>
                            </h2>
                            <p
                                className="section-sub"
                                style={{
                                    color: P.textMuted,
                                    maxWidth: 560,
                                    margin: '0 auto',
                                }}
                            >
                                {content.aboutUs.subtitle}
                            </p>
                        </div>
                        <div className="about-inner">
                            <div>
                                <p
                                    style={{
                                        fontSize: 16,
                                        color: P.textDark,
                                        lineHeight: 1.85,
                                        marginBottom: 20,
                                    }}
                                >
                                    {content.aboutUs.paragraph1}
                                </p>
                                <p
                                    style={{
                                        fontSize: 16,
                                        color: P.textDark,
                                        lineHeight: 1.85,
                                        marginBottom: 36,
                                    }}
                                >
                                    {content.aboutUs.paragraph2}
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 32,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {[
                                        {
                                            num: content.aboutUs.stat1Num,
                                            label: content.aboutUs.stat1Label,
                                        },
                                        {
                                            num: content.aboutUs.stat2Num,
                                            label: content.aboutUs.stat2Label,
                                        },
                                        {
                                            num: content.aboutUs.stat3Num,
                                            label: content.aboutUs.stat3Label,
                                        },
                                    ].map((s) => (
                                        <div
                                            key={s.label}
                                            style={{
                                                padding: '20px 24px',
                                                borderRadius: 16,
                                                background:
                                                    'rgba(16,185,129,0.07)',
                                                border: '1px solid rgba(16,185,129,0.15)',
                                                minWidth: 110,
                                            }}
                                        >
                                            <div
                                                className="display"
                                                style={{
                                                    fontSize: 28,
                                                    fontWeight: 700,
                                                    color: P.emerald,
                                                }}
                                            >
                                                {s.num}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: P.textMuted,
                                                    fontWeight: 600,
                                                    marginTop: 4,
                                                }}
                                            >
                                                {s.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div
                                className="glass-mint"
                                style={{
                                    borderRadius: 28,
                                    padding: 'clamp(36px,5vw,56px) 32px',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: -30,
                                        right: -30,
                                        width: 160,
                                        height: 160,
                                        borderRadius: '50%',
                                        background:
                                            'radial-gradient(circle, rgba(16,185,129,0.20) 0%, transparent 70%)',
                                        pointerEvents: 'none',
                                    }}
                                />
                                <div
                                    style={{
                                        fontSize: 72,
                                        marginBottom: 16,
                                        lineHeight: 1,
                                    }}
                                >
                                    🌱
                                </div>
                                <h3
                                    className="display"
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: P.emerald,
                                        marginBottom: 12,
                                    }}
                                >
                                    {content.aboutUs.farmToTableTitle}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 15,
                                        color: P.jade,
                                        lineHeight: 1.75,
                                    }}
                                >
                                    {content.aboutUs.farmToTableDesc}
                                </p>
                                <div
                                    style={{
                                        marginTop: 28,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 10,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {[
                                        '🇵🇭 PH Sourced',
                                        '♻️ Zero Waste',
                                        '✓ Certified',
                                    ].map((tag) => (
                                        <span
                                            key={tag}
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: P.jade,
                                                background:
                                                    'rgba(255,255,255,0.6)',
                                                padding: '6px 14px',
                                                borderRadius: '50px',
                                                border: '1px solid rgba(16,185,129,0.20)',
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════
                    TESTIMONIALS — Dark Forest
                ══════════════════════════════════════════════════════════════ */}
                <section className="section bg-forest noise-overlay">
                    <LeafOrb
                        size={380}
                        opacity={0.06}
                        top="-50px"
                        left="-60px"
                        rotate={25}
                        color={P.mint}
                    />
                    <div
                        className="container"
                        style={{ position: 'relative', zIndex: 2 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <div className="badge badge-dark">
                                💬 Customer Stories
                            </div>
                            <h2
                                className="section-title"
                                style={{ color: P.white }}
                            >
                                Loved by{' '}
                                <span className="grad-text">
                                    People Worldwide
                                </span>
                            </h2>
                            <p
                                className="section-sub"
                                style={{
                                    color: P.onDarkMuted,
                                    maxWidth: 440,
                                    margin: '0 auto',
                                }}
                            >
                                Real people, real results. See what our
                                customers say.
                            </p>
                        </div>
                        <div className="grid-testi">
                            {TESTIMONIALS.map((t) => (
                                <div
                                    key={t.name}
                                    className="testimonial-card glass-dark"
                                >
                                    <Stars count={t.stars} />
                                    <p
                                        style={{
                                            fontSize: 15,
                                            color: P.onDark,
                                            lineHeight: 1.85,
                                            marginBottom: 24,
                                            fontStyle: 'italic',
                                        }}
                                    >
                                        "{t.text}"
                                    </p>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 14,
                                            paddingTop: 18,
                                            borderTop:
                                                '1px solid rgba(255,255,255,0.07)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '50%',
                                                background:
                                                    'rgba(16,185,129,0.15)',
                                                border: '1px solid rgba(52,211,153,0.20)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 24,
                                            }}
                                        >
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                    color: P.white,
                                                    fontSize: 15,
                                                }}
                                            >
                                                {t.name}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    color: P.onDarkMuted,
                                                }}
                                            >
                                                {t.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════
                    CONTACT US — Foam light
                ══════════════════════════════════════════════════════════════ */}
                <section id="contact-us" className="section bg-foam">
                    <div
                        className="container"
                        style={{
                            maxWidth: 900,
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 48 }}>
                            <div className="badge badge-light">
                                {content.contactUs.badge}
                            </div>
                            <h2
                                className="section-title"
                                style={{ color: P.textDark }}
                            >
                                Reach <span className="grad-text-dark">Us</span>{' '}
                                Out
                            </h2>
                            <p
                                className="section-sub"
                                style={{ color: P.textMuted }}
                            >
                                {content.contactUs.subtitle}
                            </p>
                        </div>
                        <div
                            className="grid-contact"
                            style={{ marginBottom: 28 }}
                        >
                            {[
                                {
                                    href: `mailto:${content.contactUs.email}`,
                                    icon: '✉️',
                                    label: 'Email',
                                    value: content.contactUs.email,
                                },
                                {
                                    href: `tel:${(content.contactUs.phone ?? '').replace(/\s/g, '')}`,
                                    icon: '📞',
                                    label: 'Phone',
                                    value: content.contactUs.phone,
                                },
                                {
                                    href: undefined,
                                    icon: '📍',
                                    label: 'Address',
                                    value: content.contactUs.address,
                                },
                            ].map((c) =>
                                c.href ? (
                                    <a
                                        key={c.label}
                                        href={c.href}
                                        className="contact-card glass-light"
                                    >
                                        <div
                                            style={{
                                                width: 52,
                                                height: 52,
                                                borderRadius: 16,
                                                background:
                                                    'rgba(16,185,129,0.10)',
                                                border: '1px solid rgba(16,185,129,0.18)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 24,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {c.icon}
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: P.textMuted,
                                                    letterSpacing: '0.5px',
                                                    textTransform: 'uppercase',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {c.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: 600,
                                                    color: P.textDark,
                                                }}
                                            >
                                                {c.value}
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <div
                                        key={c.label}
                                        className="contact-card glass-light"
                                    >
                                        <div
                                            style={{
                                                width: 52,
                                                height: 52,
                                                borderRadius: 16,
                                                background:
                                                    'rgba(16,185,129,0.10)',
                                                border: '1px solid rgba(16,185,129,0.18)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 24,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {c.icon}
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: P.textMuted,
                                                    letterSpacing: '0.5px',
                                                    textTransform: 'uppercase',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {c.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: 600,
                                                    color: P.textDark,
                                                }}
                                            >
                                                {c.value}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Link href="/contact" className="btn-primary">
                                ✉️ Send a message or query
                            </Link>
                        </div>
                        <p
                            style={{
                                textAlign: 'center',
                                fontSize: 14,
                                color: P.textMuted,
                                lineHeight: 1.75,
                            }}
                        >
                            {content.contactUs.footerNote}
                        </p>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════
                    CTA — Dark forest glass panel
                ══════════════════════════════════════════════════════════════ */}

                {/* ══════════════════════════════════════════════════════════════
                    FOOTER — Deepest forest
                ══════════════════════════════════════════════════════════════ */}
                <footer
                    style={{
                        background: P.forest,
                        color: P.onDark,
                        padding: 'clamp(56px,8vw,80px) 20px 32px',
                        borderTop: '1px solid rgba(52,211,153,0.10)',
                    }}
                >
                    <div className="container">
                        <div
                            className="footer-grid"
                            style={{ marginBottom: 56 }}
                        >
                            {/* Brand */}
                            <div>
                                <Link
                                    href="/"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        marginBottom: 16,
                                        textDecoration: 'none',
                                    }}
                                >
                                    <img
                                        src={LOGO_URL}
                                        alt=""
                                        style={{
                                            height: 40,
                                            width: 'auto',
                                            maxWidth: 140,
                                            objectFit: 'contain',
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontFamily:
                                                "'Playfair Display', serif",
                                            fontWeight: 700,
                                            fontSize: 18,
                                            color: P.white,
                                        }}
                                    >
                                        Lynsi
                                        <span style={{ color: P.mint }}>
                                            Foods
                                        </span>
                                    </span>
                                </Link>
                                <p
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 1.8,
                                        color: P.onDarkMuted,
                                        maxWidth: 240,
                                    }}
                                >
                                    Philippines' leading organic food delivery
                                    platform. Fresh, healthy, sustainably
                                    sourced.
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 10,
                                        marginTop: 24,
                                    }}
                                >
                                    {['📘', '📷', '🐦', '▶️'].map((icon, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 12,
                                                background:
                                                    'rgba(255,255,255,0.06)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 18,
                                                textDecoration: 'none',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background =
                                                    'rgba(16,185,129,0.15)';
                                                e.currentTarget.style.borderColor =
                                                    'rgba(52,211,153,0.30)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background =
                                                    'rgba(255,255,255,0.06)';
                                                e.currentTarget.style.borderColor =
                                                    'rgba(255,255,255,0.08)';
                                            }}
                                        >
                                            {icon}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Menu */}
                            <div>
                                <h4
                                    style={{
                                        fontWeight: 700,
                                        color: P.white,
                                        fontSize: 13,
                                        marginBottom: 20,
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Menu
                                </h4>
                                {[
                                    'Fresh Produce',
                                    'Dairy & Eggs',
                                    'Meat & Seafood',
                                    'Pantry Staples',
                                    'Beverages',
                                    'Snacks',
                                ].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        style={{
                                            display: 'block',
                                            fontSize: 14,
                                            color: P.onDarkMuted,
                                            marginBottom: 12,
                                            textDecoration: 'none',
                                            transition: 'color 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color =
                                                P.sage;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color =
                                                P.onDarkMuted;
                                        }}
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>

                            {/* Legal */}
                            <div>
                                <h4
                                    style={{
                                        fontWeight: 700,
                                        color: P.white,
                                        fontSize: 13,
                                        marginBottom: 20,
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Legal
                                </h4>
                                {[
                                    'Privacy Policy',
                                    'Terms of Service',
                                    'Cookie Policy',
                                    'Refund Policy',
                                ].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        style={{
                                            display: 'block',
                                            fontSize: 14,
                                            color: P.onDarkMuted,
                                            marginBottom: 12,
                                            textDecoration: 'none',
                                            transition: 'color 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color =
                                                P.sage;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color =
                                                P.onDarkMuted;
                                        }}
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>

                            {/* Newsletter */}
                            <div>
                                <h4
                                    style={{
                                        fontWeight: 700,
                                        color: P.white,
                                        fontSize: 13,
                                        marginBottom: 12,
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Newsletter
                                </h4>
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: P.onDarkMuted,
                                        marginBottom: 20,
                                        lineHeight: 1.65,
                                    }}
                                >
                                    Get healthy recipes &amp; exclusive deals in
                                    your inbox.
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 10,
                                    }}
                                >
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        style={{
                                            background:
                                                'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(255,255,255,0.10)',
                                            borderRadius: 12,
                                            padding: '12px 16px',
                                            minHeight: 48,
                                            color: P.white,
                                            fontSize: 14,
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor =
                                                'rgba(52,211,153,0.40)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor =
                                                'rgba(255,255,255,0.10)';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        style={{ minHeight: 48 }}
                                    >
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer bottom */}
                        <div
                            style={{
                                borderTop: '1px solid rgba(255,255,255,0.06)',
                                paddingTop: 28,
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 16,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <p style={{ fontSize: 13, color: P.onDarkMuted }}>
                                © 2026 Lynsi Food Products. All rights reserved.
                            </p>
                            <div style={{ display: 'flex', gap: 20 }}>
                                {['Privacy', 'Terms', 'Sitemap'].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        style={{
                                            fontSize: 13,
                                            color: P.onDarkMuted,
                                            textDecoration: 'none',
                                            transition: 'color 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color =
                                                P.sage;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color =
                                                P.onDarkMuted;
                                        }}
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                            <a
                                href="https://treebyte.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: 13,
                                    color: P.onDarkMuted,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    transition: 'color 0.2s',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = P.sage;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = P.onDarkMuted;
                                }}
                            >
                                Powered by{' '}
                                <strong style={{ color: P.onDark }}>
                                    TreeByte
                                </strong>{' '}
                                Software
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
