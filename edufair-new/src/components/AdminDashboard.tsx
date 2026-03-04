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

    // Check if user is admin
    try {
      const user = JSON.parse(userData)
      if (user.role !== 'admin') {
        router.push('/dashboard')
        return
      }
    } catch (e) {
      console.error('Error parsing user data:', e)
    }

    fetchAdminStats(token)
  }, [router])

  const fetchAdminStats = async (token: string) => {
    try {
      // Mock admin stats
      const mockStats: AdminStats = {
        totalUsers: 1250,
        totalApplications: 3847,
        totalScholarships: 20,
        successRate: 34,
        avgApplicationTime: 15,
        topScholarships: [
          { name: 'KVPY Fellowship', applications: 450, acceptanceRate: 78 },
          { name: 'IIT JEE Merit', applications: 380, acceptanceRate: 62 },
          { name: 'National Scholarship Scheme', applications: 320, acceptanceRate: 58 },
          { name: 'BITS Pilani', applications: 290, acceptanceRate: 45 },
          { name: 'VIT Merit', applications: 250, acceptanceRate: 52 },
        ],
        applicationsByStatus: {
          submitted: 1200,
          reviewing: 850,
          accepted: 1300,
          rejected: 497,
        },
        recentApplications: [
          { id: 'app_001', scholarship: 'KVPY Fellowship', student: 'Raj Kumar', status: 'Accepted', date: '2024-01-15' },
          { id: 'app_002', scholarship: 'IIT JEE Merit', student: 'Priya Singh', status: 'Under Review', date: '2024-01-14' },
          { id: 'app_003', scholarship: 'National Scholarship', student: 'Amit Patel', status: 'Submitted', date: '2024-01-13' },
          { id: 'app_004', scholarship: 'BITS Pilani', student: 'Sarah Ahmed', status: 'Accepted', date: '2024-01-12' },
          { id: 'app_005', scholarship: 'VIT Merit', student: 'Kumar Sharma', status: 'Rejected', date: '2024-01-11' },
        ],
      }

      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Failed to load admin dashboard</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform analytics and management</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(['overview', 'applications', 'scholarships', 'users'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-2">Total Users</div>
                <div className="text-xs text-green-600 mt-2">+12% from last month</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-gray-900">{stats.totalApplications.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-2">Total Applications</div>
                <div className="text-xs text-green-600 mt-2">+8% from last month</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-gray-900">{stats.totalScholarships}</div>
                <div className="text-sm text-gray-600 mt-2">Scholarships Listed</div>
                <div className="text-xs text-blue-600 mt-2">India-focused</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-green-600">{stats.successRate}%</div>
                <div className="text-sm text-gray-600 mt-2">Success Rate</div>
                <div className="text-xs text-gray-600 mt-2">Overall acceptance</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-gray-900">{stats.avgApplicationTime} min</div>
                <div className="text-sm text-gray-600 mt-2">Avg Time to Apply</div>
                <div className="text-xs text-green-600 mt-2">User-friendly</div>
              </div>
            </div>

            {/* Application Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Status</h3>
                <div className="space-y-4">
                  {Object.entries(stats.applicationsByStatus).map(([status, count]) => {
                    const total = Object.values(stats.applicationsByStatus).reduce((a, b) => a + b, 0)
                    const percentage = Math.round((count / total) * 100)
                    const colors: Record<string, string> = {
                      submitted: 'bg-blue-500',
                      reviewing: 'bg-yellow-500',
                      accepted: 'bg-green-500',
                      rejected: 'bg-red-500',
                    }

                    return (
                      <div key={status}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-gray-700 capitalize">{status}</span>
                          <span className="text-gray-600">{count.toLocaleString()} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${colors[status] || 'bg-gray-500'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Top Scholarships */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Scholarships</h3>
                <div className="space-y-4">
                  {stats.topScholarships.map((scholarship, index) => (
                    <div key={index} className="pb-4 border-b last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{scholarship.name}</p>
                          <p className="text-sm text-gray-600">{scholarship.applications.toLocaleString()} applications</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{scholarship.acceptanceRate}%</p>
                          <p className="text-xs text-gray-600">Acceptance Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scholarship</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentApplications.map((app) => {
                    const statusColors: Record<string, string> = {
                      'Accepted': 'bg-green-100 text-green-800',
                      'Under Review': 'bg-yellow-100 text-yellow-800',
                      'Submitted': 'bg-blue-100 text-blue-800',
                      'Rejected': 'bg-red-100 text-red-800',
                    }

                    return (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-900">{app.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{app.scholarship}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{app.student}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{app.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-indigo-600 hover:text-indigo-900 font-medium">Review</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Scholarships Tab */}
        {activeTab === 'scholarships' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.topScholarships.map((scholarship, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{scholarship.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Applications:</span> {scholarship.applications.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Acceptance Rate:</span> {scholarship.acceptanceRate}%
                  </p>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <button className="flex-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                  <button className="flex-1 text-red-600 hover:text-red-900 text-sm font-medium">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">User Management</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  Total Users: <span className="font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</span>
                </p>
                <p className="text-gray-600 mt-2">
                  Active This Month: <span className="font-bold text-gray-900">{Math.round(stats.totalUsers * 0.65).toLocaleString()}</span>
                </p>
              </div>
              <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium">
                Export User Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
