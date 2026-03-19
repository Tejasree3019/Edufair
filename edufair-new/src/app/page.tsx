import Link from 'next/link'
import IndiaScholarshipsShowcase from '@/components/IndiaScholarshipsShowcase'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full mb-4">
              <span className="text-sm font-semibold text-blue-300">Scholarship Discovery Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
              Find Your Perfect <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Scholarship</span>
            </h1>
            <p className="text-lg md:text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto font-light">
              AI-powered matching algorithm finds scholarships you're most likely to win. Stop applying blindly. Start applying smart.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2 group"
              >
                Start Free Today
              </Link>
              <Link
                href="#scholarships"
                className="border-2 border-white/30 text-white hover:text-cyan-400 px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/10 hover:border-white/50 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 group"
              >
                View Scholarships
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mt-12 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">15,000+</div>
                <div className="text-xs md:text-sm text-gray-300 mt-3 font-medium">India Scholarships</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">50,000+</div>
                <div className="text-xs md:text-sm text-gray-300 mt-3 font-medium">Students Matched</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">₹5000 Cr+</div>
                <div className="text-xs md:text-sm text-gray-300 mt-3 font-medium">Awarded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 top-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Why Choose EduFair</h2>
            <p className="text-base text-gray-300 font-light max-w-2xl mx-auto">Complete toolkit for finding and winning scholarships</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Smart Matching', desc: 'AI analyzes thousands of scholarships to find your perfect matches', icon: '◐' },
              { title: 'Success Probability', desc: 'Know your chances before applying with predictive analytics', icon: '≡' },
              { title: 'Eligibility Check', desc: 'Automatic verification against requirements saves you time', icon: '✔' },
              { title: 'Deadline Management', desc: 'Never miss a deadline with intelligent alerts', icon: '◆' },
              { title: 'Financial Planning', desc: 'Complete cost analysis and funding strategy tools', icon: '₹' },
              { title: 'Verified Opportunities', desc: 'Access only credible, fraud-free opportunities', icon: '⊕' },
            ].map((feature, idx) => (
              <div key={idx} className="group p-7 rounded-2xl border border-white/20 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 bg-white/5 backdrop-blur-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200 flex items-center justify-center text-2xl font-bold text-white">{feature.icon}</div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-blue-900/50 to-slate-900 relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-40 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">How It Works</h2>
            <p className="text-base text-gray-300 font-light">Get scholarships matched to you in minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { num: '1', title: 'Create Profile', desc: 'Enter your academic records, family income, and education goals' },
              { num: '2', title: 'Smart Matching', desc: 'Get AI-powered recommendations from 15,000+ verified scholarships' },
              { num: '3', title: 'Track Progress', desc: 'Manage applications, deadlines, and track acceptance status' },
              { num: '4', title: 'Secure Funding', desc: 'Receive funds directly and plan your education career' },
            ].map((step) => (
              <div key={step.num} className="group relative">
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 text-center h-full hover:border-cyan-400 hover:bg-white/15 transition-all transform hover:scale-105">
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg font-bold w-10 h-10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-base text-white mb-2 group-hover:text-cyan-300 transition-colors">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {parseInt(step.num) < 4 && (
                  <div className="hidden md:flex absolute top-1/3 -right-3 text-cyan-500 text-2xl font-bold">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* India Scholarships Showcase */}
      <section id="scholarships">
        <IndiaScholarshipsShowcase />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 relative overflow-hidden border-t border-white/10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Find Your Scholarship?</h2>
          <p className="text-lg text-white/90 mb-8 font-light">Be among the first to experience EduFair's AI-powered scholarship matching</p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-black/50 font-bold transition-all hover:scale-105 active:scale-95"
          >
            Get Started Free - No Credit Card Required
          </Link>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-slate-900 text-gray-300 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-3">EduFair</h3>
              <p className="text-sm text-gray-400">AI-powered scholarship matching for Indian students</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</a></li>
                <li><a href="/register" className="text-gray-400 hover:text-white transition-colors">Register</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 EduFair. Making education funding fair and accessible for Indian students.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
