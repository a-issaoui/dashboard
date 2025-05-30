'use client';

import PageContainer from '@/components/layouts/admin/PageContainer';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
export default function Page() {
    return (
        <PageContainer
            className="bg-gradient-to-br from-background to-muted/20"
        >
            {/* Stats Cards */}
                <Card>
                    <CardContent>
                        <div
                            className="w-full h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <div className="text-white text-center">
                                <p className="text-lg font-semibold">Roles Page</p>
                                <p className="text-sm opacity-90">Testing responsive width behavior</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
        </PageContainer>
    );
}