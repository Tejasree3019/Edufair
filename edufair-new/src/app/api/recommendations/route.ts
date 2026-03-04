import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { demoScholarships } from '@/lib/demoData'
import { verifyToken, getAuthTokenFromRequest } from '@/lib/auth'
import { generateScholarshipRecommendation } from '@/lib/recommendationEngine'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export async function GET(request: NextRequest) {
  try {
    // In demo mode, return demo recommendations
    if (DEMO_MODE) {
      // Create a demo student profile from the request
      const { searchParams } = new URL(request.url)

      const demoStudent = {
        id: 'student_1',
        email: 'demo@edufair.com',
        full_name: 'Demo Student',
        role: 'student' as const,
        country: searchParams.get('country') || 'India',
        education_level: (searchParams.get('educationLevel') || 'ug') as any,
        preferred_field_of_study: searchParams.get('field') || 'STEM',
        academic_grade: parseFloat(searchParams.get('gpa') || '3.8'),
        test_scores: {
          jee: parseInt(searchParams.get('testScore') || '95'),
        },
      }

      // Generate recommendations for each scholarship
      const recommendations = demoScholarships.map((scholarship) => {
        const rec = generateScholarshipRecommendation(demoStudent as any, scholarship as any)
        return {
          scholarship_id: scholarship.id,
          scholarship_name: scholarship.name,
          scholarship_amount: scholarship.scholarship_amount,
          ...rec,
          student_id: demoStudent.id,
        }
      })

      // Sort by overall suitability score
      const sortedRecommendations = recommendations
        .sort(
          (a, b) =>
            (b.overall_suitability_score || 0) -
            (a.overall_suitability_score || 0)
        )
        .slice(0, 10)

      return NextResponse.json(
        { recommendations: sortedRecommendations },
        { status: 200 }
      )
    }

    // Non-demo mode would use Supabase
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
