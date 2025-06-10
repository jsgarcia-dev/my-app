'use client'

import { Calendar } from '@/components/ui/calendar'
import { DayAvailability } from '@/lib/types/availability'
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

interface AvailabilityCalendarProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  availabilities: DayAvailability[]
  professionalWorkingHours: Record<string, any>
}

export function AvailabilityCalendar({
  selected,
  onSelect,
  availabilities,
  professionalWorkingHours
}: AvailabilityCalendarProps) {
  
  const isDateAvailable = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const availability = availabilities.find(a => a.date === dateStr)
    
    // If there's a specific availability setting, use it
    if (availability !== undefined) {
      return availability.isAvailable
    }
    
    // Otherwise, check default working hours
    const dayOfWeek = date.getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = dayNames[dayOfWeek]
    
    return professionalWorkingHours[dayName] !== null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-sm bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="font-medium">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Indisponível</span>
        </div>
      </div>
      
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={(date) => {
          return date < today || 
                 date > addDays(today, 60) ||
                 !isDateAvailable(date)
        }}
        locale={ptBR}
        className="rounded-md border"
        classNames={{
          day_selected: "bg-green-500 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white",
          day_disabled: "text-gray-400 opacity-50",
        }}
        components={{
          DayContent: (props: any) => {
            const { date } = props
            const available = isDateAvailable(date)
            const isPast = date < today
            
            return (
              <div 
                className={`
                  w-full h-full flex items-center justify-center rounded-md
                  ${available && !isPast ? 'bg-green-100 text-green-900 font-medium' : ''}
                  ${!available && !isPast ? 'bg-gray-100 text-gray-500' : ''}
                  ${isPast ? 'opacity-50' : ''}
                `}
              >
                {format(date, 'd')}
              </div>
            )
          }
        }}
      />
    </div>
  )
}