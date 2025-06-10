'use client'

import { TimeSlotAvailability } from '@/lib/types/booking'
import { cn } from '@/lib/utils'
import { calculateEndTime } from '@/lib/utils/booking'

interface TimeSlotSelectorProps {
  slots: TimeSlotAvailability[]
  selectedTime?: string
  onSelect: (time: string) => void
  serviceDuration?: number
}

export function TimeSlotSelector({ 
  slots, 
  selectedTime, 
  onSelect,
  serviceDuration = 30
}: TimeSlotSelectorProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum horário disponível para esta data.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const endTime = calculateEndTime(slot.time, serviceDuration)
        return (
          <button
            key={slot.time}
            onClick={() => slot.available && onSelect(slot.time)}
            disabled={!slot.available}
            className={cn(
              "py-3 px-3 rounded-md text-sm font-medium transition-all",
              "flex flex-col items-center",
              slot.available
                ? "hover:border-primary hover:bg-primary/10"
                : "cursor-not-allowed opacity-50",
              selectedTime === slot.time
                ? "bg-primary text-white"
                : slot.available
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-100 text-gray-400"
            )}
          >
            <span className="font-semibold">{slot.time}</span>
            <span className="text-xs mt-1 opacity-75">até {endTime}</span>
          </button>
        )
      })}
    </div>
  )
}