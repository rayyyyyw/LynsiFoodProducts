<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingPageSetting extends Model
{
    protected $table = 'landing_page_settings';

    protected $fillable = ['content'];

    protected $casts = [
        'content' => 'array',
    ];

    /**
     * Get the singleton landing page content (creates row with defaults if missing).
     */
    public static function getContent(): array
    {
        $row = self::first();
        if ($row) {
            return self::mergeWithDefaults($row->content);
        }

        return self::defaultContent();
    }

    /**
     * Update the landing page content.
     */
    public static function setContent(array $content): void
    {
        $merged = self::mergeWithDefaults($content);
        $row = self::query()->firstOrNew(['id' => 1]);
        $row->content = $merged;
        $row->save();
    }

    protected static function mergeWithDefaults(array $content): array
    {
        $defaults = self::defaultContent();
        $merged = array_replace_recursive($defaults, $content);

        // Replace list arrays in full when present (array_replace_recursive merges by index,
        // so saving e.g. one partner would otherwise keep the rest from defaults).
        if (isset($content['products']['items'])) {
            $merged['products']['items'] = $content['products']['items'];
        }
        if (isset($content['benefits']['items'])) {
            $merged['benefits']['items'] = $content['benefits']['items'];
        }
        if (isset($content['howItWorks']['steps'])) {
            $merged['howItWorks']['steps'] = $content['howItWorks']['steps'];
        }
        if (isset($content['locations']['items'])) {
            $merged['locations']['items'] = $content['locations']['items'];
        }
        if (isset($content['partners']['items'])) {
            $merged['partners']['items'] = $content['partners']['items'];
        }

        return $merged;
    }

    public static function defaultContent(): array
    {
        return [
            'hero' => [
                'badge' => '🌿 Philippines #1 Organic Food Platform',
                'titleLine1' => 'Lynsi Food Products,',
                'titleLine2' => 'Taste Beyond Compare',
                'subtitle' => 'Discover over 500+ certified organic products from trusted local farms. Healthier eating, starting today — no compromises.',
                'ctaPrimary' => '🛒 Shop Now',
                'ctaSecondary' => '▶ How It Works',
                'stat1Num' => '500+',
                'stat1Label' => 'Products',
                'stat2Num' => '50k+',
                'stat2Label' => 'Happy Customers',
                'stat3Num' => '100%',
                'stat3Label' => 'Organic Certified',
            ],
            'products' => [
                'badge' => '🛒 Fresh Arrivals',
                'title' => 'Featured Products',
                'subtitle' => 'Hand-picked, certified organic produce fresh from our local farm partners to your table.',
                'catalogueLabel' => 'View Full Catalogue →',
                'items' => [
                    ['name' => 'Organic Hass Avocados', 'price' => '₱350', 'unit' => '/kg', 'category' => 'Fresh Fruits', 'icon' => '🥑', 'badge' => 'Bestseller', 'color' => '#dcfce7'],
                    ['name' => 'Farm-Fresh Tomatoes', 'price' => '₱120', 'unit' => '/kg', 'category' => 'Vegetables', 'icon' => '🍅', 'badge' => 'Harvested Today', 'color' => '#fee2e2'],
                    ['name' => 'Free-Range Brown Eggs', 'price' => '₱240', 'unit' => '/doz', 'category' => 'Dairy & Eggs', 'icon' => '🥚', 'badge' => 'Organic', 'color' => '#fef3c7'],
                    ['name' => 'Artisan Sourdough', 'price' => '₱180', 'unit' => '/loaf', 'category' => 'Bakery', 'icon' => '🥖', 'badge' => 'Fresh Baked', 'color' => '#ffedd5'],
                ],
            ],
            'benefits' => [
                'badge' => '🌿 Why Choose Lynsi',
                'title' => 'Benefits That Matter to You',
                'subtitle' => "We don't just deliver food — we deliver a healthier, greener, more conscious lifestyle straight to your home.",
                'items' => [
                    ['icon' => '🍃', 'title' => '100% Organic', 'desc' => 'Every product is certified organic — no pesticides, no additives, just pure goodness from farm to table.'],
                    ['icon' => '🚚', 'title' => 'Same-Day Delivery', 'desc' => 'Order before noon and get your fresh produce delivered to your door the very same day.'],
                    ['icon' => '🌱', 'title' => 'Sustainably Sourced', 'desc' => 'We partner directly with local eco-farms to reduce food miles and support sustainable agriculture.'],
                    ['icon' => '💚', 'title' => 'Health-First Selection', 'desc' => 'Every product is hand-picked by nutritionists to ensure maximum health benefits for your family.'],
                    ['icon' => '♻️', 'title' => 'Zero-Waste Packaging', 'desc' => 'All packaging is 100% compostable or recyclable — because we care about the planet as much as you do.'],
                    ['icon' => '🔒', 'title' => 'Quality Guarantee', 'desc' => 'Not satisfied? We offer a full refund, no questions asked. Your satisfaction is our promise.'],
                ],
            ],
            'howItWorks' => [
                'badge' => '⚡ Simple Process',
                'title' => 'How It Works',
                'subtitle' => 'From browse to doorstep in 3 effortless steps. Fresh food has never been this easy.',
                'steps' => [
                    ['step' => '01', 'title' => 'Choose Your Products', 'desc' => 'Browse our curated selection of over 500 fresh, organic food products sourced from certified local farms.'],
                    ['step' => '02', 'title' => 'We Pack & Prepare', 'desc' => 'Our team carefully handpicks, inspects, and packs your order in eco-friendly, temperature-controlled packaging.'],
                    ['step' => '03', 'title' => 'Delivered Fresh to You', 'desc' => 'Receive your fresh order right at your doorstep within hours — guaranteed fresh or your money back.'],
                ],
            ],
            'locations' => [
                'badge' => '📍 Visit Us',
                'title' => 'Our Locations',
                'subtitle' => 'Find a Lynsi store near you. Walk in for fresh picks or order ahead for same-day pickup and delivery.',
                'items' => [
                    ['name' => 'Lynsi Manila Hub', 'address' => '123 Organic Way, Bonifacio Global City', 'city' => 'Metro Manila', 'phone' => '+63 2 8123 4567', 'hours' => 'Mon–Sat 7AM–8PM', 'tag' => 'Headquarters', 'image_url' => ''],
                    ['name' => 'Lynsi Cebu Store', 'address' => '456 Fresh Farm Road, Cebu Business Park', 'city' => 'Cebu City', 'phone' => '+63 32 412 3456', 'hours' => 'Mon–Sat 8AM–7PM', 'tag' => 'Pick-up & Delivery', 'image_url' => ''],
                    ['name' => 'Lynsi Davao Branch', 'address' => '789 Eco Street, Lanang', 'city' => 'Davao City', 'phone' => '+63 82 221 5678', 'hours' => 'Mon–Sat 7AM–7PM', 'tag' => 'Full Service', 'image_url' => ''],
                ],
            ],
            'aboutUs' => [
                'badge' => '🌿 Our Story',
                'title' => 'About Lynsi Food Products',
                'subtitle' => "We're on a mission to make fresh, organic food accessible to every Filipino family.",
                'paragraph1' => 'Lynsi Food Products started with a simple belief: everyone deserves access to clean, nutritious food straight from the farm. We partner directly with certified organic growers across the Philippines to bring you over 500+ products — from fresh produce to pantry staples — delivered to your doorstep.',
                'paragraph2' => "Our values are rooted in sustainability, transparency, and community. We're committed to zero-waste packaging, fair partnerships with local farmers, and the highest quality standards so you can eat with confidence.",
                'stat1Num' => '500+',
                'stat1Label' => 'Organic Products',
                'stat2Num' => '50k+',
                'stat2Label' => 'Happy Families',
                'stat3Num' => '100%',
                'stat3Label' => 'Philippine Sourced',
                'farmToTableTitle' => 'Farm to Table',
                'farmToTableDesc' => 'Every product is traceable to our partner farms. Quality you can trust.',
            ],
            'contactUs' => [
                'badge' => '📬 Get in Touch',
                'title' => 'Contact Us',
                'subtitle' => "Have questions, feedback, or need support? We'd love to hear from you.",
                'email' => 'hello@lynsi.com',
                'phone' => '+63 2 8123 4567',
                'address' => 'Metro Manila, Philippines',
                'facebook' => 'https://web.facebook.com/search/top?q=lynsi%20food%20products',
                'footerNote' => 'We typically respond within 24 hours. For orders and delivery support, you can also reach us through your account dashboard after signing in.',
            ],
            'partners' => [
                'title' => 'Trusted by leading food brands & retailers',
                'items' => ['FreshMart', 'GreenLeaf Co.', 'NaturaBite', 'OrganicHub', 'EcoFarm', 'PureGrown', 'HarvestPlus', 'VerdeFoods'],
            ],
        ];
    }
}
