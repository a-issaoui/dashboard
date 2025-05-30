import { useState, useEffect, useCallback } from 'react';

interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useAsync<T>(
    asyncFunction: () => Promise<T>,
    immediate: boolean = true
): AsyncState<T> & { execute: () => Promise<T | undefined> } {
    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(async (): Promise<T | undefined> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const data = await asyncFunction();
            setState({ data, loading: false, error: null });
            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            setState({ data: null, loading: false, error: errorMessage });
            return undefined;
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { ...state, execute };
}