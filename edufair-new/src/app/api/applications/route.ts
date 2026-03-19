import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

/**
 * GET /api/applications
 * Fetch applications for a user or all applications (admin only)
 * Real-time database queries from Supabase
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    // Verify authentication
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = request.nextUrl.searchParams.get('userId') || null
    const supabase = getSupabaseServerClient()

    if (userId) {
      // Get applications for specific user
      const { data: applications, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true,
        applications: applications || [], 
        total: applications?.length || 0 
      }, { status: 200 })
    }

    // Admin-only: Get all applications
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      applications: applications || [],
      total: applications?.length || 0
    }, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/applications:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

/**
 * POST /api/applications
 * Submit a new scholarship application
 * Saves to Supabase with real-time sync
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const data = await request.json()
    const supabase = getSupabaseServerClient()

    // Validate required fields
    const requiredFields = ['scholarshipId', 'fullName', 'email', 'phone', 'academicScore']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const application = {
      user_id: decoded.userId,
      scholarship_id: data.scholarshipId,
      scholarship_name: data.scholarshipName,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      date_of_birth: data.dateOfBirth,
      gender: data.gender,
      state: data.state,
      city: data.city,
      school_name: data.schoolName,
      academic_score: parseFloat(data.academicScore),
      test_score: data.testScore ? parseInt(data.testScore) : null,
      field_of_study: data.fieldOfStudy,
      education_level: data.educationLevel,
      family_income: data.familyIncome ? parseInt(data.familyIncome) : null,
      achievements: data.achievements,
      essay_response: data.essayQuestion,
      referee_email: data.refereeEmail,
      status: 'submitted',
      documents: data.documents || [],
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: savedApplication, error } = await supabase
      .from('applications')
      .insert([application])
      .select()
      .single()

    if (error) {
      console.error('Error saving application:', error)
      return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
    }

    // Award points for application submission
    await awardPoints(decoded.userId, 'application_submit', 20)

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully. Check your email for confirmation.',
        application: savedApplication,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}

/**
 * PUT /api/applications
 * Update an application status or details
 */
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const data = await request.json()
    const { id, ...updates } = data
    const supabase = getSupabaseServerClient()

    // Verify user owns this application or is admin
    const { data: application } = await supabase
      .from('applications')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    if (application.user_id !== decoded.userId && decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update with timestamp
    const { data: updatedApplication, error } = await supabase
      .from('applications')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}

/**
 * DELETE /api/applications
 * Delete an application
 */
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Verify ownership
    const { data: application } = await supabase
      .from('applications')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    if (application.user_id !== decoded.userId && decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Application deleted',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
}

/**
 * Helper function to award points for user actions
 */
async function awardPoints(userId: string, actionType: string, points: number) {
  try {
    const supabase = getSupabaseServerClient()
    
    // Get current points
    const { data: gamification } = await supabase
      .from('gamification')
      .select('total_points, level')
      .eq('user_id', userId)
      .single()

    if (gamification) {
      const newPoints = gamification.total_points + points
      await supabase
        .from('gamification')
        .update({ 
          total_points: newPoints,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
    }
  } catch (error) {
    console.error('[Applications] Failed to award points:', error)
    // Don't throw - fail silently for gamification
  }
}
