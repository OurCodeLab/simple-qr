import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check on initial load
    checkIfMobile()

    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [breakpoint])

  return isMobile
}