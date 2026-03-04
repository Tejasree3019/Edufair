import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { registerUser, loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, email, password, fullName, role } = body

  if (action === 'register') {
    const result = await registerUser(email, password, fullName, role)
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  }

  if (action === 'login') {
    const result = await loginUser(email, password)
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json(result, { status: 200 })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
