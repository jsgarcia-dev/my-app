import { format, parse, addMinutes, isWithinInterval, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Professional, Booking, TimeSlotAvailability, DaySchedule } from '@/lib/types/booking'

export function generateTimeSlots(
  professional: Professional,
  date: Date,
  existingBookings: Booking[] = [],
  dayAvailability?: any,
  serviceDuration: number = 30 // Duration in minutes, default 30
): TimeSlotAvailability[] {
  
  console.log('generateTimeSlots called:', {
    date: format(date, 'yyyy-MM-dd'),
    serviceDuration,
    existingBookingsCount: existingBookings.length,
    dayAvailability
  })
  
  // Check if day is blocked
  if (dayAvailability && !dayAvailability.isAvailable) {
    console.log('Day is blocked by availability settings')
    return []
  }

  // Obter o dia da semana em inglês (0 = Sunday, 1 = Monday, etc.)
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayOfWeekIndex = date.getDay()
  const dayOfWeek = dayNames[dayOfWeekIndex]
  const daySchedule = dayAvailability?.customHours || professional.workingHours[dayOfWeek]
  
  if (!daySchedule) {
    console.log('No schedule for this day')
    return []
  }

  const slots: TimeSlotAvailability[] = []
  const slotDuration = serviceDuration // Use service duration as slot interval
  
  const startTime = parse(daySchedule.start, 'HH:mm', date)
  const endTime = parse(daySchedule.end, 'HH:mm', date)
  
  // Log existing bookings for this date
  console.log('Existing bookings on this date:', 
    existingBookings
      .filter(b => b.date === format(date, 'yyyy-MM-dd'))
      .map(b => ({
        id: b.id,
        time: `${b.startTime} - ${b.endTime}`,
        customer: b.customerName,
        service: b.serviceId,
        status: b.status
      }))
  )
  
  let currentTime = startTime
  
  while (currentTime < endTime) {
    const timeString = format(currentTime, 'HH:mm')
    const slotEnd = addMinutes(currentTime, serviceDuration)
    
    // Check if slot would exceed working hours
    if (slotEnd > endTime) {
      break // Don't add slots that would exceed working hours
    }
    
    // Check if time is within a break
    const isBreakTime = daySchedule.breaks?.some(breakSlot => {
      const breakStart = parse(breakSlot.start, 'HH:mm', date)
      const breakEnd = parse(breakSlot.end, 'HH:mm', date)
      // Check if any part of the service duration overlaps with break
      return (currentTime < breakEnd && slotEnd > breakStart)
    })
    
    // Check if time conflicts with existing bookings
    const isBooked = existingBookings.some(booking => {
      // Only ignore cancelled bookings
      if (booking.status === 'cancelled') return false
      
      const bookingStart = parse(booking.startTime, 'HH:mm', date)
      const bookingEnd = parse(booking.endTime, 'HH:mm', date)
      
      // Check if the entire service duration would overlap with any existing booking
      return (currentTime < bookingEnd && slotEnd > bookingStart)
    })
    
    const available = !isBreakTime && !isBooked
    
    console.log(`Slot ${timeString}:`, {
      isBreakTime,
      isBooked,
      available,
      slotEnd: format(slotEnd, 'HH:mm')
    })
    
    slots.push({
      time: timeString,
      available
    })
    
    currentTime = addMinutes(currentTime, slotDuration)
  }
  
  return slots
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const start = parse(startTime, 'HH:mm', new Date())
  const end = addMinutes(start, durationMinutes)
  return format(end, 'HH:mm')
}

