'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import PublicNavBar from './PublicNavBar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!(token && user))
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  // Define public routes that should never show sidebar
  const publicRoutes = ['/', '/login', '/register', '/forgot-password']
  const isPublicPage = publicRoutes.includes(pathname)

  // For public pages: just show top navbar and full-width content
  if (isPublicPage) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <PublicNavBar />
        <main className="flex-1 w-full">{children}</main>
      </div>
    )
  }

  // For private/authenticated pages: show sidebar + content with proper offset
  return (
    <div className="flex min-h-screen w-full">
      {isLoggedIn && <Sidebar />}
      {/* Main content with left margin on desktop to accommodate fixed sidebar */}
      <main className="flex-1 w-full md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
