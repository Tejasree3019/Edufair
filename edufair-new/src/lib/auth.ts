import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  initializeDemoData,
  findUserByEmail,
  createUser,
} from '@/lib/demoData'
import { getSupabaseServerClient } from '@/lib/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  role: 'student' | 'institution' | 'admin'
) {
  try {
    if (DEMO_MODE) {
      // Demo mode using in-memory storage
      await initializeDemoData()

      const existingUser = findUserByEmail(email)
      if (existingUser) {
        return { error: 'User already exists' }
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = createUser(email, passwordHash, fullName, role)

      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
        },
        token,
      }
    } else {
      // Real Supabase authentication
      const supabase = getSupabaseServerClient()
      const passwordHash = await bcrypt.hash(password, 10)

      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single()

        if (existingUser) {
          return { error: 'User already exists' }
        }
      } catch (checkError) {
        // User doesn't exist, which is good
      }

      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: passwordHash,
          full_name: fullName,
          role,
        })
        .select()
        .single()

      if (createError || !newUser) {
        console.error('Registration error:', createError)
        return { error: 'Registration failed' }
      }

      // Create JWT token with UUID
      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          role: newUser.role,
        },
        token,
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'Registration failed' }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    if (DEMO_MODE) {
      // Demo mode using in-memory storage
      await initializeDemoData()

      const user = findUserByEmail(email)
      if (!user) {
        return { error: 'Invalid credentials' }
      }

      const passwordValid = await bcrypt.compare(password, user.passwordHash)
      if (!passwordValid) {
        return { error: 'Invalid credentials' }
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
        token,
      }
    } else {
      // Real Supabase authentication
      try {
        const supabase = getSupabaseServerClient()

        // Find user by email
        const { data: user, error: queryError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()

        if (queryError || !user) {
          console.error('User query error:', queryError)
          return { error: 'Invalid credentials' }
        }

        // Verify password
        const passwordValid = await bcrypt.compare(
          password,
          user.password_hash
        )
        if (!passwordValid) {
          return { error: 'Invalid credentials' }
        }

        // Create JWT token with UUID
        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            role: user.role,
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        )

        return {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
          },
          token,
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
        return { error: 'Login failed' }
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Login failed' }
  }
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

export function getAuthTokenFromRequest(req: NextApiRequest): string | null {
  const authorization = req.headers.authorization
  if (!authorization?.startsWith('Bearer ')) {
    return null
  }
  return authorization.substring(7)
}
