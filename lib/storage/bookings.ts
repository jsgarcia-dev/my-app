import { Booking } from '@/lib/types/booking'

// In-memory storage for demo purposes
// In production, this would be replaced with a proper database
let bookings: Booking[] = []

export const bookingStorage = {
  getAll: async (): Promise<Booking[]> => {
    return [...bookings]
  },

  getById: async (id: string): Promise<Booking | null> => {
    return bookings.find(b => b.id === id) || null
  },

  getByToken: async (token: string): Promise<Booking | null> => {
    return bookings.find(b => b.confirmationToken === token) || null
  },

  getByProfessional: async (professionalId: string): Promise<Booking[]> => {
    return bookings.filter(b => b.professionalId === professionalId)
  },

  create: async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    bookings.push(newBooking)
    return newBooking
  },

  update: async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
    const index = bookings.findIndex(b => b.id === id)
    if (index === -1) return null
    
    bookings[index] = { ...bookings[index], ...updates }
    return bookings[index]
  },

  delete: async (id: string): Promise<boolean> => {
    const initialLength = bookings.length
    bookings = bookings.filter(b => b.id !== id)
    return bookings.length < initialLength
  }
}