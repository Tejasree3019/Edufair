import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  initializeDemoData,
  findUserByEmail,
  createUser,
} from '@/lib/demoData'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  role: 'student' | 'institution' | 'admin'
) {
  try {
    // Initialize demo data if in demo mode
    if (DEMO_MODE) {
      await initializeDemoData()

      // Check if user exists
      const existingUser = findUserByEmail(email)
      if (existingUser) {
        return { error: 'User already exists' }
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10)

      // Create user in demo storage
      const newUser = createUser(email, passwordHash, fullName, role)

      // Create JWT token
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
    }

    // Fallback for non-demo mode (would use Supabase)
    return { error: 'Registration service unavailable' }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'Registration failed' }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    // Initialize demo data if in demo mode
    if (DEMO_MODE) {
      await initializeDemoData()

      // Find user
      const user = findUserByEmail(email)
      if (!user) {
        return { error: 'Invalid credentials' }
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, user.passwordHash)
      if (!passwordValid) {
        return { error: 'Invalid credentials' }
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

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
        token,
      }
    }

    // Fallback for non-demo mode
    return { error: 'Login service unavailable' }
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
