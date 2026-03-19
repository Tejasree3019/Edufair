'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ApplicationFormProps {
  scholarshipId?: string
  scholarshipName?: string
}

export default function ApplicationForm({ scholarshipId = '', scholarshipName = '' }: ApplicationFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: 'India',
    country: 'India',
    state: '',
    city: '',
    schoolName: '',
    academicScore: '',
    testScore: '',
    familyIncome: '',
    fieldOfStudy: '',
    educationLevel: 'ug',
    achievements: '',
    essayQuestion: '',
    refereeEmail: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Store application in local storage + send to API
      const applicationData = {
        id: `app_${Date.now()}`,
        scholarshipId,
        scholarshipName,
        ...formData,
        appliedDate: new Date().toISOString(),
        status: 'submitted',
      }

      // Save to localStorage for demo
      const existingApps = JSON.parse(localStorage.getItem('applications') || '[]')
      existingApps.push(applicationData)
      localStorage.setItem('applications', JSON.stringify(existingApps))

      // Try to send to API
      try {
        await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(applicationData),
        })
      } catch (apiError) {
        console.log('API not available, using local storage')
      }

      setSubmitted(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError('Failed to submit application. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your application for {scholarshipName} has been successfully submitted.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Scholarship Application Form</h1>
          {scholarshipName && <p className="text-lg text-cyan-400 font-semibold">{scholarshipName}</p>}
          <p className="text-gray-300 mt-2">Fill out this form to apply for the scholarship</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
          {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <h2 className="col-span-full text-2xl font-bold text-white mb-2">Personal Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gender *</label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 appearance-none cursor-pointer pr-10"
                >
                  <option value="" className="bg-slate-900 text-white">Select Gender</option>
                  <option value="male" className="bg-slate-900 text-white">Male</option>
                  <option value="female" className="bg-slate-900 text-white">Female</option>
                  <option value="other" className="bg-slate-900 text-white">Other</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
            </div>

            {/* Location */}
            <h2 className="col-span-full text-2xl font-bold text-white mt-6 mb-2">Location</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State/Province *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="Maharashtra, Delhi, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="Your city"
              />
            </div>

            {/* Academic Information */}
            <h2 className="col-span-full text-2xl font-bold text-white mt-6 mb-2">Academic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">School/College Name *</label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="Your school/college"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Academic Score (GPA/%) *</label>
              <input
                type="number"
                name="academicScore"
                value={formData.academicScore}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="e.g., 95 or 3.8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Entrance Test Score (JEE/CAT etc) *</label>
              <input
                type="number"
                name="testScore"
                value={formData.testScore}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="e.g., 98.5 percentile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Field of Study *</label>
              <div className="relative">
                <select
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 appearance-none cursor-pointer pr-10"
                >
                  <option value="" className="bg-slate-900 text-white">Select Field</option>
                  <option value="engineering" className="bg-slate-900 text-white">Engineering</option>
                  <option value="medicine" className="bg-slate-900 text-white">Medicine</option>
                  <option value="law" className="bg-slate-900 text-white">Law</option>
                  <option value="business" className="bg-slate-900 text-white">Business</option>
                  <option value="science" className="bg-slate-900 text-white">Science</option>
                  <option value="arts" className="bg-slate-900 text-white">Arts</option>
                  <option value="commerce" className="bg-slate-900 text-white">Commerce</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Education Level *</label>
              <div className="relative">
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 appearance-none cursor-pointer pr-10"
                >
                  <option value="10th" className="bg-slate-900 text-white">10th Grade</option>
                  <option value="12th" className="bg-slate-900 text-white">12th Grade</option>
                  <option value="ug" className="bg-slate-900 text-white">Undergraduate</option>
                  <option value="pg" className="bg-slate-900 text-white">Postgraduate</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
            </div>

            {/* Financial Information */}
            <h2 className="col-span-full text-2xl font-bold text-white mt-6 mb-2">Financial Information</h2>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">Annual Family Income (₹) *</label>
              <input
                type="number"
                name="familyIncome"
                value={formData.familyIncome}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="e.g., 500000"
              />
            </div>

            {/* Essays & Additional */}
            <h2 className="col-span-full text-2xl font-bold text-white mt-6 mb-2">Additional Information</h2>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">Achievements & Awards</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="List any awards, competitions, or achievements..."
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Why are you applying for this scholarship? *
              </label>
              <textarea
                name="essayQuestion"
                value={formData.essayQuestion}
                onChange={handleChange}
                rows={5}
                required
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="Tell us about your educational goals and why you deserve this scholarship..."
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">Referee Email (Teacher/Principal)</label>
              <input
                type="email"
                name="refereeEmail"
                value={formData.refereeEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 transition-all"
                placeholder="teacher@school.com"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-success text-white font-bold py-3 px-6 rounded-lg shadow-button hover:shadow-button-lg hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-5 h-5 border-2 border-white border-r-transparent rounded-full animate-spin"></span>
                  Submitting...
                </span>
              ) : (
                '✓ Submit Application'
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg shadow-button hover:shadow-button-lg transition-all duration-200 active:scale-95"
            >
              ← Go Back
            </button>
          </div>

          <p className="text-sm text-gray-400 text-center mt-4 font-semibold">* Required fields</p>
        </form>
      </div>
    </div>
  )
}
