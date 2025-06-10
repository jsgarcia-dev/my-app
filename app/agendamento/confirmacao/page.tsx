'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Calendar, Clock, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Booking, Professional, Service } from '@/lib/types/booking'
import { getAllProfessionals } from '@/lib/data/professionals'
import { formatBookingDate } from '@/lib/utils/booking'
import { parseISO } from 'date-fns'
import { formatDateTimeBR } from '@/lib/utils/date-time-br'

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchBooking(token)
    }
  }, [token])

  const fetchBooking = async (confirmationToken: string) => {
    try {
      const response = await fetch(`/api/bookings/confirmation/${confirmationToken}`)
      if (response.ok) {
        const bookingData = await response.json()
        setBooking(bookingData)
        
        // Find professional and service
        const professionals = await getAllProfessionals()
        const prof = professionals.find(p => p.id === bookingData.professionalId)
        const serv = prof?.servicesOffered.find(s => s.id === bookingData.serviceId)
        
        setProfessional(prof || null)
        setService(serv || null)
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!booking || !professional || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Agendamento não encontrado.</p>
          <Link href="/agendamento">
            <Button className="mt-4">Fazer novo agendamento</Button>
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Agendamento Confirmado!</h1>
            <p className="mt-2 text-gray-600">
              Seu agendamento foi confirmado com sucesso. Aguardamos você!
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Detalhes do Agendamento</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Profissional</p>
                  <p className="font-medium">{professional.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-medium">{formatBookingDate(parseISO(booking.date))}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Horário</p>
                  <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium">{booking.customerPhone}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Serviço</p>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-gray-600">
                Duração: {service.duration} minutos | Valor: R$ {service.price.toFixed(2)}
              </p>
            </div>

            {booking.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">Observações</p>
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Código de confirmação:</strong> {booking.confirmationToken}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Guarde este código para gerenciar seu agendamento
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                Voltar ao Início
              </Button>
            </Link>
            
            <Link href="/agendamento" className="flex-1">
              <Button className="w-full" size="lg">
                Agendar Outro Serviço
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}