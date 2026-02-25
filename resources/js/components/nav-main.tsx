import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type NavMainProps =
    | { items: NavItem[]; groups?: never }
    | { items?: never; groups: NavGroup[] };

export function NavMain(props: NavMainProps) {
    const { isCurrentUrl } = useCurrentUrl();
    const groups: NavGroup[] = props.groups
        ? props.groups
        : [{ label: 'Platform', items: props.items ?? [] }];

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        groups.forEach((g) => {
            const hasActive = g.items.some((item) => isCurrentUrl(item.href));
            initial[g.label] = g.items.length > 1 ? hasActive : true;
        });
        const anyOpen = Object.values(initial).some(Boolean);
        if (!anyOpen && groups.some((g) => g.items.length > 1)) {
            const first = groups.find((g) => g.items.length > 1);
            if (first) initial[first.label] = true;
        }
        return initial;
    });

    return (
        <>
            {groups.map((group) => {
                const isCollapsible = group.items.length > 1;
                const isOpen = openGroups[group.label] ?? false;

                if (!isCollapsible) {
                    return (
                        <SidebarGroup key={group.label} className="px-2 py-0">
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={`${group.label}-${item.title}`}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isCurrentUrl(item.href)}
                                            tooltip={{ children: item.title }}
                                        >
                                            <Link href={item.href} prefetch>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    );
                }

                const GroupIcon = group.icon;

                return (
                    <SidebarGroup key={group.label} className="px-2 py-0">
                        <Collapsible
                            open={isOpen}
                            onOpenChange={(open) =>
                                setOpenGroups((prev) => ({ ...prev, [group.label]: open }))
                            }
                        >
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={{ children: group.label }}
                                            className={cn(
                                                'flex w-full items-center justify-between gap-2 rounded-md transition-colors',
                                                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                                                'data-[state=open]:shadow-sm',
                                                'hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground',
                                            )}
                                        >
                                            <span className="flex min-w-0 flex-1 items-center gap-2">
                                                {GroupIcon && <GroupIcon className="size-4 shrink-0" />}
                                                <span className="truncate">{group.label}</span>
                                            </span>
                                            <ChevronDown
                                                className={cn(
                                                    'size-4 shrink-0 transition-transform duration-200',
                                                    isOpen && 'rotate-180',
                                                )}
                                                aria-hidden
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 data-[state=closed]:duration-150 data-[state=open]:duration-200">
                                        <SidebarMenuSub>
                                            {group.items.map((item) => (
                                                <SidebarMenuSubItem
                                                    key={`${group.label}-${item.title}`}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isCurrentUrl(item.href)}
                                                    >
                                                        <Link href={item.href} prefetch>
                                                            {item.icon && <item.icon />}
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </Collapsible>
                    </SidebarGroup>
                );
            })}
        </>
    );
}
