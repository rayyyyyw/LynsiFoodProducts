import { Link } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    Folder,
    LayoutGrid,
    Package,
    ShoppingCart,
    Users,
    Tag,
    FileText,
    HelpCircle,
    Settings,
    CreditCard,
    Truck,
    Mail,
    Layers,
    RotateCcw,
    ClipboardList,
    Image,
    TrendingUp,
} from 'lucide-react';
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
import type { NavGroup, NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

const dashboardPath = '/dashboard';
const productsPath = '/products';
const base = (path: string) => `${dashboardPath}/${path}`;
const products = (path: string) => `${productsPath}/${path}`;

const mainNavGroups: NavGroup[] = [
    {
        label: 'Platform',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        ],
    },
    {
        label: 'Products',
        icon: Package,
        items: [
            { title: 'Categories', href: products('categories'), icon: Layers },
            { title: 'Products', href: products('products'), icon: Package },
            { title: 'Inventory', href: products('inventory'), icon: BarChart3 },
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
            { title: 'Reseller Applications', href: base('reseller'), icon: ClipboardList },
        ],
    },
    {
        label: 'Reports',
        icon: TrendingUp,
        items: [
            { title: 'Sales', href: base('sales'), icon: TrendingUp },
            { title: 'Analytics', href: base('analytics'), icon: BarChart3 },
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

export function AppSidebar() {
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

            <SidebarContent>
                <NavMain groups={mainNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
