'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Calendar, X, Check, AlertCircle, Clock, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Professional } from '@/lib/types/booking'
import { DayAvailability } from '@/lib/types/availability'
import { cn } from '@/lib/utils'
import { TimeSlotEditor } from './TimeSlotEditor'
import { getAuthHeaders } from '@/lib/utils/auth'
import { normalizeWorkingHours } from '@/lib/utils/date-time-br'

interface AvailabilityManagerProps {
  professional: Professional
}

export function AvailabilityManager({ professional }: AvailabilityManagerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availabilities, setAvailabilities] = useState<DayAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [editMode, setEditMode] = useState(false)
  const [timeEditDate, setTimeEditDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  useEffect(() => {
    fetchAvailabilities()
  }, [currentMonth, professional.id])

  const fetchAvailabilities = async () => {
    try {
      const startDate = format(monthStart, 'yyyy-MM-dd')
      const endDate = format(monthEnd, 'yyyy-MM-dd')
      
      const response = await fetch(
        `/api/availability?professionalId=${professional.id}&startDate=${startDate}&endDate=${endDate}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setAvailabilities(data)
      }
    } catch (error) {
      console.error('Error fetching availabilities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDayAvailability = (date: Date): DayAvailability | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return availabilities.find(a => a.date === dateStr)
  }

  const getDefaultAvailability = (date: Date): boolean => {
    const dayOfWeek = getDay(date)
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = dayNames[dayOfWeek]
    
    return professional.workingHours[dayName] !== null
  }

  const toggleDateSelection = (date: Date) => {
    if (!editMode) return
    
    const dateStr = format(date, 'yyyy-MM-dd')
    const newSelected = new Set(selectedDates)
    
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr)
    } else {
      newSelected.add(dateStr)
    }
    
    setSelectedDates(newSelected)
  }

  const saveAvailability = async (isAvailable: boolean, customHours?: any) => {
    const promises = Array.from(selectedDates).map(async (dateStr) => {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          professionalId: professional.id,
          date: dateStr,
          isAvailable,
          customHours
        })
      })
      
      if (!response.ok) {
        const error = await response.text()
        console.error('Failed to save availability:', response.status, error)
      }
      
      return response.ok
    })
    
    await Promise.all(promises)
    await fetchAvailabilities()
    setSelectedDates(new Set())
    setEditMode(false)
  }

  const saveTimeSlots = async (date: Date, hours: any) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    
    // Normalizar horários para formato HH:mm
    const normalizedHours = normalizeWorkingHours(hours)
    
    console.log('Saving time slots:', {
      date: dateStr,
      originalHours: hours,
      normalizedHours,
      professionalId: professional.id
    })
    
    const response = await fetch('/api/availability', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        professionalId: professional.id,
        date: dateStr,
        isAvailable: true,
        customHours: normalizedHours
      })
    })
    
    if (response.ok) {
      await fetchAvailabilities()
    } else {
      const error = await response.text()
      console.error('Failed to save time slots:', response.status, error)
    }
  }

  const clearSelection = () => {
    setSelectedDates(new Set())
    setEditMode(false)
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Gerenciar Disponibilidade
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {!editMode ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                >
                  Próximo
                </Button>
                <Button
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="ml-2"
                >
                  Editar Disponibilidade
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearSelection}
                >
                  Cancelar
                </Button>
                {selectedDates.size === 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const dateStr = Array.from(selectedDates)[0]
                      const date = new Date(dateStr + 'T00:00:00')
                      setTimeEditDate(date)
                      setEditMode(false)
                      setSelectedDates(new Set())
                    }}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Configurar Horários
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                  onClick={() => saveAvailability(false)}
                  disabled={selectedDates.size === 0}
                >
                  <X className="w-4 h-4 mr-1" />
                  Bloquear Datas
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => saveAvailability(true)}
                  disabled={selectedDates.size === 0}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Liberar Datas
                </Button>
              </>
            )}
          </div>
        </div>
        
        {editMode && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Clique nas datas para selecionar. Datas selecionadas: {selectedDates.size}
            </p>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <>
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span>Bloqueado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span>Não trabalha</span>
              </div>
              {editMode && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 border-2 border-blue-500 rounded"></div>
                  <span>Selecionado</span>
                </div>
              )}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
              
              {monthDays.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const availability = getDayAvailability(day)
                const defaultAvailable = getDefaultAvailability(day)
                const isSelected = selectedDates.has(dateStr)
                const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))
                
                // Determine availability status
                let isAvailable = defaultAvailable
                if (availability !== undefined) {
                  isAvailable = availability.isAvailable
                }
                
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "min-h-[80px] p-2 border rounded transition-all relative",
                      isPast && "opacity-50",
                      !isPast && editMode && "hover:shadow-md",
                      isSelected && "border-2 border-blue-500 bg-blue-50",
                      !isSelected && isAvailable && "bg-green-50 border-green-200",
                      !isSelected && !isAvailable && defaultAvailable && "bg-red-50 border-red-200",
                      !isSelected && !defaultAvailable && "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div 
                      onClick={() => !isPast && editMode && toggleDateSelection(day)}
                      className={cn(
                        "h-full",
                        !isPast && editMode && "cursor-pointer"
                      )}
                    >
                      <div className="text-sm font-medium">
                        {format(day, 'd')}
                      </div>
                      {availability?.customHours && (
                        <div className="text-xs text-gray-600 mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {availability.customHours.start}-{availability.customHours.end}
                        </div>
                      )}
                    </div>
                    {!isPast && isAvailable && !editMode && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 p-1 h-auto"
                        onClick={() => setTimeEditDate(day)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
      
      {/* Time Slot Editor Dialog */}
      {timeEditDate && (
        <TimeSlotEditor
          isOpen={!!timeEditDate}
          onClose={() => setTimeEditDate(null)}
          date={timeEditDate}
          professionalName={professional.name}
          defaultHours={
            getDayAvailability(timeEditDate)?.customHours || 
            (() => {
              const dayOfWeek = getDay(timeEditDate)
              const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
              const dayName = dayNames[dayOfWeek]
              return professional.workingHours[dayName]
            })()
          }
          onSave={(hours) => {
            saveTimeSlots(timeEditDate, hours)
            setTimeEditDate(null)
          }}
        />
      )}
    </div>
  )
}