'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PublicNavBar() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only render after client hydration to prevent mismatch
  if (!isMounted) return null

  return (
    <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              EduFair
            </div>
            <span className="hidden sm:inline px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/50">Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-200 hover:text-cyan-300 font-semibold text-sm transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-200 hover:text-cyan-300 font-semibold text-sm transition-colors">
              How It Works
            </a>
            <a href="#scholarships" className="text-gray-200 hover:text-cyan-300 font-semibold text-sm transition-colors">
              Scholarships
            </a>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="text-white hover:text-cyan-400 font-bold text-sm px-6 py-2 rounded-xl border-2 border-white/30 hover:border-white/50 hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
