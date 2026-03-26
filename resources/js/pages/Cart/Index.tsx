import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import L from 'leaflet';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { LandingNav } from '@/components/LandingNav';
import 'leaflet/dist/leaflet.css';

const LOGO_URL = '/mylogo/logopng%20(1).png';

const P = {
    primary: '#065f46',
    secondary: '#047857',
    accent: '#10b981',
    bg: '#f0fdf4',
    card: '#ffffff',
    border: '#d1fae5',
    borderGray: '#e5e7eb',
    accentBg: '#ecfdf5',
    text: '#111827',
    textMuted: '#6b7280',
    textLight: '#9ca3af',
    danger: '#ef4444',
    dangerBg: '#fef2f2',
    white: '#ffffff',
} as const;

type Variant = {
    id: number;
    size: string | null;
    flavor: string | null;
    price: number;
    stock_quantity: number;
    display_name: string;
};

type CartItemData = {
    id: number;
    quantity: number;
    variant: Variant;
    product: {
        id: number;
        name: string;
        slug: string;
        image_url: string | null;
        category: string | null;
    };
    is_guest_item?: boolean;
};

const PH_PROVINCES = [
    'Abra',
    'Agusan del Norte',
    'Agusan del Sur',
    'Aklan',
    'Albay',
    'Antique',
    'Apayao',
    'Aurora',
    'Basilan',
    'Bataan',
    'Batanes',
    'Batangas',
    'Benguet',
    'Biliran',
    'Bohol',
    'Bukidnon',
    'Bulacan',
    'Cagayan',
    'Camarines Norte',
    'Camarines Sur',
    'Camiguin',
    'Capiz',
    'Catanduanes',
    'Cavite',
    'Cebu',
    'Compostela Valley',
    'Cotabato',
    'Davao del Norte',
    'Davao del Sur',
    'Davao Occidental',
    'Davao Oriental',
    'Dinagat Islands',
    'Eastern Samar',
    'Guimaras',
    'Ifugao',
    'Ilocos Norte',
    'Ilocos Sur',
    'Iloilo',
    'Isabela',
    'Kalinga',
    'La Union',
    'Laguna',
    'Lanao del Norte',
    'Lanao del Sur',
    'Leyte',
    'Maguindanao',
    'Marinduque',
    'Masbate',
    'Metro Manila',
    'Misamis Occidental',
    'Misamis Oriental',
    'Mountain Province',
    'Negros Occidental',
    'Negros Oriental',
    'Northern Samar',
    'Nueva Ecija',
    'Nueva Vizcaya',
    'Occidental Mindoro',
    'Oriental Mindoro',
    'Palawan',
    'Pampanga',
    'Pangasinan',
    'Quezon',
    'Quirino',
    'Rizal',
    'Romblon',
    'Samar',
    'Sarangani',
    'Siquijor',
    'Sorsogon',
    'South Cotabato',
    'Southern Leyte',
    'Sultan Kudarat',
    'Sulu',
    'Surigao del Norte',
    'Surigao del Sur',
    'Tarlac',
    'Tawi-Tawi',
    'Zambales',
    'Zamboanga del Norte',
    'Zamboanga del Sur',
    'Zamboanga Sibugay',
];

const PAYMENT_METHODS = [
    {
        id: 'cod',
        label: 'Cash on Delivery',
        icon: 'cod',
        desc: 'Pay when your order arrives.',
    },
    {
        id: 'gcash',
        label: 'GCash',
        icon: 'gcash',
        desc: 'Pay via GCash mobile wallet.',
    },
    {
        id: 'bank_transfer',
        label: 'Bank Transfer',
        icon: 'bank_transfer',
        desc: 'Direct bank deposit or online transfer.',
    },
];

function PaymentIcon({ kind, active }: { kind: string; active: boolean }) {
    const color = active ? P.primary : '#6b7280';
    if (kind === 'cod') {
        return (
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        );
    }
    if (kind === 'gcash') {
        return (
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <path d="M12 18h.01" />
                <path d="M8 6h8M8 10h8M8 14h5" />
            </svg>
        );
    }
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 10h18" />
            <path d="M6 10V7a6 6 0 0 1 12 0v3" />
            <rect x="3" y="10" width="18" height="10" rx="2" />
            <path d="M7 15h.01M12 15h.01M17 15h.01" />
        </svg>
    );
}

