import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Camera, Mail, Save, User } from 'lucide-react';
import { useRef } from 'react';
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import AppearanceTabs from '@/components/appearance-tabs';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: edit().url },
];

function getInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .map((s) => s[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props as {
        auth: { user: { name: string; email: string; profile_photo_url?: string | null; email_verified_at?: string | null } };
    };
    const fileInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const currentPasswordInputRef = useRef<HTMLInputElement>(null);
    const user = auth.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile & Password" />

            <SettingsLayout>
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Profile card - compact */}
                    <Card className="border-border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Profile Settings</CardTitle>
                            <CardDescription className="text-xs">
                                Update your personal information and profile picture
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Form
                                {...ProfileController.update.form()}
                                encType="multipart/form-data"
                                options={{ preserveScroll: true }}
                                className="space-y-4"
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <>
                                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
                                            <label className="relative shrink-0 cursor-pointer">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    name="profile_photo"
                                                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                                    className="sr-only"
                                                    onChange={() => {
                                                        const form = fileInputRef.current?.form;
                                                        if (form) form.requestSubmit();
                                                    }}
                                                />
                                                <div className="relative">
                                                    <Avatar className="size-16 rounded-full border-2 border-border">
                                                        <AvatarImage
                                                            src={user.profile_photo_url ?? undefined}
                                                            alt={user.name}
                                                        />
                                                        <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span
                                                        className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full border-2 border-background bg-foreground text-background"
                                                        aria-hidden
                                                    >
                                                        <Camera className="size-3" />
                                                    </span>
                                                </div>
                                            </label>
                                            <div className="min-w-0 flex-1 text-center text-xs text-muted-foreground sm:text-left">
                                                Click the camera icon to upload a new photo
                                            </div>
                                        </div>
                                        <InputError message={errors.profile_photo} />

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="name" className="text-xs">Full Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        defaultValue={user.name}
                                                        required
                                                        autoComplete="name"
                                                        placeholder="Full name"
                                                        className="h-8 pl-8 text-sm"
                                                    />
                                                </div>
                                                <InputError message={errors.name} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="email" className="text-xs">Email Address</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        defaultValue={user.email}
                                                        required
                                                        autoComplete="username"
                                                        disabled
                                                        className="h-8 bg-muted/50 pl-8 text-sm"
                                                    />
                                                </div>
                                                <input type="hidden" name="email" value={user.email} />
                                                <p className="text-[10px] text-muted-foreground">Email address cannot be changed</p>
                                                <InputError message={errors.email} />
                                            </div>
                                        </div>

                                        {mustVerifyEmail && user.email_verified_at === null && (
                                            <div className="rounded border border-border bg-muted/50 p-2 text-xs text-muted-foreground">
                                                Your email address is unverified.{' '}
                                                <Link href={send()} as="button" className="font-medium underline underline-offset-1 text-foreground">
                                                    Resend verification email
                                                </Link>
                                                {status === 'verification-link-sent' && (
                                                    <p className="mt-1 font-medium text-foreground">Verification link sent.</p>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                size="sm"
                                                className="bg-foreground text-background hover:bg-foreground/90"
                                                data-test="update-profile-button"
                                            >
                                                <Save className="size-3.5" />
                                                Save Changes
                                            </Button>
                                            <Transition show={recentlySuccessful} enter="transition ease-out duration-150" enterFrom="opacity-0" leave="transition ease-in duration-100" leaveTo="opacity-0">
                                                <span className="text-xs text-muted-foreground">Saved</span>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Password card - compact */}
                    <Card className="border-border shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Password</CardTitle>
                            <CardDescription className="text-xs">
                                Update your password
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...PasswordController.update.form()}
                                options={{ preserveScroll: true }}
                                resetOnError={['password', 'password_confirmation', 'current_password']}
                                resetOnSuccess
                                onError={(errors) => {
                                    if (errors.password) passwordInputRef.current?.focus();
                                    if (errors.current_password) currentPasswordInputRef.current?.focus();
                                }}
                                className="space-y-3"
                            >
                                {({ errors, processing, recentlySuccessful }) => (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="current_password" className="text-xs">Current password</Label>
                                            <Input
                                                id="current_password"
                                                ref={currentPasswordInputRef}
                                                name="current_password"
                                                type="password"
                                                autoComplete="current-password"
                                                placeholder="Current password"
                                                className="h-8 text-sm"
                                            />
                                            <InputError message={errors.current_password} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="password" className="text-xs">New password</Label>
                                            <Input
                                                id="password"
                                                ref={passwordInputRef}
                                                name="password"
                                                type="password"
                                                autoComplete="new-password"
                                                placeholder="New password"
                                                className="h-8 text-sm"
                                            />
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="password_confirmation" className="text-xs">Confirm password</Label>
                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type="password"
                                                autoComplete="new-password"
                                                placeholder="Confirm password"
                                                className="h-8 text-sm"
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button type="submit" disabled={processing} size="sm" variant="secondary" data-test="update-password-button">
                                                Save password
                                            </Button>
                                            <Transition show={recentlySuccessful} enter="transition ease-out duration-150" enterFrom="opacity-0" leave="transition ease-in duration-100" leaveTo="opacity-0">
                                                <span className="text-xs text-muted-foreground">Saved</span>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Appearance + Delete - one row */}
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Card className="border-border shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Appearance</CardTitle>
                            <CardDescription className="text-xs">
                                Theme (light / dark / system)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AppearanceTabs />
                        </CardContent>
                    </Card>
                    <div className="flex items-start">
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
