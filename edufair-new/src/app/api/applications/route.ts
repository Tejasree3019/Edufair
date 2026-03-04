import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken, getAuthTokenFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getAuthTokenFromRequest(request as any)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Fetch student's applications
    const { data: applications, error } = await supabase
      .from('scholarship_applications')
      .select(`
        *,
        scholarships:scholarship_id (
          name,
          application_deadline,
          scholarship_amount,
          provider_name
        )
      `)
      .eq('student_id', decoded.userId)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ applications }, { status: 200 })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthTokenFromRequest(request as any)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { scholarship_id } = body

    // Create application
    const { data: application, error } = await supabase
      .from('scholarship_applications')
      .insert([
        {
          student_id: decoded.userId,
          scholarship_id,
          status: 'draft',
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}
