export interface DayAvailability {
  id: string
  professionalId: string
  date: string // formato yyyy-MM-dd
  isAvailable: boolean
  customHours?: {
    start: string
    end: string
    breaks?: Array<{
      start: string
      end: string
    }>
  }
  reason?: string // motivo do bloqueio (férias, folga, etc)
}

export interface AvailabilitySettings {
  professionalId: string
  defaultWorkingHours: Record<string, any>
  blockedDates: string[] // datas completamente bloqueadas
  customAvailability: DayAvailability[] // disponibilidades customizadas
}