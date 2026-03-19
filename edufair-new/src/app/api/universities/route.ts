import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Load universities from JSON
async function loadUniversities() {
  try {
    const uniPath = join(process.cwd(), 'public/data/universities.json')
    if (existsSync(uniPath)) {
      const data = JSON.parse(readFileSync(uniPath, 'utf-8'))
      return data.universities || []
    }
    return []
  } catch (error) {
    console.error('Error loading universities:', error)
    return []
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let universities = await loadUniversities()

    // Filter to ONLY India universities - India focused
    universities = universities.filter(
      (u: any) => u.country === 'India' || u.country === 'IN'
    )

    // Apply pagination
    const paginated = universities.slice(offset, offset + limit)

    return NextResponse.json({
      universities: paginated,
      total: universities.length,
      returned: paginated.length,
    })
  } catch (error) {
    console.error('Error fetching universities:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch universities',
        message: (error as any).message,
      },
      { status: 500 }
    )
  }
}
