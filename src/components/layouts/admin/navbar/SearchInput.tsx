// src/components/layouts/admin/navbar/SearchInput.tsx
'use client';

interface SearchInputProps {
    className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
    // For now, return null as we don't have a search implementation
    // This can be expanded later with proper search functionality
    return null;
}

// Commented out implementation for future use:
/*
import { useKBar } from 'kbar';
import { Icons } from '@/components/icons/Icons';
import { Button } from '@/components/ui/button';

export function SearchInput({ className }: SearchInputProps) {
    const { query } = useKBar();

    return (
        <div className={cn('w-full space-y-2', className)}>
            <Button
                variant='outline'
                className='bg-background text-muted-foreground relative h-9 w-full justify-start rounded-[0.5rem] text-sm font-normal shadow-none sm:pe-12 md:w-40 lg:w-64'
                onClick={query.toggle}
            >
                <Icons.Search className='me-2 h-4 w-4' />
                Search...
                <kbd className='bg-muted pointer-events-none absolute top-[0.3rem] end-[0.3rem] hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
                    <span className='text-xs'>⌘</span>K
                </kbd>
            </Button>
        </div>
    );
}
*/