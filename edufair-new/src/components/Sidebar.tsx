'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure hydration safety - don't render until mounted on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything until client is mounted
  if (!isMounted) return null

  const menuItems = [
    { label: 'Dashboard', icon: '◇', href: '/dashboard', id: 'dashboard' },
    { label: 'Scholarships', icon: '≡', href: '/scholarships', id: 'scholarships' },
    { label: 'Applications', icon: '⊕', href: '/tracking', id: 'applications' },
    { label: 'Profile', icon: '○', href: '/profile', id: 'profile' },
    { label: 'Admin', icon: '⚙', href: '/admin', id: 'admin' },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-lg hover:scale-105 transition-transform"
      >
        ☰
      </button>

      {/* Sidebar Container - Only visible when logged in */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/20 backdrop-blur-xl w-64 transition-transform duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              EduFair
            </div>
            <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/50">
              Pro
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-semibold text-sm">{item.label}</span>
              {isActive(item.href) && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-white/10"></div>

        {/* User Section */}
        <div className="p-4 mt-8 border-t border-white/10 space-y-3">
          <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">Student</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500/20 text-red-300 border border-red-400/30 rounded-lg font-semibold text-sm hover:bg-red-500/30 transition-all hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}
