import { format, parse, addMinutes, isWithinInterval, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Professional, Booking, TimeSlotAvailability, DaySchedule } from '@/lib/types/booking'

export function generateTimeSlots(
  professional: Professional,
  date: Date,
  existingBookings: Booking[] = [],
  dayAvailability?: any
): TimeSlotAvailability[] {
  // Check if day is blocked
  if (dayAvailability && !dayAvailability.isAvailable) {
    return []
  }

  const dayOfWeek = format(date, 'EEEE', { locale: ptBR }).toLowerCase()
  const daySchedule = dayAvailability?.customHours || professional.workingHours[dayOfWeek]
  
  if (!daySchedule) {
    return []
  }

  const slots: TimeSlotAvailability[] = []
  const slotDuration = 30 // 30 minute intervals
  
  const startTime = parse(daySchedule.start, 'HH:mm', date)
  const endTime = parse(daySchedule.end, 'HH:mm', date)
  
  let currentTime = startTime
  
  while (currentTime < endTime) {
    const timeString = format(currentTime, 'HH:mm')
    
    // Check if time is within a break
    const isBreakTime = daySchedule.breaks?.some(breakSlot => {
      const breakStart = parse(breakSlot.start, 'HH:mm', date)
      const breakEnd = parse(breakSlot.end, 'HH:mm', date)
      return isWithinInterval(currentTime, { start: breakStart, end: breakEnd })
    })
    
    // Check if time conflicts with existing bookings
    const isBooked = existingBookings.some(booking => {
      if (booking.status === 'cancelled') return false
      
      const bookingStart = parse(booking.startTime, 'HH:mm', date)
      const bookingEnd = parse(booking.endTime, 'HH:mm', date)
      
      return isWithinInterval(currentTime, { start: bookingStart, end: bookingEnd })
    })
    
    slots.push({
      time: timeString,
      available: !isBreakTime && !isBooked
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
  const dayOfWeek = format(date, 'EEEE', { locale: ptBR }).toLowerCase()
  const daySchedule = professional.workingHours[dayOfWeek]
  
  if (!daySchedule) return false
  
  const requestedStart = parse(startTime, 'HH:mm', date)
  const requestedEnd = addMinutes(requestedStart, duration)
  
  const workStart = parse(daySchedule.start, 'HH:mm', date)
  const workEnd = parse(daySchedule.end, 'HH:mm', date)
  
  // Check if requested time is within working hours
  if (requestedStart < workStart || requestedEnd > workEnd) {
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
  
  if (overlapsBreak) return false
  
  // Check if time conflicts with existing bookings
  const hasConflict = existingBookings.some(booking => {
    if (booking.status === 'cancelled') return false
    if (booking.date !== format(date, 'yyyy-MM-dd')) return false
    
    const bookingStart = parse(booking.startTime, 'HH:mm', date)
    const bookingEnd = parse(booking.endTime, 'HH:mm', date)
    
    return (
      (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
      (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
      (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
    )
  })
  
  return !hasConflict
}