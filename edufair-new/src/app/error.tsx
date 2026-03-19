'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Error logging happens server-side in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Application Error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      {/* Background elements matching site theme */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="mb-8 flex justify-center">
            <div className="bg-red-500/20 p-4 rounded-full border border-red-500/30">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M7.08 6.47A9 9 0 0119.02 20M3 12a9 9 0 1018 0 9 9 0 01-18 0z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Oops! Something went wrong
          </h1>

          <p className="text-gray-300 mb-6 text-center text-sm">
            We encountered an unexpected error. Your session remains secure. 
            {error.digest && ` (Error ID: ${error.digest})`}
          </p>

          {process.env.NODE_ENV !== 'production' && error.message && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs text-red-300 font-mono">
                {error.message}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-95"
              aria-label="Try again button"
            >
              Try Again
            </button>

            <Link
              href="/"
              className="block text-center bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40"
            >
              Go to Home
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center">
              If the problem persists, <Link href="/" className="text-cyan-400 hover:text-cyan-300">contact support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
