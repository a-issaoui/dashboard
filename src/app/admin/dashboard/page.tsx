// src/app/admin/dashboard/page.tsx
'use client';

import { Suspense, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ModeToggle } from '@/components/shared/ModeToggle';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { useAsync } from '@/lib/hooks/useAsync';
import { cn } from '@/lib/utils';

// Types
interface DashboardStats {
    totalUsers: number;
    revenue: number;
    orders: number;
    growth: number;
}

// Mock API call (replace with real API)
const fetchDashboardStats = async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return {
        totalUsers: 2350,
        revenue: 45231,
        orders: 1234,
        growth: 89.2,
    };
};

// Memoized components
const StatsCard = memo<{
    title: string;
    value: string;
    change: string;
    icon?: React.ReactNode;
}>(({ title, value, change, icon }) => (
    <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{change}</span> from last month
            </p>
        </CardContent>
    </Card>
));

StatsCard.displayName = 'StatsCard';

const StatsGrid = memo<{ stats: DashboardStats }>(({ stats }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={stats.totalUsers.toLocaleString()} change="+20.1%" />
        <StatsCard title="Revenue" value={`${stats.revenue.toLocaleString()}`} change="+12.5%" />
        <StatsCard title="Orders" value={stats.orders.toLocaleString()} change="+8.2%" />
        <StatsCard title="Growth" value={`${stats.growth}%`} change="+2.1%" />
    </div>
));

StatsGrid.displayName = 'StatsGrid';

const StatsGridSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="animate-pulse">
                <CardHeader>
                    <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                </CardContent>
            </Card>
        ))}
    </div>
);

const FeatureShowcase = memo(() => (
    <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Theme System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <span className="text-sm">Toggle theme</span>
                </div>
                <div className="flex gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Internationalization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <span className="text-sm">Change language</span>
                </div>
                <div className="flex gap-2">
                    <Button size="sm">Primary</Button>
                    <Button variant="outline" size="sm">Outline</Button>
                    <Button variant="ghost" size="sm">Ghost</Button>
                </div>
            </CardContent>
        </Card>
    </div>
));

FeatureShowcase.displayName = 'FeatureShowcase';

export default function DashboardPage() {
    const { data: stats, loading, error } = useAsync(fetchDashboardStats);

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="p-6">
                    <CardContent>
                        <p className="text-destructive">Failed to load dashboard data</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 w-full min-h-0 bg-gradient-to-br from-background to-muted/20">
            {/* Header */}
            <header className="flex-shrink-0 border-b bg-background/95 backdrop-blur">
                <div className="px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground">Welcome to your admin dashboard</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageSwitcher />
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* Stats Section */}
                <Suspense fallback={<StatsGridSkeleton />}>
                    {loading ? <StatsGridSkeleton /> : stats && <StatsGrid stats={stats} />}
                </Suspense>

                {/* Features Section */}
                <FeatureShowcase />

                {/* Success Message */}
                <Card>
                    <CardHeader>
                        <CardTitle>🎉 Migration Complete!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                                <h4 className="font-medium text-green-800 dark:text-green-200">
                                    ✅ Type Safety
                                </h4>
                                <p className="text-green-600 dark:text-green-300 text-sm">
                                    Full TypeScript support with strict typing
                                </p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                                    🌍 Internationalization
                                </h4>
                                <p className="text-blue-600 dark:text-blue-300 text-sm">
                                    Multi-language with RTL support
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                                <h4 className="font-medium text-purple-800 dark:text-purple-200">
                                    ⚡ Performance
                                </h4>
                                <p className="text-purple-600 dark:text-purple-300 text-sm">
                                    Optimized bundle size and loading
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
