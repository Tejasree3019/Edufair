import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Load real scholarship data - INDIA FOCUSED ONLY
async function loadRealScholarships() {
  try {
    const scholarships: any[] = []
    
    // Load ONLY India scholarships
    const indiaPath = join(process.cwd(), 'public/data/india_scholarships.json')
    if (existsSync(indiaPath)) {
      const indiaData = JSON.parse(readFileSync(indiaPath, 'utf-8'))
      scholarships.push(...(indiaData.scholarships || []))
    }

    if (scholarships.length === 0) {
      console.warn('No India scholarships found in data file')
    }

    return scholarships
  } catch (error) {
    console.error('Error loading India scholarships:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get filter parameters
    const country = searchParams.get('country')
    const field = searchParams.get('field')
    const educationLevel = searchParams.get('educationLevel')
    const minGPA = searchParams.get('minGPA')
      ? parseFloat(searchParams.get('minGPA')!)
      : undefined

    // Load real data from JSON files
    let scholarships = await loadRealScholarships()

    console.log(`Loaded ${scholarships.length} scholarships from JSON files`)

    // Filter scholarships
    let filtered = [...scholarships]

    if (country) {
      filtered = filtered.filter((s) => {
        const countries = s.eligible_countries || s.eligibleCountries || []
        return countries.includes(country) || country === 'All'
      })
    }

    if (field) {
      filtered = filtered.filter((s) => {
        const fields = s.eligible_fields_of_study || s.eligibleFields || []
        return fields.includes(field)
      })
    }

    if (educationLevel) {
      filtered = filtered.filter((s) => {
        const levels = s.eligible_education_levels || s.eligibleLevels || []
        return levels.includes(educationLevel)
      })
    }

    if (minGPA !== undefined) {
      filtered = filtered.filter((s) => {
        const minGrade = s.min_academic_grade || s.minGPA || 0
        return minGrade <= minGPA
      })
    }

    return NextResponse.json({
      scholarships: filtered,
      total: filtered.length,
      source: 'real-data',
    })
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch scholarships',
        message: (error as any).message,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      { error: 'POST not allowed in production' },
      { status: 403 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
