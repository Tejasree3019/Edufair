import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

/**
 * GET /api/users/profile
 * Get current user's profile
 */
export async function GET(request: NextRequest) {
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

    const supabase = getSupabaseServerClient()

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        role,
        country,
        region_state,
        school_type,
        academic_grade,
        test_scores,
        family_income,
        preferred_field_of_study,
        career_goals,
        education_level,
        email_verified,
        profile_completed,
        avatar_url,
        created_at,
        updated_at,
        last_login
      `)
      .eq('id', decoded.userId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/users/profile
 * Update user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    let data
    try {
      data = await request.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    console.log('Updating profile for user:', decoded.userId)
    console.log('Data received:', data)

    let supabase
    try {
      supabase = getSupabaseServerClient()
    } catch (clientError) {
      console.error('Failed to initialize Supabase client:', clientError)
      return NextResponse.json(
        { error: 'Server configuration error - Supabase not available' },
        { status: 500 }
      )
    }

    // Build update object - only allow certain fields
    const allowedFields = [
      'full_name',
      'country',
      'region_state',
      'school_type',
      'academic_grade',
      'test_scores',
      'family_income',
      'preferred_field_of_study',
      'career_goals',
      'education_level',
      'avatar_url',
    ]

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Only add fields that are provided in the request
    for (const field of allowedFields) {
      if (field in data && data[field] !== '' && data[field] !== null && data[field] !== undefined) {
        updateData[field] = data[field]
      }
    }

    console.log('Update data to be sent:', updateData)

    // Check if profile is complete (all required fields filled)
    // For now, we'll just track this in the response, not in the database
    // until the schema migration is complete
    const isComplete =
      data.full_name?.trim() &&
      data.country &&
      (data.academic_grade || data.academic_grade === 0) &&
      data.preferred_field_of_study &&
      data.education_level

    if (isComplete) {
      // Try to update profile_completed if the column exists
      // If not, the error will be caught and we'll still return success
      updateData.profile_completed = true
      console.log('Profile marked as complete')
    }

    // Perform the update
    let updated
    let updateError
    try {
      const result = await supabase
        .from('users')
        .update(updateData)
        .eq('id', decoded.userId)
        .select()
        .single()
      
      updated = result.data
      updateError = result.error
    } catch (dbError) {
      console.error('Database query error:', dbError)
      return NextResponse.json(
        { error: `Database error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

    if (updateError) {
      console.error('Supabase update error:', updateError)
      
      // If the error is about profile_completed column not existing, try again without it
      if (updateError.message?.includes('profile_completed') || updateError.message?.includes('column')) {
        console.log('Retrying without profile_completed column...')
        delete updateData.profile_completed
        
        try {
          const retryResult = await supabase
            .from('users')
            .update(updateData)
            .eq('id', decoded.userId)
            .select()
            .single()
          
          if (retryResult.error) {
            return NextResponse.json(
              { error: `Failed to save profile: ${retryResult.error.message}` },
              { status: 500 }
            )
          }
          updated = retryResult.data
        } catch (retryError) {
          return NextResponse.json(
            { error: `Failed to save profile: ${retryError instanceof Error ? retryError.message : 'Unknown error'}` },
            { status: 500 }
          )
        }
      } else {
        return NextResponse.json(
          { error: `Failed to save profile: ${updateError.message}` },
          { status: 500 }
        )
      }
    }

    if (!updated) {
      return NextResponse.json(
        { error: 'Profile update returned no data' },
        { status: 500 }
      )
    }

    console.log('Profile updated successfully:', updated)

    // Award points for profile update
    try {
      const { data: gamification } = await supabase
        .from('gamification')
        .select('total_points')
        .eq('user_id', decoded.userId)
        .single()

      if (gamification) {
        await supabase
          .from('gamification')
          .update({
            total_points: gamification.total_points + 10,
          })
          .eq('user_id', decoded.userId)
        console.log('Awarded 10 points for profile update')
      }
    } catch (pointsError) {
      console.warn('Failed to award profile update points:', pointsError)
      // This is not critical, so we don't return an error
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        user: updated,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating profile:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to update profile: ${errorMessage}` },
      { status: 500 }
    )
  }
}
