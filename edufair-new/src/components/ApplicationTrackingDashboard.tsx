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
    <div className="py-8 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2\">Application Tracking</h1>\n          <p className="text-gray-300 text-sm font-light\">Monitor and manage your scholarship applications</p>\n        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-gray-300 mt-1 font-medium">Total Applications</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all">
            <div className="text-2xl font-bold text-blue-400">{stats.submitted}</div>
            <div className="text-xs text-gray-300 mt-1 font-medium">Submitted</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all">
            <div className="text-2xl font-bold text-yellow-400">{stats.reviewing}</div>
            <div className="text-xs text-gray-300 mt-1 font-medium">Under Review</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all">
            <div className="text-2xl font-bold text-green-400">{stats.accepted}</div>
            <div className="text-xs text-gray-300 mt-1 font-medium">Accepted</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all">
            <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
            <div className="text-xs text-gray-300 mt-1 font-medium">Rejected</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all">
            <div className="text-2xl font-bold text-indigo-400">{stats.successRate}%</div>
            <div className="text-xs text-gray-300 mt-1 font-medium">Success Rate</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Filter Applications</h2>
          <div className="flex flex-wrap gap-2">
            {(['all', 'submitted', 'reviewing', 'accepted', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all text-sm ${
                  filter === status
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
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
            <p className="text-gray-300 text-sm">Loading your applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
            <p className="text-gray-300 mb-6 text-base">No applications found</p>
            <button
              onClick={() => router.push('/scholarships')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95"
            >
              Browse Scholarships
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div key={app.id} className="bg-white/10 backdrop-blur-xl rounded-2xl hover:bg-white/15 transition-all border border-white/20 hover:border-white/40">
                <div className="p-6">
                  {/* Application Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{app.scholarshipName}</h3>
                      <p className="text-sm text-gray-300">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        app.status === 'submitted' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                        app.status === 'reviewing' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                        app.status === 'accepted' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                        app.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                        'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                      }`}>
                        {getStatusIcon(app.status)} {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Application ID</p>
                      <p className="font-mono text-sm text-white">{app.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Last Updated</p>
                      <p className="text-sm text-white">{new Date(app.updatedAt).toLocaleDateString()}</p>
                    </div>
                    {app.matchPercentage && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Match Percentage</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              style={{ width: `${app.matchPercentage}%` }}
                            ></div>
                          </div>
                          <p className="text-sm font-medium text-white">{app.matchPercentage}%</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">Status Timeline:</span>
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-gray-300">Submitted</span>
                      </div>
                      {['reviewing', 'accepted', 'rejected'].includes(app.status) && (
                        <>
                          <span className="text-gray-500">→</span>
                          <div className="flex items-center gap-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${app.status === 'reviewing' ? 'bg-yellow-400' : 'bg-gray-500'}`}></span>
                            <span className="text-gray-300">Under Review</span>
                          </div>
                        </>
                      )}
                      {(app.status === 'accepted' || app.status === 'rejected') && (
                        <>
                          <span className="text-gray-500">→</span>
                          <div className="flex items-center gap-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${app.status === 'accepted' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                            <span className="text-gray-300">{app.status === 'accepted' ? 'Accepted' : 'Rejected'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4 pt-4 border-t border-white/20">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95"
                    >
                      View Details
                    </button>
                    {app.status === 'submitted' && (
                      <button className="flex-1 bg-red-500/20 text-red-300 border border-red-400/30 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-200">
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

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="flex-1 bg-gradient-primary text-white px-4 py-2 rounded-lg font-semibold shadow-button hover:shadow-button-lg hover:scale-105 transition-all duration-200 active:scale-95"
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
