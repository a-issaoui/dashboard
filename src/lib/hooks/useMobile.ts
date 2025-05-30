// src/lib/hooks/useMobile.ts
import * as React from "react"
import { BREAKPOINTS } from '@/lib/constants';

// Use the MOBILE breakpoint from the constants file
const MOBILE_BREAKPOINT = BREAKPOINTS.MOBILE;

export function useMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Ensure window is defined (for SSR compatibility)
    if (typeof window === 'undefined') {
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Set initial value based on media query
    setIsMobile(mql.matches)

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)

    // Set initial value again in case the window size changed
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => mql.removeEventListener("change", onChange);
  }, []) // Empty dependency array ensures this runs once on mount

  return !!isMobile // Return a boolean value
}