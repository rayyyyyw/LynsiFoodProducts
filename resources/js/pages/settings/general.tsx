import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/settings/general' },
];

export default function General() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="General Settings" />
            <SettingsLayout>
                <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
                    <h2 className="text-lg font-semibold">General Settings</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Application-wide preferences. More options coming soon.
                    </p>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
