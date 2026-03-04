'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Application {
  id: string
  scholarshipId: string
  scholarshipName: string
  status: 'submitted' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn'
  appliedDate: string
  updatedAt: string
  fullName: string
  email: string
  matchPercentage?: number
}

export default function ApplicationTrackingDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'submitted' | 'reviewing' | 'accepted' | 'rejected'>('all')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0,
    successRate: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    fetchApplications(token)
  }, [router])

  const fetchApplications = async (token: string) => {
    try {
      const response = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        const apps = data.applications || []
        setApplications(apps)
        calculateStats(apps)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (apps: Application[]) => {
    const total = apps.length
    const submitted = apps.filter((a) => a.status === 'submitted').length
    const reviewing = apps.filter((a) => a.status === 'reviewing').length
    const accepted = apps.filter((a) => a.status === 'accepted').length
    const rejected = apps.filter((a) => a.status === 'rejected').length
    const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0

    setStats({
      total,
      submitted,
      reviewing,
      accepted,
      rejected,
      successRate,
    })
  }

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return '📝'
      case 'reviewing':
        return '👀'
      case 'accepted':
        return '✅'
      case 'rejected':
        return '❌'
      case 'withdrawn':
        return '🚫'
      default:
        return '📋'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Application Tracker</h1>
          <p className="text-gray-600">Monitor and manage your scholarship applications</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-blue-600">{stats.submitted}</div>
            <div className="text-sm text-gray-600">Submitted</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-yellow-600">{stats.reviewing}</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-indigo-600">{stats.successRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Applications</h2>
          <div className="flex flex-wrap gap-2">
            {(['all', 'submitted', 'reviewing', 'accepted', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">No applications found</p>
            <button
              onClick={() => router.push('/scholarships')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Browse Scholarships
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Application Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{app.scholarshipName}</h3>
                      <p className="text-sm text-gray-600">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(app.status)}`}>
                        {getStatusIcon(app.status)} {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase">Application ID</p>
                      <p className="font-mono text-sm text-gray-900">{app.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase">Last Updated</p>
                      <p className="text-sm text-gray-900">{new Date(app.updatedAt).toLocaleDateString()}</p>
                    </div>
                    {app.matchPercentage && (
                      <div>
                        <p className="text-xs text-gray-600 uppercase">Match Percentage</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600"
                              style={{ width: `${app.matchPercentage}%` }}
                            ></div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{app.matchPercentage}%</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Status Timeline:</span>
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-700">Submitted</span>
                      </div>
                      {['reviewing', 'accepted', 'rejected'].includes(app.status) && (
                        <>
                          <span className="text-gray-400">→</span>
                          <div className="flex items-center gap-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${app.status === 'reviewing' ? 'bg-yellow-500' : 'bg-gray-300'}`}></span>
                            <span className="text-gray-700">Under Review</span>
                          </div>
                        </>
                      )}
                      {(app.status === 'accepted' || app.status === 'rejected') && (
                        <>
                          <span className="text-gray-400">→</span>
                          <div className="flex items-center gap-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${app.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-gray-700">{app.status === 'accepted' ? 'Accepted' : 'Rejected'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                    >
                      View Details
                    </button>
                    {app.status === 'submitted' && (
                      <button className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 font-medium">
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedApp.scholarshipName}</h3>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Application ID</p>
                    <p className="font-mono text-gray-900">{selectedApp.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedApp.status)}`}>
                      {getStatusIcon(selectedApp.status)} {selectedApp.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applied Date</p>
                    <p className="text-gray-900">{new Date(selectedApp.appliedDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-gray-900">{new Date(selectedApp.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
