'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validateLoginForm, getErrorMessage } from '@/lib/validation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([])
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validation = validateLoginForm(email, password)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    setErrors([])
    setLoading(true)

    try {
      // Call auth API to validate credentials
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors([{ field: 'form', message: data.error || 'Invalid email or password' }])
        return
      }

      // Save token and user to localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      router.push('/dashboard')
    } catch (err) {
      setErrors([{ field: 'form', message: 'Login failed. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Branding & Welcome */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg">
                {/* Unique EduFair Icon - Book with graduation cap */}
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  {/* Book */}
                  <path d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm2 2v14h12V5H6z"/>
                  {/* Graduation Cap */}
                  <path d="M12 2l6.5 3.5V7h-13V5.5L12 2zm-6.5 4h13v1H5.5v-1z"/>
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 leading-tight">Welcome Back</h1>
              <p className="text-2xl text-blue-100 font-light mb-6">Continue your journey to secure scholarships</p>
              <p className="text-lg text-gray-300 leading-relaxed">Access your scholarship matches, track applications, and discover opportunities tailored just for you.</p>
            </div>

            {/* Feature Points */}
            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                <p className="text-gray-300">AI-powered scholarship matching</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                <p className="text-gray-300">Real-time application tracking</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                <p className="text-gray-300">Personalized recommendations</p>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="w-full max-w-md mx-auto lg:max-w-none">
            {/* Login Card */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/20">
              {/* Header */}
              <div className="text-center mb-8 lg:hidden">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 shadow-lg">
                  {/* Unique EduFair Icon - Book with graduation cap */}
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    {/* Book */}
                    <path d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm2 2v14h12V5H6z"/>
                    {/* Graduation Cap */}
                    <path d="M12 2l6.5 3.5V7h-13V5.5L12 2zm-6.5 4h13v1H5.5v-1z"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  EduFair
                </h1>
                <p className="text-gray-300 text-sm font-light">Sign in to access your scholarships</p>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6 hidden lg:block">Sign In</h2>

              {errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                  <ul className="space-y-1 text-sm">
                    {errors.map((error, idx) => (
                      <li key={idx}>
                        {error.field === 'form' ? error.message : `${error.field}: ${error.message}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all backdrop-blur-sm ${
                  getErrorMessage('email', errors) 
                    ? 'border-red-500/50 focus:ring-red-500' 
                    : 'border-white/10 focus:ring-blue-500'
                }`}
                placeholder="your@email.com"
                autoComplete="email"
                disabled={loading}
              />
              {getErrorMessage('email', errors) && (
                <p className="text-red-400 text-xs mt-1">{getErrorMessage('email', errors)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all backdrop-blur-sm ${
                  getErrorMessage('password', errors)
                    ? 'border-red-500/50 focus:ring-red-500'
                    : 'border-white/10 focus:ring-blue-500'
                }`}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
              />
              {getErrorMessage('password', errors) && (
                <p className="text-red-400 text-xs mt-1">{getErrorMessage('password', errors)}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-gray-300">Don't have an account?</span>
                </div>
              </div>

              <Link
                href="/register"
                className="w-full block text-center py-3 border-2 border-blue-500/50 text-blue-300 rounded-xl hover:bg-blue-500/10 hover:border-blue-500 font-semibold transition-all duration-200"
              >
                Create New Account
              </Link>

              <p className="text-center text-xs text-gray-400 mt-6">
                Securing scholarships made simple and intelligent
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