export function formatBookingDate(date: Date): string {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatBookingTime(time: string): string {
  return time
}

export function generateConfirmationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function getBookingsForDay(bookings: Booking[], date: Date): Booking[] {
  const dayStart = startOfDay(date)
  const dayEnd = endOfDay(date)
  
  return bookings.filter(booking => {
    const bookingDate = new Date(booking.date)
    return isWithinInterval(bookingDate, { start: dayStart, end: dayEnd })
  })
}

export function isTimeSlotAvailable(
  professional: Professional,
  date: Date,
  startTime: string,
  duration: number,
  existingBookings: Booking[] = []
): boolean {
  // Obter o dia da semana em inglês (0 = Sunday, 1 = Monday, etc.)
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayOfWeekIndex = date.getDay()
  const dayOfWeek = dayNames[dayOfWeekIndex]
  const daySchedule = professional.workingHours[dayOfWeek]
  
  if (!daySchedule) {
    console.log('No schedule for this day')
    return false
  }
  
  const requestedStart = parse(startTime, 'HH:mm', date)
  const requestedEnd = addMinutes(requestedStart, duration)
  
  const workStart = parse(daySchedule.start, 'HH:mm', date)
  const workEnd = parse(daySchedule.end, 'HH:mm', date)
  
  console.log('Working hours check:', {
    daySchedule,
    requestedTime: `${startTime} - ${format(requestedEnd, 'HH:mm')}`,
    workingHours: `${daySchedule.start} - ${daySchedule.end}`,
    withinHours: requestedStart >= workStart && requestedEnd <= workEnd
  })
  
  // Check if requested time is within working hours
  if (requestedStart < workStart || requestedEnd > workEnd) {
    console.log('Outside working hours')
    return false
  }
  
  // Check if time overlaps with breaks
  const overlapsBreak = daySchedule.breaks?.some(breakSlot => {
    const breakStart = parse(breakSlot.start, 'HH:mm', date)
    const breakEnd = parse(breakSlot.end, 'HH:mm', date)
    
    return (
      (requestedStart >= breakStart && requestedStart < breakEnd) ||
      (requestedEnd > breakStart && requestedEnd <= breakEnd) ||
      (requestedStart <= breakStart && requestedEnd >= breakEnd)
    )
  })
  
  if (overlapsBreak) {
    console.log('Overlaps with break time')
    return false
  }
  
  // Check if time conflicts with existing bookings
  console.log('Checking conflicts with existing bookings:')
  console.log(`Total bookings to check: ${existingBookings.length}`)
  
  const bookingsOnDate = existingBookings.filter(b => b.date === format(date, 'yyyy-MM-dd'))
  console.log(`Bookings on ${format(date, 'yyyy-MM-dd')}: ${bookingsOnDate.length}`)
  
  bookingsOnDate.forEach((booking, index) => {
    console.log(`Booking ${index + 1}:`, {
      id: booking.id,
      time: `${booking.startTime} - ${booking.endTime}`,
      customer: booking.customerName,
      service: booking.serviceId,
      status: booking.status
    })
  })
  
  const hasConflict = existingBookings.some(booking => {
    if (booking.status === 'cancelled') return false
    if (booking.date !== format(date, 'yyyy-MM-dd')) return false
    
    const bookingStart = parse(booking.startTime, 'HH:mm', date)
    const bookingEnd = parse(booking.endTime, 'HH:mm', date)
    
    // Debug: Log time comparisons
    const requestedStartMinutes = requestedStart.getHours() * 60 + requestedStart.getMinutes()
    const requestedEndMinutes = requestedEnd.getHours() * 60 + requestedEnd.getMinutes()
    const bookingStartMinutes = bookingStart.getHours() * 60 + bookingStart.getMinutes()
    const bookingEndMinutes = bookingEnd.getHours() * 60 + bookingEnd.getMinutes()
    
    console.log(`Comparing with booking ${booking.id}:`, {
      bookingTime: `${booking.startTime} - ${booking.endTime}`,
      requestedTime: `${startTime} - ${format(requestedEnd, 'HH:mm')}`,
      bookingMinutes: `${bookingStartMinutes} - ${bookingEndMinutes}`,
      requestedMinutes: `${requestedStartMinutes} - ${requestedEndMinutes}`
    })
    
    const overlaps = (
      (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
      (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
      (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
    )
    
    if (overlaps) {
      console.log('CONFLICT FOUND with booking:', {
        bookingId: booking.id,
        existing: `${booking.startTime} - ${booking.endTime}`,
        requested: `${startTime} - ${format(requestedEnd, 'HH:mm')}`,
        customerName: booking.customerName,
        overlap: {
          requestedStartInBooking: requestedStart >= bookingStart && requestedStart < bookingEnd,
          requestedEndInBooking: requestedEnd > bookingStart && requestedEnd <= bookingEnd,
          bookingInRequested: requestedStart <= bookingStart && requestedEnd >= bookingEnd
        }
      })
    }
    
    return overlaps
  })
  
  return !hasConflict
}