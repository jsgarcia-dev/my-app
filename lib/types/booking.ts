export interface Professional {
  id: string
  name: string
  specialties: string[]
  avatar?: string
  bio?: string
  workingHours: WorkingHours
  servicesOffered: Service[]
}

export interface WorkingHours {
  [key: string]: DaySchedule | null
}

export interface DaySchedule {
  start: string
  end: string
  breaks?: TimeSlot[]
}

export interface TimeSlot {
  start: string
  end: string
}

export interface Service {
  id: string
  name: string
  duration: number
  price: number
  description?: string
}

export interface Booking {
  id: string
  professionalId: string
  serviceId: string
  customerName: string
  customerPhone: string
  date: string
  startTime: string
  endTime: string
  status: BookingStatus
  notes?: string
  createdAt: string
  confirmationToken?: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'

export interface TimeSlotAvailability {
  time: string
  available: boolean
}

export interface BookingFormData {
  professionalId: string
  serviceId: string
  date: Date
  time: string
  customerName: string
  customerPhone: string
  notes?: string
}