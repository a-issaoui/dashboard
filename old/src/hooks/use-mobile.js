import * as React from "react"
import { CONSTANTS } from '@/constants/index'; // Import constants

// Use the MOBILE breakpoint from the constants file
const MOBILE_BREAKPOINT = CONSTANTS.BREAKPOINTS.MOBILE;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    // Ensure window is defined (for SSR compatibility, though less critical in client hooks)
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

    // Set initial value again in case the window size changed between the first setIsMobile and adding the listener
    // This also covers the case where the component mounts after the initial load.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => mql.removeEventListener("change", onChange);
  }, []) // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return !!isMobile // Return a boolean value
}