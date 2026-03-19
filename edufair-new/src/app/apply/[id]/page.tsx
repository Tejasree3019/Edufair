'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import ApplicationForm from '@/components/ApplicationForm'
import { useEffect } from 'react'

export default function ApplyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scholarshipName = searchParams.get('name') || 'Scholarship'
  const scholarshipId = params.id

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ApplicationForm scholarshipId={scholarshipId} scholarshipName={scholarshipName} />
    </main>
  )
}
