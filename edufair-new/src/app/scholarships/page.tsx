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
    if (filters.country && !s.eligible_countries?.includes(filters.country)) return false
    if (filters.minAmount && s.scholarship_amount < filters.minAmount) return false
    if (filters.riskLevel && s.risk_level !== filters.riskLevel) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            EduFair
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Scholarship Directory</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Countries</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="India">India</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Award Amount
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk Level
              </label>
              <select
                value={filters.riskLevel}
                onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scholarships List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading scholarships...</p>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No scholarships found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredScholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {scholarship.name}
                    </h3>
                    <p className="text-gray-600">{scholarship.provider_name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${scholarship.scholarship_amount.toLocaleString()}
                    </div>
                    <span className="inline-block text-sm font-semibold">
                      {scholarship.amount_type === 'full_tuition'
                        ? '🎓 Full Tuition'
                        : scholarship.amount_type === 'partial'
                        ? '📚 Partial'
                        : '💰 Fixed'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{scholarship.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Credibility</p>
                    <p className="font-semibold text-gray-900">
                      {(scholarship.credibility_score * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Acceptance Rate</p>
                    <p className="font-semibold text-gray-900">
                      {(scholarship.historical_acceptance_rate * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Awards Available</p>
                    <p className="font-semibold text-gray-900">
                      {scholarship.total_awards_available || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Risk Level</p>
                    <p
                      className={`font-semibold ${
                        scholarship.risk_level === 'low'
                          ? 'text-green-600'
                          : scholarship.risk_level === 'medium'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {scholarship.risk_level.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Deadline:{' '}
                    {new Date(scholarship.application_deadline).toLocaleDateString()}
                  </p>
                  <button 
                    onClick={() => router.push(`/apply/${scholarship.id}?name=${encodeURIComponent(scholarship.name)}`)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                  >
                    Apply Now
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
