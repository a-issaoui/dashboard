"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { useThemeStore } from "@/store/theme-store"

interface CustomThemeProviderProps extends Omit<ThemeProviderProps, 'children'> {
    children: React.ReactNode
}

export function ThemeProvider({
                                  children,
                                  ...props
                              }: CustomThemeProviderProps) {
    const [isMounted, setIsMounted] = React.useState(false)
    const { mode, resolvedTheme, setTheme } = useThemeStore()

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    React.useEffect(() => {
        // ✅ Add return for early exit
        if (!isMounted) return;

        // Sync next-themes with our store
        const handleThemeChange = () => {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
            if (currentTheme !== resolvedTheme) {
                setTheme(currentTheme)
            }
        }

        // Create observer for class changes
        const observer = new MutationObserver(handleThemeChange)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })

        return () => observer.disconnect()
    }, [isMounted, resolvedTheme, setTheme])

    if (!isMounted) {
        return <>{children}</>
    }

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="dashboard-theme"
            themes={['light', 'dark', 'system']}
            {...props}
        >
            {children}
        </NextThemesProvider>
    )
}