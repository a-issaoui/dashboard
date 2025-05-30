
// src/app/admin/settings/page.tsx
'use client';

import PageContainer from '@/components/layouts/admin/PageContainer';
import { Card, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
    return (
        <PageContainer className="bg-gradient-to-br from-background to-muted/20">
            <Card>
                <CardContent>
                    <div className="w-full h-32 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                            <p className="text-lg font-semibold">Settings Page</p>
                            <p className="text-sm opacity-90">Application settings coming soon</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </PageContainer>
    );
}