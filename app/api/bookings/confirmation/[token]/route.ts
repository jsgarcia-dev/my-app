import { NextRequest, NextResponse } from 'next/server'
import { bookingStorage } from '@/lib/storage/bookings'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const booking = await bookingStorage.getByToken(token)
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}