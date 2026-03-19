'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    full_name: '',
    country: 'India',
    region_state: '',
    school_type: '',
    academic_grade: '',
    family_income: '',
    preferred_field_of_study: '',
    career_goals: '',
    education_level: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('') // Clear error when user types
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('Authentication required. Please login first.')
        setLoading(false)
        return
      }

      // Validate required fields
      if (!formData.full_name?.trim()) {
        setError('Full name is required')
        setLoading(false)
        return
      }

      if (!formData.academic_grade) {
        setError('Please enter your GPA/score')
        setLoading(false)
        return
      }

      if (!formData.preferred_field_of_study) {
        setError('Please select your preferred field of study')
        setLoading(false)
        return
      }

      if (!formData.education_level) {
        setError('Please select your education level')
        setLoading(false)
        return
      }

      // Prepare data for API
      const dataToSend = {
        full_name: formData.full_name.trim(),
        country: formData.country || 'India',
        region_state: formData.region_state || undefined,
        school_type: formData.school_type || undefined,
        academic_grade: formData.academic_grade ? parseFloat(formData.academic_grade) : undefined,
        family_income: formData.family_income ? parseInt(formData.family_income) : undefined,
        preferred_field_of_study: formData.preferred_field_of_study || undefined,
        career_goals: formData.career_goals || undefined,
        education_level: formData.education_level || undefined,
      }

      // Remove undefined values
      Object.keys(dataToSend).forEach(
        (key) => dataToSend[key as keyof typeof dataToSend] === undefined && delete dataToSend[key as keyof typeof dataToSend]
      )

      console.log('Saving profile with data:', dataToSend)

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      })

      const responseData = await response.json()
      console.log('Response:', responseData)

      if (!response.ok) {
        const errorMsg = responseData.error || 'Failed to save profile. Please try again.'
        setError(errorMsg)
        setLoading(false)
        return
      }

      if (responseData.success) {
        // Save to localStorage for persistence
        localStorage.setItem('userProfile', JSON.stringify(responseData.user))
        
        // CRITICAL: Update the user object to mark profile as complete
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        userData.profileComplete = true
        localStorage.setItem('user', JSON.stringify(userData))
        
        setSuccess('✅ Profile saved successfully!')
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(responseData.error || 'Failed to save profile. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to connect to server'
      setError(`Connection error: ${errorMsg}. Please try again.`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-8 md:py-12 relative overflow-hidden scrollbar-gutter-stable">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 w-full max-w-3xl border border-white/20 relative z-10 shadow-2xl">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Complete Your Profile</h1>
          <p className="text-gray-300 text-base font-light">
            Help us understand your background to get personalized scholarship recommendations matched to your goals
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/40 rounded-xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-red-300 font-medium text-sm">Error saving profile</p>
                <p className="text-red-200/80 text-sm mt-1">{error}</p>
                {error.includes('Connection error') && (
                  <p className="text-red-200/60 text-xs mt-2">
                    💡 Tip: Make sure all environment variables are properly configured on the server.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-600/10 border border-green-500/40 rounded-xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl">✅</span>
              <p className="text-green-300 font-medium text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-10 pb-8 border-b border-white/10">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                    num < step
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                      : num === step
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-110'
                      : 'bg-white/10 border-2 border-white/20 text-gray-400 hover:border-white/40'
                  }`}
                >
                  {num < step ? '✓' : num}
                </div>
                <span className="text-xs text-gray-400 mt-2 font-medium">
                  {num === 1 ? 'Location' : num === 2 ? 'Academic' : num === 3 ? 'Financial' : 'Goals'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative w-full bg-white/5 rounded-full h-2 border border-white/10 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Step {step} of 4</p>
        </div>

        {/* Step Content */}
        <div className="space-y-6 mb-10">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">👤</span> Personal Information
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:bg-white/10 transition-all outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  🇮🇳 Country
                </label>
                <div className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white font-medium">
                  India
                </div>
                <input type="hidden" name="country" value="India" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  📍 State/Region
                </label>
                <input
                  type="text"
                  name="region_state"
                  value={formData.region_state}
                  onChange={handleChange}
                  placeholder="e.g., Delhi, Maharashtra, Karnataka, Tamil Nadu..."
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:bg-white/10 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  🏫 School Type
                </label>
                <select
                  name="school_type"
                  value={formData.school_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:bg-white/10 transition-all outline-none appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e5e7eb' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                >
                  <option value="" className="bg-slate-900 text-white">Select your school type...</option>
                  <option value="government" className="bg-slate-900 text-white">Government School</option>
                  <option value="private" className="bg-slate-900 text-white">Private School</option>
                  <option value="international" className="bg-slate-900 text-white">International School</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">📚</span> Academic Profile
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Current Education Level *
                </label>
                <select
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:bg-white/10 transition-all outline-none appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e5e7eb' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                  required
                >
                  <option value="" className="bg-slate-900 text-white">Select your current level...</option>
                  <option value="10th" className="bg-slate-900 text-white">10th Grade (Class X)</option>
                  <option value="12th" className="bg-slate-900 text-white">12th Grade (Class XII)</option>
                  <option value="diploma" className="bg-slate-900 text-white">Diploma</option>
                  <option value="ug" className="bg-slate-900 text-white">Undergraduate (Bachelor's)</option>
                  <option value="pg" className="bg-slate-900 text-white">Postgraduate (Master's)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Current GPA/Score *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="academic_grade"
                    value={formData.academic_grade}
                    onChange={handleChange}
                    placeholder="e.g., 90 (on 100) or 3.8 (on 4.0)"
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:bg-white/10 transition-all outline-none"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">💡 Your GPA/percentage score helps us find matching scholarships</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">💰</span> Financial Information
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Annual Family Income (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400 font-semibold">₹</span>
                  <input
                    type="number"
                    name="family_income"
                    value={formData.family_income}
                    onChange={handleChange}
                    placeholder="e.g., 500000 or 25 lakhs"
                    className="w-full pl-8 pr-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:bg-white/10 transition-all outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  🔒 Your financial information is completely private and helps us find need-based scholarships
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-cyan-300 mb-2">💡 Income Brackets</h3>
                <div className="text-xs text-gray-300 space-y-1">
                  <p>🟢 Low Income: Below ₹3 lakhs</p>
                  <p>🟡 Middle Income: ₹3 - 10 lakhs</p>
                  <p>🔵 Higher-Middle: ₹10 - 25 lakhs</p>
                  <p>⚪ High Income: Above ₹25 lakhs</p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Goals & Interests
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Preferred Field of Study *
                </label>
                <select
                  name="preferred_field_of_study"
                  value={formData.preferred_field_of_study}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:bg-white/10 transition-all outline-none appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e5e7eb' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                  required
                >
                  <option value="" className="bg-slate-900 text-white">Select your field of interest...</option>
                  <option value="STEM" className="bg-slate-900 text-white">STEM (Science, Tech, Engineering, Math)</option>
                  <option value="Engineering" className="bg-slate-900 text-white">Engineering</option>
                  <option value="Business" className="bg-slate-900 text-white">Business & Management</option>
                  <option value="Medical" className="bg-slate-900 text-white">Medical & Health Sciences</option>
                  <option value="Law" className="bg-slate-900 text-white">Law & Governance</option>
                  <option value="Humanities" className="bg-slate-900 text-white">Humanities & Social Sciences</option>
                  <option value="Arts" className="bg-slate-900 text-white">Arts & Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Career Goals
                </label>
                <textarea
                  name="career_goals"
                  value={formData.career_goals}
                  onChange={handleChange}
                  placeholder="What are your career aspirations? E.g., 'Become a software engineer', 'Work in renewable energy', 'Start a social enterprise', etc."
                  rows={5}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:bg-white/10 transition-all outline-none resize-none"
                />
                <p className="text-xs text-gray-400 mt-2">📝 This helps scholarships organizations understand your potential</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4 pt-6 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="px-6 py-3 border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            ← Previous
          </button>

          <div className="text-center text-sm text-gray-400">
            {step === 4 && '📝 Almost there! Review and complete.'}
            {step === 3 && '💰 Financial info helps find need-based scholarships.'}
            {step === 2 && '📚 Your academic profile is important.'}
            {step === 1 && '👤 Let\'s start with your basics.'}
          </div>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 active:scale-95"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.full_name || !formData.academic_grade || !formData.preferred_field_of_study}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin"></span>
                  Saving Profile...
                </>
              ) : (
                <>
                  ✅ Complete Profile
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
