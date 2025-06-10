'use client'

import { TimeSlotAvailability } from '@/lib/types/booking'
import { cn } from '@/lib/utils'

interface TimeSlotSelectorProps {
  slots: TimeSlotAvailability[]
  selectedTime?: string
  onSelect: (time: string) => void
}

export function TimeSlotSelector({ 
  slots, 
  selectedTime, 
  onSelect 
}: TimeSlotSelectorProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum horário disponível para esta data.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {slots.map((slot) => (
        <button
          key={slot.time}
          onClick={() => slot.available && onSelect(slot.time)}
          disabled={!slot.available}
          className={cn(
            "py-2 px-3 rounded-md text-sm font-medium transition-all",
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
          {slot.time}
        </button>
      ))}
    </div>
  )
}