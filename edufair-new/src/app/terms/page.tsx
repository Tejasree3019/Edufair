export const metadata = {
  title: 'Terms of Service | EduFair',
  description: 'Terms of Service for EduFair - Understand the terms and conditions of using our platform',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="text-gray-300 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">1. Agreement to Terms</h2>
              <p>By accessing and using EduFair, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on EduFair for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on EduFair</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">3. Disclaimer</h2>
              <p>The materials on EduFair are provided "as is". EduFair makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">4. Limitations</h2>
              <p>In no event shall EduFair or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use of or inability to use the materials on EduFair.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">5. Accuracy of Materials</h2>
              <p>The materials appearing on EduFair could include technical, typographical, or photographic errors. EduFair does not warrant that any of the materials on the website are accurate, complete, or current. EduFair may make changes to the materials contained on the website at any time without notice.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">6. Links</h2>
              <p>EduFair has not reviewed all of the sites linked to the website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by EduFair of the site. Use of any such linked website is at the user's own risk.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">7. Modifications</h2>
              <p>EduFair may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">8. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
            </div>

            <div className="bg-white/5 border border-white/20 rounded-lg p-4 mt-8">
              <p className="text-sm text-gray-400">Last updated: March 2026 | For questions, contact support@edufair.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
