'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import PublicNavBar from './PublicNavBar'

export default function Navigation() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!(token && user))
  }, [])

  // Update main element margin for CSS to use
  useEffect(() => {
    if (!isMounted) return
    const mainElement = document.querySelector('main')
    if (mainElement) {
      if (isLoggedIn && window.innerWidth >= 768) {
        // Only add margin on desktop (md+) when logged in
        mainElement.style.marginLeft = '256px'
      } else {
        mainElement.style.marginLeft = '0px'
      }
    }

    // Handle window resize
    const handleResize = () => {
      if (mainElement) {
        if (isLoggedIn && window.innerWidth >= 768) {
          mainElement.style.marginLeft = '256px'
        } else {
          mainElement.style.marginLeft = '0px'
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMounted, isLoggedIn])

  // Don't render anything until client is mounted to prevent hydration mismatch
  if (!isMounted) return null

  // Public pages should always show PublicNavBar, never Sidebar
  const publicRoutes = ['/', '/login', '/register', '/forgot-password']
  const isPublicPage = publicRoutes.includes(pathname)

  // If on a public page, always show PublicNavBar
  if (isPublicPage) {
    return <PublicNavBar />
  }

  // If on a private page and logged in, show Sidebar
  if (isLoggedIn) {
    return <Sidebar />
  }

  // If on a private page but not logged in, show nothing (will redirect via middleware or page)
  return null
}
