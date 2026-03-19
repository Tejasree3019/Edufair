export const metadata = {
  title: 'Privacy Policy | EduFair',
  description: 'Privacy Policy for EduFair - Learn how we protect your data and personal information',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="text-gray-300 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">Introduction</h2>
              <p>EduFair ("we", "us", or "our") operates the edufair.com website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">Information Collection and Use</h2>
              <p>We collect several different types of information for various purposes to provide and improve our service to you:</p>
              <ul className="list-disc list-inside mt-2 space-y-2 text-gray-400">
                <li><strong>Personal Data:</strong> Name, email address, educational background, exam scores, and application information</li>
                <li><strong>Usage Data:</strong> Information about how you use our platform (pages visited, time spent, interactions)</li>
                <li><strong>Device Information:</strong> Browser type, IP address, operating system, and other technical identifiers</li>
                <li><strong>Cookies:</strong> We use cookies to enhance your experience and understand user behavior</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">Use of Data</h2>
              <p>EduFair uses the collected data for various purposes:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">Security of Data</h2>
              <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.</p>
              <p className="mt-3">We implement:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                <li>Encryption of sensitive data in transit (SSL/TLS)</li>
                <li>Secure password hashing with bcrypt</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Limited access to personal data to authorized personnel only</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">User Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-3">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p className="mt-2 text-cyan-400">
                Email: privacy@edufair.com<br/>
                Address: EduFair, India
              </p>
            </div>

            <div className="bg-white/5 border border-white/20 rounded-lg p-4 mt-8">
              <p className="text-sm text-gray-400">Last updated: March 2026 | This policy may be updated periodically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
