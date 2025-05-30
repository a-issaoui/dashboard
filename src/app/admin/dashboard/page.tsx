// src/app/admin/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/shared/ModeToggle';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

// Mock data
const mockStats = [
    { title: 'Total Users', value: '2,350', change: '+20.1%' },
    { title: 'Revenue', value: '$45,231', change: '+12.5%' },
    { title: 'Orders', value: '1,234', change: '+8.2%' },
    { title: 'Growth', value: '89.2%', change: '+2.1%' },
];

export default function DashboardPage() {
    const [selectedTab, setSelectedTab] = useState('overview');

    return (
        <div className="flex flex-col flex-1 w-full min-h-0 bg-gradient-to-br from-background to-muted/20">
            {/* Header */}
            <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 md:px-6 py-4">
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
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 w-full overflow-hidden min-h-0">
                <div className="h-full w-full overflow-y-auto">
                    <main className="w-full p-4 md:p-6 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {mockStats.map((stat, index) => (
                                <Card key={index} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {stat.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">
                                            <span className="text-green-600 font-medium">{stat.change}</span> from last month
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Features Demo */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Theme System</CardTitle>
                                    <CardDescription>
                                        Test the theme switching functionality
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <ModeToggle />
                                        <span className="text-sm">Click to toggle theme</span>
                                    </div>
                                    <div className="space-y-2">
                                        <Badge variant="default">Default Badge</Badge>
                                        <Badge variant="secondary">Secondary Badge</Badge>
                                        <Badge variant="destructive">Destructive Badge</Badge>
                                        <Badge variant="outline">Outline Badge</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Multi-language Support</CardTitle>
                                    <CardDescription>
                                        Switch between different languages and RTL support
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <LanguageSwitcher />
                                        <span className="text-sm">Click to change language</span>
                                    </div>
                                    <div className="space-y-2">
                                        <Button variant="default" size="sm">Default Button</Button>
                                        <Button variant="outline" size="sm">Outline Button</Button>
                                        <Button variant="ghost" size="sm">Ghost Button</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Full Width Test */}
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Dashboard Migration Complete</CardTitle>
                                <CardDescription>
                                    Your Next.js dashboard has been successfully migrated to TypeScript
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <div className="text-white text-center">
                                        <p className="text-lg font-semibold">🎉 Migration Successful!</p>
                                        <p className="text-sm opacity-90">Your dashboard is now running on TypeScript</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                        <h4 className="font-medium text-green-800 dark:text-green-200">✅ Type Safety</h4>
                                        <p className="text-green-600 dark:text-green-300">Full TypeScript support with strict typing</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                        <h4 className="font-medium text-blue-800 dark:text-blue-200">🌍 Internationalization</h4>
                                        <p className="text-blue-600 dark:text-blue-300">Multi-language with RTL support</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                                        <h4 className="font-medium text-purple-800 dark:text-purple-200">🎨 Modern UI</h4>
                                        <p className="text-purple-600 dark:text-purple-300">Tailwind v4 + shadcn/ui components</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    );
}