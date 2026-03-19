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
    const savedProfile = localStorage.getItem('studentProfile')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    let user = JSON.parse(userData)
    
    // If a student profile is saved, mark the user as having a complete profile
    if (savedProfile && !user.profileComplete) {
      user.profileComplete = true
      localStorage.setItem('user', JSON.stringify(user))
    }

    setUser(user)
    fetchDashboardData(token)
  }, [router])

  const fetchDashboardData = async (token: string) => {
    try {
      // Fetch user profile from API to get actual profile_completed status
      const profileResponse = await fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      let profileData = null
      if (profileResponse.ok) {
        const profileResult = await profileResponse.json()
        profileData = profileResult.user
        
        // Update user object with actual profile_completed status from database
        if (profileData && profileData.profile_completed !== undefined) {
          let userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : {}
          userData.profileComplete = profileData.profile_completed
          localStorage.setItem('user', JSON.stringify(userData))
          setUser(userData)
        }
      }

      // Get saved student profile or use API data
      const savedProfile = localStorage.getItem('studentProfile')
      const profile = savedProfile ? JSON.parse(savedProfile) : (profileData ? {
        gpa: profileData.academic_grade || 3.8,
        testScore: profileData.test_scores || 95,
        field: profileData.preferred_field_of_study || 'Engineering',
        educationLevel: profileData.education_level || 'ug',
        country: profileData.country || 'India',
      } : {
        gpa: 3.8,
        testScore: 95,
        field: 'Engineering',
        educationLevel: 'ug',
        country: 'India',
      })

      // Fetch recommendations with profile data
      const recsParams = new URLSearchParams({
        country: profile.country || 'India',
        gpa: profile.gpa?.toString() || '3.8',
        testScore: profile.testScore?.toString() || '95',
        field: profile.field || 'Engineering',
        educationLevel: profile.educationLevel || 'ug',
      })

      const recsResponse = await fetch(`/api/recommendations?${recsParams}`, {
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

      // Fetch alerts - with error handling to prevent auth 401
      try {
        const alertsResponse = await fetch('/api/alerts', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json()
          setAlerts(alertsData.alerts?.slice(0, 3) || [])
        }
      } catch (alertError) {
        // Silently fail for alerts - not critical
        console.log('Alerts fetch skipped')
        setAlerts([])
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
    localStorage.removeItem('userProfile')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-200/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-gray-300 font-semibold text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      {/* Main Content */}
      <main className="w-full px-2 sm:px-3 lg:px-4 py-12 relative z-10">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-2xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
              <p className="text-blue-100 text-sm">Discover scholarships matched to your profile</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Recommendations', value: recommendations.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Applications', value: applications.length, color: 'from-green-500 to-emerald-500' },
            { label: 'Alerts', value: alerts.length, color: 'from-purple-500 to-pink-500' },
            { label: 'Profile', value: user?.profileComplete ? 'Complete' : 'Pending', color: 'from-orange-500 to-red-500' },
          ].map((stat, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scholarship Recommendations */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:border-white/40 transition-all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Top Scholarship Matches</h2>
                <Link href="/scholarships" className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs transition-colors">
                  View All →
                </Link>
              </div>

              {recommendations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-3">🎯</div>
                  <p className="text-gray-300 mb-6 text-lg">No recommendations yet</p>
                  <Link
                    href="/profile"
                    className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 active:scale-95"
                  >
                    Complete Your Profile
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => {
                    const matchPercentage = (rec.overall_suitability_score * 100);
                    let description = '';
                    let badgeColor = 'from-gray-500 to-gray-600';
                    
                    if (matchPercentage >= 80) {
                      description = '🌟 Excellent Match - Highly Recommended';
                      badgeColor = 'from-green-600 to-emerald-600';
                    } else if (matchPercentage >= 60) {
                      description = '✅ Strong Match - Good Fit';
                      badgeColor = 'from-green-500 to-emerald-500';
                    } else if (matchPercentage >= 40) {
                      description = '📌 Moderate Match - Worth Applying';
                      badgeColor = 'from-yellow-500 to-orange-500';
                    } else if (matchPercentage >= 20) {
                      description = '⚠️ Low Match - Consider Your Options';
                      badgeColor = 'from-orange-500 to-red-500';
                    } else {
                      description = '❌ Very Low Match - Not Recommended';
                      badgeColor = 'from-red-500 to-red-600';
                    }
                    
                    return (
                      <div key={rec.id || rec.scholarship_id} className="group border border-white/20 rounded-2xl p-5 hover:border-cyan-400 hover:bg-white/5 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors">{rec.scholarship_id}</h3>
                            <p className="text-xs text-gray-300 mt-2 font-medium">{description}</p>
                          </div>
                          <span className={`bg-gradient-to-r ${badgeColor} text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg whitespace-nowrap ml-3`}>
                            {matchPercentage.toFixed(0)}% Match
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${badgeColor} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${matchPercentage}%` }}
                          ></div>
                        </div>
                        <button 
                          onClick={() => router.push(`/scholarship/${rec.scholarship_id}`)}
                          className="text-white bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2.5 rounded-xl font-semibold mt-3 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 active:scale-95 w-full text-center text-xs"
                        >
                          View Details & Apply →
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Applications Tracking */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:border-white/40 transition-all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">📝 Your Applications</h2>
                <Link href="/tracking" className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs transition-colors">
                  View All →
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-3">📝</div>
                  <p className="text-gray-300 mb-6 text-lg">No applications submitted yet</p>
                  <Link
                    href="/scholarships"
                    className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-200 active:scale-95"
                  >
                    Discover & Apply Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400 hover:bg-white/10 hover:shadow-lg transition-all transform hover:scale-105">
                      <div>
                        <p className="font-semibold text-white">{app.scholarships?.name || 'Scholarship'}</p>
                        <p className={`text-sm font-medium mt-1 ${
                          app.status === 'submitted' ? 'text-blue-400' :
                          app.status === 'approved' ? 'text-green-400' :
                          app.status === 'rejected' ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          Status: {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </p>
                      </div>
                      <Link href="/tracking" className="text-cyan-400 hover:text-cyan-300 hover:font-bold font-semibold text-sm transition-colors">
                        View →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Alerts */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:border-white/40 transition-all">
              <h3 className="text-xl font-bold text-white mb-4">📢 Recent Alerts</h3>

              {alerts.length === 0 ? (
                <p className="text-gray-400 text-sm">No new alerts</p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-blue-500/10 border-l-4 border-blue-400 rounded-lg hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-400/20 transition-all transform hover:scale-105">
                      <p className="text-sm font-bold text-blue-300">{alert.title}</p>
                      <p className="text-xs text-gray-300 mt-2">{alert.message}</p>
                      <button className="text-blue-400 hover:text-blue-300 hover:font-semibold text-xs font-semibold mt-2 transition-colors">
                        Learn more →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:border-white/40 transition-all space-y-3">
              <h3 className="text-xl font-bold text-white mb-4">⚡ Quick Actions</h3>

              <Link
                href="/profile"
                className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 active:scale-95 text-center text-sm"
              >
                👤 Complete Profile
              </Link>
              <Link
                href="/scholarships"
                className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-200 active:scale-95 text-center text-sm"
              >
                🔍 Browse Scholarships
              </Link>
              <Link
                href="/tracking"
                className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 active:scale-95 text-center text-sm"
              >
                📊 Track Applications
              </Link>
            </div>

            {/* Profile Completion */}
            {!user?.profileComplete && (
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl border-2 border-orange-400/50 p-8 hover:border-orange-400 transition-all">
                <div className="text-center">
                  <p className="text-sm font-semibold text-orange-300 mb-2">⚠️ Profile Incomplete</p>
                  <p className="text-xs text-orange-200 mb-4">Complete your profile to get better scholarship matches</p>
                  <Link
                    href="/profile"
                    className="inline-block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/50 font-semibold text-sm transition-all hover:scale-105 duration-200"
                  >
                    Complete Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
