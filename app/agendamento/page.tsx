'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookingForm } from '@/components/booking/BookingForm'
import { BookingFormData } from '@/lib/types/booking'
import { getAllProfessionals } from '@/lib/data/professionals'
import { generateConfirmationToken, calculateEndTime } from '@/lib/utils/booking'
import { format } from 'date-fns'

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [professionals, setProfessionals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const preselectedProfessionalId = searchParams.get('professional')

  useEffect(() => {
    getAllProfessionals().then(profs => {
      setProfessionals(profs)
      setLoading(false)
    })
  }, [])

  const handleBookingSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    
    try {
      const professional = professionals.find(p => p.id === data.professionalId)
      const service = professional?.servicesOffered.find(s => s.id === data.serviceId)
      
      if (!professional || !service) {
        throw new Error('Profissional ou serviço não encontrado')
      }

      const booking = {
        professionalId: data.professionalId,
        serviceId: data.serviceId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        date: format(data.date, 'yyyy-MM-dd'),
        startTime: data.time,
        endTime: calculateEndTime(data.time, service.duration),
        status: 'pending' as const,
        notes: data.notes,
        confirmationToken: generateConfirmationToken()
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar agendamento')
      }

      const createdBooking = await response.json()
      
      // Redirect to confirmation page
      router.push(`/agendamento/confirmacao?token=${createdBooking.confirmationToken}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Erro ao criar agendamento. Por favor, tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando profissionais...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Agendar Horário</h1>
            <p className="mt-2 text-gray-600">
              Escolha o profissional, serviço e horário desejado para seu atendimento.
            </p>
          </div>
          
          <BookingForm 
            professionals={professionals} 
            onSubmit={handleBookingSubmit}
            preselectedProfessionalId={preselectedProfessionalId || undefined}
          />
        </div>
      </div>
    </div>
  )
}