import { Head, Link, usePage } from '@inertiajs/react';
import { Home, ShoppingBag, MapPin, Info, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

// ─── Emerald E‑commerce Palette ───────────────────────────────────────────────
const PALETTE = {
    primary: '#065f46',      // emerald-800
    secondary: '#047857',   // emerald-700
    accent: '#10b981',      // emerald-500
    muted: '#059669',       // emerald-600
    light: '#d1fae5',       // emerald-100
    bg: '#ecfdf5',          // emerald-50
    border: '#a7f3d0',       // emerald-200
    dark: '#022c22',        // emerald-950
    onDark: '#a7f3d0',      // emerald-200 on dark bg
    onDarkMuted: '#6ee7b7', // emerald-300
    white: '#ffffff',
} as const;

const LOGO_URL = '/mylogo/logopng%20(1).png';

const NAV_ITEMS: { id: string; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'our-locations', label: 'Our Locations', icon: MapPin },
    { id: 'about-us', label: 'About Us', icon: Info },
    { id: 'contact-us', label: 'Contact Us', icon: Mail },
];

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
        color: '#dcfce7',
    },
    {
        name: 'Farm-Fresh Tomatoes',
        price: '₱120',
        unit: '/kg',
        category: 'Vegetables',
        icon: '🍅',
        badge: 'Harvested Today',
        color: '#fee2e2',
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
        color: '#ffedd5',
    },
];

const PARTNERS = ['FreshMart', 'GreenLeaf Co.', 'NaturaBite', 'OrganicHub', 'EcoFarm', 'PureGrown', 'HarvestPlus', 'VerdeFoods'];

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
        desc: "Our team carefully handpicks, inspects, and packs your order in eco-friendly, temperature-controlled packaging.",
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
        text: "Lynsi Food Products has completely transformed how I cook. The freshness is unbeatable and I love knowing exactly where my food comes from. Highly recommend!",
    },
    {
        name: 'Carlos Reyes',
        role: 'Fitness Coach, Cebu',
        avatar: '🏋️',
        stars: 5,
        text: "As a fitness coach, I recommend Lynsi to all my clients. The organic quality is top-notch and my clients have seen real improvements in their energy levels.",
    },
    {
        name: 'Ana Lim',
        role: 'Mother of 3, Davao',
        avatar: '👨‍👩‍👧',
        stars: 5,
        text: "I feel so much better knowing my kids are eating clean food. The same-day delivery is a game changer for our busy family schedule. We love Lynsi!",
    },
];

/** Deep-merge incoming landing content with defaults so missing sections (e.g. partners) always have values. */
function mergeWithDefaults(incoming: ReturnType<typeof getDefaultLandingContent> | null | undefined): ReturnType<typeof getDefaultLandingContent> {
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
            // Use incoming items only when server sent an array (so 1 or 0 items show correctly)
            items: Array.isArray(incoming.partners?.items) ? incoming.partners.items : (d.partners?.items ?? []),
        },
    };
}

/** Default landing content when none is provided from the server (e.g. before migration). */
function getDefaultLandingContent() {
    return {
        hero: {
            badge: '🌿 Philippines #1 Organic Food Platform',
            titleLine1: 'Lynsi Food Products,',
            titleLine2: 'Taste Beyond Compare',
            subtitle: 'Discover over 500+ certified organic products from trusted local farms. Healthier eating, starting today — no compromises.',
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
            subtitle: 'Hand-picked, certified organic produce fresh from our local farm partners to your table.',
            catalogueLabel: 'View Full Catalogue →',
            items: [...PRODUCTS],
        },
        benefits: {
            badge: '🌿 Why Choose Lynsi',
            title: 'Benefits That Matter to You',
            subtitle: "We don't just deliver food — we deliver a healthier, greener, more conscious lifestyle straight to your home.",
            items: [...BENEFITS],
        },
        howItWorks: {
            badge: '⚡ Simple Process',
            title: 'How It Works',
            subtitle: 'From browse to doorstep in 3 effortless steps. Fresh food has never been this easy.',
            steps: [...STEPS],
        },
        locations: {
            badge: '📍 Visit Us',
            title: 'Our Locations',
            subtitle: 'Find a Lynsi store near you. Walk in for fresh picks or order ahead for same-day pickup and delivery.',
            items: [...LOCATIONS],
        },
        aboutUs: {
            badge: '🌿 Our Story',
            title: 'About Lynsi Food Products',
            subtitle: "We're on a mission to make fresh, organic food accessible to every Filipino family.",
            paragraph1: 'Lynsi Food Products started with a simple belief: everyone deserves access to clean, nutritious food straight from the farm. We partner directly with certified organic growers across the Philippines to bring you over 500+ products — from fresh produce to pantry staples — delivered to your doorstep.',
            paragraph2: "Our values are rooted in sustainability, transparency, and community. We're committed to zero-waste packaging, fair partnerships with local farmers, and the highest quality standards so you can eat with confidence.",
            stat1Num: '500+',
            stat1Label: 'Organic Products',
            stat2Num: '50k+',
            stat2Label: 'Happy Families',
            stat3Num: '100%',
            stat3Label: 'Philippine Sourced',
            farmToTableTitle: 'Farm to Table',
            farmToTableDesc: 'Every product is traceable to our partner farms. Quality you can trust.',
        },
        contactUs: {
            badge: '📬 Get in Touch',
            title: 'Contact Us',
            subtitle: "Have questions, feedback, or need support? We'd love to hear from you.",
            email: 'hello@lynsi.com',
            phone: '+63 2 8123 4567',
            address: 'Metro Manila, Philippines',
            footerNote: "We typically respond within 24 hours. For orders and delivery support, you can also reach us through your account dashboard after signing in.",
        },
        partners: {
            title: 'Trusted by leading food brands & retailers',
            items: [...PARTNERS],
        },
    };
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
    return (
        <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }} aria-label={`${count} stars`}>
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} style={{ color: '#f59e0b', fontSize: '16px' }}>★</span>
            ))}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const SECTION_IDS = ['home', 'products', 'our-locations', 'about-us', 'contact-us'];
const NAV_HEIGHT_PX = 72; // match .lynsi-nav-spacer so "active line" is just below fixed nav

