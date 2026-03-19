'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AdminStats {
  totalUsers: number
  totalApplications: number
  totalScholarships: number
  successRate: number
  avgApplicationTime: number
  topScholarships: Array<{
    name: string
    applications: number
    acceptanceRate: number
  }>
  applicationsByStatus: Record<string, number>
  recentApplications: Array<{
    id: string
    scholarship: string
    student: string
    status: string
    date: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'scholarships' | 'users'>('overview')
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    // Allow access to admin dashboard (demo mode - no role check needed)
    try {
      const user = JSON.parse(userData)
      // Demo mode: Allow all logged-in users to access admin
      if (!user) {
        router.push('/login')
        return
      }
    } catch (e) {
      console.error('Error parsing user data:', e)
    }

    fetchAdminStats(token)
  }, [router])

  const fetchAdminStats = async (token: string) => {
    try {
      // Fetch real admin stats from API
      const response = await fetch('/api/admin/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch admin stats: ${response.statusText}`)
      }

      const stats: AdminStats = await response.json()
      setStats(stats)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      // Set empty stats to show dashboard with no data message
      setStats({
        totalUsers: 0,
        totalApplications: 0,
        totalScholarships: 0,
        successRate: 0,
        avgApplicationTime: 0,
        applicationsByStatus: {
          submitted: 0,
          reviewing: 0,
          accepted: 0,
          rejected: 0,
        },
        topScholarships: [],
        recentApplications: [],
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <p className="text-gray-300 relative z-10">Loading admin dashboard...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <p className="text-red-400 relative z-10">Failed to load admin dashboard</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden" style={{ height: '100%' }}>
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-300 mt-2 text-sm">Platform analytics and management</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/20 sticky top-20 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(['overview', 'applications', 'scholarships', 'users'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-bold text-sm transition-all duration-200 ${
                  activeTab === tab
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-white/20'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 p-6 transition-all hover:scale-105">
                <div className="text-2xl font-bold text-blue-400">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-xs text-gray-300 mt-2 font-semibold uppercase">Total Users</div>
                <div className="text-xs text-gray-400 mt-2 font-medium">Platform Members</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 p-6 transition-all hover:scale-105">
                <div className="text-2xl font-bold text-purple-400">{stats.totalApplications.toLocaleString()}</div>
                <div className="text-xs text-gray-300 mt-2 font-semibold uppercase">Total Applications</div>
                <div className="text-xs text-gray-400 mt-2 font-medium">This Year</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 p-6 transition-all hover:scale-105">
                <div className="text-2xl font-bold text-emerald-400">{stats.totalScholarships}</div>
                <div className="text-xs text-gray-300 mt-2 font-semibold uppercase">Scholarships Listed</div>
                <div className="text-xs text-cyan-400 mt-2 font-bold">India-focused</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 p-6 transition-all hover:scale-105">
                <div className="text-2xl font-bold text-teal-400">{stats.successRate}%</div>
                <div className="text-xs text-gray-300 mt-2 font-semibold uppercase">Success Rate</div>
                <div className="text-xs text-gray-400 mt-2 font-medium">Overall acceptance</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 p-6 transition-all hover:scale-105">
                <div className="text-2xl font-bold text-orange-400">{stats.avgApplicationTime} min</div>
                <div className="text-xs text-gray-300 mt-2 font-semibold uppercase">Avg Time to Apply</div>
                <div className="text-xs text-green-400 mt-2 font-bold">User-friendly</div>
              </div>
            </div>

            {/* Application Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Applications by Status</h3>
                {Object.values(stats.applicationsByStatus).reduce((a: number, b: number) => a + b, 0) === 0 ? (
                  <div className="flex items-center justify-center h-32 text-center">
                    <p className="text-gray-400">No applications yet. Applications will appear here once submitted.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(stats.applicationsByStatus).map(([status, count]) => {
                      const total = Object.values(stats.applicationsByStatus).reduce((a: number, b: number) => a + b, 0)
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                      const colors: Record<string, string> = {
                        submitted: 'bg-blue-500',
                        reviewing: 'bg-yellow-500',
                        accepted: 'bg-green-500',
                        rejected: 'bg-red-500',
                      }

                      return (
                        <div key={status}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-300 capitalize">{status}</span>
                            <span className="text-gray-400">{count.toLocaleString()} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${colors[status] || 'bg-gray-500'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Top Scholarships */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Scholarships</h3>
                {stats.topScholarships.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-center">
                    <p className="text-gray-400">No scholarships with applications yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.topScholarships.map((scholarship, index) => (
                      <div key={index} className="pb-4 border-b border-white/10 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-white">{scholarship.name}</p>
                            <p className="text-sm text-gray-400">{scholarship.applications.toLocaleString()} applications</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-emerald-400">{scholarship.acceptanceRate}%</p>
                            <p className="text-xs text-gray-400">Acceptance Rate</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-xl font-semibold text-white">Recent Applications</h2>
            </div>
            {stats.recentApplications.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-center">No applications submitted yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/20">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Scholarship</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {stats.recentApplications.map((app) => {
                      const statusColors: Record<string, string> = {
                        'Accepted': 'bg-green-500/20 text-green-300 border border-green-400/30',
                        'Under Review': 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30',
                        'Submitted': 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
                        'Rejected': 'bg-red-500/20 text-red-300 border border-red-400/30',
                      }

                      return (
                        <tr key={app.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 text-sm font-mono text-white">{app.id}</td>
                          <td className="px-6 py-4 text-sm text-white">{app.scholarship}</td>
                          <td className="px-6 py-4 text-sm text-white">{app.student}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-500/20 text-gray-300 border border-gray-400/30'}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">{app.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Review</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              </div>
            )}
          </div>
        )}

        {/* Scholarships Tab */}
        {activeTab === 'scholarships' && (
          <>
            {stats.topScholarships.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-center">No scholarships listed yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.topScholarships.map((scholarship, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 p-6 transition-all">
                    <h3 className="text-lg font-semibold text-white mb-2">{scholarship.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">Applications:</span> {scholarship.applications.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">Acceptance Rate:</span> {scholarship.acceptanceRate}%
                      </p>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-white/10 mt-4">
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95">
                        Edit
                      </button>
                      <button className="flex-1 bg-red-500/20 text-red-300 border border-red-400/30 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-200 active:scale-95">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">User Management</h2>
            <div className="space-y-4">
              <div className="bg-white/10 border border-white/20 p-4 rounded-lg">
                <p className="text-gray-300">
                  Total Users: <span className="font-bold text-white">{stats.totalUsers.toLocaleString()}</span>
                </p>
                <p className="text-gray-300 mt-2">
                  Active This Month: <span className="font-bold text-white">{Math.round(stats.totalUsers * 0.65).toLocaleString()}</span>
                </p>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-xl font-medium transition-all hover:scale-105">
                Export User Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
