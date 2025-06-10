'use client'

import { Professional } from '@/lib/types/booking'
import { cn } from '@/lib/utils'

interface ProfessionalSelectorProps {
  professionals: Professional[]
  selectedId?: string
  onSelect: (professional: Professional) => void
}

export function ProfessionalSelector({ 
  professionals, 
  selectedId, 
  onSelect 
}: ProfessionalSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {professionals.map((professional) => (
        <button
          key={professional.id}
          onClick={() => onSelect(professional)}
          className={cn(
            "p-4 rounded-lg border-2 text-left transition-all",
            "hover:border-primary hover:shadow-md",
            selectedId === professional.id
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          )}
        >
          <div className="flex items-start gap-4">
            {professional.avatar && (
              <img
                src={professional.avatar}
                alt={professional.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{professional.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {professional.specialties.join(' • ')}
              </p>
              {professional.bio && (
                <p className="text-sm text-gray-500">{professional.bio}</p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}