import { NextRequest, NextResponse } from 'next/server'
import { bookingStorage } from '@/lib/storage/bookings'
import { professionals } from '@/lib/data/professionals'
import { isTimeSlotAvailable } from '@/lib/utils/booking'
import { parseISO } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')
    const date = searchParams.get('date')
    
    let bookings = await bookingStorage.getAll()
    
    if (professionalId) {
      bookings = bookings.filter(b => b.professionalId === professionalId)
    }
    
    if (date) {
      bookings = bookings.filter(b => b.date === date)
    }
    
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['professionalId', 'serviceId', 'customerName', 'customerPhone', 'date', 'startTime', 'endTime']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Validate professional exists
    const professional = professionals.find(p => p.id === body.professionalId)
    if (!professional) {
      return NextResponse.json(
        { error: 'Professional not found' },
        { status: 404 }
      )
    }
    
    // Validate service exists
    const service = professional.servicesOffered.find(s => s.id === body.serviceId)
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }
    
    // Check availability
    const existingBookings = await bookingStorage.getByProfessional(body.professionalId)
    const isAvailable = isTimeSlotAvailable(
      professional,
      parseISO(body.date),
      body.startTime,
      service.duration,
      existingBookings
    )
    
    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Time slot is not available' },
        { status: 409 }
      )
    }
    
    // Create booking
    const booking = await bookingStorage.create({
      ...body,
      status: 'pending'
    })
    
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}