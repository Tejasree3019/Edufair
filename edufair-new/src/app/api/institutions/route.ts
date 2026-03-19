import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { demoInstitutions } from '@/lib/demoData'
import { verifyToken, getAuthTokenFromRequest } from '@/lib/auth'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export async function GET(request: NextRequest) {
  try {
    // In demo mode, return demo institutions
    if (DEMO_MODE) {
      // Filter to ONLY India institutions - India focused
      let filtered = demoInstitutions.filter((i) => i.country === 'India')

      return NextResponse.json({
        institutions: filtered.sort(
          (a, b) => b.credibility_score - a.credibility_score
        ),
      })
    }

    // Non-demo mode would use Supabase
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  } catch (error) {
    console.error('Error fetching institutions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch institutions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // In demo mode, return error (demo mode is read-only)
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      return NextResponse.json(
        { error: 'Cannot create institutions in demo mode' },
        { status: 403 }
      )
    }

    // Non-demo mode would use Supabase
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  } catch (error) {
    console.error('Error creating institution:', error)
    return NextResponse.json(
      { error: 'Failed to create institution' },
      { status: 500 }
    )
  }
}
