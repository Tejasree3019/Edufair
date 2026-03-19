import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash)
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Log login activity for gamification
    try {
      await supabase
        .from('activity_log')
        .insert([
          {
            user_id: user.id,
            action_type: 'login',
            created_at: new Date().toISOString(),
          },
        ])

      // Award login points
      const { data: gamification } = await supabase
        .from('gamification')
        .select('total_points')
        .eq('user_id', user.id)
        .single()

      if (gamification) {
        await supabase
          .from('gamification')
          .update({
            total_points: gamification.total_points + 5,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
      }
    } catch (logError) {
      console.warn('Failed to log login activity:', logError)
    }

    // Update last login timestamp
    try {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id)
    } catch (logError) {
      console.warn('Failed to update last_login:', logError)
    }

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          emailVerified: user.email_verified || false,
          country: user.country,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
