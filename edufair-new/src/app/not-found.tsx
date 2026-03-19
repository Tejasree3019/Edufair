'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background elements matching site theme */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-300 mb-8 text-sm">
            The page you're looking for doesn't exist or has been moved to a different location.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/20 mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-cyan-500/20 p-4 rounded-full border border-cyan-500/30">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-white mb-4">
            What can you do?
          </h2>

          <ul className="text-gray-300 text-sm space-y-2 mb-6 text-left">
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">◈</span>
              <span>Visit the home page to get started</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">◈</span>
              <span>Browse available scholarships</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">◈</span>
              <span>Check your application status</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-95"
          >
            Back to Home
          </Link>
          <Link
            href="/scholarships"
            className="block bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40"
          >
            View Scholarships
          </Link>
        </div>
      </div>
    </div>
  )
}
