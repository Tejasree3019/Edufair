import type { Metadata } from 'next'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ToastProvider } from '@/components/Toast'
import { ConfirmProvider } from '@/components/ConfirmDialog'

export const metadata: Metadata = {
  title: 'EduFair - AI-Powered Scholarship Recommendation & Financial Aid Platform',
  description: 'Discover scholarships matched to your profile. Get AI-powered recommendations, track applications, and plan your education funding with EduFair - the intelligent scholarship platform.',
  keywords: [
    'scholarship',
    'education',
    'financial aid',
    'fee recommendation',
    'student funding',
    'AI recommendations',
    'scholarship matching',
    'education planning',
  ],
  metadataBase: new URL('https://edufair.com'),
  openGraph: {
    title: 'EduFair - AI-Powered Scholarship Recommendation Platform',
    description: 'Find scholarships matched to your profile with AI-powered recommendations',
    url: 'https://edufair.com',
    siteName: 'EduFair',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 min-h-screen overflow-y-scroll">
        <ToastProvider>
          <ConfirmProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
