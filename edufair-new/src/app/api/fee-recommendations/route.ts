import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken, getAuthTokenFromRequest } from '@/lib/auth'
import { generateFinancialAnalysis } from '@/lib/feeRecommendationEngine'

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
    const { institution_id, course_id } = body

    // Fetch student
    const { data: student, error: studentError } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Fetch institution
    const { data: institution, error: institutionError } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', institution_id)
      .single()

    if (institutionError || !institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 })
    }

    // Fetch course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', course_id)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Fetch available scholarships for this course
    const { data: scholarships } = await supabase
      .from('scholarships')
      .select('*')
      .eq('status', 'active')

    // Generate financial analysis
    const analysis = generateFinancialAnalysis(
      student,
      institution,
      course,
      scholarships || []
    )

    // Save recommendation plan to database
    const { data: plan, error: planError } = await supabase
      .from('fee_recommendation_plans')
      .insert([
        {
          student_id: decoded.userId,
          institution_id,
          course_id,
          total_tuition_cost: analysis.costBreakdown.tuition,
          estimated_living_expenses: analysis.costBreakdown.livingExpenses,
          other_expenses: analysis.costBreakdown.otherExpenses,
          total_cost: analysis.costBreakdown.total,
          scholarship_funding: analysis.fundingPlan.scholarshipFunding,
          grant_funding: analysis.fundingPlan.grantFunding,
          loan_recommended: analysis.fundingPlan.loanRecommended,
          self_funded_amount: analysis.fundingPlan.selfFunded,
          financial_feasibility_score: analysis.feasibilityScore,
          affordability_analysis: analysis.affordabilityAnalysis,
          future_earning_potential: analysis.futureEarningPotential,
          roi_score: analysis.roiScore,
          risk_assessment: analysis.riskAssessment,
        },
      ])
      .select()
      .single()

    if (planError) throw planError

    return NextResponse.json(
      {
        plan,
        analysis,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error generating fee recommendation:', error)
    return NextResponse.json({ error: 'Failed to generate fee recommendation' }, { status: 500 })
  }
}

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

    // Fetch student's fee plans
    const { data: plans, error } = await supabase
      .from('fee_recommendation_plans')
      .select(`
        *,
        institutions:institution_id (name),
        courses:course_id (name)
      `)
      .eq('student_id', decoded.userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ plans }, { status: 200 })
  } catch (error) {
    console.error('Error fetching fee recommendations:', error)
    return NextResponse.json({ error: 'Failed to fetch fee recommendations' }, { status: 500 })
  }
}
