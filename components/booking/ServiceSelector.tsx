'use client'

import { Service } from '@/lib/types/booking'
import { cn } from '@/lib/utils'
import { Clock, DollarSign } from 'lucide-react'

interface ServiceSelectorProps {
  services: Service[]
  selectedId?: string
  onSelect: (service: Service) => void
}

export function ServiceSelector({ 
  services, 
  selectedId, 
  onSelect 
}: ServiceSelectorProps) {
  return (
    <div className="space-y-2">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onSelect(service)}
          className={cn(
            "w-full p-4 rounded-lg border-2 text-left transition-all",
            "hover:border-primary hover:shadow-md",
            selectedId === service.id
              ? "border-primary bg-primary/5"
              : "border-gray-200"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{service.name}</h4>
              {service.description && (
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {service.duration} min
                </span>
                <span className="flex items-center gap-1 text-sm font-medium">
                  <DollarSign className="w-4 h-4" />
                  R$ {service.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}