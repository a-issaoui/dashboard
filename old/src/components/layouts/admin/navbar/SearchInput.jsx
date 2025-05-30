'use client';

export default function SearchInput() {
    return (
        null
    )
}
/*
import { useKBar } from 'kbar';
import { ListMagnifyingGlassIcon } from "@phosphor-icons/react";
import { Button } from '@/components/ui/button';

export default function SearchInput() {
    const { query } = useKBar();
    return (
        <div className='w-full space-y-2'>
            <Button
                variant='outline'
                className='bg-background text-muted-foreground relative h-9 w-full justify-start rounded-[0.5rem] text-sm font-normal shadow-none sm:pe-12 md:w-40 lg:w-64'
                onClick={query.toggle}
            >
                <ListMagnifyingGlass  size={32} weight="duotone" className='me-2 h-4 w-4' />
                Search...
                <kbd className='bg-muted pointer-events-none absolute top-[0.3rem] end-[0.3rem] hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
                    <span className='text-xs'>⌘</span>K
                </kbd>
            </Button>
        </div>
    );
}
*/