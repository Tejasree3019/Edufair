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

    // Fetch unread alerts
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', decoded.userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ alerts }, { status: 200 })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
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
    const { alert_id } = body

    // Mark alert as read
    const { data: alert, error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', alert_id)
      .eq('user_id', decoded.userId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ alert }, { status: 200 })
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 })
  }
}
