'use client';

import { useState } from 'react';
import PageContainer from '@/components/layouts/admin/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Users,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    MoreHorizontal,
    Plus,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    Star,
    Activity
} from 'lucide-react';

// Mock data
const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', avatar: '/avatars/01.png', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active', avatar: '/avatars/02.png', joinDate: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive', avatar: '/avatars/03.png', joinDate: '2024-03-10' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Editor', status: 'Active', avatar: '/avatars/04.png', joinDate: '2024-01-30' },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Pending', avatar: '/avatars/05.png', joinDate: '2024-04-05' },
];

const mockStats = [
    { title: 'Total Users', value: '2,350', change: '+20.1%', icon: Users, color: 'text-blue-600' },
    { title: 'Revenue', value: '$45,231', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Orders', value: '1,234', change: '+8.2%', icon: ShoppingCart, color: 'text-purple-600' },
    { title: 'Growth', value: '89.2%', change: '+2.1%', icon: TrendingUp, color: 'text-orange-600' },
];

const HeaderActions = () => (
    <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 me-2" />
            Filter
        </Button>
        <Button variant="outline" size="sm">
            <Download className="h-4 w-4 me-2" />
            Export
        </Button>
        <Button size="sm">
            <Plus className="h-4 w-4 me-2" />
            Add User
        </Button>
    </div>
);

export default function ComprehensiveTestPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('overview');

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageContainer
            className="bg-gradient-to-br from-background to-muted/20"
        >
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mockStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600 font-medium">{stat.change}</span> from last month
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Activity Chart Placeholder */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                                <CardDescription>
                                    Your activity overview for the last 30 days
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <TrendingUp className="h-12 w-12 text-blue-500 mx-auto" />
                                        <p className="text-sm text-muted-foreground">Chart Component Here</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Progress Cards */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Progress</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Website Redesign</span>
                                            <span>75%</span>
                                        </div>
                                        <Progress value={75} className="h-2" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Mobile App</span>
                                            <span>45%</span>
                                        </div>
                                        <Progress value={45} className="h-2" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>API Integration</span>
                                            <span>90%</span>
                                        </div>
                                        <Progress value={90} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" size="sm" className="justify-start">
                                        <Plus className="h-4 w-4 me-2" />
                                        New Project
                                    </Button>
                                    <Button variant="outline" size="sm" className="justify-start">
                                        <Users className="h-4 w-4 me-2" />
                                        Invite Team
                                    </Button>
                                    <Button variant="outline" size="sm" className="justify-start">
                                        <Download className="h-4 w-4 me-2" />
                                        Export Data
                                    </Button>
                                    <Button variant="outline" size="sm" className="justify-start">
                                        <Eye className="h-4 w-4 me-2" />
                                        View Reports
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                    {/* Search and Filter */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>
                                Manage your team members and their permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="ps-8"
                                    />
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead className="w-[100px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={user.avatar} alt={user.name} />
                                                            <AvatarFallback>
                                                                {user.name.split(' ').map(n => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            user.status === 'Active' ? 'default' :
                                                                user.status === 'Inactive' ? 'destructive' :
                                                                    'secondary'
                                                        }
                                                    >
                                                        {user.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(user.joinDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>
                                                                <Eye className="me-2 h-4 w-4" />
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit className="me-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="me-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Analytics Overview</CardTitle>
                                <CardDescription>
                                    Performance metrics and insights
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <TrendingUp className="h-12 w-12 text-green-500 mx-auto" />
                                        <p className="text-sm text-muted-foreground">Analytics Dashboard</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Top Performers</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {mockUsers.slice(0, 3).map((user, index) => (
                                        <div key={user.id} className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                                                {index + 1}
                                            </div>
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {Math.floor(Math.random() * 100)}% completion
                                                </p>
                                            </div>
                                            <Star className="h-4 w-4 text-yellow-500" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Settings</CardTitle>
                            <CardDescription>
                                Configure your application preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="app-name">Application Name</Label>
                                    <Input id="app-name" placeholder="Enter application name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admin-email">Admin Email</Label>
                                    <Input id="admin-email" type="email" placeholder="admin@example.com" />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Notification Preferences</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-medium">Email Notifications</div>
                                            <div className="text-xs text-muted-foreground">
                                                Receive notifications via email
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Configure
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-medium">Push Notifications</div>
                                            <div className="text-xs text-muted-foreground">
                                                Receive push notifications
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Configure
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button variant="outline">Cancel</Button>
                                <Button>Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Bottom Section - Full Width Test */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Full Width Content Test</CardTitle>
                    <CardDescription>
                        This section tests the full width capabilities of the dashboard layout
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                            <p className="text-lg font-semibold">Full Width Container</p>
                            <p className="text-sm opacity-90">Testing responsive width behavior</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Bottom Section - Full Width Test */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Full Width Content Test</CardTitle>
                    <CardDescription>
                        This section tests the full width capabilities of the dashboard layout
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                            <p className="text-lg font-semibold">Full Width Container</p>
                            <p className="text-sm opacity-90">Testing responsive width behavior</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Bottom Section - Full Width Test */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Full Width Content Test</CardTitle>
                    <CardDescription>
                        This section tests the full width capabilities of the dashboard layout
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                            <p className="text-lg font-semibold">Full Width Container</p>
                            <p className="text-sm opacity-90">Testing responsive width behavior</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Bottom Section - Full Width Test */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Full Width Content Test</CardTitle>
                    <CardDescription>
                        This section tests the full width capabilities of the dashboard layout
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                            <p className="text-lg font-semibold">Full Width Container</p>
                            <p className="text-sm opacity-90">Testing responsive width behavior</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Bottom Section - Full Width Test */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Full Width Content Test</CardTitle>
                    <CardDescription>
                        This section tests the full width capabilities of the dashboard layout
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                            <p className="text-lg font-semibold">Full Width Container</p>
                            <p className="text-sm opacity-90">Testing responsive width behavior</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </PageContainer>
    );
}