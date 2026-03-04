import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">EduFair</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Scholarships That Match Your Profile
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop wasting time on irrelevant scholarships. EduFair uses smart algorithms to recommend
            the scholarships you're most likely to receive, along with intelligent financial planning.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personalized Matching
              </h3>
              <p className="text-gray-600">
                Get scholarships matched to your academic profile, financial background, and goals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Ranking
              </h3>
              <p className="text-gray-600">
                Know which scholarships to apply to first based on your success probability.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Financial Planning
              </h3>
              <p className="text-gray-600">
                Get comprehensive cost analysis and funding strategy for any education program.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Create Profile', desc: 'Tell us about your academics, finances, and goals' },
              { num: '2', title: 'Get Matches', desc: 'AI recommends scholarships suited for you' },
              { num: '3', title: 'Track Applications', desc: 'Manage all your applications in one place' },
              { num: '4', title: 'Get Funded', desc: 'Secure scholarships and plan your education' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="inline-block bg-blue-600 text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: '📊', title: 'Success Probability Estimation', desc: 'Know your chances before applying' },
            { icon: '✅', title: 'Eligibility Verification', desc: 'Only see scholarships you qualify for' },
            { icon: '📅', title: 'Deadline Tracking', desc: 'Never miss an application deadline' },
            { icon: '🔐', title: 'Fraud Protection', desc: 'Verified and credible opportunities only' },
            { icon: '💵', title: 'Fee Breakdown Analysis', desc: 'Understand the real cost of education' },
            { icon: '🎓', title: 'Career Outcome Data', desc: 'See employment rates and salaries' },
          ].map((feature, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="text-3xl flex-shrink-0">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 EduFair. Making education funding fair and accessible.</p>
        </div>
      </footer>
    </div>
  )
}
