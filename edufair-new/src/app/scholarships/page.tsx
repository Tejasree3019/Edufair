'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Scholarships() {
  const [scholarships, setScholarships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    country: '',
    minAmount: 0,
    riskLevel: '',
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchScholarships(token)
  }, [router])

  const fetchScholarships = async (token: string) => {
    try {
      const response = await fetch('/api/scholarships', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setScholarships(data.scholarships || [])
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredScholarships = scholarships.filter((s) => {
    const eligibleCountries = s.eligible_countries || s.eligibleCountries || []
    if (filters.country && !eligibleCountries.includes(filters.country)) return false
    
    const amount = s.scholarship_amount || s.amount || 0
    if (filters.minAmount && amount < filters.minAmount) return false
    
    if (filters.riskLevel && s.risk_level !== filters.riskLevel) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      {/* Navigation */}
      <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            EduFair
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white font-semibold transition-colors flex items-center gap-2">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">Scholarships</h1>
          <p className="text-lg text-gray-300 font-light">Discover vetted opportunities for Indian students</p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 mb-8 hover:border-white/40 transition-all">
          <h2 className="text-xl font-bold text-white mb-6">Filter Scholarships</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Country
              </label>
              <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold text-center">
                India
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Minimum Award Amount
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Credibility Level
              </label>
              <div className="relative">
                <select
                  value={filters.riskLevel}
                  onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all appearance-none cursor-pointer pr-10"
                >
                  <option value="" className="bg-slate-900 text-white">All Levels</option>
                  <option value="low" className="bg-slate-900 text-white">Low Risk</option>
                  <option value="medium" className="bg-slate-900 text-white">Medium Risk</option>
                  <option value="high" className="bg-slate-900 text-white">High Risk</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarships List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-blue-200/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-300 font-semibold text-lg">Loading scholarships...</p>
            </div>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-300 text-xl mb-6">No scholarships found matching your filters</p>
            <button 
              onClick={() => setFilters({ country: '', minAmount: 0, riskLevel: '' })}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-blue-500/50 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredScholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="group bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:border-cyan-400 hover:bg-white/15 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                      {scholarship.name}
                    </h3>
                    <p className="text-gray-400 font-semibold">{scholarship.provider_name || scholarship.provider || 'Unknown Provider'}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {scholarship.currency === 'INR' ? '₹' : '$'}
                      {(scholarship.amount || scholarship.scholarship_amount || 0).toLocaleString()}
                    </div>
                    <span className="inline-block text-sm font-bold text-emerald-400 mt-1">
                      {(scholarship.amountType || scholarship.amount_type) === 'full_tuition'
                        ? '🎓 Full Tuition'
                        : (scholarship.amountType || scholarship.amount_type) === 'partial'
                        ? '📚 Partial'
                        : '💰 ' + (scholarship.amountType || scholarship.amount_type || 'Fixed')}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 line-clamp-2">{scholarship.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Credibility</p>
                    <p className="font-bold text-blue-400 text-lg mt-2">
                      {Math.round((scholarship.credibility_score || scholarship.credibilityScore || 0.8) * 100)}%
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Acceptance</p>
                    <p className="font-bold text-emerald-400 text-lg mt-2">
                      {Math.round((scholarship.historical_acceptance_rate || scholarship.acceptanceRate || 0.5) * 100)}%
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Awards</p>
                    <p className="font-bold text-purple-400 text-lg mt-2">
                      {(scholarship.total_awards_available || scholarship.awardCount || 'N/A').toLocaleString ? (scholarship.total_awards_available || scholarship.awardCount || 'N/A').toLocaleString() : scholarship.total_awards_available || scholarship.awardCount || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Risk</p>
                    <p
                      className={`font-bold text-lg mt-2 ${
                        (scholarship.risk_level || scholarship.riskLevel) === 'low'
                          ? 'text-green-400'
                          : (scholarship.risk_level || scholarship.riskLevel) === 'medium'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {(scholarship.risk_level || scholarship.riskLevel || 'UNKNOWN').charAt(0).toUpperCase() + (scholarship.risk_level || scholarship.riskLevel || 'UNKNOWN').slice(1)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 font-semibold">
                    📅 Deadline: {' '}
                    <span className="text-cyan-400">
                      {scholarship.application_deadline 
                        ? new Date(scholarship.application_deadline).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })
                        : scholarship.deadline
                        ? new Date(scholarship.deadline).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })
                        : 'TBD'}
                    </span>
                  </p>
                  <button 
                    onClick={() => router.push(`/scholarship/${scholarship.id}`)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl hover:shadow-xl hover:shadow-blue-500/50 font-bold transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    View Details & Apply →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