function formatPrice(n: number) {
    return `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function estimateShippingFee(province: string): number {
    const normalized = province.trim().toLowerCase();
    if (!normalized || normalized === 'metro manila') return 0;
    if (['cebu', 'iloilo', 'davao del sur', 'davao'].includes(normalized)) {
        return 79;
    }
    return 129;
}

function estimateCouponDiscount(code: string, subtotal: number): number {
    const normalized = code.trim().toUpperCase();
    if (!normalized || subtotal <= 0) return 0;
    if (normalized === 'WELCOME10') return Number((subtotal * 0.1).toFixed(2));
    if (normalized === 'LYNSI50') return Math.min(50, subtotal);
    return 0;
}

type CheckoutFormData = {
    fulfillment_method: 'delivery' | 'pickup';
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_province: string;
    shipping_zip: string;
    payment_method: string;
    coupon_code: string;
    notes: string;
    delivery_latitude: string;
    delivery_longitude: string;
};

// Ensure marker icons render in Vite builds.
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const deliveryPinIcon = L.divIcon({
    className: 'delivery-pin-icon',
    html: `
      <div style="position:relative;width:30px;height:36px;display:flex;align-items:center;justify-content:center;background:#047857;border:2px solid #ffffff;border-radius:999px;box-shadow:0 4px 12px rgba(6,95,70,0.28);">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-check-icon lucide-map-pin-check"><path d="M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728"/><circle cx="12" cy="10" r="3"/><path d="m16 18 2 2 4-4"/></svg>
      </div>
    `,
    iconSize: [30, 36],
    iconAnchor: [15, 34],
});

function DeliveryMapPicker({
    latitude,
    longitude,
    onChange,
}: {
    latitude: string;
    longitude: string;
    onChange: (lat: number, lng: number) => void;
}) {
    const initial: [number, number] =
        latitude && longitude
            ? [Number(latitude), Number(longitude)]
            : [10.6713, 122.9511]; // Bacuyangan area default
    const [position, setPosition] = useState<[number, number]>(initial);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [mapNote, setMapNote] = useState<string>('');
    const [suggestions, setSuggestions] = useState<
        Array<{ display_name: string; lat: string; lon: string }>
    >([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([Number(latitude), Number(longitude)]);
        }
    }, [latitude, longitude]);

    function InteractiveMarker() {
        const map = useMapEvents({
            click: (e) => {
                const next: [number, number] = [e.latlng.lat, e.latlng.lng];
                setPosition(next);
                onChange(next[0], next[1]);
                setMapNote('Pin updated from map click.');
                map.panTo(next);
            },
        });

        return (
            <Marker
                position={position}
                icon={deliveryPinIcon}
                draggable
                eventHandlers={{
                    dragend: (e) => {
                        const ll = e.target.getLatLng();
                        const next: [number, number] = [ll.lat, ll.lng];
                        setPosition(next);
                        onChange(ll.lat, ll.lng);
                        setMapNote('Pin updated by dragging.');
                        map.panTo(next);
                    },
                }}
            />
        );
    }

    async function geocode() {
        const q = search.trim();
        if (!q) return;
        setSearching(true);
        setMapNote('');
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=ph&q=${encodeURIComponent(q)}&limit=1`;
            const res = await fetch(url);
            const json = (await res.json()) as Array<{
                lat: string;
                lon: string;
            }>;
            if (!json.length) {
                setMapNote('No location found. Try a more specific address.');
                return;
            }
            const lat = Number(json[0].lat);
            const lng = Number(json[0].lon);
            setPosition([lat, lng]);
            onChange(lat, lng);
            mapRef.current?.flyTo([lat, lng], mapRef.current.getZoom(), {
                animate: true,
                duration: 0.35,
            });
            setSuggestions([]);
            setShowSuggestions(false);
            setMapNote('Pin updated from search result.');
        } finally {
            setSearching(false);
        }
    }

    function useGps() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((p) => {
            const lat = p.coords.latitude;
            const lng = p.coords.longitude;
            setPosition([lat, lng]);
            onChange(lat, lng);
            mapRef.current?.flyTo([lat, lng], mapRef.current.getZoom(), {
                animate: true,
                duration: 0.35,
            });
            setMapNote('Pin updated from GPS.');
        });
    }

    useEffect(() => {
        const q = search.trim();
        if (q.length < 1) {
            setSuggestions([]);
            setShowSuggestions(false);
            setSuggestionsLoading(false);
            return;
        }
        setShowSuggestions(true);
        setSuggestionsLoading(true);
        const t = window.setTimeout(async () => {
            try {
                const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=ph&q=${encodeURIComponent(q)}&limit=5`;
                const res = await fetch(url);
                const json = (await res.json()) as Array<{
                    display_name: string;
                    lat: string;
                    lon: string;
                }>;
                setSuggestions(json);
            } catch {
                setSuggestions([]);
            } finally {
                setSuggestionsLoading(false);
            }
        }, 120);
        return () => window.clearTimeout(t);
    }, [search]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1, zIndex: 20 }}>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() =>
                            suggestions.length && setShowSuggestions(true)
                        }
                        onBlur={() =>
                            window.setTimeout(
                                () => setShowSuggestions(false),
                                120,
                            )
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                geocode();
                            }
                        }}
                        placeholder="Pin your exact location (Philippines)"
                        style={{
                            width: '100%',
                            padding: '9px 12px',
                            border: `1px solid ${P.borderGray}`,
                            borderRadius: 10,
                            fontSize: 14,
                        }}
                    />
                </div>
                <button
                    type="button"
                    onClick={geocode}
                    disabled={searching}
                    style={{
                        border: 'none',
                        background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                        color: '#fff',
                        borderRadius: 10,
                        padding: '0 14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        opacity: searching ? 0.75 : 1,
                    }}
                >
                    {searching ? 'Searching…' : 'Search'}
                </button>
                <button
                    type="button"
                    onClick={useGps}
                    style={{
                        border: `1px solid ${P.borderGray}`,
                        background: '#fff',
                        borderRadius: 10,
                        padding: '0 12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                    }}
                    title="Use GPS"
                >
                    ◎
                </button>
            </div>

            {showSuggestions &&
                (suggestionsLoading || suggestions.length > 0) && (
                    <div
                        style={{
                            background: '#fff',
                            border: `1px solid ${P.borderGray}`,
                            borderRadius: 10,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            maxHeight: 220,
                            overflowY: 'auto',
                        }}
                    >
                        {suggestionsLoading && (
                            <div
                                style={{
                                    padding: '10px 12px',
                                    fontSize: 13,
                                    color: P.textMuted,
                                }}
                            >
                                Searching places...
                            </div>
                        )}
                        {suggestions.map((s, idx) => (
                            <button
                                key={`${s.lat}-${s.lon}-${idx}`}
                                type="button"
                                onClick={() => {
                                    const lat = Number(s.lat);
                                    const lng = Number(s.lon);
                                    setSearch(s.display_name);
                                    setPosition([lat, lng]);
                                    onChange(lat, lng);
                                    mapRef.current?.flyTo(
                                        [lat, lng],
                                        mapRef.current.getZoom(),
                                        {
                                            animate: true,
                                            duration: 0.35,
                                        },
                                    );
                                    setShowSuggestions(false);
                                    setMapNote(
                                        'Pin updated from place suggestion.',
                                    );
                                }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    border: 'none',
                                    borderBottom:
                                        idx < suggestions.length - 1
                                            ? `1px solid ${P.borderGray}`
                                            : 'none',
                                    background: '#fff',
                                    padding: '10px 12px',
                                    fontSize: 13,
                                    color: P.text,
                                    cursor: 'pointer',
                                }}
                            >
                                {s.display_name}
                            </button>
                        ))}
                    </div>
                )}

            <div
                style={{
                    border: `1px solid ${P.border}`,
                    borderRadius: 12,
                    overflow: 'hidden',
                }}
            >
                <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: 340, width: '100%' }}
                    whenReady={(e) => {
                        mapRef.current = e.target;
                    }}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <InteractiveMarker />
                </MapContainer>
            </div>
            {mapNote && (
                <div style={{ fontSize: 12, color: P.textMuted }}>
                    {mapNote}
                </div>
            )}
            <div style={{ fontSize: 12, color: P.textMuted }}>
                Pinned coordinates: {position[0].toFixed(6)},{' '}
                {position[1].toFixed(6)}
            </div>
        </div>
    );
}

function CheckoutField({
    data,
    setData,
    errors,
    label,
    name,
    type = 'text',
    placeholder,
    required = false,
    as: as_,
}: {
    data: CheckoutFormData;
    setData: (k: keyof CheckoutFormData, v: string) => void;
    errors: Record<string, string>;
    label: string;
    name: keyof CheckoutFormData;
    type?: string;
    placeholder?: string;
    required?: boolean;
    as?: 'textarea' | 'select';
}) {
    const error = errors[name];
    const base: React.CSSProperties = {
        width: '100%',
        padding: '10px 14px',
        border: `1.5px solid ${error ? P.danger : P.borderGray}`,
        borderRadius: 10,
        fontSize: 14,
        color: P.text,
        background: P.white,
        outline: 'none',
        fontFamily: "'Inter', sans-serif",
        transition: 'border-color 0.15s',
        boxSizing: 'border-box',
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {label ? (
                <label style={{ fontSize: 13, fontWeight: 600, color: P.text }}>
                    {label}{' '}
                    {required && <span style={{ color: P.danger }}>*</span>}
                </label>
            ) : null}
            {as_ === 'textarea' ? (
                <textarea
                    value={data[name]}
                    onChange={(e) => setData(name, e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    style={{ ...base, resize: 'vertical', minHeight: 76 }}
                />
            ) : as_ === 'select' ? (
                <select
                    value={data[name]}
                    onChange={(e) => setData(name, e.target.value)}
                    style={{ ...base, cursor: 'pointer' }}
                >
                    <option value="">Select province…</option>
                    {PH_PROVINCES.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={data[name]}
                    onChange={(e) => setData(name, e.target.value)}
                    placeholder={placeholder}
                    style={base}
                />
            )}
            {error ? (
                <span style={{ fontSize: 12, color: P.danger }}>{error}</span>
            ) : null}
        </div>
    );
}

/* ── Qty stepper ── */
function Qty({ item }: { item: CartItemData }) {
    const max = item.variant.stock_quantity || 99;
    const [draft, setDraft] = useState(String(item.quantity));
    const serverQty = String(item.quantity);
    if (
        draft !== serverQty &&
        document.activeElement?.id !== `qty-${item.id}`
    ) {
        setDraft(serverQty);
    }

    const isGuest = item.is_guest_item;
    const patchUrl = isGuest
        ? `/cart/guest/${item.variant.id}`
        : `/cart/${item.id}`;

    function commit(raw: string) {
        const parsed = parseInt(raw, 10);
        if (isNaN(parsed) || parsed < 1) {
            setDraft(serverQty);
            return;
        }
        const clamped = Math.min(parsed, max);
        setDraft(String(clamped));
        if (clamped !== item.quantity) {
            router.patch(
                patchUrl,
                { quantity: clamped },
                { preserveScroll: true },
            );
        }
    }

    function patch(qty: number) {
        const clamped = Math.min(Math.max(1, qty), max);
        setDraft(String(clamped));
        router.patch(patchUrl, { quantity: clamped }, { preserveScroll: true });
    }

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: `1.5px solid ${P.borderGray}`,
                borderRadius: 10,
                overflow: 'hidden',
                background: P.white,
            }}
        >
            <button
                type="button"
                disabled={item.quantity <= 1}
                onClick={() => patch(item.quantity - 1)}
                style={{
                    width: 34,
                    height: 34,
                    background: 'none',
                    border: 'none',
                    cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: 18,
                    color: item.quantity <= 1 ? P.textLight : P.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                    if (item.quantity > 1)
                        (
                            e.currentTarget as HTMLButtonElement
                        ).style.background = P.accentBg;
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                        'none';
                }}
            >
                −
            </button>
            <input
                id={`qty-${item.id}`}
                type="number"
                min={1}
                max={max}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={(e) => commit(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter')
                        (e.currentTarget as HTMLInputElement).blur();
                }}
                style={{
                    width: 44,
                    height: 34,
                    border: 'none',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    color: P.text,
                    background: 'transparent',
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                    MozAppearance: 'textfield',
                }}
            />
            <button
                type="button"
                disabled={item.quantity >= max}
                onClick={() => patch(item.quantity + 1)}
                style={{
                    width: 34,
                    height: 34,
                    background: 'none',
                    border: 'none',
                    cursor: item.quantity >= max ? 'not-allowed' : 'pointer',
                    fontSize: 18,
                    color: item.quantity >= max ? P.textLight : P.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                    if (item.quantity < max)
                        (
                            e.currentTarget as HTMLButtonElement
                        ).style.background = P.accentBg;
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                        'none';
                }}
            >
                +
            </button>
        </div>
    );
}

type AuthUser = {
    name: string;
    email: string;
    profile_photo_url?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    zip?: string | null;
};

/* ── Main wizard ── */
export default function CartIndex({
    items,
    initialStep = 1,
}: {
    items: CartItemData[];
    initialStep?: 1 | 2;
}) {
    const { auth } = usePage().props as { auth: { user: AuthUser | null } };
    const user = auth?.user;

    const [step, setStep] = useState<1 | 2>(initialStep);
    const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');
    const [animating, setAnimating] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const subtotal = items.reduce(
        (s, i) => s + i.variant.price * i.quantity,
        0,
    );
    const totalQty = items.reduce((s, i) => s + i.quantity, 0);

    const { data, setData, post, processing, errors } = useForm({
        fulfillment_method: 'delivery' as const,
        shipping_name: user?.name ?? '',
        shipping_phone: user?.phone ?? '',
        shipping_address: user?.address ?? '',
        shipping_city: user?.city ?? '',
        shipping_province: user?.province ?? '',
        shipping_zip: user?.zip ?? '',
        payment_method: 'cod',
        coupon_code: '',
        notes: '',
        delivery_latitude: '',
        delivery_longitude: '',
    });
    const shippingFee =
        data.fulfillment_method === 'pickup'
            ? 0
            : estimateShippingFee(data.shipping_province ?? '');
    const discountAmount = estimateCouponDiscount(
        data.coupon_code ?? '',
        subtotal,
    );
    const total = Math.max(0, subtotal + shippingFee - discountAmount);

    function goStep(next: 1 | 2) {
        if (animating) return;
        setAnimDir(next > step ? 'forward' : 'back');
        setAnimating(true);
        setTimeout(() => {
            setStep(next);
            setAnimating(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 220);
    }

    function removeItem(item: CartItemData) {
        if (item.is_guest_item) {
            router.delete(`/cart/guest/${item.variant.id}`, {
                preserveScroll: true,
            });
        } else {
            router.delete(`/cart/${item.id}`, { preserveScroll: true });
        }
    }

    function clearCart() {
        if (window.confirm('Remove all items from your cart?')) {
            if (user) {
                router.delete('/cart', { preserveScroll: true });
            } else {
                router.delete('/cart/guest', { preserveScroll: true });
            }
        }
    }

    function submitOrder(e: FormEvent) {
        e.preventDefault();
        setShowConfirmModal(true);
    }

    function confirmAndPlaceOrder() {
        setShowConfirmModal(false);
        post('/checkout');
    }

    const STEPS = [
        { n: 1, label: 'Review Cart' },
        { n: 2, label: 'Delivery & Payment' },
        { n: 3, label: 'Confirmation' },
    ];

    return (
        <>
            <Head title="Checkout – Lynsi Food Products">
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
            </Head>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                .cart-root, .cart-root * { box-sizing: border-box; }
                .cart-root { font-family: 'Inter', sans-serif; background: ${P.bg}; }
                input:focus, textarea:focus, select:focus {
                    border-color: ${P.accent} !important;
                    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
                }
                input[type=number]::-webkit-inner-spin-button,
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                input[type=number] { -moz-appearance: textfield; }

                @keyframes slide-in-right  { from { opacity: 0; transform: translateX(32px);  } to { opacity: 1; transform: none; } }
                @keyframes slide-in-left   { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: none; } }
                @keyframes slide-out-left  { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(-32px); } }
                @keyframes slide-out-right { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(32px);  } }

                .step-enter-forward { animation: slide-in-right 0.24s ease both; }
                .step-enter-back    { animation: slide-in-left  0.24s ease both; }
                .step-exit-forward  { animation: slide-out-left  0.22s ease both; }
                .step-exit-back     { animation: slide-out-right 0.22s ease both; }

                @media (max-width: 768px) {
                    .cart-header-inner { padding: 0 12px !important; min-height: 52px !important; }
                    .cart-step-bar     { top: 52px !important; }
                    .cart-step-inner   { padding: 0 12px !important; }
                    .cart-step-label   { font-size: 11px !important; }
                    .cart-body         { padding: 16px 12px 60px !important; }
                    .cart-wrap         { flex-direction: column !important; gap: 20px !important; }
                    .cart-main         { flex: none !important; width: 100% !important; }
                    .cart-sidebar      { width: 100% !important; max-width: 100% !important; position: static !important; }
                    .cart-item-row     { flex-wrap: wrap !important; gap: 12px !important; padding: 12px !important; }
                    .cart-item-details { flex: 1 1 100% !important; min-width: 0 !important; }
                    .cart-item-actions { flex-direction: row !important; width: 100% !important; justify-content: space-between !important; align-items: center !important; }
                    .checkout-form-grid-2 { grid-template-columns: 1fr !important; }
                    .checkout-form-grid-3 { grid-template-columns: 1fr !important; }
                    .checkout-section  { padding: 18px !important; }
                    .cart-footer-buttons { flex-wrap: wrap !important; gap: 10px !important; }
                    .cart-footer-buttons button, .cart-footer-buttons a { min-width: 0 !important; }
                    .confirm-modal-card { margin: 12px !important; max-height: 85vh !important; padding: 20px !important; }
                    .confirm-modal-actions { flex-direction: column !important; }
                    .confirm-modal-actions button { width: 100% !important; }
                    .checkout-fulfillment-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 480px) {
                    .cart-step-text { display: none !important; }
                    .cart-item-row { flex-direction: column !important; align-items: flex-start !important; }
                    .cart-item-row .cart-item-img { margin: 0 auto; }
                    .cart-title { font-size: 18px !important; }
                    .cart-title .cart-title-meta { margin-left: 6px !important; font-size: 12px !important; }
                }
            `}</style>

            <LandingNav activeId="products" auth={auth} />

            {/* ── HEADER ── */}
            <header
                style={{
                    display: 'none',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: `linear-gradient(135deg, #022c22 0%, ${P.primary} 100%)`,
                    boxShadow: '0 2px 12px rgba(2,44,34,0.3)',
                }}
            >
                <div
                    className="cart-header-inner"
                    style={{
                        maxWidth: 1100,
                        margin: '0 auto',
                        padding: '0 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: 58,
                        gap: 16,
                    }}
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
                            style={{ height: 28, objectFit: 'contain' }}
                        />
                        <span
                            style={{
                                fontWeight: 800,
                                fontSize: 15,
                                color: P.white,
                                letterSpacing: '-0.3px',
                            }}
                        >
                            Lynsi
                            <span style={{ color: '#6ee7b7' }}>
                                FoodProducts
                            </span>
                        </span>
                    </Link>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        {step === 1 ? (
                            <Link
                                href="/shop"
                                style={{
                                    fontSize: 13,
                                    color: 'rgba(255,255,255,0.75)',
                                    textDecoration: 'none',
                                    padding: '7px 14px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                }}
                                onMouseEnter={(e) => {
                                    (
                                        e.currentTarget as HTMLAnchorElement
                                    ).style.background =
                                        'rgba(255,255,255,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    (
                                        e.currentTarget as HTMLAnchorElement
                                    ).style.background = 'transparent';
                                }}
                            >
                                ← Continue Shopping
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => goStep(1)}
                                style={{
                                    fontSize: 13,
                                    color: 'rgba(255,255,255,0.75)',
                                    background: 'none',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    padding: '7px 14px',
                                    cursor: 'pointer',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={(e) => {
                                    (
                                        e.currentTarget as HTMLButtonElement
                                    ).style.background =
                                        'rgba(255,255,255,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    (
                                        e.currentTarget as HTMLButtonElement
                                    ).style.background = 'transparent';
                                }}
                            >
                                ← Back to Cart
                            </button>
                        )}
                        {user && (
                            <Link
                                href="/account"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 7,
                                    padding: '5px 10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: 50,
                                    textDecoration: 'none',
                                }}
                            >
                                <div
                                    style={{
                                        width: 26,
                                        height: 26,
                                        borderRadius: '50%',
                                        background: P.accent,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 10,
                                        fontWeight: 800,
                                        color: P.white,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {user.profile_photo_url ? (
                                        <img
                                            src={user.profile_photo_url}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span
                                    style={{
                                        fontSize: 12,
                                        color: 'rgba(255,255,255,0.85)',
                                        fontWeight: 500,
                                    }}
                                >
                                    {user.name.split(' ')[0]}
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* ── STEP INDICATOR ── */}
            <div
                className="cart-step-bar"
                style={{
                    background: P.white,
                    borderBottom: `1px solid ${P.border}`,
                    position: 'sticky',
                    top: 'clamp(56px, 7vw, 64px)',
                    zIndex: 90,
                }}
            >
                <div
                    className="cart-step-inner"
                    style={{
                        maxWidth: 1100,
                        margin: '0 auto',
                        padding: '0 24px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'stretch',
                            gap: 0,
                        }}
                    >
                        {STEPS.map((s, i) => {
                            const done = step > s.n;
                            const active = step === s.n;
                            return (
                                <div
                                    key={s.n}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0,
                                        flex:
                                            i < STEPS.length - 1 ? 1 : 'unset',
                                    }}
                                >
                                    <div
                                        className="cart-step-label"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '13px 0',
                                            paddingRight: 8,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 12,
                                                fontWeight: 800,
                                                background: done
                                                    ? P.accent
                                                    : active
                                                      ? P.primary
                                                      : P.borderGray,
                                                color:
                                                    done || active
                                                        ? P.white
                                                        : P.textLight,
                                                transition: 'all 0.3s',
                                            }}
                                        >
                                            {done ? '✓' : s.n}
                                        </div>
                                        <span
                                            className="cart-step-text"
                                            style={{
                                                fontSize: 13,
                                                fontWeight: active
                                                    ? 700
                                                    : done
                                                      ? 600
                                                      : 400,
                                                color: active
                                                    ? P.primary
                                                    : done
                                                      ? P.accent
                                                      : P.textLight,
                                                whiteSpace: 'nowrap',
                                                transition: 'all 0.3s',
                                            }}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div
                                            style={{
                                                flex: 1,
                                                height: 2,
                                                borderRadius: 2,
                                                margin: '0 8px',
                                                background: done
                                                    ? P.accent
                                                    : P.borderGray,
                                                transition: 'background 0.4s',
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── BODY ── */}
            <div
                className="cart-body"
                style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    padding: '32px 20px 80px',
                }}
            >
                {/* Empty cart */}
                {items.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '80px 20px',
                            background: P.card,
                            borderRadius: 18,
                            border: `1px solid ${P.border}`,
                        }}
                    >
                        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
                        <h2
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: P.text,
                                marginBottom: 8,
                            }}
                        >
                            Your cart is empty
                        </h2>
                        <p
                            style={{
                                fontSize: 14,
                                color: P.textMuted,
                                marginBottom: 28,
                            }}
                        >
                            Discover fresh products and add them to your cart.
                        </p>
                        <Link
                            href="/shop"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 28px',
                                background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                color: P.white,
                                borderRadius: 12,
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: 14,
                            }}
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div
                        className="cart-wrap"
                        style={{
                            display: 'flex',
                            gap: 28,
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                        }}
                    >
                        {/* ── MAIN CONTENT (steps) ── */}
                        <div
                            className="cart-main"
                            style={{
                                flex: '1 1 500px',
                                minWidth: 0,
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                ref={contentRef}
                                className={
                                    animating
                                        ? animDir === 'forward'
                                            ? 'step-exit-forward'
                                            : 'step-exit-back'
                                        : animDir === 'forward'
                                          ? 'step-enter-forward'
                                          : 'step-enter-back'
                                }
                            >
                                {/* ════ STEP 1: Review Cart ════ */}
                                {step === 1 && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 12,
                                        }}
                                    >
                                        {!user && (
                                            <div
                                                style={{
                                                    background:
                                                        'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                                                    border: `1px solid ${P.border}`,
                                                    borderRadius: 14,
                                                    padding: '14px 18px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                    flexWrap: 'wrap',
                                                    gap: 12,
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 600,
                                                        color: P.primary,
                                                        margin: 0,
                                                    }}
                                                >
                                                    Create an account or log in
                                                    to checkout. Your cart is
                                                    saved.
                                                </p>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 10,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Link
                                                        href="/login"
                                                        style={{
                                                            padding: '8px 16px',
                                                            borderRadius: 10,
                                                            fontSize: 13,
                                                            fontWeight: 600,
                                                            color: P.primary,
                                                            background: P.white,
                                                            border: `2px solid ${P.primary}`,
                                                            textDecoration:
                                                                'none',
                                                            transition:
                                                                'all 0.2s',
                                                        }}
                                                    >
                                                        Log in
                                                    </Link>
                                                    <Link
                                                        href="/register"
                                                        style={{
                                                            padding: '8px 16px',
                                                            borderRadius: 10,
                                                            fontSize: 13,
                                                            fontWeight: 600,
                                                            color: P.white,
                                                            background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                                            border: 'none',
                                                            textDecoration:
                                                                'none',
                                                            transition:
                                                                'all 0.2s',
                                                        }}
                                                    >
                                                        Create account
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                        <h1
                                            className="cart-title"
                                            style={{
                                                fontSize: 22,
                                                fontWeight: 800,
                                                color: P.primary,
                                                letterSpacing: '-0.4px',
                                                marginBottom: 4,
                                            }}
                                        >
                                            🛒 Review Your Cart
                                            <span
                                                className="cart-title-meta"
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    color: P.textMuted,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                ({totalQty}{' '}
                                                {totalQty === 1
                                                    ? 'item'
                                                    : 'items'}
                                                )
                                            </span>
                                        </h1>

                                        {items.map((item) => (
                                            <div
                                                key={
                                                    item.is_guest_item
                                                        ? `guest-${item.variant.id}`
                                                        : item.id
                                                }
                                                className="cart-item-row"
                                                style={{
                                                    display: 'flex',
                                                    gap: 16,
                                                    background: P.card,
                                                    borderRadius: 16,
                                                    border: `1px solid ${P.border}`,
                                                    padding: 16,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Link
                                                    href={`/shop/product/${item.product.slug}`}
                                                    className="cart-item-img"
                                                    style={{ flexShrink: 0 }}
                                                >
                                                    {item.product.image_url ? (
                                                        <img
                                                            src={
                                                                item.product
                                                                    .image_url
                                                            }
                                                            alt={
                                                                item.product
                                                                    .name
                                                            }
                                                            style={{
                                                                width: 76,
                                                                height: 76,
                                                                borderRadius: 12,
                                                                objectFit:
                                                                    'cover',
                                                                border: `1px solid ${P.border}`,
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: 76,
                                                                height: 76,
                                                                borderRadius: 12,
                                                                background:
                                                                    P.accentBg,
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                justifyContent:
                                                                    'center',
                                                                fontSize: 28,
                                                            }}
                                                        >
                                                            🥬
                                                        </div>
                                                    )}
                                                </Link>

                                                <div
                                                    className="cart-item-details"
                                                    style={{
                                                        flex: 1,
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    {item.product.category && (
                                                        <div
                                                            style={{
                                                                fontSize: 11,
                                                                fontWeight: 700,
                                                                color: P.accent,
                                                                textTransform:
                                                                    'uppercase',
                                                                letterSpacing:
                                                                    '0.05em',
                                                                marginBottom: 2,
                                                            }}
                                                        >
                                                            {
                                                                item.product
                                                                    .category
                                                            }
                                                        </div>
                                                    )}
                                                    <Link
                                                        href={`/shop/product/${item.product.slug}`}
                                                        style={{
                                                            fontSize: 15,
                                                            fontWeight: 700,
                                                            color: P.text,
                                                            textDecoration:
                                                                'none',
                                                            display: 'block',
                                                            overflow: 'hidden',
                                                            textOverflow:
                                                                'ellipsis',
                                                            whiteSpace:
                                                                'nowrap',
                                                        }}
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    {item.variant
                                                        .display_name !==
                                                        'Default' && (
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: P.textMuted,
                                                                marginTop: 2,
                                                            }}
                                                        >
                                                            {
                                                                item.variant
                                                                    .display_name
                                                            }
                                                        </div>
                                                    )}
                                                    <div
                                                        style={{
                                                            marginTop: 10,
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 12,
                                                            flexWrap: 'wrap',
                                                        }}
                                                    >
                                                        <Qty item={item} />
                                                        <span
                                                            style={{
                                                                fontSize: 13,
                                                                color: P.textLight,
                                                            }}
                                                        >
                                                            ×{' '}
                                                            {formatPrice(
                                                                item.variant
                                                                    .price,
                                                            )}
                                                        </span>
                                                        <span
                                                            style={{
                                                                display:
                                                                    'inline-flex',
                                                                alignItems:
                                                                    'center',
                                                                gap: 4,
                                                                fontSize: 11,
                                                                fontWeight: 600,
                                                                padding:
                                                                    '2px 8px',
                                                                borderRadius: 50,
                                                                background:
                                                                    item.variant
                                                                        .stock_quantity <=
                                                                    item.quantity
                                                                        ? '#fef3c7'
                                                                        : P.accentBg,
                                                                color:
                                                                    item.variant
                                                                        .stock_quantity <=
                                                                    item.quantity
                                                                        ? '#b45309'
                                                                        : P.primary,
                                                                border: `1px solid ${item.variant.stock_quantity <= item.quantity ? '#fde68a' : P.border}`,
                                                            }}
                                                        >
                                                            {item.variant
                                                                .stock_quantity <=
                                                                item.quantity && (
                                                                <>⚠ </>
                                                            )}
                                                            {
                                                                item.variant
                                                                    .stock_quantity
                                                            }{' '}
                                                            left
                                                        </span>
                                                    </div>
                                                </div>

                                                <div
                                                    className="cart-item-actions"
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-end',
                                                        gap: 10,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: 16,
                                                            fontWeight: 800,
                                                            color: P.primary,
                                                        }}
                                                    >
                                                        {formatPrice(
                                                            item.variant.price *
                                                                item.quantity,
                                                        )}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(item)
                                                        }
                                                        title="Remove"
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            color: P.textLight,
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            padding: 4,
                                                            borderRadius: 8,
                                                            transition:
                                                                'all 0.15s',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            const b =
                                                                e.currentTarget as HTMLButtonElement;
                                                            b.style.color =
                                                                P.danger;
                                                            b.style.background =
                                                                P.dangerBg;
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            const b =
                                                                e.currentTarget as HTMLButtonElement;
                                                            b.style.color =
                                                                P.textLight;
                                                            b.style.background =
                                                                'none';
                                                        }}
                                                    >
                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                                            <path d="M10 11v6" />
                                                            <path d="M14 11v6" />
                                                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <div
                                            className="cart-footer-buttons"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginTop: 4,
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={clearCart}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: 13,
                                                    color: P.danger,
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 5,
                                                    padding: '6px 4px',
                                                }}
                                            >
                                                <svg
                                                    width="13"
                                                    height="13"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                                </svg>
                                                Clear cart
                                            </button>

                                            {user ? (
                                                <button
                                                    type="button"
                                                    onClick={() => goStep(2)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        padding: '12px 28px',
                                                        background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                                        color: P.white,
                                                        border: 'none',
                                                        borderRadius: 12,
                                                        fontWeight: 700,
                                                        fontSize: 14,
                                                        cursor: 'pointer',
                                                        fontFamily:
                                                            "'Inter', sans-serif",
                                                        boxShadow:
                                                            '0 2px 8px rgba(6,95,70,0.25)',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        const b =
                                                            e.currentTarget as HTMLButtonElement;
                                                        b.style.transform =
                                                            'translateY(-1px)';
                                                        b.style.boxShadow =
                                                            '0 4px 14px rgba(6,95,70,0.32)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        const b =
                                                            e.currentTarget as HTMLButtonElement;
                                                        b.style.transform =
                                                            'none';
                                                        b.style.boxShadow =
                                                            '0 2px 8px rgba(6,95,70,0.25)';
                                                    }}
                                                >
                                                    Proceed to Checkout →
                                                </button>
                                            ) : (
                                                <Link
                                                    href="/checkout"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        padding: '12px 28px',
                                                        background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                                        color: P.white,
                                                        border: 'none',
                                                        borderRadius: 12,
                                                        fontWeight: 700,
                                                        fontSize: 14,
                                                        textDecoration: 'none',
                                                        fontFamily:
                                                            "'Inter', sans-serif",
                                                        boxShadow:
                                                            '0 2px 8px rgba(6,95,70,0.25)',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        const b =
                                                            e.currentTarget as HTMLAnchorElement;
                                                        b.style.transform =
                                                            'translateY(-1px)';
                                                        b.style.boxShadow =
                                                            '0 4px 14px rgba(6,95,70,0.32)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        const b =
                                                            e.currentTarget as HTMLAnchorElement;
                                                        b.style.transform =
                                                            'none';
                                                        b.style.boxShadow =
                                                            '0 2px 8px rgba(6,95,70,0.25)';
                                                    }}
                                                >
                                                    Proceed to Checkout →
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ════ STEP 2: Delivery & Payment ════ */}
                                {step === 2 && (
                                    <form
                                        onSubmit={submitOrder}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 20,
                                        }}
                                    >
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => goStep(1)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    padding: '8px 12px',
                                                    borderRadius: 10,
                                                    border: `1px solid ${P.border}`,
                                                    background: P.white,
                                                    color: P.primary,
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                ← Back to Review Cart
                                            </button>
                                        </div>
                                        <h1
                                            style={{
                                                fontSize: 22,
                                                fontWeight: 800,
                                                color: P.primary,
                                                letterSpacing: '-0.4px',
                                                marginBottom: 4,
                                            }}
                                        >
                                            Delivery & Payment
                                        </h1>

                                        <section
                                            className="checkout-section"
                                            style={{
                                                background: P.card,
                                                borderRadius: 18,
                                                border: `1px solid ${P.border}`,
                                                padding: 18,
                                                boxShadow:
                                                    '0 1px 6px rgba(6,95,70,0.05)',
                                            }}
                                        >
                                            <h2
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 800,
                                                    color: P.text,
                                                    marginBottom: 12,
                                                }}
                                            >
                                                How would you like to receive
                                                your order?
                                            </h2>
                                            <div
                                                className="checkout-fulfillment-grid"
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns:
                                                        '1fr 1fr',
                                                    gap: 10,
                                                }}
                                            >
                                                {(
                                                    [
                                                        {
                                                            id: 'delivery',
                                                            label: 'Delivery',
                                                            sub: "We'll deliver to your address",
                                                        },
                                                        {
                                                            id: 'pickup',
                                                            label: 'Pickup',
                                                            sub: "Pick up from the seller's store",
                                                        },
                                                    ] as const
                                                ).map((opt) => {
                                                    const selected =
                                                        data.fulfillment_method ===
                                                        opt.id;
                                                    return (
                                                        <button
                                                            key={opt.id}
                                                            type="button"
                                                            onClick={() =>
                                                                setData(
                                                                    'fulfillment_method',
                                                                    opt.id,
                                                                )
                                                            }
                                                            style={{
                                                                textAlign:
                                                                    'left',
                                                                border: `1.5px solid ${selected ? P.primary : P.borderGray}`,
                                                                borderRadius: 14,
                                                                background:
                                                                    selected
                                                                        ? '#f3fbf7'
                                                                        : P.white,
                                                                color: selected
                                                                    ? P.primary
                                                                    : P.text,
                                                                padding:
                                                                    '14px 14px',
                                                                boxShadow:
                                                                    selected
                                                                        ? '0 4px 14px rgba(6,95,70,0.08)'
                                                                        : 'none',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    gap: 12,
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: 44,
                                                                        height: 44,
                                                                        borderRadius: 12,
                                                                        display:
                                                                            'inline-flex',
                                                                        alignItems:
                                                                            'center',
                                                                        justifyContent:
                                                                            'center',
                                                                        background:
                                                                            selected
                                                                                ? P.primary
                                                                                : '#f3f4f6',
                                                                        color: selected
                                                                            ? '#ffffff'
                                                                            : '#6b7280',
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    {opt.id ===
                                                                    'delivery' ? (
                                                                        <svg
                                                                            width="22"
                                                                            height="22"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            <rect
                                                                                x="1"
                                                                                y="3"
                                                                                width="15"
                                                                                height="13"
                                                                            />
                                                                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                                                            <circle
                                                                                cx="5.5"
                                                                                cy="18.5"
                                                                                r="2.5"
                                                                            />
                                                                            <circle
                                                                                cx="18.5"
                                                                                cy="18.5"
                                                                                r="2.5"
                                                                            />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg
                                                                            width="22"
                                                                            height="22"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            <path d="M3 10l9-7 9 7" />
                                                                            <path d="M5 10v10h14V10" />
                                                                            <path d="M9 14h6" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 16,
                                                                            fontWeight: 800,
                                                                        }}
                                                                    >
                                                                        {
                                                                            opt.label
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            marginTop: 2,
                                                                            fontSize: 13,
                                                                            color: selected
                                                                                ? P.secondary
                                                                                : P.textMuted,
                                                                            lineHeight: 1.45,
                                                                        }}
                                                                    >
                                                                        {
                                                                            opt.sub
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </section>

                                        {/* Delivery details */}
                                        <section
                                            className="checkout-section"
                                            style={{
                                                background: P.card,
                                                borderRadius: 18,
                                                border: `1px solid ${P.border}`,
                                                padding: 24,
                                                boxShadow:
                                                    '0 1px 6px rgba(6,95,70,0.05)',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                    flexWrap: 'wrap',
                                                    gap: 8,
                                                    marginBottom: 18,
                                                }}
                                            >
                                                <h2
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 800,
                                                        color: P.text,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        margin: 0,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: 26,
                                                            height: 26,
                                                            borderRadius: '50%',
                                                            background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                                            color: P.white,
                                                            display:
                                                                'inline-flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            fontSize: 12,
                                                            fontWeight: 800,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        1
                                                    </span>
                                                    Delivery Details
                                                </h2>
                                                {(user?.address ||
                                                    user?.phone) && (
                                                    <span
                                                        style={{
                                                            display:
                                                                'inline-flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 5,
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                            color: P.primary,
                                                            background:
                                                                P.accentBg,
                                                            border: `1px solid ${P.border}`,
                                                            borderRadius: 50,
                                                            padding: '3px 10px',
                                                        }}
                                                    >
                                                        <svg
                                                            width="11"
                                                            height="11"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                        Pre-filled from your
                                                        profile
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gap: 14,
                                                }}
                                            >
                                                <div
                                                    className="checkout-form-grid-2"
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns:
                                                            '1fr 1fr',
                                                        gap: 14,
                                                    }}
                                                >
                                                    <CheckoutField
                                                        data={data}
                                                        setData={setData}
                                                        errors={errors}
                                                        label="Full Name"
                                                        name="shipping_name"
                                                        placeholder="Juan Dela Cruz"
                                                        required
                                                    />
                                                    <CheckoutField
                                                        data={data}
                                                        setData={setData}
                                                        errors={errors}
                                                        label="Phone Number"
                                                        name="shipping_phone"
                                                        placeholder="09XXXXXXXXX"
                                                        required
                                                    />
                                                </div>
                                                {data.fulfillment_method ===
                                                'delivery' ? (
                                                    <>
                                                        <CheckoutField
                                                            data={data}
                                                            setData={setData}
                                                            errors={errors}
                                                            label="Street Address"
                                                            name="shipping_address"
                                                            placeholder="House/Unit no., Street, Barangay"
                                                            required
                                                        />
                                                        <div
                                                            className="checkout-form-grid-3"
                                                            style={{
                                                                display: 'grid',
                                                                gridTemplateColumns:
                                                                    '1fr 1fr 110px',
                                                                gap: 14,
                                                            }}
                                                        >
                                                            <CheckoutField
                                                                data={data}
                                                                setData={
                                                                    setData
                                                                }
                                                                errors={errors}
                                                                label="City / Municipality"
                                                                name="shipping_city"
                                                                placeholder="City or municipality"
                                                                required
                                                            />
                                                            <CheckoutField
                                                                data={data}
                                                                setData={
                                                                    setData
                                                                }
                                                                errors={errors}
                                                                label="Province"
                                                                name="shipping_province"
                                                                as="select"
                                                                required
                                                            />
                                                            <CheckoutField
                                                                data={data}
                                                                setData={
                                                                    setData
                                                                }
                                                                errors={errors}
                                                                label="ZIP Code"
                                                                name="shipping_zip"
                                                                placeholder="4000"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                style={{
                                                                    display:
                                                                        'block',
                                                                    fontSize: 13,
                                                                    fontWeight: 700,
                                                                    color: P.text,
                                                                    marginBottom: 8,
                                                                }}
                                                            >
                                                                Pin exact
                                                                delivery
                                                                location on map
                                                            </label>
                                                            <DeliveryMapPicker
                                                                latitude={
                                                                    data.delivery_latitude
                                                                }
                                                                longitude={
                                                                    data.delivery_longitude
                                                                }
                                                                onChange={(
                                                                    lat,
                                                                    lng,
                                                                ) => {
                                                                    setData(
                                                                        'delivery_latitude',
                                                                        lat.toFixed(
                                                                            6,
                                                                        ),
                                                                    );
                                                                    setData(
                                                                        'delivery_longitude',
                                                                        lng.toFixed(
                                                                            6,
                                                                        ),
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div
                                                        style={{
                                                            fontSize: 13,
                                                            color: P.textMuted,
                                                            background:
                                                                P.accentBg,
                                                            border: `1px solid ${P.border}`,
                                                            borderRadius: 10,
                                                            padding:
                                                                '10px 12px',
                                                        }}
                                                    >
                                                        Pickup selected. We will
                                                        prepare your order for
                                                        store pickup. Shipping
                                                        fee is free.
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {/* Payment method */}
                                        <section
                                            className="checkout-section"
                                            style={{
                                                background: P.card,
                                                borderRadius: 18,
                                                border: `1px solid ${P.border}`,
                                                padding: 24,
                                                boxShadow:
                                                    '0 1px 6px rgba(6,95,70,0.05)',
                                            }}
                                        >
                                            <h2
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 800,
                                                    color: P.text,
                                                    marginBottom: 16,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: 26,
                                                        height: 26,
                                                        borderRadius: '50%',
                                                        background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                                        color: P.white,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        fontSize: 12,
                                                        fontWeight: 800,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    2
                                                </span>
                                                Payment Method
                                            </h2>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 10,
                                                }}
                                            >
                                                {PAYMENT_METHODS.map((pm) => {
                                                    const selected =
                                                        data.payment_method ===
                                                        pm.id;
                                                    return (
                                                        <label
                                                            key={pm.id}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                gap: 14,
                                                                padding:
                                                                    '13px 16px',
                                                                borderRadius: 12,
                                                                cursor: 'pointer',
                                                                border: `2px solid ${selected ? P.accent : P.borderGray}`,
                                                                background:
                                                                    selected
                                                                        ? P.accentBg
                                                                        : P.white,
                                                                boxShadow:
                                                                    selected
                                                                        ? '0 2px 10px rgba(6,95,70,0.08)'
                                                                        : 'none',
                                                                transition:
                                                                    'all 0.15s',
                                                            }}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="payment_method"
                                                                value={pm.id}
                                                                checked={
                                                                    selected
                                                                }
                                                                onChange={() =>
                                                                    setData(
                                                                        'payment_method',
                                                                        pm.id,
                                                                    )
                                                                }
                                                                style={{
                                                                    accentColor:
                                                                        P.accent,
                                                                    width: 17,
                                                                    height: 17,
                                                                }}
                                                            />
                                                            <div
                                                                style={{
                                                                    width: 34,
                                                                    height: 34,
                                                                    borderRadius: 10,
                                                                    display:
                                                                        'inline-flex',
                                                                    alignItems:
                                                                        'center',
                                                                    justifyContent:
                                                                        'center',
                                                                    background:
                                                                        selected
                                                                            ? '#e7f6ef'
                                                                            : '#f8fafc',
                                                                    border: `1px solid ${selected ? P.border : P.borderGray}`,
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                <PaymentIcon
                                                                    kind={
                                                                        pm.icon
                                                                    }
                                                                    active={
                                                                        selected
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <div
                                                                    style={{
                                                                        fontSize: 14,
                                                                        fontWeight: 700,
                                                                        color: P.text,
                                                                    }}
                                                                >
                                                                    {pm.label}
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: P.textMuted,
                                                                        marginTop: 1,
                                                                    }}
                                                                >
                                                                    {pm.desc}
                                                                </div>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </section>

                                        {/* Order notes */}
                                        <section
                                            className="checkout-section"
                                            style={{
                                                background: P.card,
                                                borderRadius: 18,
                                                border: `1px solid ${P.border}`,
                                                padding: 24,
                                                boxShadow:
                                                    '0 1px 6px rgba(6,95,70,0.05)',
                                            }}
                                        >
                                            <h2
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 800,
                                                    color: P.text,
                                                    marginBottom: 14,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: 26,
                                                        height: 26,
                                                        borderRadius: '50%',
                                                        background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                                        color: P.white,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        fontSize: 12,
                                                        fontWeight: 800,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    3
                                                </span>
                                                Order Notes
                                                <span
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        color: P.textLight,
                                                    }}
                                                >
                                                    (optional)
                                                </span>
                                            </h2>
                                            <CheckoutField
                                                data={data}
                                                setData={setData}
                                                errors={errors}
                                                label="Coupon Code (optional)"
                                                name="coupon_code"
                                                placeholder="WELCOME10, LYNSI50"
                                            />
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: P.textLight,
                                                    marginBottom: 10,
                                                }}
                                            >
                                                Try: WELCOME10 or LYNSI50
                                            </div>
                                            <CheckoutField
                                                data={data}
                                                setData={setData}
                                                errors={errors}
                                                label=""
                                                name="notes"
                                                as="textarea"
                                                placeholder="Special instructions, landmark, or delivery notes…"
                                            />
                                        </section>

                                        {/* Footer nav */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: 12,
                                                paddingTop: 4,
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => goStep(1)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    padding: '11px 22px',
                                                    background: P.white,
                                                    color: P.textMuted,
                                                    border: `2px solid ${P.borderGray}`,
                                                    borderRadius: 12,
                                                    fontWeight: 600,
                                                    fontSize: 14,
                                                    cursor: 'pointer',
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                    transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    const b =
                                                        e.currentTarget as HTMLButtonElement;
                                                    b.style.borderColor =
                                                        P.accent;
                                                    b.style.color = P.primary;
                                                }}
                                                onMouseLeave={(e) => {
                                                    const b =
                                                        e.currentTarget as HTMLButtonElement;
                                                    b.style.borderColor =
                                                        P.borderGray;
                                                    b.style.color = P.textMuted;
                                                }}
                                            >
                                                ← Back
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={processing}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    padding: '12px 32px',
                                                    background: processing
                                                        ? P.textLight
                                                        : `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                                    color: P.white,
                                                    border: 'none',
                                                    borderRadius: 12,
                                                    fontWeight: 700,
                                                    fontSize: 15,
                                                    cursor: processing
                                                        ? 'not-allowed'
                                                        : 'pointer',
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                    boxShadow: processing
                                                        ? 'none'
                                                        : '0 2px 8px rgba(6,95,70,0.28)',
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!processing) {
                                                        const b =
                                                            e.currentTarget as HTMLButtonElement;
                                                        b.style.transform =
                                                            'translateY(-1px)';
                                                        b.style.boxShadow =
                                                            '0 4px 14px rgba(6,95,70,0.32)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    const b =
                                                        e.currentTarget as HTMLButtonElement;
                                                    b.style.transform = 'none';
                                                    b.style.boxShadow =
                                                        processing
                                                            ? 'none'
                                                            : '0 2px 8px rgba(6,95,70,0.28)';
                                                }}
                                            >
                                                {processing
                                                    ? 'Placing Order…'
                                                    : 'Place Order ✓'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* ── ORDER SUMMARY SIDEBAR ── */}
                        <div
                            className="cart-sidebar"
                            style={{
                                width: 300,
                                flexShrink: 0,
                                position: 'sticky',
                                top: 112,
                            }}
                        >
                            <div
                                style={{
                                    background: P.card,
                                    borderRadius: 18,
                                    border: `1px solid ${P.border}`,
                                    padding: 24,
                                    boxShadow: '0 2px 12px rgba(6,95,70,0.07)',
                                }}
                            >
                                <h2
                                    style={{
                                        fontSize: 15,
                                        fontWeight: 800,
                                        color: P.text,
                                        marginBottom: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>Order Summary</span>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: P.primary,
                                            background: P.accentBg,
                                            border: `1px solid ${P.border}`,
                                            borderRadius: 999,
                                            padding: '3px 9px',
                                        }}
                                    >
                                        {totalQty}{' '}
                                        {totalQty === 1 ? 'item' : 'items'}
                                    </span>
                                </h2>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 10,
                                        marginBottom: 16,
                                    }}
                                >
                                    {items.map((item) => (
                                        <div
                                            key={
                                                item.is_guest_item
                                                    ? `guest-${item.variant.id}`
                                                    : item.id
                                            }
                                            style={{
                                                display: 'flex',
                                                gap: 10,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {item.product.image_url ? (
                                                    <img
                                                        src={
                                                            item.product
                                                                .image_url
                                                        }
                                                        alt={item.product.name}
                                                        style={{
                                                            width: 44,
                                                            height: 44,
                                                            borderRadius: 8,
                                                            objectFit: 'cover',
                                                            border: `1px solid ${P.border}`,
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: 44,
                                                            height: 44,
                                                            borderRadius: 8,
                                                            background:
                                                                P.accentBg,
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            fontSize: 18,
                                                        }}
                                                    >
                                                        🥬
                                                    </div>
                                                )}
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        top: -5,
                                                        right: -5,
                                                        background: P.primary,
                                                        color: P.white,
                                                        borderRadius: '50%',
                                                        width: 17,
                                                        height: 17,
                                                        fontSize: 9,
                                                        fontWeight: 800,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                >
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div
                                                style={{ flex: 1, minWidth: 0 }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: P.text,
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {item.product.name}
                                                </div>
                                                {item.variant.display_name !==
                                                    'Default' && (
                                                    <div
                                                        style={{
                                                            fontSize: 11,
                                                            color: P.textMuted,
                                                        }}
                                                    >
                                                        {
                                                            item.variant
                                                                .display_name
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    color: P.primary,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {formatPrice(
                                                    item.variant.price *
                                                        item.quantity,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    style={{
                                        height: 1,
                                        background: P.borderGray,
                                        marginBottom: 12,
                                    }}
                                />

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                        marginBottom: 12,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 13,
                                            color: P.textMuted,
                                        }}
                                    >
                                        <span>Subtotal</span>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: P.text,
                                            }}
                                        >
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 13,
                                            color: P.textMuted,
                                        }}
                                    >
                                        <span>Shipping</span>
                                        <span
                                            style={{
                                                fontWeight: 500,
                                                color: P.accent,
                                            }}
                                        >
                                            {step === 1
                                                ? 'Calculated next step'
                                                : shippingFee === 0
                                                  ? 'Free'
                                                  : formatPrice(shippingFee)}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        height: 1,
                                        background: P.borderGray,
                                        marginBottom: 14,
                                    }}
                                />

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 16,
                                        fontWeight: 800,
                                        color: P.text,
                                        marginBottom: step === 2 ? 0 : 18,
                                    }}
                                >
                                    <span>Total</span>
                                    <span style={{ color: P.primary }}>
                                        {formatPrice(total)}
                                    </span>
                                </div>

                                {step === 1 && (
                                    <div className="cart-root">
                                        {user ? (
                                            <button
                                                type="button"
                                                onClick={() => goStep(2)}
                                                style={{
                                                    width: '100%',
                                                    marginTop: 18,
                                                    padding: '13px',
                                                    background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                                    color: P.white,
                                                    border: 'none',
                                                    borderRadius: 12,
                                                    fontWeight: 700,
                                                    fontSize: 15,
                                                    cursor: 'pointer',
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                    boxShadow:
                                                        '0 2px 8px rgba(6,95,70,0.28)',
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    const b =
                                                        e.currentTarget as HTMLButtonElement;
                                                    b.style.transform =
                                                        'translateY(-1px)';
                                                    b.style.boxShadow =
                                                        '0 4px 14px rgba(6,95,70,0.32)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    const b =
                                                        e.currentTarget as HTMLButtonElement;
                                                    b.style.transform = 'none';
                                                    b.style.boxShadow =
                                                        '0 2px 8px rgba(6,95,70,0.28)';
                                                }}
                                            >
                                                Proceed to Checkout
                                            </button>
                                        ) : (
                                            <Link
                                                href="/checkout"
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    marginTop: 18,
                                                    padding: '13px',
                                                    background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                                    color: P.white,
                                                    border: 'none',
                                                    borderRadius: 12,
                                                    fontWeight: 700,
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    textDecoration: 'none',
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                    boxShadow:
                                                        '0 2px 8px rgba(6,95,70,0.28)',
                                                    transition: 'all 0.2s',
                                                    boxSizing: 'border-box',
                                                }}
                                                onMouseEnter={(e) => {
                                                    const b =
                                                        e.currentTarget as HTMLAnchorElement;
                                                    b.style.transform =
                                                        'translateY(-1px)';
                                                    b.style.boxShadow =
                                                        '0 4px 14px rgba(6,95,70,0.32)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    const b =
                                                        e.currentTarget as HTMLAnchorElement;
                                                    b.style.transform = 'none';
                                                    b.style.boxShadow =
                                                        '0 2px 8px rgba(6,95,70,0.28)';
                                                }}
                                            >
                                                Proceed to Checkout
                                            </Link>
                                        )}
                                        <Link
                                            href="/shop"
                                            style={{
                                                display: 'block',
                                                textAlign: 'center',
                                                marginTop: 10,
                                                fontSize: 13,
                                                color: P.textMuted,
                                                textDecoration: 'none',
                                            }}
                                            onMouseEnter={(e) => {
                                                (
                                                    e.currentTarget as HTMLAnchorElement
                                                ).style.color = P.primary;
                                            }}
                                            onMouseLeave={(e) => {
                                                (
                                                    e.currentTarget as HTMLAnchorElement
                                                ).style.color = P.textMuted;
                                            }}
                                        >
                                            ← Continue Shopping
                                        </Link>
                                    </div>
                                )}

                                {step === 2 && (
                                    <p
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 11,
                                            color: P.textLight,
                                            marginTop: 14,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 6,
                                        }}
                                    >
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ color: P.primary }}
                                        >
                                            <rect
                                                x="3"
                                                y="11"
                                                width="18"
                                                height="11"
                                                rx="2"
                                            />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                        Your order is safe and secure
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Final confirmation modal (step 2) ── */}
            {showConfirmModal && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-modal-title"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                        background: 'rgba(2,44,34,0.6)',
                        backdropFilter: 'blur(4px)',
                    }}
                    onClick={() => setShowConfirmModal(false)}
                >
                    <div
                        className="confirm-modal-card"
                        style={{
                            background: P.card,
                            borderRadius: 20,
                            border: `1px solid ${P.border}`,
                            boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
                            maxWidth: 440,
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ padding: 28 }}>
                            <h2
                                id="confirm-modal-title"
                                style={{
                                    fontSize: 20,
                                    fontWeight: 800,
                                    color: P.primary,
                                    marginBottom: 8,
                                }}
                            >
                                Review your order
                            </h2>
                            <p
                                style={{
                                    fontSize: 14,
                                    color: P.textMuted,
                                    marginBottom: 20,
                                    lineHeight: 1.5,
                                }}
                            >
                                Please review the items below. Are you sure you
                                want to place this order?
                            </p>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 12,
                                    marginBottom: 20,
                                }}
                            >
                                {items.map((item) => (
                                    <div
                                        key={
                                            item.is_guest_item
                                                ? `guest-${item.variant.id}`
                                                : item.id
                                        }
                                        style={{
                                            display: 'flex',
                                            gap: 12,
                                            alignItems: 'center',
                                            padding: '12px 14px',
                                            background: P.accentBg,
                                            borderRadius: 12,
                                            border: `1px solid ${P.border}`,
                                        }}
                                    >
                                        {item.product.image_url ? (
                                            <img
                                                src={item.product.image_url}
                                                alt={item.product.name}
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 10,
                                                    objectFit: 'cover',
                                                    flexShrink: 0,
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 10,
                                                    background: P.border,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 22,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                🥬
                                            </div>
                                        )}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    color: P.text,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {item.product.name}
                                            </div>
                                            {item.variant.display_name !==
                                                'Default' && (
                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        color: P.textMuted,
                                                    }}
                                                >
                                                    {item.variant.display_name}
                                                </div>
                                            )}
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: P.textLight,
                                                    marginTop: 2,
                                                }}
                                            >
                                                Qty {item.quantity} ×{' '}
                                                {formatPrice(
                                                    item.variant.price,
                                                )}
                                            </div>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 800,
                                                color: P.primary,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {formatPrice(
                                                item.variant.price *
                                                    item.quantity,
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div
                                style={{
                                    height: 1,
                                    background: P.borderGray,
                                    marginBottom: 14,
                                }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                    marginBottom: 8,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 13,
                                        color: P.textMuted,
                                    }}
                                >
                                    <span>Subtotal</span>
                                    <span
                                        style={{
                                            fontWeight: 600,
                                            color: P.text,
                                        }}
                                    >
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 13,
                                        color: P.textMuted,
                                    }}
                                >
                                    <span>Shipping</span>
                                    <span
                                        style={{
                                            fontWeight: 500,
                                            color: P.accent,
                                        }}
                                    >
                                        {shippingFee === 0
                                            ? 'Free'
                                            : formatPrice(shippingFee)}
                                    </span>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: 16,
                                    fontWeight: 800,
                                    color: P.text,
                                    marginBottom: 24,
                                }}
                            >
                                <span>Total</span>
                                <span style={{ color: P.primary }}>
                                    {formatPrice(total)}
                                </span>
                            </div>

                            <div
                                className="confirm-modal-actions"
                                style={{
                                    display: 'flex',
                                    gap: 12,
                                    justifyContent: 'flex-end',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmModal(false)}
                                    style={{
                                        padding: '12px 24px',
                                        background: P.white,
                                        color: P.textMuted,
                                        border: `2px solid ${P.borderGray}`,
                                        borderRadius: 12,
                                        fontWeight: 600,
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                    onMouseEnter={(e) => {
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.borderColor = P.accent;
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.color = P.primary;
                                    }}
                                    onMouseLeave={(e) => {
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.borderColor = P.borderGray;
                                        (
                                            e.currentTarget as HTMLButtonElement
                                        ).style.color = P.textMuted;
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmAndPlaceOrder}
                                    disabled={processing}
                                    style={{
                                        padding: '12px 24px',
                                        background: processing
                                            ? P.textLight
                                            : `linear-gradient(135deg, ${P.secondary}, ${P.primary})`,
                                        color: P.white,
                                        border: 'none',
                                        borderRadius: 12,
                                        fontWeight: 700,
                                        fontSize: 14,
                                        cursor: processing
                                            ? 'not-allowed'
                                            : 'pointer',
                                        fontFamily: "'Inter', sans-serif",
                                        boxShadow: processing
                                            ? 'none'
                                            : '0 2px 8px rgba(6,95,70,0.28)',
                                    }}
                                >
                                    {processing
                                        ? 'Placing order…'
                                        : 'Yes, place order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
