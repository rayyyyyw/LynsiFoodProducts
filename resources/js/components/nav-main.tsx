import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types';

type NavMainProps =
    | { items: NavItem[]; groups?: never }
    | { items?: never; groups: NavGroup[] };

export function NavMain(props: NavMainProps) {
    const { isCurrentUrl } = useCurrentUrl();
    const groups: NavGroup[] = props.groups
        ? props.groups
        : [{ label: 'Platform', items: props.items ?? [] }];

    return (
        <>
            {groups.map((group) => {
                return (
                    <SidebarGroup key={group.label} className="px-2 py-0">
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem
                                    key={`${group.label}-${item.title}`}
                                >
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentUrl(item.href)}
                                        tooltip={{ children: item.title }}
                                        className="data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:hover:bg-black dark:data-[active=true]:bg-white dark:data-[active=true]:text-black dark:data-[active=true]:hover:bg-white [&[data-active=true]>svg]:text-white dark:[&[data-active=true]>svg]:text-black"
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
            })}
        </>
    );
}
