import { DayAvailability } from '@/lib/types/availability'

// In-memory storage for availability settings
let availabilities: DayAvailability[] = []

export const availabilityStorage = {
  getAll: async (): Promise<DayAvailability[]> => {
    return [...availabilities]
  },

  getByProfessional: async (professionalId: string): Promise<DayAvailability[]> => {
    return availabilities.filter(a => a.professionalId === professionalId)
  },

  getByProfessionalAndDateRange: async (
    professionalId: string, 
    startDate: string, 
    endDate: string
  ): Promise<DayAvailability[]> => {
    return availabilities.filter(a => 
      a.professionalId === professionalId &&
      a.date >= startDate &&
      a.date <= endDate
    )
  },

  getByDate: async (professionalId: string, date: string): Promise<DayAvailability | null> => {
    return availabilities.find(a => 
      a.professionalId === professionalId && 
      a.date === date
    ) || null
  },

  create: async (availability: Omit<DayAvailability, 'id'>): Promise<DayAvailability> => {
    const newAvailability: DayAvailability = {
      ...availability,
      id: Date.now().toString()
    }
    availabilities.push(newAvailability)
    return newAvailability
  },

  update: async (id: string, updates: Partial<DayAvailability>): Promise<DayAvailability | null> => {
    const index = availabilities.findIndex(a => a.id === id)
    if (index === -1) return null
    
    availabilities[index] = { ...availabilities[index], ...updates }
    return availabilities[index]
  },

  upsert: async (availability: Omit<DayAvailability, 'id'>): Promise<DayAvailability> => {
    const existing = await availabilityStorage.getByDate(availability.professionalId, availability.date)
    
    if (existing) {
      return await availabilityStorage.update(existing.id, availability) || existing
    } else {
      return await availabilityStorage.create(availability)
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const initialLength = availabilities.length
    availabilities = availabilities.filter(a => a.id !== id)
    return availabilities.length < initialLength
  }
}