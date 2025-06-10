'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DayAvailability } from '@/lib/types/availability'
import { cn } from '@/lib/utils'

interface BookingCalendarProps {
  selected?: Date
  onSelect: (date: Date) => void
  availabilities: DayAvailability[]
  professionalWorkingHours: Record<string, any>
}

export function BookingCalendar({
  selected,
  onSelect,
  availabilities,
  professionalWorkingHours
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  // Add padding days for calendar grid
  const startDayOfWeek = getDay(monthStart)
  const paddingDays = Array(startDayOfWeek).fill(null)
  
  const isDateAvailable = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const availability = availabilities.find(a => a.date === dateStr)
    
    if (availability !== undefined) {
      return availability.isAvailable
    }
    
    const dayOfWeek = date.getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = dayNames[dayOfWeek]
    
    return professionalWorkingHours[dayName] !== null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handlePrevMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex items-center gap-4 text-sm bg-gray-50 p-3 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="font-medium">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Indisponível</span>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          disabled={currentMonth <= new Date()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          disabled={currentMonth >= addMonths(new Date(), 2)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding days */}
          {paddingDays.map((_, index) => (
            <div key={`pad-${index}`} className="aspect-square" />
          ))}
          
          {/* Month days */}
          {monthDays.map(day => {
            const isAvailable = isDateAvailable(day)
            const isPast = day < today
            const isSelected = selected && isSameDay(day, selected)
            const isSelectable = !isPast && isAvailable
            
            return (
              <button
                key={day.toString()}
                onClick={() => isSelectable && onSelect(day)}
                disabled={!isSelectable}
                className={cn(
                  "aspect-square rounded-lg border-2 transition-all",
                  "flex items-center justify-center font-medium",
                  
                  // Base states
                  isPast && "opacity-50 cursor-not-allowed",
                  
                  // Available/Unavailable states
                  !isPast && isAvailable && "bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-400",
                  !isPast && !isAvailable && "bg-gray-50 border-gray-200 cursor-not-allowed",
                  
                  // Selected state
                  isSelected && "bg-green-500 border-green-600 text-white hover:bg-green-600",
                  
                  // Text color
                  !isSelected && isAvailable && !isPast && "text-green-900",
                  !isSelected && !isAvailable && "text-gray-400"
                )}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}