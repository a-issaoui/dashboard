import * as React from "react";
import { usePathname } from 'next/navigation';
import { Breadcrumbs } from "@/components/layouts/admin/Breadcrumbs";
import { cn } from "@/lib/utils";
import { ROUTES_BY_PATH } from '@/config/admin/routes';

const PageHeaderContent = React.memo(({ title, description, children }) => (
    <>
        {title && (
            <div className="mb-1">
                <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {title}
                </h1>
            </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
            <div className="flex-1 min-w-0">
                {description && (
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-prose">
                        {description}
                    </p>
                )}
            </div>

            {/* Desktop Breadcrumbs - RTL optimized positioning */}
            <div className="hidden md:flex shrink-0">
                <Breadcrumbs />
            </div>
        </div>

        {/* Mobile breadcrumbs - shown below title/description */}
        <div className="md:hidden mt-2">
            <Breadcrumbs />
        </div>

        {children && (
            <div className="mt-3">
                {children}
            </div>
        )}
    </>
));

PageHeaderContent.displayName = 'PageHeaderContent';

export const PageHeader = React.memo(({
                                          title: titleProp,
                                          description: descriptionProp,
                                          children,
                                          className
                                      }) => {
    const pathname = usePathname();
    const routeConfig = React.useMemo(() => ROUTES_BY_PATH[pathname], [pathname]);

    const title = titleProp ?? routeConfig?.title;
    const description = descriptionProp ?? routeConfig?.description;

    // Early return if no content to render
    if (!title && !description && !children) {
        return (
            <header className={cn("py-2", className)}>
                <div className="hidden md:flex justify-end">
                    <Breadcrumbs />
                </div>
                <div className="md:hidden">
                    <Breadcrumbs />
                </div>
            </header>
        );
    }

    return (
        <header className={cn("flex flex-col gap-1 py-2", className)}>
            <PageHeaderContent title={title} description={description}>
                {children}
            </PageHeaderContent>
        </header>
    );
});

PageHeader.displayName = 'PageHeader';
export default PageHeader;