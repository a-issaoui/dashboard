
// =============================================================================
// 📁 src/components/icons/dev/IconShowcase.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Icon, searchIcons, getAvailableCategories, type IconSize } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IconShowcaseProps {
    className?: string;
}

export const IconShowcase: React.FC<IconShowcaseProps> = ({ className }) => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<IconSize>('md');
    const [selectedWeight, setSelectedWeight] = useState<'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'>('regular');
    const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

    const categories = getAvailableCategories();
    const searchResults = useMemo(() => {
        return searchIcons(search, selectedCategory || undefined, 100);
    }, [search, selectedCategory]);

    const handleCopyIcon = async (iconName: string) => {
        const code = `<Icon name="${iconName}" size="${selectedSize}" weight="${selectedWeight}" />`;
        await navigator.clipboard.writeText(code);
        setCopiedIcon(iconName);
        setTimeout(() => setCopiedIcon(null), 2000);
    };

    const sizeOptions: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
    const weightOptions = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'] as const;

    return (
        <div className={`p-6 space-y-6 max-w-7xl mx-auto ${className || ''}`}>
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Icon Showcase</h1>
                <p className="text-muted-foreground">
                    Browse and search through 1,200+ Phosphor icons
                </p>
            </div>

            {/* Controls */}
            <Card>
                <CardHeader>
                    <CardTitle>Search & Filter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input
                            placeholder="Search icons..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full"
                        />

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value as IconSize)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Size" />
                            </SelectTrigger>
                            <SelectContent>
                                {sizeOptions.map(size => (
                                    <SelectItem key={size} value={size}>{size}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedWeight} onValueChange={(value) => setSelectedWeight(value as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Weight" />
                            </SelectTrigger>
                            <SelectContent>
                                {weightOptions.map(weight => (
                                    <SelectItem key={weight} value={weight}>{weight}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                            {searchResults.length} icons found
                        </Badge>
                        {selectedCategory && (
                            <Badge variant="secondary">
                                Category: {selectedCategory}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <Tabs defaultValue="grid" className="w-full">
                <TabsList>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="space-y-4">
                    {searchResults.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Icon name="MagnifyingGlass" size="xl" className="text-muted-foreground mb-4" />
                                <p className="text-muted-foreground text-center">
                                    {search ? `No icons found for "${search}"` : 'Start typing to search icons'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                            {searchResults.map(({ name, category, metadata }) => (
                                <Card
                                    key={name}
                                    className="p-4 text-center hover:bg-accent/50 transition-colors cursor-pointer group"
                                    onClick={() => handleCopyIcon(name)}
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="flex items-center justify-center h-12">
                                            <Icon
                                                name={name}
                                                size={selectedSize}
                                                weight={selectedWeight}
                                                className="group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-mono text-foreground truncate w-full" title={name}>
                                                {name}
                                            </p>
                                            <Badge variant="outline" className="text-[10px] h-4">
                                                {category}
                                            </Badge>
                                        </div>
                                        {copiedIcon === name && (
                                            <Badge variant="default" className="text-[10px] h-4">
                                                Copied!
                                            </Badge>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="list" className="space-y-2">
                    {searchResults.map(({ name, category, metadata }) => (
                        <Card key={name} className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Icon name={name} size={selectedSize} weight={selectedWeight} />
                                    <div>
                                        <p className="font-mono font-medium">{name}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {category}
                                            </Badge>
                                            {metadata.rtlFlip && (
                                                <Badge variant="secondary" className="text-xs">
                                                    RTL
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopyIcon(name)}
                                >
                                    {copiedIcon === name ? 'Copied!' : 'Copy Code'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
};
