import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { demoScholarships } from '@/lib/demoData'
import { verifyToken, getAuthTokenFromRequest } from '@/lib/auth'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export async function GET(request: NextRequest) {
  try {
    // In demo mode, return demo scholarships without authentication
    if (DEMO_MODE) {
      const { searchParams } = new URL(request.url)

      // Get filter parameters
      const country = searchParams.get('country')
      const field = searchParams.get('field')
      const educationLevel = searchParams.get('educationLevel')
      const minGPA = searchParams.get('minGPA')
        ? parseFloat(searchParams.get('minGPA')!)
        : undefined

      // Filter scholarships
      let filtered = [...demoScholarships]

      if (country) {
        filtered = filtered.filter((s) =>
          s.eligible_countries.includes(country)
        )
      }

      if (field) {
        filtered = filtered.filter((s) =>
          s.eligible_fields_of_study.includes(field)
        )
      }

      if (educationLevel) {
        filtered = filtered.filter((s) =>
          s.eligible_education_levels.includes(educationLevel)
        )
      }

      if (minGPA !== undefined) {
        filtered = filtered.filter((s) => s.min_academic_grade <= minGPA)
      }

      return NextResponse.json({
        scholarships: filtered,
        total: filtered.length,
      })
    }

    // Non-demo mode would use Supabase
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scholarships' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // In demo mode, return error (demo mode is read-only)
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      return NextResponse.json(
        { error: 'Cannot create scholarships in demo mode' },
        { status: 403 }
      )
    }

    // Non-demo mode would use Supabase
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  } catch (error) {
    console.error('Error creating scholarship:', error)
    return NextResponse.json(
      { error: 'Failed to create scholarship' },
      { status: 500 }
    )
  }
}
