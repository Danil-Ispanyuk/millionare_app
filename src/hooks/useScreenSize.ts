import { MOBILE_SCREEN_SIZE, TABLET_SCREEN_SIZE } from '@/constants/general'
import { useState, useEffect } from 'react'

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window?.innerWidth,
        height: window?.innerHeight,
        isMobile: window?.innerWidth <= MOBILE_SCREEN_SIZE,
        isTablet:
          window?.innerWidth <= TABLET_SCREEN_SIZE &&
          window?.innerWidth > MOBILE_SCREEN_SIZE,
      })
    }

    if (typeof window !== 'undefined') {
      handleResize()
      window.addEventListener('resize', handleResize)
    }

    handleResize()

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return screenSize
}

export default useScreenSize
