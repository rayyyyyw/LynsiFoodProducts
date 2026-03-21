import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { adminPendingOrdersCount = 0 } = usePage().props as {
        adminPendingOrdersCount?: number;
    };

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <Link
                href="/dashboard/orders"
                className="relative flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-sidebar-accent"
                title="View orders – pending count"
            >
                <Bell className="h-5 w-5 shrink-0" />
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white tabular-nums shadow-sm">
                    {adminPendingOrdersCount > 99
                        ? '99+'
                        : adminPendingOrdersCount}
                </span>
            </Link>
        </header>
    );
}
