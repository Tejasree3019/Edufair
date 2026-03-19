'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Calendar, DollarSign, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

export default function ScholarshipDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [scholarship, setScholarship] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchScholarshipDetails(token)
  }, [params.id, router])

  const fetchScholarshipDetails = async (token: string) => {
    try {
      const response = await fetch(`/api/scholarships?id=${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        const scholarship = data.scholarships?.find((s: any) => s.id === params.id)
        if (scholarship) {
          setScholarship(scholarship)
        } else {
          setError('Scholarship not found')
        }
      } else {
        setError('Failed to load scholarship details')
      }
    } catch (error) {
      console.error('Error fetching scholarship:', error)
      setError('Error loading scholarship details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
              <p className="text-gray-300">Loading scholarship details...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !scholarship) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 p-8">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-300 text-lg mb-6">{error || 'Scholarship not found'}</p>
              <button
                onClick={() => router.back()}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 font-semibold transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const riskLevelColor = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }

  const getRiskLevelLabel = (level: string) => {
    switch (level) {
      case 'low':
        return '✅ Low Risk - Highly Credible'
      case 'medium':
        return '⚠️ Medium Risk - Verify Before Applying'
      case 'high':
        return '🚩 High Risk - Apply with Caution'
      default:
        return 'Unknown'
    }
  }

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    if (currency === 'INR') {
      return '₹' + amount.toLocaleString('en-IN')
    }
    return '$' + amount.toLocaleString('en-US')
  }

  const formatDeadline = (deadline: string) => {
    try {
      return new Date(deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return deadline
    }
  }

  const isDeadlineSoon = scholarship.deadline && new Date(scholarship.deadline) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4 relative overflow-hidden scrollbar-gutter-stable">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-lg px-4 py-2 border border-white/20 hover:border-white/40 transition-all text-cyan-400 font-semibold hover:bg-white/20"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">{scholarship.name}</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 overflow-hidden hover:border-white/40 transition-all">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 p-8 text-white">
            <p className="text-blue-100 mb-2">{scholarship.provider || 'Scholarship Provider'}</p>
            <h2 className="text-3xl font-bold mb-4">{scholarship.name}</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <DollarSign size={20} />
                <div className="text-sm">
                  <p className="text-blue-100">Award Amount</p>
                  <p className="text-lg font-bold">{formatCurrency(scholarship.amount, scholarship.currency)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <Calendar size={20} />
                <div className="text-sm">
                  <p className="text-blue-100">Application Deadline</p>
                  <p className="text-lg font-bold">{formatDeadline(scholarship.deadline)}</p>
                </div>
              </div>
              {isDeadlineSoon && (
                <div className="flex items-center gap-2 bg-yellow-500 bg-opacity-90 rounded-lg px-4 py-2">
                  <AlertCircle size={20} />
                  <p className="font-bold">Deadline Approaching!</p>
                </div>
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-8">
            {/* Description */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-4">About This Scholarship</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{scholarship.description}</p>
            </section>

            {/* Key Details Grid */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-4">Key Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount Type */}
                <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                  <p className="text-sm text-gray-300 font-semibold">Award Frequency</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {scholarship.amountType === 'annual' ? '💰 Annual Award' : '💰 One-time Award'}
                  </p>
                </div>

                {/* Living Expenses */}
                <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                  <p className="text-sm text-gray-300 font-semibold">Living Expenses Covered</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {scholarship.coversLivingExpenses ? '✅ Yes' : '❌ No'}
                  </p>
                </div>

                {/* Total Awards */}
                <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                  <p className="text-sm text-gray-300 font-semibold">Total Awards Available</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {(scholarship.awardCount || scholarship.total_awards_available)?.toLocaleString()} scholarships
                  </p>
                </div>

                {/* Previous Awardees */}
                <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                  <p className="text-sm text-gray-300 font-semibold">Previous Year Awardees</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {(scholarship.previousAwardees || scholarship.previous_year_awardees)?.toLocaleString()} students
                  </p>
                </div>
              </div>
            </section>

            {/* Eligibility */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-4">🎓 Who Can Apply?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-cyan-500 pl-4">
                  <p className="text-sm text-gray-300 font-semibold mb-2">Eligible Countries</p>
                  <div className="flex flex-wrap gap-2">
                    {(scholarship.eligibleCountries || ['Not specified']).map((country: string, idx: number) => (
                      <span key={idx} className="bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm font-semibold border border-blue-500/50">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm text-gray-300 font-semibold mb-2">Eligible Education Levels</p>
                  <div className="flex flex-wrap gap-2">
                    {(scholarship.eligibleLevels || ['Not specified']).map((level: string, idx: number) => (
                      <span key={idx} className="bg-green-500/30 text-green-200 px-3 py-1 rounded-full text-sm font-semibold border border-green-500/50">
                        {level === '10th' ? '10th Grade' : level === '12th' ? '12th Grade' : level === 'ug' ? 'Undergraduate' : level === 'pg' ? 'Postgraduate' : level}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm text-gray-300 font-semibold mb-2">Eligible Fields of Study</p>
                  <div className="flex flex-wrap gap-2">
                    {(scholarship.eligibleFields || ['All fields']).map((field: string, idx: number) => (
                      <span key={idx} className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm font-semibold border border-purple-500/50">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="text-sm text-gray-300 font-semibold mb-2">Minimum GPA/Score Required</p>
                  <p className="text-lg font-bold text-white">
                    {scholarship.minGPA || scholarship.min_academic_grade || 'Not specified'}
                  </p>
                </div>
              </div>
            </section>

            {/* Scholarship Type */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-4">📋 Scholarship Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-blue-500/20 p-4 rounded-lg border border-blue-500/50">
                  {scholarship.meritBased ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
                  )}
                  <span className="font-semibold text-white">Merit-Based</span>
                </div>
                <div className="flex items-center gap-3 bg-green-500/20 p-4 rounded-lg border border-green-500/50">
                  {scholarship.needBased ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
                  )}
                  <span className="font-semibold text-white">Need-Based</span>
                </div>
              </div>
            </section>

            {/* Acceptance Stats */}
            <section>
              <h3 className="text-2xl font-bold text-white mb-4">📊 Acceptance Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Acceptance Rate */}
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-lg p-6">
                  <TrendingUp className="text-green-400 mb-2" size={28} />
                  <p className="text-sm text-gray-300 font-semibold mb-2">Historical Acceptance Rate</p>
                  <p className="text-3xl font-bold text-green-400">
                    {((scholarship.acceptanceRate || scholarship.historical_acceptance_rate || 0.5) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Your odds of getting accepted</p>
                </div>

                {/* Credibility Score */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 rounded-lg p-6">
                  <CheckCircle className="text-blue-400 mb-2" size={28} />
                  <p className="text-sm text-gray-300 font-semibold mb-2">Credibility Score</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {((scholarship.credibilityScore || scholarship.credibility_score || 0.5) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-400 mt-2">How legitimate this scholarship is</p>
                </div>

                {/* Risk Level */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/50 border-2 rounded-lg p-6">
                  <AlertCircle className="text-orange-400 mb-2" size={28} />
                  <p className="text-sm font-semibold mb-2 text-gray-300">Risk Level</p>
                  <p className="font-bold text-white">{getRiskLevelLabel(scholarship.riskLevel || scholarship.risk_level || 'medium')}</p>
                </div>
              </div>
            </section>

            {/* Apply Button Section */}
            <section className="border-t-2 border-white/20 pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push(`/apply/${scholarship.id}?name=${encodeURIComponent(scholarship.name)}`)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-green-500/50 font-bold text-lg transition-all hover:scale-105 active:scale-95"
                >
                  ✨ Apply Now
                </button>
                <button
                  onClick={() => router.push('/scholarships')}
                  className="flex-1 border-2 border-white/30 text-white px-8 py-4 rounded-lg hover:border-white/50 hover:bg-white/10 font-bold text-lg transition-all"
                >
                  View More Scholarships
                </button>
              </div>
              <p className="text-sm text-gray-400 text-center mt-4">
                Ready to apply? Click the button above to start your application.
              </p>
            </section>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 p-4 text-center text-sm text-gray-300">
          <p>
            💡 <strong className="text-white">Pro Tip:</strong> Review all details carefully before applying. You can track your application from your dashboard.
          </p>
        </div>
      </div>
    </main>
  )
}
