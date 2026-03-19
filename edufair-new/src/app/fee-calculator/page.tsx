'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FeeCalculator() {
  const [formData, setFormData] = useState({
    tuition: 0,
    accommodation: 0,
    books: 0,
    transport: 0,
    other: 0,
    scholarshipAmount: 0,
  })

  const totalCost = Object.entries(formData)
    .filter(([key]) => key !== 'scholarshipAmount')
    .reduce((sum, [, value]) => sum + value, 0)

  const remainingCost = Math.max(0, totalCost - formData.scholarshipAmount)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 font-bold text-2xl transition-colors">
              EduFair
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white font-semibold text-sm transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Education Fee Calculator</h1>
          <p className="text-gray-300 text-sm font-light">Calculate your total education costs and required funding</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all">
            <h2 className="text-xl font-bold text-white mb-6">Cost Breakdown</h2>

            <div className="space-y-6">
              {[
                { label: 'Tuition Fees', name: 'tuition' },
                { label: 'Accommodation', name: 'accommodation' },
                { label: 'Books & Materials', name: 'books' },
                { label: 'Transport', name: 'transport' },
                { label: 'Other Expenses', name: 'other' },
              ].map((item) => (
                <div key={item.name}>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    {item.label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                    <input
                      type="number"
                      name={item.name}
                      value={formData[item.name as keyof typeof formData]}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              ))}

              <div className="border-t border-white/10 pt-6 mt-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Expected Scholarship Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <input
                    type="number"
                    name="scholarshipAmount"
                    value={formData.scholarshipAmount}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {/* Total Cost */}
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-8 border-2 border-blue-500/30">
              <p className="text-sm font-semibold text-blue-300 mb-2">Total Education Cost</p>
              <p className="text-4xl font-bold text-blue-400 mb-4">
                ${totalCost.toLocaleString()}
              </p>
              <p className="text-xs text-blue-300">Based on your cost breakdown</p>
            </div>

            {/* Scholarship Coverage */}
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl p-8 border-2 border-green-500/30">
              <p className="text-sm font-semibold text-green-300 mb-2">Scholarship Coverage</p>
              <p className="text-4xl font-bold text-green-400 mb-4">
                {totalCost === 0 ? '0' : ((formData.scholarshipAmount / totalCost) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-green-300">
                ${formData.scholarshipAmount.toLocaleString()} of ${totalCost.toLocaleString()}
              </p>
            </div>

            {/* Remaining Cost */}
            <div className={`rounded-xl p-8 border-2 ${
              remainingCost === 0
                ? 'bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-500/30'
                : 'bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-500/30'
            }`}>
              <p className={`text-sm font-semibold mb-2 ${
                remainingCost === 0 ? 'text-green-300' : 'text-orange-300'
              }`}>
                {remainingCost === 0 ? '✓ Fully Funded' : 'Remaining to Fund'}
              </p>
              <p className={`text-4xl font-bold mb-4 ${
                remainingCost === 0 ? 'text-green-400' : 'text-orange-400'
              }`}>
                ${remainingCost.toLocaleString()}
              </p>
              <p className={`text-xs ${remainingCost === 0 ? 'text-green-300' : 'text-orange-300'}`}>
                {remainingCost === 0
                  ? 'Great job! Your scholarship covers all costs'
                  : 'Additional funding needed'}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-semibold text-gray-900">${totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scholarship:</span>
                  <span className="font-semibold text-green-600">${formData.scholarshipAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Still Needed:</span>
                  <span className={`font-bold text-lg ${remainingCost === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    ${remainingCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href="/scholarships"
              className="w-full block text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition-all"
            >
              Find More Scholarships
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
