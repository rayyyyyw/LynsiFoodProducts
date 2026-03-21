const LOGO_URL = '/mylogo/logopng%20(1).png';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white">
                <img
                    src={LOGO_URL}
                    alt="Lynsi Administrator"
                    className="size-full object-contain p-0.5"
                />
            </div>
            <div className="ml-2 min-w-0 flex-1 text-left">
                <span className="truncate text-sm leading-tight font-semibold text-sidebar-foreground">
                    Lynsi Administrator
                </span>
            </div>
        </>
    );
}
