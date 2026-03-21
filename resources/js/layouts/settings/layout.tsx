import { Link } from '@inertiajs/react';
import { Layout, Settings, User } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';

const tabs = [
    { label: 'General Settings', href: '/settings/general', icon: Settings },
    { label: 'Landing Page', href: '/settings/landing', icon: Layout },
    { label: 'Profile & Password', href: edit(), icon: User },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="min-h-full w-full px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
            {/* Header: black/white only */}
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                    <Settings className="size-5 text-foreground" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                        Settings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your application preferences, profile, password,
                        and appearance.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <nav
                className="mb-4 flex flex-wrap gap-1 border-b border-border"
                aria-label="Settings sections"
            >
                {tabs.map((tab) => {
                    const href =
                        typeof tab.href === 'string'
                            ? tab.href
                            : toUrl(tab.href);
                    const active = isCurrentUrl(href);
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-2 rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                                active
                                    ? 'border-foreground bg-muted text-foreground'
                                    : 'border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                            )}
                        >
                            <Icon className="size-4 shrink-0" />
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="w-full max-w-full">{children}</div>
        </div>
    );
}
