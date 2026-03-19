'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function IndiaScholarshipsShowcase() {
  const [scholarships, setScholarships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load India scholarships from JSON
    loadIndiaScholarships()
  }, [])

  const loadIndiaScholarships = async () => {
    try {
      // Fetch from API endpoint which loads real data
      const response = await fetch('/api/scholarships?country=India&limit=6')
      if (response.ok) {
        const data = await response.json()
        // Show top 6 scholarships
        setScholarships(data.scholarships || [])
      }
    } catch (error) {
      console.error('Error loading India scholarships:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading scholarships...</div>
  }

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            🇮🇳 Featured Indian Scholarships
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore top scholarships available for Indian students from IITs, NITs, and government schemes
          </p>
        </div>

        {/* Scholarships Grid */}
        {scholarships.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No India scholarships available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
                  <h3 className="text-lg font-bold">{scholarship.name}</h3>
                  <p className="text-sm text-orange-100">{scholarship.category}</p>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Amount */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{scholarship.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{scholarship.scope}</p>
                  </div>

                  {/* Eligibility Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <p>
                      <span className="font-semibold text-gray-700">Min. GPA:</span>{' '}
                      <span className="text-gray-600">{scholarship.minGPA || scholarship.min_gpa || 'N/A'}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Fields:</span>{' '}
                      <span className="text-gray-600">{Array.isArray(scholarship.eligibleFields) ? scholarship.eligibleFields.join(', ') : scholarship.eligible_fields || 'All'}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Level:</span>{' '}
                      <span className="text-gray-600">{Array.isArray(scholarship.eligibleLevels) ? scholarship.eligibleLevels.join(', ') : scholarship.eligible_levels || 'Undergraduate'}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Credibility:</span>{' '}
                      <span className="text-gray-600">{scholarship.credibilityScore ? (scholarship.credibilityScore * 100).toFixed(0) : (scholarship.credibility_score * 100).toFixed(0)}%</span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Deadline:</span>{' '}
                      <span className="text-green-600 font-semibold">{scholarship.deadline}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">{scholarship.description}</p>

                  {/* CTA Button */}
                  <Link
                    href={`/register`}
                    className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            View All Indian Scholarships
          </Link>
        </div>
      </div>
    </section>
  )
}
