import { NextRequest, NextResponse } from 'next/server'
import { availabilityStorage } from '@/lib/storage/availability'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    if (professionalId && startDate && endDate) {
      const availabilities = await availabilityStorage.getByProfessionalAndDateRange(
        professionalId,
        startDate,
        endDate
      )
      return NextResponse.json(availabilities)
    } else if (professionalId) {
      const availabilities = await availabilityStorage.getByProfessional(professionalId)
      return NextResponse.json(availabilities)
    }
    
    const availabilities = await availabilityStorage.getAll()
    return NextResponse.json(availabilities)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch availabilities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.professionalId || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const availability = await availabilityStorage.upsert(body)
    return NextResponse.json(availability, { status: 201 })
  } catch (error) {
    console.error('Error creating availability:', error)
    return NextResponse.json(
      { error: 'Failed to create availability' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing availability ID' },
        { status: 400 }
      )
    }
    
    const deleted = await availabilityStorage.delete(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Availability not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete availability' },
      { status: 500 }
    )
  }
}