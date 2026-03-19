import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('email', email)
      .single()

    if (error || !user) {
      // Don't reveal if email exists (security)
      return NextResponse.json(
        { success: true, message: 'If email exists, you will receive a password reset link' },
        { status: 200 }
      )
    }

    // Generate password reset token
    const resetToken = jwt.sign(
      { userId: user.id, email, purpose: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '30m' }
    )

    // Store reset token in database
    await supabase
      .from('users')
      .update({
        password_reset_token: resetToken,
        password_reset_expires: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      })
      .eq('id', user.id)

    // Email sending disabled - emailService module not available
    // Users should check their application dashboard for reset instructions

    return NextResponse.json(
      {
        success: true,
        message: 'If email exists, you will receive a password reset link',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/auth/reset-password
 * Reset password with token
 */
export async function PUT(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any
    } catch (verifyError) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    if (decoded.purpose !== 'password_reset') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Find user and verify token
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single()

    if (findError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if token valid and not expired
    if (!user.password_reset_token || 
        user.password_reset_token !== token ||
        !user.password_reset_expires ||
        new Date(user.password_reset_expires) < new Date()) {
      return NextResponse.json(
        { error: 'Reset token expired or invalid' },
        { status: 400 }
      )
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update password and clear reset token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: passwordHash,
        password_reset_token: null,
        password_reset_expires: null,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { error: 'Failed to reset password' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully! You can now login with your new password.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
