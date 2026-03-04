import { NextRequest, NextResponse } from 'next/server'
import { scholarshipFetcher } from '@/lib/scholarshipFetcher'

/**
 * Real-time scholarship data endpoint
 * GET: Fetch scholarships from real-time sources with caching
 * POST: Manually trigger a cache refresh
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter')
    const sort = searchParams.get('sort') || 'relevance'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch all scholarships from real-time sources
    const allScholarships = await scholarshipFetcher.fetchAllScholarships()

    // Apply filters if provided
    let filtered = allScholarships
    if (filter) {
      try {
        const filterObj = JSON.parse(filter)
        filtered = scholarshipFetcher.filterScholarships(allScholarships, filterObj)
      } catch (e) {
        console.error('Invalid filter format:', e)
      }
    }

    // Apply sorting
    const sorted = sortScholarships(filtered, sort)

    // Apply pagination
    const paginated = sorted.slice(offset, offset + limit)

    return NextResponse.json(
      {
        success: true,
        data: paginated,
        pagination: {
          total: sorted.length,
          returned: paginated.length,
          offset,
          limit,
        },
        metadata: {
          fetchedAt: new Date().toISOString(),
          cacheStatus: 'active',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching real-time scholarships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scholarships', message: (error as any).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, cacheKey } = body

    if (action === 'refresh-cache') {
      scholarshipFetcher.clearCache(cacheKey)
      const refreshed = await scholarshipFetcher.fetchAllScholarships()

      return NextResponse.json(
        {
          success: true,
          message: 'Cache refreshed successfully',
          scholarshipsCount: refreshed.length,
          refreshedAt: new Date().toISOString(),
        },
        { status: 200 }
      )
    }

    if (action === 'cache-stats') {
      const stats = scholarshipFetcher.getCacheStats()
      const sourceStatus = scholarshipFetcher.getSourceStatus()

      return NextResponse.json(
        {
          success: true,
          cacheStats: stats,
          sourceStatus,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing scholarship request:', error)
    return NextResponse.json(
      { error: 'Failed to process request', message: (error as any).message },
      { status: 500 }
    )
  }
}

/**
 * Sort scholarships based on criteria
 */
function sortScholarships(scholarships: any[], sortBy: string): any[] {
  const sorted = [...scholarships]

  switch (sortBy) {
    case 'amount-high':
      return sorted.sort((a, b) => (b.amount || 0) - (a.amount || 0))

    case 'amount-low':
      return sorted.sort((a, b) => (a.amount || 0) - (b.amount || 0))

    case 'credibility':
      return sorted.sort((a, b) => (b.credibility_score || 0) - (a.credibility_score || 0))

    case 'deadline':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.deadline || '').getTime()
        const dateB = new Date(b.deadline || '').getTime()
        return dateA - dateB
      })

    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })

    case 'relevance':
    default:
      return sorted.sort(
        (a, b) =>
          (b.credibility_score || 0) - (a.credibility_score || 0) ||
          (b.awards_available || 0) - (a.awards_available || 0)
      )
  }
}
