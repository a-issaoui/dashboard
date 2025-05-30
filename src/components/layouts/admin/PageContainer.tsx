// src/components/layouts/admin/PageContainer.tsx
import React, { memo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageHeader } from './PageHeader';
import { cn } from '@/lib/utils';

interface PageContainerProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    headerActions?: React.ReactNode;
    className?: string;
    scrollable?: boolean;
    contentClassName?: string;
}

export const PageContainer = memo<PageContainerProps>(({
                                                           children,
                                                           title,
                                                           description,
                                                           headerActions,
                                                           className,
                                                           scrollable = true,
                                                           contentClassName,
                                                       }) => {
    const ContentWrapper = scrollable ? ScrollArea : 'div';

    return (
        <div className={cn("flex flex-col flex-1 w-full min-h-0", className)}>
            {(title || description || headerActions) && (
                <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur">
                    <div className="w-full px-4 md:px-6">
                        <PageHeader title={title} description={description}>
                            {headerActions}
                        </PageHeader>
                    </div>
                </div>
            )}

            <div className="flex flex-col flex-1 w-full overflow-hidden min-h-0">
                <ContentWrapper className={scrollable ? "h-full w-full" : "flex-1 overflow-y-auto"}>
                    <main className={cn("w-full p-4 md:p-6 space-y-6", contentClassName)}>
                        {children}
                    </main>
                </ContentWrapper>
            </div>
        </div>
    );
});

PageContainer.displayName = 'PageContainer';