import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EduFair - Bias-Free Education Scholarship & Fee Recommendation System',
  description: 'Find the right scholarships and get intelligent financial guidance for your education.',
  keywords: [
    'scholarship',
    'education',
    'financial aid',
    'fee recommendation',
    'student funding',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
