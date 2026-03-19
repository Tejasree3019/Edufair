import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Load programs from JSON
async function loadPrograms() {
  try {
    const progPath = join(process.cwd(), 'public/data/programs.json')
    if (existsSync(progPath)) {
      const data = JSON.parse(readFileSync(progPath, 'utf-8'))
      return data.programs || []
    }
    return []
  } catch (error) {
    console.error('Error loading programs:', error)
    return []
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const field = searchParams.get('field')
    const level = searchParams.get('level')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let programs = await loadPrograms()

    // Filter by field if specified
    if (field) {
      programs = programs.filter(
        (p: any) => p.fieldCategory === field || p.field === field
      )
    }

    // Filter by level if specified
    if (level) {
      programs = programs.filter(
        (p: any) => p.level === level
      )
    }

    // Apply pagination
    const paginated = programs.slice(offset, offset + limit)

    return NextResponse.json({
      programs: paginated,
      total: programs.length,
      returned: paginated.length,
    })
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch programs',
        message: (error as any).message,
      },
      { status: 500 }
    )
  }
}
