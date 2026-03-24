import { Link } from '@inertiajs/react';
import {
    BarChart3,
    LayoutGrid,
    Package,
    ShoppingCart,
    Users,
    Layers,
    RotateCcw,
    ClipboardList,
    HelpCircle,
    TrendingUp,
    MessageSquare,
    MessageCircle,
    TicketPercent,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavGroup, NavItem } from '@/types';
import AppLogo from './app-logo';

const dashboardPath = '/dashboard';
const productsPath = '/products';
const base = (path: string) => `${dashboardPath}/${path}`;
const products = (path: string) => `${productsPath}/${path}`;

const mainNavGroups: NavGroup[] = [
    {
        label: 'Platform',
        items: [{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }],
    },
    {
        label: 'Products',
        icon: Package,
        items: [
            { title: 'Categories', href: products('categories'), icon: Layers },
            { title: 'Products', href: products('products'), icon: Package },
            {
                title: 'Inventory',
                href: products('inventory'),
                icon: BarChart3,
            },
        ],
    },
    {
        label: 'Orders',
        icon: ShoppingCart,
        items: [
            { title: 'Orders', href: base('orders'), icon: ShoppingCart },
            { title: 'Returns', href: base('returns'), icon: RotateCcw },
        ],
    },
    {
        label: 'User Management',
        icon: Users,
        items: [
            { title: 'Customers', href: base('customers'), icon: Users },
            {
                title: 'Reseller Applications',
                href: base('reseller'),
                icon: ClipboardList,
            },
        ],
    },
    {
        label: 'Reports',
        icon: TrendingUp,
        items: [
            { title: 'Sales', href: base('sales'), icon: TrendingUp },
            { title: 'Analytics', href: base('analytics'), icon: BarChart3 },
            { title: 'Discounts', href: base('discounts'), icon: TicketPercent },
        ],
    },
    {
        label: 'Support and Queries',
        icon: HelpCircle,
        items: [
            { title: 'Queries', href: base('queries'), icon: HelpCircle },
            {
                title: 'Feedbacks',
                href: base('feedbacks'),
                icon: MessageSquare,
            },
            { title: 'Reviews', href: base('reviews'), icon: MessageCircle },
        ],
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

const SIDEBAR_SCROLL_KEY = 'lynsi:sidebar-scroll-top';

export function AppSidebar() {
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        const saved = window.sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
        if (saved) {
            const top = Number(saved);
            if (Number.isFinite(top)) {
                el.scrollTop = top;
            }
        }

        const onScroll = () => {
            window.sessionStorage.setItem(
                SIDEBAR_SCROLL_KEY,
                String(el.scrollTop),
            );
        };

        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent ref={contentRef}>
                <NavMain groups={mainNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
