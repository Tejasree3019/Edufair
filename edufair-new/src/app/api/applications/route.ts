import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory storage for demo mode
let applications: any[] = []

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (userId) {
      // Get applications for specific user
      const userApplications = applications.filter((app) => app.userId === userId)
      return NextResponse.json({ applications: userApplications }, { status: 200 })
    }

    // Get all applications (admin only)
    return NextResponse.json({ applications }, { status: 200 })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const application = {
      id: data.id || `app_${Date.now()}`,
      userId: data.userId || 'demo_user',
      scholarshipId: data.scholarshipId,
      scholarshipName: data.scholarshipName,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      state: data.state,
      city: data.city,
      schoolName: data.schoolName,
      academicScore: data.academicScore,
      testScore: data.testScore,
      fieldOfStudy: data.fieldOfStudy,
      educationLevel: data.educationLevel,
      familyIncome: data.familyIncome,
      achievements: data.achievements,
      essayQuestion: data.essayQuestion,
      refereeEmail: data.refereeEmail,
      status: 'submitted',
      appliedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    applications.push(application)

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        application,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updates } = data

    const index = applications.findIndex((app) => app.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    applications[index] = {
      ...applications[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      application: applications[index],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const index = applications.findIndex((app) => app.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    applications.splice(index, 1)

    return NextResponse.json({
      success: true,
      message: 'Application deleted',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
    console.error('Error creating application:', error)
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}
