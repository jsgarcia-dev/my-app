'use client'

import * as React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Professional, Service, BookingFormData } from '@/lib/types/booking'
import { DayAvailability } from '@/lib/types/availability'
import { ProfessionalSelector } from './ProfessionalSelector'
import { ServiceSelector } from './ServiceSelector'
import { TimeSlotSelector } from './TimeSlotSelector'
import { BookingCalendar } from './BookingCalendar'
import { generateTimeSlots } from '@/lib/utils/booking'

const formSchema = z.object({
  professionalId: z.string().min(1, 'Selecione um profissional'),
  serviceId: z.string().min(1, 'Selecione um serviço'),
  date: z.date({
    required_error: 'Selecione uma data',
  }),
  time: z.string().min(1, 'Selecione um horário'),
  customerName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  customerPhone: z.string()
    .min(10, 'Telefone inválido')
    .regex(/^\d+$/, 'Telefone deve conter apenas números'),
  notes: z.string().optional(),
})

interface BookingFormProps {
  professionals: Professional[]
  onSubmit: (data: BookingFormData) => void
  preselectedProfessionalId?: string
}

export function BookingForm({ professionals, onSubmit, preselectedProfessionalId }: BookingFormProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [availabilities, setAvailabilities] = useState<DayAvailability[]>([])
  const [existingBookings, setExistingBookings] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      professionalId: preselectedProfessionalId || '',
      serviceId: '',
      customerName: '',
      customerPhone: '',
      notes: '',
    },
  })

  // Set preselected professional
  React.useEffect(() => {
    if (preselectedProfessionalId) {
      const professional = professionals.find(p => p.id === preselectedProfessionalId)
      if (professional) {
        setSelectedProfessional(professional)
        form.setValue('professionalId', professional.id)
      }
    }
  }, [preselectedProfessionalId, professionals, form])

  // Fetch availabilities when professional is selected
  React.useEffect(() => {
    if (selectedProfessional) {
      fetchAvailabilities(selectedProfessional.id)
    }
  }, [selectedProfessional])

  const fetchAvailabilities = async (professionalId: string) => {
    try {
      // Fetch availabilities for the next 3 months
      const startDate = format(new Date(), 'yyyy-MM-dd')
      const endDate = format(addDays(new Date(), 90), 'yyyy-MM-dd')
      
      const response = await fetch(
        `/api/availability?professionalId=${professionalId}&startDate=${startDate}&endDate=${endDate}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setAvailabilities(data)
      }
    } catch (error) {
      console.error('Error fetching availabilities:', error)
    }
  }

  const isDateAvailable = (date: Date): boolean => {
    if (!selectedProfessional) return false
    
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
    
    return selectedProfessional.workingHours[dayName] !== null
  }

  const fetchBookingsForDate = async (professionalId: string, date: Date) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd')
      const response = await fetch(
        `/api/bookings?professionalId=${professionalId}&date=${dateStr}`
      )
      
      if (response.ok) {
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
    return []
  }

  const selectedDate = form.watch('date')
  const selectedDateAvailability = selectedDate 
    ? availabilities.find(a => a.date === format(selectedDate, 'yyyy-MM-dd'))
    : undefined

  // Fetch bookings when date changes
  React.useEffect(() => {
    if (selectedProfessional && selectedDate) {
      fetchBookingsForDate(selectedProfessional.id, selectedDate).then(setExistingBookings)
    }
  }, [selectedProfessional, selectedDate])
  
  const timeSlots = selectedProfessional && selectedDate
    ? generateTimeSlots(selectedProfessional, selectedDate, existingBookings, selectedDateAvailability)
    : []

  const handleProfessionalSelect = (professional: Professional) => {
    setSelectedProfessional(professional)
    setSelectedService(null)
    form.setValue('professionalId', professional.id)
    form.setValue('serviceId', '')
    form.setValue('time', '')
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    form.setValue('serviceId', service.id)
  }

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values as BookingFormData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">1. Escolha o Profissional</h3>
          <FormField
            control={form.control}
            name="professionalId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ProfessionalSelector
                    professionals={professionals}
                    selectedId={field.value}
                    onSelect={handleProfessionalSelect}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {selectedProfessional && (
          <div>
            <h3 className="text-lg font-semibold mb-4">2. Escolha o Serviço</h3>
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ServiceSelector
                      services={selectedProfessional.servicesOffered}
                      selectedId={field.value}
                      onSelect={handleServiceSelect}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {selectedService && (
          <div>
            <h3 className="text-lg font-semibold mb-4">3. Escolha a Data</h3>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </FormControl>
                  {showCalendar && selectedProfessional && (
                    <div className="mt-4">
                      <BookingCalendar
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date)
                          setShowCalendar(false)
                          form.setValue('time', '')
                        }}
                        availabilities={availabilities}
                        professionalWorkingHours={selectedProfessional.workingHours}
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {selectedDate && selectedService && (
          <div>
            <h3 className="text-lg font-semibold mb-4">4. Escolha o Horário</h3>
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TimeSlotSelector
                      slots={timeSlots}
                      selectedTime={field.value}
                      onSelect={(time) => field.onChange(time)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {form.watch('time') && (
          <div>
            <h3 className="text-lg font-semibold mb-4">5. Seus Dados</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="11999999999" {...field} />
                    </FormControl>
                    <FormDescription>
                      Apenas números, com DDD
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Alguma informação adicional..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {form.watch('customerPhone') && (
          <Button type="submit" className="w-full" size="lg">
            Confirmar Agendamento
          </Button>
        )}
      </form>
    </Form>
  )
}