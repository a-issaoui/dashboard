// src/components/layouts/admin/PageContainer.tsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageHeader } from '@/components/layouts/admin/PageHeader';
import { cn } from '@/lib/utils';

interface PageContainerProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    headerChildren?: React.ReactNode;
    className?: string;
    scrollable?: boolean;
    contentClassName?: string;
}

const PageContainer = React.memo<PageContainerProps>(({
                                                          children,
                                                          title,
                                                          description,
                                                          headerChildren,
                                                          className = "",
                                                          scrollable = true,
                                                          contentClassName = ""
                                                      }) => {
    return (
        <div className={cn("flex flex-col flex-1 w-full min-h-0", className)}>
            {/* Header Section */}
            <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 md:px-6">
                    <PageHeader
                        title={title}
                        description={description}
                    >
                        {headerChildren}
                    </PageHeader>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="flex flex-col flex-1 w-full overflow-hidden min-h-0">
                {scrollable ? (
                    <ScrollArea className="h-full w-full">
                        <main className={cn(
                            "w-full p-4 md:p-6 space-y-6",
                            contentClassName
                        )}>
                            {children}
                        </main>
                    </ScrollArea>
                ) : (
                    <main className={cn(
                        "w-full p-4 md:p-6 space-y-6 flex-1 overflow-y-auto",
                        contentClassName
                    )}>
                        {children}
                    </main>
                )}
            </div>
        </div>
    );
});

PageContainer.displayName = 'PageContainer';
export default PageContainer;