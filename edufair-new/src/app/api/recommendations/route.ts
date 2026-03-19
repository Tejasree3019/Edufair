import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { demoScholarships } from '@/lib/demoData'
import { verifyToken, getAuthTokenFromRequest } from '@/lib/auth'
import { generateScholarshipRecommendation } from '@/lib/recommendationEngine'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

async function loadRealScholarships(country?: string) {
  try {
    const scholarships: any[] = []
    
    // Load ONLY Indian scholarships - India focused
    const indiaPath = join(process.cwd(), 'public/data/india_scholarships.json')
    if (existsSync(indiaPath)) {
      const data = JSON.parse(readFileSync(indiaPath, 'utf-8'))
      scholarships.push(...(data.scholarships || []))
    }
    
    return scholarships
  } catch (error) {
    console.error('Error loading real scholarships:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
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

    // Load real scholarships
    const scholarships = await loadRealScholarships(demoStudent.country)
    
    if (scholarships.length === 0) {
      // Fallback to demo scholarships
      return NextResponse.json(
        { 
          recommendations: demoScholarships
            .map((scholarship) => {
              const rec = generateScholarshipRecommendation(demoStudent as any, scholarship as any)
              return {
                scholarship_id: scholarship.id,
                scholarship_name: scholarship.name,
                scholarship_amount: scholarship.scholarship_amount,
                ...rec,
                student_id: demoStudent.id,
              }
            })
            .sort(
              (a, b) =>
                (b.overall_suitability_score || 0) -
                (a.overall_suitability_score || 0)
            )
            .slice(0, 20)
        },
        { status: 200 }
      )
    }

    // Generate recommendations for each real scholarship
    const recommendations = scholarships.map((scholarship) => {
      const rec = generateScholarshipRecommendation(demoStudent as any, scholarship as any)
      return {
        scholarship_id: scholarship.id,
        scholarship_name: scholarship.name || scholarship.name,
        scholarship_amount: scholarship.scholarship_amount || scholarship.amount,
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
      .slice(0, 20)

    return NextResponse.json(
      { recommendations: sortedRecommendations },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
