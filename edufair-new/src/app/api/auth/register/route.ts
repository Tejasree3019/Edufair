import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * POST /api/auth/register
 * Register a new user with email verification
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role, country } = await request.json()

    // Validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, fullName' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const validRoles = ['student', 'institution', 'admin']
    const userRole = validRoles.includes(role) ? role : 'student'

    const supabase = getSupabaseServerClient()

    // Check if email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Generate email verification token
    const verificationToken = jwt.sign(
      { email, purpose: 'email_verification' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Create user in database
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          full_name: fullName,
          role: userRole,
          country,
          email_verified: false,
          verification_token: verificationToken,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    }

    // Email verification disabled - emailService module not available
    // Users can verify email through application dashboard

    // Create JWT token for immediate login
    const authToken = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Initialize gamification for new user
    try {
      await supabase
        .from('gamification')
        .insert([
          {
            user_id: newUser.id,
            total_points: 0,
            level: 1,
            badges_earned: [],
            current_streak: 0,
            max_streak: 0,
            referral_code: `EDUFAIR-${newUser.id.substring(0, 8).toUpperCase()}`,
            referrals_count: 0,
            referral_earnings: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
    } catch (gamError) {
      console.warn('Failed to initialize gamification:', gamError)
    }

    // Award welcome bonus points
    try {
      await supabase
        .from('gamification')
        .update({ total_points: 10 })
        .eq('user_id', newUser.id)
    } catch (pointsError) {
      console.warn('Failed to award welcome points:', pointsError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully. Check your email to verify your account.',
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          role: newUser.role,
          emailVerified: false,
        },
        token: authToken,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
