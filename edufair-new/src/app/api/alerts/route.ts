import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

/**
 * GET /api/alerts
 * Fetch user's alerts and notifications
 * Real-time data from Supabase
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
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
    const unreadOnly = request.nextUrl.searchParams.get('unreadOnly') === 'true'

    let query = supabase
      .from('alerts')
      .select('*')
      .eq('user_id', decoded.userId)
      .order('created_at', { ascending: false })

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data: alerts, error } = await query.limit(limit)

    if (error) {
      console.error('Error fetching alerts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch alerts' },
        { status: 500 }
      )
    }

    // Count unread alerts
    const unreadCount = alerts?.filter(a => !a.is_read).length || 0

    return NextResponse.json(
      {
        success: true,
        alerts: alerts || [],
        unreadCount,
        total: alerts?.length || 0,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in GET /api/alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/alerts
 * Mark alert as read or perform other action
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

    const { alertId, isRead } = await request.json()

    if (!alertId) {
      return NextResponse.json(
        { error: 'Alert ID required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Verify ownership
    const { data: alert } = await supabase
      .from('alerts')
      .select('user_id')
      .eq('id', alertId)
      .single()

    if (!alert || alert.user_id !== decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update read status
    const { data: updated, error } = await supabase
      .from('alerts')
      .update({ is_read: isRead })
      .eq('id', alertId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update alert' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        alert: updated,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in POST /api/alerts:', error)
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/alerts
 * Delete an alert
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

    const alertId = request.nextUrl.searchParams.get('id')

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Verify ownership
    const { data: alert } = await supabase
      .from('alerts')
      .select('user_id')
      .eq('id', alertId)
      .single()

    if (!alert || alert.user_id !== decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete alert' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Alert deleted',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in DELETE /api/alerts:', error)
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    )
  }
}

