import { useState, useCallback } from 'react';

export function useToggle(
    initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
    const [value, setValue] = useState<boolean>(initialValue);

    const toggle = useCallback(() => setValue(prev => !prev), []);
    const setToggle = useCallback((value: boolean) => setValue(value), []);

    return [value, toggle, setToggle];
}