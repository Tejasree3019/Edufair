'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchDashboardData(token)
  }, [router])

  const fetchDashboardData = async (token: string) => {
    try {
      // Fetch recommendations
      const recsResponse = await fetch('/api/recommendations', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (recsResponse.ok) {
        const recsData = await recsResponse.json()
        setRecommendations(recsData.recommendations.slice(0, 5))
      }

      // Fetch applications
      const appsResponse = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (appsResponse.ok) {
        const appsData = await appsResponse.json()
        setApplications(appsData.applications)
      }

      // Fetch alerts
      const alertsResponse = await fetch('/api/alerts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData.alerts.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">EduFair</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.fullName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600">{recommendations.length}</div>
            <p className="text-gray-600">Recommended Scholarships</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600">{applications.length}</div>
            <p className="text-gray-600">Applications</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-purple-600">{alerts.length}</div>
            <p className="text-gray-600">Active Alerts</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Link href="/profile" className="text-blue-600 hover:underline font-semibold">
              → Complete Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Recommendations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Scholarship Matches</h2>

              {recommendations.length === 0 ? (
                <p className="text-gray-600">
                  No recommendations yet. Complete your profile to get personalized matches.
                </p>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {rec.scholarship_id}
                        </h3>
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Match: {(rec.overall_suitability_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {rec.priority_level === 'high'
                          ? '🔥 High Priority'
                          : rec.priority_level === 'medium'
                          ? '⭐ Medium Priority'
                          : '📌 Low Priority'}
                      </p>
                      <button className="text-blue-600 hover:underline text-sm font-semibold">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Link
                href="/scholarships"
                className="text-blue-600 hover:underline font-semibold mt-4 inline-block"
              >
                View All Scholarships →
              </Link>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Applications</h2>

              {applications.length === 0 ? (
                <p className="text-gray-600">No applications yet.</p>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {app.scholarships?.name || 'Scholarship'}
                        </p>
                        <p className="text-sm text-gray-600">Status: {app.status}</p>
                      </div>
                      <button className="text-blue-600 hover:underline text-sm">
                        Edit →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Alerts */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📢 Recent Alerts</h3>

              {alerts.length === 0 ? (
                <p className="text-gray-600 text-sm">No new alerts</p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-center font-semibold"
                >
                  Complete Profile
                </Link>
                <Link
                  href="/scholarships"
                  className="block w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 text-center font-semibold"
                >
                  Browse Scholarships
                </Link>
                <Link
                  href="/fee-calculator"
                  className="block w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 text-center font-semibold"
                >
                  Fee Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
