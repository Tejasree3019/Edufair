import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * POST /api/auth/verify-email
 * Verify email address with token
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token required' },
        { status: 400 }
      )
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any
    } catch (verifyError) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    if (decoded.purpose !== 'email_verification') {
      return NextResponse.json(
        { error: 'Invalid token purpose' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Find user and update verification status
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email_verified')
      .eq('email', decoded.email)
      .single()

    if (findError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.email_verified) {
      return NextResponse.json(
        { success: true, message: 'Email already verified' },
        { status: 200 }
      )
    }

    // Update verification status
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating verification:', updateError)
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      )
    }

    // Award verification bonus
    try {
      const { data: gamification } = await supabase
        .from('gamification')
        .select('total_points')
        .eq('user_id', user.id)
        .single()

      if (gamification) {
        await supabase
          .from('gamification')
          .update({
            total_points: gamification.total_points + 25,
          })
          .eq('user_id', user.id)
      }
    } catch (pointsError) {
      console.warn('Failed to award verification bonus:', pointsError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully! 🎉',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
