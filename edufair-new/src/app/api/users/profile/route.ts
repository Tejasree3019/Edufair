import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, getAuthTokenFromRequest } from '@/lib/auth'
import { findUserById } from '@/lib/demoData'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export async function GET(request: NextRequest) {
  try {
    // In demo mode, return demo user profile
    if (DEMO_MODE) {
      const token = getAuthTokenFromRequest(request as any)
      if (!token) {
        // Return demo profile for unauthenticated requests
        return NextResponse.json({
          user: {
            id: 'demo_student_1',
            email: 'demo@edufair.com',
            fullName: 'Demo Student',
            role: 'student',
            country: 'India',
            educationLevel: 'ug',
            fieldOfStudy: 'STEM',
            gpa: 3.8,
            testScore: 95,
          },
        })
      }

      const decoded = verifyToken(token)
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }

      // Find user in demo data
      const user = findUserById(decoded.userId)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          country: 'India',
          educationLevel: 'ug',
          fieldOfStudy: 'STEM',
          gpa: 3.8,
          testScore: 95,
        },
      })
    }

    // Non-demo mode would use Supabase
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // In demo mode, return error (demo mode is read-only)
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      return NextResponse.json(
        { error: 'Cannot update profile in demo mode' },
        { status: 403 }
      )
    }

    // Non-demo mode would use Supabase
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