type LandingContent = ReturnType<typeof getDefaultLandingContent>;

type FeaturedProduct = {
    id: number;
    slug?: string;
    name: string;
    description: string | null;
    expiry: string | null;
    image_url: string | null;
    category: string | null;
    variants: { size: string | null; flavor: string | null; price: string; stock_quantity: number }[];
};

export default function Welcome({
    canRegister = true,
    landingContent,
    featuredProducts = [],
}: {
    canRegister?: boolean;
    landingContent?: LandingContent | null;
    featuredProducts?: FeaturedProduct[];
}) {
    const { auth } = usePage().props as { auth: { user: unknown } };
    const content = mergeWithDefaults(landingContent);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // Scroll-spy: which section is at the "active line" (just below fixed nav)
    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                raf = 0;
                let best: { id: string; top: number } | null = null;
                for (const id of SECTION_IDS) {
                    const el = document.getElementById(id);
                    if (!el) continue;
                    const top = el.getBoundingClientRect().top;
                    // Section is "current" if its top is at or above the active line; pick the one closest below the line
                    if (top <= NAV_HEIGHT_PX + 24) {
                        if (!best || top >= best.top) best = { id, top };
                    }
                }
                if (best) setActiveSection(best.id);
                else if (SECTION_IDS.length) setActiveSection(SECTION_IDS[0]);
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <Head title="Lynsi Food Products – Fresh Organic Delivered to You">
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <style>{`
                    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                    html { scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; overflow-x: hidden; }
                    body { font-family: 'Inter', sans-serif; font-size: 16px; overflow-x: hidden; }

                    .lynsi-nav-sticky {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 1000;
                    }
                    .lynsi-nav-spacer { padding-top: 64px; }
                    @media (min-width: 768px) {
                        .lynsi-nav-spacer { padding-top: 68px; }
                    }
                    section[id] { scroll-margin-top: 72px; }

                    .lynsi-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; width: 100%; }
                    @media (min-width: 768px) { .lynsi-container { padding: 0 24px; } }
                    @supports (padding: max(0px)) {
                        .lynsi-container { padding-left: max(20px, env(safe-area-inset-left)); padding-right: max(20px, env(safe-area-inset-right)); }
                    }

                    .lynsi-section { padding: 48px 20px; }
                    @media (min-width: 768px) { .lynsi-section { padding: 80px 24px; } }
                    @media (min-width: 1024px) { .lynsi-section { padding: 96px 24px; } }

                    .lynsi-hero-section { padding: 40px 20px 56px; position: relative; }
                    @media (min-width: 768px) { .lynsi-hero-section { padding: 56px 24px 72px; } }
                    @media (min-width: 1024px) { .lynsi-hero-section { padding: 64px 48px 80px; } }
                    .lynsi-hero-section .lynsi-section-title { margin-bottom: 20px; font-size: clamp(28px, 4.5vw, 48px); line-height: 1.2; }
                    .lynsi-hero-section .lynsi-section-desc { margin-bottom: 32px; font-size: 17px; line-height: 1.65; }
                    .lynsi-hero-section .lynsi-hero-social-proof { font-size: 15px; font-weight: 500; margin-bottom: 28px; display: flex; align-items: center; gap: 10px; }
                    .lynsi-hero-section .lynsi-hero-social-dots { display: flex; align-items: center; }
                    .lynsi-hero-section .lynsi-hero-social-dots span { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #ecfdf5; margin-left: -10px; background: linear-gradient(135deg, #10b981, #059669); flex-shrink: 0; }
                    .lynsi-hero-section .lynsi-hero-social-dots span:first-child { margin-left: 0; }
                    .lynsi-hero-section .lynsi-hero-social-dots span:nth-child(2) { background: linear-gradient(135deg, #34d399, #10b981); }
                    .lynsi-hero-section .lynsi-hero-social-dots span:nth-child(3) { background: linear-gradient(135deg, #6ee7b7, #34d399); }
                    .lynsi-hero-section .section-badge { margin-bottom: 12px; }
                    @media (max-width: 480px) {
                        .lynsi-hero-section .section-badge { font-size: 11px; padding: 6px 12px; white-space: normal; text-align: left; }
                        .lynsi-hero-section .lynsi-section-title { font-size: 26px; }
                    }

                    .lynsi-btn-primary {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        min-height: 44px;
                        min-width: 44px;
                        background: linear-gradient(135deg, #047857 0%, #065f46 100%);
                        color: #fff;
                        font-weight: 600;
                        font-size: 15px;
                        padding: 14px 28px;
                        border-radius: 12px;
                        border: none;
                        cursor: pointer;
                        transition: all 0.25s ease;
                        box-shadow: 0 4px 14px rgba(6,95,70,0.35);
                        text-decoration: none;
                    }
                    .lynsi-btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(6,95,70,0.4);
                        background: linear-gradient(135deg, #059669 0%, #047857 100%);
                    }
                    @media (max-width: 480px) { .lynsi-btn-primary { padding: 12px 20px; font-size: 14px; width: 100%; justify-content: center; } }

                    .lynsi-btn-secondary {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        min-height: 44px;
                        background: transparent;
                        color: #065f46;
                        font-weight: 600;
                        font-size: 15px;
                        padding: 12px 28px;
                        border-radius: 12px;
                        border: 2px solid #047857;
                        cursor: pointer;
                        transition: all 0.25s ease;
                        text-decoration: none;
                    }
                    .lynsi-btn-secondary:hover {
                        background: #ecfdf5;
                        transform: translateY(-2px);
                    }
                    @media (max-width: 480px) { .lynsi-btn-secondary { padding: 12px 20px; font-size: 14px; } }

                    .benefit-card {
                        background: #fff;
                        border: 1px solid #a7f3d0;
                        border-radius: 16px;
                        padding: 24px 20px;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }
                    .benefit-card::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0;
                        height: 3px;
                        background: linear-gradient(90deg, #10b981, #065f46);
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    .benefit-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 16px 40px rgba(6,95,70,0.12);
                        border-color: #6ee7b7;
                    }
                    .benefit-card:hover::before { opacity: 1; }
                    @media (max-width: 767px) { .benefit-card { padding: 20px 16px; } }

                    .product-card {
                        background: #fff;
                        border: 1px solid #a7f3d0;
                        border-radius: 16px;
                        padding: 20px;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                    }
                    .product-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 16px 40px rgba(6,95,70,0.12);
                        border-color: #6ee7b7;
                    }
                    .product-image-placeholder {
                        height: 140px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 56px;
                        margin-bottom: 16px;
                        background: #ecfdf5;
                        transition: transform 0.3s ease;
                    }
                    .product-card:hover .product-image-placeholder { transform: scale(1.03); }
                    @media (min-width: 768px) { .product-image-placeholder { height: 160px; font-size: 64px; } }

                    .testimonial-card {
                        background: #fff;
                        border: 1px solid #a7f3d0;
                        border-radius: 16px;
                        padding: 24px;
                        transition: all 0.3s ease;
                    }
                    .testimonial-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 12px 32px rgba(6,95,70,0.1);
                    }
                    @media (min-width: 768px) { .testimonial-card { padding: 32px; } }

                    .step-card {
                        background: #fff;
                        border: 1px solid #a7f3d0;
                        border-radius: 16px;
                        padding: 28px 20px;
                        text-align: center;
                        transition: all 0.3s ease;
                        position: relative;
                    }
                    .step-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 16px 40px rgba(6,95,70,0.1);
                    }
                    @media (min-width: 768px) { .step-card { padding: 36px 28px; } }

                    .lynsi-hero-inner { display: flex; flex-direction: column; align-items: flex-start; gap: 0; text-align: left; }
                    .lynsi-hero-inner .lynsi-hero-text { text-align: left; flex: 1; min-width: 0; max-width: 560px; }
                    .lynsi-hero-inner .lynsi-hero-text p { margin-left: 0; margin-right: 0; }
                    .lynsi-hero-visual { width: 100%; min-height: 280px; flex: 1 1 auto; flex-shrink: 0; border-radius: 16px; overflow: hidden; display: flex; align-items: stretch; justify-content: stretch; }
                    .lynsi-hero-visual-inner { flex: 1; width: 100%; min-height: 280px; display: flex; flex-direction: column; align-items: stretch; justify-content: stretch; }
                    .lynsi-hero-visual-card { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; }
                    @media (min-width: 768px) {
                        .lynsi-hero-inner { flex-direction: row; align-items: stretch; justify-content: space-between; gap: 48px; }
                        .lynsi-hero-visual { width: 48%; min-width: 320px; min-height: 360px; flex: 0 1 auto; }
                        .lynsi-hero-visual-inner { min-height: 360px; }
                    }
                    @media (min-width: 1024px) { .lynsi-hero-inner { gap: 64px; } .lynsi-hero-section .lynsi-container { padding-left: max(64px, env(safe-area-inset-left)); } }
                    .lynsi-hero-section .hero-buttons { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: flex-start; }
                    .lynsi-hero-section .hero-buttons .lynsi-btn-primary, .lynsi-hero-section .hero-buttons .lynsi-btn-secondary { min-height: 48px; padding: 14px 28px; font-size: 16px; border-radius: 12px; }
                    .hero-buttons { flex-direction: column; align-items: stretch; gap: 12px; }
                    @media (min-width: 480px) { .hero-buttons { flex-direction: row; align-items: center; flex-wrap: wrap; } }

                    .section-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        background: #d1fae5;
                        color: #065f46;
                        font-size: 12px;
                        font-weight: 600;
                        padding: 6px 14px;
                        border-radius: 50px;
                        border: 1px solid #a7f3d0;
                        margin-bottom: 12px;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                    }
                    @media (min-width: 768px) { .section-badge { font-size: 13px; padding: 6px 16px; margin-bottom: 16px; } }

                    .nav-link {
                        color: #64748b;
                        font-weight: 500;
                        font-size: 14px;
                        text-decoration: none;
                        padding: 10px 14px;
                        min-height: 44px;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        border-radius: 10px;
                        border-bottom: 2px solid transparent;
                        transition: all 0.2s;
                    }
                    .nav-link:hover { color: #065f46; background: rgba(6,95,70,0.06); }
                    .nav-link.nav-link-active {
                        color: #065f46;
                        background: #ecfdf5;
                        border-bottom-color: #10b981;
                    }
                    .nav-link.nav-link-active .nav-link-icon { color: #065f46; }

                    .nav-desktop { display: none; }
                    @media (min-width: 768px) { .nav-desktop { display: flex; } }
                    .nav-mobile-btn { display: flex; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; }
                    @media (min-width: 768px) { .nav-mobile-btn { display: none; } }

                    @media (max-width: 767px) {
                        .lynsi-nav-bar .lynsi-nav-brand { min-width: 0; }
                        .lynsi-nav-bar .lynsi-nav-brand img { max-width: 100px; height: 36px; }
                        .lynsi-nav-bar .lynsi-nav-brand span { font-size: 15px; }
                        .lynsi-nav-bar .lynsi-nav-cta {
                            padding: 6px 12px !important;
                            font-size: 12px !important;
                            font-weight: 600 !important;
                            min-height: 36px !important;
                            white-space: nowrap;
                            border-radius: 10px;
                        }
                    }

                    .partner-badge {
                        display: inline-flex;
                        align-items: center;
                        padding: 8px 16px;
                        border-radius: 50px;
                        background: #fff;
                        border: 1px solid #a7f3d0;
                        color: #047857;
                        font-weight: 600;
                        font-size: 12px;
                        white-space: nowrap;
                        transition: all 0.2s;
                    }
                    .partner-badge:hover {
                        background: #ecfdf5;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(6,95,70,0.12);
                    }
                    @media (min-width: 768px) { .partner-badge { padding: 10px 22px; font-size: 14px; } }

                    .gradient-text {
                        background: linear-gradient(135deg, #065f46 0%, #10b981 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .lynsi-section-title { font-size: clamp(28px, 4vw, 48px); }
                    .lynsi-section-desc { font-size: 15px; }
                    @media (min-width: 768px) { .lynsi-section-desc { font-size: 17px; } }

                    .products-grid { grid-template-columns: 1fr; gap: 16px; }
                    @media (min-width: 480px) { .products-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
                    @media (min-width: 768px) { .products-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; } }

                    .benefits-grid { grid-template-columns: 1fr; gap: 16px; }
                    @media (min-width: 640px) { .benefits-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
                    @media (min-width: 1024px) { .benefits-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

                    .steps-grid { grid-template-columns: 1fr; gap: 20px; }
                    @media (min-width: 768px) { .steps-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

                    .testimonials-grid { grid-template-columns: 1fr; gap: 20px; }
                    @media (min-width: 640px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr); } }
                    @media (min-width: 1024px) { .testimonials-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

                    .contact-grid { grid-template-columns: 1fr; gap: 16px; }
                    @media (min-width: 480px) { .contact-grid { grid-template-columns: repeat(2, 1fr); } }
                    @media (min-width: 768px) { .contact-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

                    .locations-grid { grid-template-columns: 1fr; gap: 20px; }
                    @media (min-width: 640px) { .locations-grid { grid-template-columns: repeat(2, 1fr); } }
                    @media (min-width: 1024px) { .locations-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

                    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
                    @media (min-width: 640px) { .footer-grid { grid-template-columns: repeat(2, 1fr); } }
                    @media (min-width: 1024px) { .footer-grid { grid-template-columns: repeat(4, 1fr); gap: 48px; } }

                    .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
                    @media (min-width: 640px) { .footer-bottom { flex-direction: row; justify-content: space-between; text-align: left; } }
                `}</style>
            </Head>

            <div style={{ background: PALETTE.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: PALETTE.primary }}>

                {/* ── STICKY NAVBAR ─────────────────────────────────────────────────── */}
                <nav className="lynsi-nav-sticky" style={{
                    background: 'rgba(255,255,255,0.96)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${PALETTE.border}`,
                    boxShadow: '0 2px 20px rgba(6,95,70,0.08)',
                }}>
                    <div className="lynsi-container lynsi-nav-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', gap: '12px' }}>
                        <Link href="/" className="lynsi-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit', minWidth: 0 }} aria-label="Lynsi Food Products - Home">
                            <img
                                src={LOGO_URL}
                                alt=""
                                style={{ height: '40px', width: 'auto', maxWidth: '140px', objectFit: 'contain', display: 'block', flexShrink: 1 }}
                            />
                            <span style={{ fontWeight: 800, fontSize: '18px', color: PALETTE.primary, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
                                Lynsi<span style={{ color: PALETTE.accent }}>FoodProducts</span>
                            </span>
                        </Link>

                        <div className="nav-desktop" style={{ alignItems: 'center', gap: '12px' }}>
                            {NAV_ITEMS.map(({ id, label, icon: Icon }) =>
                                id === 'products' ? (
                                    <Link
                                        key={id}
                                        href="/shop"
                                        className={`nav-link ${activeSection === id ? 'nav-link-active' : ''}`}
                                    >
                                        <Icon size={18} className="nav-link-icon" style={{ flexShrink: 0 }} />
                                        <span>{label}</span>
                                    </Link>
                                ) : (
                                    <a
                                        key={id}
                                        href={`#${id}`}
                                        className={`nav-link ${activeSection === id ? 'nav-link-active' : ''}`}
                                        onClick={(e) => { e.preventDefault(); scrollToSection(id); }}
                                    >
                                        <Icon size={18} className="nav-link-icon" style={{ flexShrink: 0 }} />
                                        <span>{label}</span>
                                    </a>
                                ),
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {auth.user ? (
                                <Link href="/dashboard" className="lynsi-btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>Dashboard</Link>
                            ) : (
                                <>
                                    <Link href="/login" className="nav-link nav-desktop">Log in</Link>
                                    {canRegister && (
                                        <Link href="/register" className="lynsi-btn-primary lynsi-nav-cta" style={{ padding: '10px 20px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                                            Get Started Free
                                        </Link>
                                    )}
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="nav-mobile-btn"
                                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: PALETTE.primary }}
                                id="mobile-menu-toggle"
                                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            >
                                {mobileMenuOpen ? '✕' : '☰'}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div style={{ background: PALETTE.white, borderTop: `1px solid ${PALETTE.border}`, padding: '12px 16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {NAV_ITEMS.map(({ id, label, icon: Icon }) =>
                                    id === 'products' ? (
                                        <Link
                                            key={id}
                                            href="/shop"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                                                color: activeSection === id ? PALETTE.primary : PALETTE.muted,
                                                fontWeight: 500, textDecoration: 'none', borderRadius: '10px',
                                                background: activeSection === id ? PALETTE.bg : 'transparent',
                                                minHeight: 44,
                                            }}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Icon size={20} />
                                            <span>{label}</span>
                                        </Link>
                                    ) : (
                                        <a
                                            key={id}
                                            href={`#${id}`}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                                                color: activeSection === id ? PALETTE.primary : PALETTE.muted,
                                                fontWeight: 500, textDecoration: 'none', borderRadius: '10px',
                                                background: activeSection === id ? PALETTE.bg : 'transparent',
                                                minHeight: 44,
                                            }}
                                            onClick={(e) => { e.preventDefault(); scrollToSection(id); setMobileMenuOpen(false); }}
                                        >
                                            <Icon size={20} />
                                            <span>{label}</span>
                                        </a>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </nav>

                <div className="lynsi-nav-spacer">
                {/* ── HERO AREA ─────────────────────────────────────────────────────── */}
                <section id="home" className="lynsi-hero-section" style={{ background: PALETTE.bg, borderBottom: `1px solid ${PALETTE.border}` }}>
                    <div className="lynsi-container">
                        <div className="lynsi-hero-inner">
                            <div className="lynsi-hero-text">
                                <div className="lynsi-hero-social-proof" style={{ color: PALETTE.muted }}>
                                    <div className="lynsi-hero-social-dots" aria-hidden>
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                    <span>{content.hero.stat2Num} {content.hero.stat2Label}</span>
                                </div>
                                <div className="section-badge">{content.hero.badge}</div>
                                <h1 className="lynsi-section-title" style={{ fontWeight: 800, letterSpacing: '-0.02em', color: PALETTE.primary }}>
                                    {content.hero.titleLine1}<br />
                                    <span className="gradient-text">{content.hero.titleLine2}</span>
                                </h1>
                                <p className="lynsi-section-desc" style={{ margin: 0, color: PALETTE.muted }}>
                                    {content.hero.subtitle}
                                </p>
                                <div className="hero-buttons" style={{ marginTop: 8 }}>
                                    <a
                                        href="#products"
                                        className="lynsi-btn-primary"
                                        onClick={(e) => { e.preventDefault(); scrollToSection('products'); }}
                                    >
                                        {content.hero.ctaPrimary}
                                    </a>
                                    <a
                                        href="#how-it-works"
                                        className="lynsi-btn-secondary"
                                        onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
                                    >
                                        {content.hero.ctaSecondary}
                                    </a>
                                </div>
                            </div>
                            <div className="lynsi-hero-visual" style={{ background: PALETTE.white, border: `1px solid ${PALETTE.border}`, boxShadow: '0 20px 50px rgba(6,95,70,0.12)' }}>
                                {(content.hero as { heroImageUrl?: string }).heroImageUrl?.trim() ? (
                                    <img
                                        src={(content.hero as { heroImageUrl?: string }).heroImageUrl!.trim()}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="lynsi-hero-visual-inner" style={{
                                        background: PALETTE.white,
                                        borderRadius: 16,
                                        padding: 12,
                                        boxSizing: 'border-box',
                                    }}>
                                        <div
                                            className="lynsi-hero-visual-card"
                                            style={{
                                                width: '100%',
                                                background: PALETTE.bg,
                                                borderRadius: 14,
                                                border: `1px solid ${PALETTE.border}`,
                                                padding: 'clamp(16px, 4vw, 28px) 20px',
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-start' }}>
                                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: PALETTE.accent }} />
                                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: PALETTE.border }} />
                                            </div>
                                            <div style={{
                                                width: 'min(120px, 22vw)',
                                                height: 'min(120px, 22vw)',
                                                maxWidth: 120,
                                                maxHeight: 120,
                                                borderRadius: '50%',
                                                background: `linear-gradient(135deg, ${PALETTE.accent} 0%, ${PALETTE.secondary} 100%)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
                                            }}>
                                                <svg width="48%" height="48%" viewBox="0 0 24 24" fill="none" stroke={PALETTE.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 20A7 7 0 0 1 9 8a5 5 0 0 1 7-6.5 5.5 5.5 0 0 1 4 2.5 5 5 0 0 1 2 4 7 7 0 0 1-11 12.5z" />
                                                </svg>
                                            </div>
                                            <div style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 700, color: PALETTE.primary, textAlign: 'center', lineHeight: 1.3 }}>
                                                Fresh from the Farm
                                            </div>
                                            <div style={{ fontSize: 'clamp(12px, 1.8vw, 15px)', color: PALETTE.muted, textAlign: 'center', lineHeight: 1.4 }}>
                                                500+ certified organic products, delivered daily
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── PARTNERS (TRUSTED BY) ─────────────────────────────────────────── */}
                {(content.partners?.items?.length ?? 0) > 0 && (
                    <section style={{ background: PALETTE.white, padding: '32px 16px 40px', borderBottom: `1px solid ${PALETTE.border}` }}>
                        <div className="lynsi-container" style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                {content.partners?.title ?? 'Trusted by leading food brands & retailers'}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                {(content.partners?.items ?? [])
                                    .filter((p): p is string => p != null && String(p).trim() !== '')
                                    .map((p, i) => (
                                        <span key={`${i}-${p}`} className="partner-badge">{p}</span>
                                    ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── PRODUCTS ──────────────────────────────────────────────────────── */}
                <section id="products" className="lynsi-section" style={{ background: PALETTE.white }}>
                    <div className="lynsi-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                            <div>
                                <div className="section-badge">{content.products.badge}</div>
                                <h2 className="lynsi-section-title" style={{ fontWeight: 800, color: PALETTE.primary, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                                    {content.products.title?.replace(/\s*Products\s*$/, '')}<span className="gradient-text">Products</span>
                                </h2>
                                <p className="lynsi-section-desc" style={{ color: PALETTE.muted, maxWidth: '500px', lineHeight: 1.7 }}>
                                    {content.products.subtitle}
                                </p>
                            </div>
                            <Link href="/shop" className="lynsi-btn-secondary" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '14px' }}>
                                {content.products.catalogueLabel}
                            </Link>
                        </div>
                        <div className="products-grid" style={{ display: 'grid' }}>
                            {featuredProducts && featuredProducts.length > 0
                                ? featuredProducts.map((p) => {
                                        const minPrice = p.variants?.length
                                            ? Math.min(...p.variants.map((v) => Number(v.price)))
                                            : null;
                                        const cardContent = (
                                            <>
                                                {p.image_url ? (
                                                    <div className="product-image-placeholder" style={{ background: PALETTE.light, padding: 0, overflow: 'hidden' }}>
                                                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                ) : (
                                                    <div className="product-image-placeholder" style={{ background: PALETTE.light }}>
                                                        🛒
                                                    </div>
                                                )}
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                    {p.category && (
                                                        <div style={{ fontSize: '12px', color: PALETTE.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                                            {p.category}
                                                        </div>
                                                    )}
                                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: PALETTE.primary, marginBottom: '8px', lineHeight: 1.4 }}>
                                                        {p.name}
                                                    </h3>
                                                    {p.description && (
                                                        <p style={{ fontSize: '13px', color: PALETTE.muted, lineHeight: 1.5, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                            {p.description}
                                                        </p>
                                                    )}
                                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                                                        <div>
                                                            {minPrice != null && (
                                                                <>
                                                                    <span style={{ fontSize: '14px', color: PALETTE.muted }}>From </span>
                                                                    <span style={{ fontSize: '22px', fontWeight: 800, color: PALETTE.secondary }}>₱{minPrice.toFixed(2)}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                            style={{
                                                                width: '44px', height: '44px', minWidth: '44px', minHeight: '44px',
                                                                borderRadius: '12px', border: 'none',
                                                                background: PALETTE.light, color: PALETTE.primary, fontSize: '20px',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                cursor: 'pointer', transition: 'all 0.2s',
                                                            }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = PALETTE.primary; e.currentTarget.style.color = PALETTE.white; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = PALETTE.light; e.currentTarget.style.color = PALETTE.primary; }}
                                                            aria-label={`Add ${p.name} to cart`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                        return p.slug ? (
                                            <Link key={p.id} href={`/shop/product/${p.slug}`} className="product-card">
                                                {cardContent}
                                            </Link>
                                        ) : (
                                            <div key={p.id} className="product-card">
                                                {cardContent}
                                            </div>
                                        );
                                  })
                                : (content.products.items ?? []).map(p => (
                                        <div key={p.name} className="product-card">
                                            <div style={{
                                                position: 'absolute', top: '12px', right: '12px', zIndex: 2,
                                                background: PALETTE.white, color: PALETTE.secondary, fontSize: '11px', fontWeight: 700,
                                                padding: '4px 10px', borderRadius: '50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            }}>
                                                {p.badge}
                                            </div>
                                            <div className="product-image-placeholder" style={{ background: p.color }}>
                                                {p.icon}
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ fontSize: '12px', color: PALETTE.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                                    {p.category}
                                                </div>
                                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: PALETTE.primary, marginBottom: '12px', lineHeight: 1.4 }}>
                                                    {p.name}
                                                </h3>
                                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
                                                    <div>
                                                        <span style={{ fontSize: '22px', fontWeight: 800, color: PALETTE.secondary }}>{p.price}</span>
                                                        <span style={{ fontSize: '13px', color: PALETTE.muted }}>{p.unit}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        style={{
                                                            width: '44px', height: '44px', minWidth: '44px', minHeight: '44px',
                                                            borderRadius: '12px', border: 'none',
                                                            background: PALETTE.light, color: PALETTE.primary, fontSize: '20px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer', transition: 'all 0.2s',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = PALETTE.primary; e.currentTarget.style.color = PALETTE.white; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = PALETTE.light; e.currentTarget.style.color = PALETTE.primary; }}
                                                        aria-label={`Add ${p.name} to cart`}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                </section>

                {/* ── BENEFITS ──────────────────────────────────────────────────────── */}
                <section id="services" className="lynsi-section" style={{ background: PALETTE.bg }}>
                    <div className="lynsi-container">
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <div className="section-badge">{content.benefits.badge}</div>
                            <h2 className="lynsi-section-title" style={{ fontWeight: 800, color: PALETTE.primary, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                                {content.benefits.title}
                            </h2>
                            <p className="lynsi-section-desc" style={{ color: PALETTE.muted, maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                                {content.benefits.subtitle}
                            </p>
                        </div>
                        <div className="benefits-grid" style={{ display: 'grid' }}>
                            {(content.benefits.items ?? []).map(b => (
                                <div key={b.title} className="benefit-card">
                                    <div style={{
                                        width: '52px', height: '52px', borderRadius: '14px',
                                        background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '26px', marginBottom: '16px',
                                    }}>{b.icon}</div>
                                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: PALETTE.primary, marginBottom: '8px' }}>{b.title}</h3>
                                    <p style={{ fontSize: '14px', color: PALETTE.muted, lineHeight: 1.7 }}>{b.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
                <section id="how-it-works" className="lynsi-section" style={{ background: PALETTE.white }}>
                    <div className="lynsi-container">
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <div className="section-badge">{content.howItWorks.badge}</div>
                            <h2 className="lynsi-section-title" style={{ fontWeight: 800, color: PALETTE.primary, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                                {content.howItWorks.title}
                            </h2>
                            <p className="lynsi-section-desc" style={{ color: PALETTE.muted, maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
                                {content.howItWorks.subtitle}
                            </p>
                        </div>
                        <div className="steps-grid" style={{ display: 'grid', position: 'relative' }}>
                            {(content.howItWorks.steps ?? []).map((s) => (
                                <div key={s.step} className="step-card">
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '14px',
                                        background: `linear-gradient(135deg, ${PALETTE.secondary}, ${PALETTE.primary})`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '20px', fontWeight: 800, color: PALETTE.white,
                                        margin: '0 auto 20px',
                                        boxShadow: '0 6px 20px rgba(6,95,70,0.3)',
                                    }}>{s.step}</div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: PALETTE.primary, marginBottom: '10px' }}>{s.title}</h3>
                                    <p style={{ fontSize: '14px', color: PALETTE.muted, lineHeight: 1.7 }}>{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── OUR LOCATIONS ──────────────────────────────────────────────────── */}
                <section id="our-locations" className="lynsi-section" style={{ background: PALETTE.white }}>
                    <div className="lynsi-container">
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <div className="section-badge">{content.locations.badge}</div>
                            <h2 className="lynsi-section-title" style={{ fontWeight: 800, color: PALETTE.primary, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                                {content.locations.title}
                            </h2>
                            <p className="lynsi-section-desc" style={{ color: PALETTE.muted, maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                                {content.locations.subtitle}
                            </p>
                        </div>
                        <div className="locations-grid" style={{ display: 'grid' }}>
                            {(content.locations.items ?? []).map((loc, idx) => (
                                <div key={loc.name || idx} className="benefit-card" style={{ textAlign: 'left' }}>
                                    {loc.tag && (
                                        <span style={{
                                            position: 'absolute', top: '16px', right: '16px',
                                            fontSize: '11px', fontWeight: 700, color: PALETTE.secondary,
                                            background: PALETTE.light, padding: '4px 10px', borderRadius: '50px',
                                        }}>
                                            {loc.tag}
                                        </span>
                                    )}
                                    {loc.image_url?.trim() ? (
                                        <div style={{
                                            width: '100%', aspectRatio: '16/10', borderRadius: '12px',
                                            overflow: 'hidden', marginBottom: '16px', background: PALETTE.light,
                                        }}>
                                            <img
                                                src={loc.image_url.trim()}
                                                alt={loc.name || 'Location'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px',
                                            background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '22px', marginBottom: '16px',
                                        }}>📍</div>
                                    )}
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: PALETTE.primary, marginBottom: '10px' }}>{loc.name}</h3>
                                    <p style={{ fontSize: '14px', color: PALETTE.primary, lineHeight: 1.6, marginBottom: '8px' }}>{loc.address}</p>
                                    <p style={{ fontSize: '13px', color: PALETTE.muted, fontWeight: 600, marginBottom: '12px' }}>{loc.city}</p>
                                    <a href={`tel:${loc.phone.replace(/\s/g, '')}`} style={{ fontSize: '14px', color: PALETTE.accent, fontWeight: 600, textDecoration: 'none', display: 'block', marginBottom: '6px' }}>
                                        {loc.phone}
                                    </a>
                                    <p style={{ fontSize: '13px', color: PALETTE.muted }}>{loc.hours}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── ABOUT US ─────────────────────────────────────────────────────── */}
                <section id="about-us" className="lynsi-section" style={{ background: PALETTE.bg }}>
                    <div className="lynsi-container" style={{ maxWidth: '1100px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <div className="section-badge">{content.aboutUs.badge}</div>
                            <h2 className="lynsi-section-title" style={{ fontWeight: 800, color: PALETTE.primary, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                                About <span className="gradient-text">Lynsi Food Products</span>
                            </h2>
                            <p className="lynsi-section-desc" style={{ color: PALETTE.muted, maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
                                {content.aboutUs.subtitle}
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px', alignItems: 'center' }} className="benefits-grid">
                            <div>
                                <p className="lynsi-section-desc" style={{ color: PALETTE.primary, lineHeight: 1.8, marginBottom: '16px' }}>
                                    {content.aboutUs.paragraph1}
                                </p>
                                <p className="lynsi-section-desc" style={{ color: PALETTE.primary, lineHeight: 1.8, marginBottom: '24px' }}>
                                    {content.aboutUs.paragraph2}
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                    {[
                                        { num: content.aboutUs.stat1Num, label: content.aboutUs.stat1Label },
                                        { num: content.aboutUs.stat2Num, label: content.aboutUs.stat2Label },
                                        { num: content.aboutUs.stat3Num, label: content.aboutUs.stat3Label },
                                    ].map(({ num, label }) => (
                                        <div key={label}>
                                            <div style={{ fontSize: '22px', fontWeight: 800, color: PALETTE.primary }}>{num}</div>
                                            <div style={{ fontSize: '12px', color: PALETTE.muted, fontWeight: 600 }}>{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="benefit-card" style={{
                                borderRadius: '20px',
                                background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                padding: '40px 24px',
                                textAlign: 'center',
                                border: `1px solid ${PALETTE.border}`,
                            }}>
                                <div style={{ fontSize: '64px', marginBottom: '12px' }}>🌱</div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: PALETTE.primary, marginBottom: '10px' }}>{content.aboutUs.farmToTableTitle}</h3>
                                <p style={{ fontSize: '14px', color: PALETTE.muted, lineHeight: 1.7 }}>
                                    {content.aboutUs.farmToTableDesc}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
                <section className="lynsi-section" style={{ background: PALETTE.white }}>
                    <div className="lynsi-container">
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <div className="section-badge">💬 Customer Stories</div>
                            <h2 className="lynsi-section-title" style={{ fontWeight: 800, color: PALETTE.primary, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                                Loved by People Worldwide
                            </h2>
                            <p className="lynsi-section-desc" style={{ color: PALETTE.muted, maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
                                Real people, real results. See what our customers say about Lynsi Foods.
                            </p>
                        </div>
                        <div className="testimonials-grid" style={{ display: 'grid' }}>
                            {TESTIMONIALS.map(t => (
                                <div key={t.name} className="testimonial-card">
                                    <Stars count={t.stars} />
                                    <p style={{ fontSize: '15px', color: PALETTE.primary, lineHeight: 1.8, marginBottom: '20px', fontStyle: 'italic' }}>
                                        "{t.text}"
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '24px',
                                        }}>{t.avatar}</div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: PALETTE.primary, fontSize: '15px' }}>{t.name}</div>
                                            <div style={{ fontSize: '13px', color: PALETTE.muted }}>{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CONTACT US ────────────────────────────────────────────────────── */}
                <section id="contact-us" className="lynsi-section" style={{ background: PALETTE.bg }}>
                    <div className="lynsi-container" style={{ maxWidth: '900px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div className="section-badge">{content.contactUs.badge}</div>
                            <h2 className="lynsi-section-title" style={{ fontWeight: 800, color: PALETTE.primary, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                                Contact <span className="gradient-text">Us</span>
                            </h2>
                            <p className="lynsi-section-desc" style={{ color: PALETTE.muted, lineHeight: 1.7 }}>
                                {content.contactUs.subtitle}
                            </p>
                        </div>
                        <div className="contact-grid" style={{ display: 'grid', marginBottom: '32px' }}>
                            <a href={`mailto:${content.contactUs.email}`} style={{
                                display: 'flex', alignItems: 'center', gap: '16px', padding: '24px 20px',
                                background: PALETTE.white, border: `1px solid ${PALETTE.border}`, borderRadius: '16px',
                                textDecoration: 'none', color: 'inherit', transition: 'all 0.25s', minHeight: '44px',
                            }} className="benefit-card">
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                                }}>✉️</div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, marginBottom: '2px' }}>Email</div>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: PALETTE.primary }}>{content.contactUs.email}</div>
                                </div>
                            </a>
                            <a href={`tel:${(content.contactUs.phone ?? '').replace(/\s/g, '')}`} style={{
                                display: 'flex', alignItems: 'center', gap: '16px', padding: '24px 20px',
                                background: PALETTE.white, border: `1px solid ${PALETTE.border}`, borderRadius: '16px',
                                textDecoration: 'none', color: 'inherit', transition: 'all 0.25s', minHeight: '44px',
                            }} className="benefit-card">
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                                }}>📞</div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, marginBottom: '2px' }}>Phone</div>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: PALETTE.primary }}>{content.contactUs.phone}</div>
                                </div>
                            </a>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '16px', padding: '24px 20px',
                                background: PALETTE.white, border: `1px solid ${PALETTE.border}`, borderRadius: '16px',
                                minHeight: '44px',
                            }} className="benefit-card">
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${PALETTE.light}, ${PALETTE.border})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                                }}>📍</div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: PALETTE.muted, marginBottom: '2px' }}>Address</div>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: PALETTE.primary }}>{content.contactUs.address}</div>
                                </div>
                            </div>
                        </div>
                        <p className="lynsi-section-desc" style={{ textAlign: 'center', color: PALETTE.muted, lineHeight: 1.7 }}>
                            {content.contactUs.footerNote}
                        </p>
                    </div>
                </section>

                {/* ── CTA SECTION ───────────────────────────────────────────────────── */}
                <section className="lynsi-section" style={{ padding: '48px 16px 64px' }}>
                    <div className="lynsi-container" style={{ maxWidth: '1100px' }}>
                        <div style={{
                            background: `linear-gradient(135deg, ${PALETTE.primary} 0%, ${PALETTE.secondary} 50%, ${PALETTE.accent} 100%)`,
                            borderRadius: '24px',
                            padding: 'clamp(40px, 5vw, 64px) clamp(24px, 4vw, 48px)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 24px 60px rgba(6,95,70,0.35)',
                        }}>
                            <div style={{
                                position: 'absolute', top: '-50px', right: '-50px',
                                width: '240px', height: '240px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.08)', filter: 'blur(24px)',
                            }} />
                            <div style={{
                                position: 'absolute', bottom: '-50px', left: '-50px',
                                width: '200px', height: '200px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.06)', filter: 'blur(24px)',
                            }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ fontSize: 'clamp(36px, 5vw, 48px)', marginBottom: '12px' }}>🌿</div>
                                <h2 className="lynsi-section-title" style={{ fontWeight: 900, color: PALETTE.white, marginBottom: '12px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                                    Start Eating Healthier Today
                                </h2>
                                <p className="lynsi-section-desc" style={{ color: PALETTE.onDarkMuted, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                                    Join 50,000+ customers who have already made the switch to fresh, organic living.
                                </p>
                                <div className="hero-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <a href="/register" className="lynsi-btn-primary" style={{
                                        background: PALETTE.white, color: PALETTE.primary, padding: '14px 32px',
                                        boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
                                    }} id="cta-get-started">
                                        🛒 Get Started Free
                                    </a>
                                    <a href="#how-it-works" className="lynsi-btn-secondary" style={{
                                        background: 'rgba(255,255,255,0.12)', color: PALETTE.white, borderColor: 'rgba(255,255,255,0.4)',
                                    }}>
                                        Learn More
                                    </a>
                                </div>
                                <p style={{ marginTop: '20px', fontSize: '12px', color: PALETTE.onDark }}>
                                    ✓ No credit card required &nbsp;·&nbsp; ✓ Cancel anytime &nbsp;·&nbsp; ✓ 100% satisfaction guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FOOTER ────────────────────────────────────────────────────────── */}
                <footer style={{ background: PALETTE.dark, color: PALETTE.onDark, padding: '48px 16px 24px' }}>
                    <div className="lynsi-container">
                        <div className="footer-grid" style={{ display: 'grid', marginBottom: '48px' }}>
                            <div>
                                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px', textDecoration: 'none', color: 'inherit' }} aria-label="Lynsi Food Products - Home">
                                    <img
                                        src={LOGO_URL}
                                        alt=""
                                        style={{ height: '40px', width: 'auto', maxWidth: '140px', objectFit: 'contain', display: 'block' }}
                                    />
                                    <span style={{ fontWeight: 800, fontSize: '18px', color: PALETTE.white }}>
                                        Lynsi<span style={{ color: PALETTE.accent }}>FoodProducts</span>
                                    </span>
                                </Link>
                                <p style={{ fontSize: '14px', lineHeight: 1.75, color: PALETTE.onDarkMuted, maxWidth: '260px' }}>
                                    Philippines' leading organic food delivery platform. Fresh, healthy, and sustainably sourced.
                                </p>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                                    {['📘', '📷', '🐦', '▶️'].map((icon, i) => (
                                        <a key={i} href="#" style={{
                                            width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: '18px', textDecoration: 'none',
                                            transition: 'background 0.2s',
                                        }} aria-label={`Social link ${i + 1}`}>{icon}</a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontWeight: 700, color: PALETTE.white, fontSize: '14px', marginBottom: '16px' }}>Menu</h4>
                                {['Fresh Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Pantry Staples', 'Beverages', 'Snacks'].map(item => (
                                    <a key={item} href="#" style={{ display: 'block', fontSize: '14px', color: PALETTE.onDarkMuted, marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s', padding: '4px 0' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = PALETTE.onDark; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = PALETTE.onDarkMuted; }}
                                    >{item}</a>
                                ))}
                            </div>

                            <div>
                                <h4 style={{ fontWeight: 700, color: PALETTE.white, fontSize: '14px', marginBottom: '16px' }}>Legal</h4>
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'].map(item => (
                                    <a key={item} href="#" style={{ display: 'block', fontSize: '14px', color: PALETTE.onDarkMuted, marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s', padding: '4px 0' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = PALETTE.onDark; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = PALETTE.onDarkMuted; }}
                                    >{item}</a>
                                ))}
                            </div>

                            <div>
                                <h4 style={{ fontWeight: 700, color: PALETTE.white, fontSize: '14px', marginBottom: '8px' }}>Newsletter</h4>
                                <p style={{ fontSize: '13px', color: PALETTE.onDarkMuted, marginBottom: '14px', lineHeight: 1.6 }}>
                                    Get healthy recipes &amp; exclusive deals in your inbox.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        id="newsletter-email"
                                        style={{
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: '12px', padding: '12px 16px', minHeight: '44px',
                                            color: PALETTE.white, fontSize: '14px', outline: 'none',
                                        }}
                                        aria-label="Email for newsletter"
                                    />
                                    <button type="button" id="newsletter-submit" style={{
                                        background: `linear-gradient(135deg, ${PALETTE.accent}, ${PALETTE.secondary})`,
                                        border: 'none', borderRadius: '12px', padding: '12px 16px', minHeight: '44px',
                                        color: PALETTE.white, fontWeight: 600, fontSize: '14px',
                                        cursor: 'pointer', transition: 'all 0.25s',
                                    }}>
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                            <p style={{ fontSize: '12px', color: PALETTE.onDarkMuted }}>
                                © 2026 LynsiFood Products. All rights reserved. Made with 💚 in the Philippines.
                            </p>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                {['Privacy', 'Terms', 'Sitemap'].map(item => (
                                    <a key={item} href="#" style={{ fontSize: '12px', color: PALETTE.onDarkMuted, textDecoration: 'none' }}>{item}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>

                </div>
            </div>
        </>
    );
}
