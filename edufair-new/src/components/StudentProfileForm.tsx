'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'

interface StudentProfile {
  fullName: string
  email: string
  country: string
  educationLevel: string
  field: string
  gpa: number
  testScore: number
}

export default function StudentProfileForm() {
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: '',
    email: '',
    country: 'India',
    educationLevel: 'ug',
    field: 'Engineering',
    gpa: 3.5,
    testScore: 75,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load saved profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('studentProfile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  // Auto-save profile on change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('studentProfile', JSON.stringify(profile))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 500)

    return () => clearTimeout(timer)
  }, [profile])

  const handleChange = (field: keyof StudentProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
        {saved && (
          <span className="text-sm text-green-600 font-semibold flex items-center gap-2">
            ✓ Saved automatically
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Country
          </label>
          <select
            value={profile.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Education Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Education Level
          </label>
          <select
            value={profile.educationLevel}
            onChange={(e) => handleChange('educationLevel', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="12th">12th Pass</option>
            <option value="ug">Undergraduate</option>
            <option value="pg">Postgraduate</option>
            <option value="phd">PhD</option>
          </select>
        </div>

        {/* Field of Study */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Field of Study
          </label>
          <select
            value={profile.field}
            onChange={(e) => handleChange('field', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Engineering">Engineering</option>
            <option value="Science">Science</option>
            <option value="Commerce">Commerce</option>
            <option value="Arts">Arts</option>
            <option value="Medical">Medical</option>
            <option value="Business">Business</option>
          </select>
        </div>

        {/* GPA/Score */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            GPA/Percentage
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={profile.gpa}
            onChange={(e) => handleChange('gpa', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Test Score */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Test Score (JEE/SAT/IELTS out of 100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={profile.testScore}
            onChange={(e) => handleChange('testScore', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          ✓ Your profile is automatically saved. Use these details for future applications!
        </p>
      </div>
    </div>
  )
}
