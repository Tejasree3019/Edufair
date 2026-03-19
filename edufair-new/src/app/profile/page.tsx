'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    educationLevel: '',
    fieldOfStudy: '',
    gpa: '',
    testScore: '',
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token || !userData) {
          router.push('/login')
          return
        }

        // Fetch profile from API
        const response = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          const user = data.user
          setFormData({
            fullName: user.full_name || '',
            email: user.email || '',
            country: user.country || 'India',
            educationLevel: user.education_level || 'ug',
            fieldOfStudy: user.preferred_field_of_study || 'STEM',
            gpa: user.academic_grade ? user.academic_grade.toString() : '3.5',
            testScore: user.test_scores ? user.test_scores.toString() : '85',
          })
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Convert to snake_case to match API expectations
      const dataToSend = {
        full_name: formData.fullName,
        country: formData.country,
        education_level: formData.educationLevel,
        preferred_field_of_study: formData.fieldOfStudy,
        academic_grade: parseFloat(formData.gpa),
        test_scores: parseInt(formData.testScore),
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to save profile')
        return
      }

      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = {
        ...userData,
        ...formData,
        profileComplete: true, // Mark profile as complete
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Also save student profile for recommendations
      const studentProfile = {
        fullName: formData.fullName,
        email: formData.email,
        country: formData.country,
        educationLevel: formData.educationLevel,
        fieldOfStudy: formData.fieldOfStudy,
        gpa: parseFloat(formData.gpa),
        testScore: parseInt(formData.testScore),
      }
      localStorage.setItem('studentProfile', JSON.stringify(studentProfile))

      setMessage('✅ Profile saved successfully!')
      setTimeout(() => {
        setMessage('')
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('An error occurred while saving your profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 font-semibold text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-flex items-center gap-2 font-semibold text-sm transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">My Profile</h1>
          <p className="text-gray-300 text-sm font-light">Manage your educational information and preferences</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 backdrop-blur-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 backdrop-blur-xl">
            {error}
          </div>
        )}

        {/* VIEW MODE - Show user details */}
        {!isEditMode && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 space-y-6 hover:border-white/40 transition-all">
            {/* Personal Information Display */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-white/10">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-sm text-gray-400 font-semibold mb-2 uppercase tracking-wide">Full Name</p>
                  <p className="text-lg text-white font-bold">{formData.fullName || 'Not provided'}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-sm text-gray-400 font-semibold mb-2 uppercase tracking-wide">Email</p>
                  <p className="text-lg text-white font-bold break-all">{formData.email || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Educational Information Display */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-white/10">
                Educational Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-sm text-gray-400 font-semibold mb-2 uppercase tracking-wide">Country</p>
                  <p className="text-lg text-white font-bold">🇮🇳 {formData.country || 'Not provided'}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-sm text-gray-400 font-semibold mb-2 uppercase tracking-wide">Education Level</p>
                  <p className="text-lg text-white font-bold">
                    {formData.educationLevel === '12' ? '12th Pass'
                    : formData.educationLevel === 'ug' ? 'Undergraduate'
                    : formData.educationLevel === 'pg' ? 'Postgraduate'
                    : formData.educationLevel === 'phd' ? 'PhD'
                    : formData.educationLevel || 'Not provided'}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-sm text-gray-400 font-semibold mb-2 uppercase tracking-wide">Field of Study</p>
                  <p className="text-lg text-white font-bold">{formData.fieldOfStudy || 'Not provided'}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-sm text-gray-400 font-semibold mb-2 uppercase tracking-wide">GPA (0-4.0)</p>
                  <p className="text-lg text-cyan-400 font-bold">{formData.gpa || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Academic Performance Display */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-white/10">
                Academic Performance
              </h2>
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <p className="text-sm text-gray-400 font-semibold mb-2 uppercase tracking-wide">Test Score (0-100)</p>
                  <p className="text-lg text-cyan-400 font-bold">{formData.testScore || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="pt-6 border-t border-white/10">
              <button
                onClick={() => setIsEditMode(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* EDIT MODE - Show form */}
        {isEditMode && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:border-white/40 transition-all">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Edit Profile</h1>
            <p className="text-gray-300 mb-8 text-sm font-light">Update your information to get better scholarship matches</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Educational Information */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Educational Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Country
                  </label>
                  <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold">
                    🇮🇳 India
                  </div>
                  <input type="hidden" name="country" value="India" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Education Level
                  </label>
                  <div className="relative">
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all appearance-none cursor-pointer pr-10"
                    >
                      <option value="12" className="bg-slate-900 text-white">12th Pass</option>
                      <option value="ug" className="bg-slate-900 text-white">Undergraduate</option>
                      <option value="pg" className="bg-slate-900 text-white">Postgraduate</option>
                      <option value="phd" className="bg-slate-900 text-white">PhD</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Field of Study
                  </label>
                  <div className="relative">
                    <select
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all appearance-none cursor-pointer pr-10"
                    >
                      <option value="STEM" className="bg-slate-900 text-white">STEM</option>
                      <option value="Business" className="bg-slate-900 text-white">Business</option>
                      <option value="Arts" className="bg-slate-900 text-white">Arts</option>
                      <option value="Commerce" className="bg-slate-900 text-white">Commerce</option>
                      <option value="Law" className="bg-slate-900 text-white">Law</option>
                      <option value="Medicine" className="bg-slate-900 text-white">Medicine</option>
                      <option value="Engineering" className="bg-slate-900 text-white">Engineering</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    GPA (0-4.0)
                  </label>
                  <input
                    type="number"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    min="0"
                    max="4"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="3.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Test Score (0-100)
                  </label>
                  <input
                    type="number"
                    name="testScore"
                    value={formData.testScore}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="85"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 font-bold"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="flex-1 bg-white/10 border border-white/20 text-white py-4 rounded-xl hover:bg-white/15 hover:border-white/40 transition-all duration-200 font-bold"
              >
                Cancel
              </button>
            </div>
            </form>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-white/40 transition-all">
          <h3 className="font-bold text-white mb-4 text-lg">Profile Tips</h3>
          <ul className="text-sm text-gray-300 space-y-3 divide-y divide-white/10">
            <li className="py-2">• Keep your information up-to-date for better scholarship matches</li>
            <li className="py-2">• Your GPA and test scores help us find relevant scholarships</li>
            <li className="py-2">• Profile changes are saved immediately to your account</li>
            <li className="py-2">• You can edit your profile anytime from the dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
