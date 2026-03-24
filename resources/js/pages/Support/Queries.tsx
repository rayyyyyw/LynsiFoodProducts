import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type QueryRow = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    created_at: string;
};
type Paginated<T> = { data: T[] };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Queries', href: '/dashboard/queries' },
];

export default function QueriesPage({ queries }: { queries: Paginated<QueryRow> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Queries" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <h1 className="text-2xl font-bold">Customer queries</h1>
                <p className="text-sm text-muted-foreground">
                    General customer questions from contact form messages.
                </p>
                <div className="overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full min-w-[900px] text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-3 py-2 text-left">Sender</th>
                                <th className="px-3 py-2 text-left">Subject</th>
                                <th className="px-3 py-2 text-left">Message</th>
                                <th className="px-3 py-2 text-left">Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queries.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                                        No queries yet.
                                    </td>
                                </tr>
                            ) : (
                                queries.data.map((q) => (
                                    <tr key={q.id} className="border-t align-top">
                                        <td className="px-3 py-2">
                                            <div className="font-medium">{q.name}</div>
                                            <div className="text-xs text-muted-foreground">{q.email}</div>
                                        </td>
                                        <td className="px-3 py-2">{q.subject ?? '—'}</td>
                                        <td className="max-w-xl px-3 py-2 text-muted-foreground">{q.message}</td>
                                        <td className="px-3 py-2 text-xs text-muted-foreground">
                                            {new Date(q.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

