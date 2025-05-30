// src/app/admin/users/page.tsx
'use client';

import PageContainer from '@/components/layouts/admin/PageContainer';
import { Card, CardContent } from '@/components/ui/card';

export default function UsersPage() {
    return (
        <PageContainer className="bg-gradient-to-br from-background to-muted/20">
            <Card>
                <CardContent>
                    <div className="w-full h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                            <p className="text-lg font-semibold">Users Page</p>
                            <p className="text-sm opacity-90">User management coming soon</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </PageContainer>
    );
}
