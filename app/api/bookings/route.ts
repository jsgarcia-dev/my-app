import { NextRequest, NextResponse } from 'next/server'
import { bookingStorage } from '@/lib/storage/bookings'
import { availabilityStorage } from '@/lib/storage/availability'
import { getAllProfessionals } from '@/lib/data/professionals'
import { isTimeSlotAvailable } from '@/lib/utils/booking'
import { parseISO, format } from 'date-fns'
import { z } from 'zod'

// Schema de validação para criação de agendamento
const createBookingSchema = z.object({
  professionalId: z.string().uuid('ID do profissional inválido'),
  serviceId: z.string().uuid('ID do serviço inválido'),
  customerName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  customerPhone: z.string().regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
  notes: z.string().max(500).optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')
    const date = searchParams.get('date')
    
    // Validar parâmetros
    if (professionalId && !z.string().uuid().safeParse(professionalId).success) {
      return NextResponse.json(
        { error: 'ID do profissional inválido' },
        { status: 400 }
      )
    }
    
    if (date && !z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(date).success) {
      return NextResponse.json(
        { error: 'Formato de data inválido' },
        { status: 400 }
      )
    }
    
    let bookings = await bookingStorage.getAll()
    
    if (professionalId) {
      bookings = bookings.filter(b => b.professionalId === professionalId)
    }
    
    if (date) {
      bookings = bookings.filter(b => b.date === date)
    }
    
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar agendamentos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados de entrada
    const validation = createBookingSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validation.error.flatten()
        },
        { status: 400 }
      )
    }
    
    const validatedData = validation.data
    
    // Buscar profissionais do banco de dados
    const professionals = await getAllProfessionals()
    
    // Validar que o profissional existe
    const professional = professionals.find(p => p.id === validatedData.professionalId)
    if (!professional) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
        { status: 404 }
      )
    }
    
    // Validar que o serviço existe e está ativo
    const service = professional.servicesOffered.find(s => s.id === validatedData.serviceId)
    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado ou não oferecido por este profissional' },
        { status: 404 }
      )
    }
    
    // Validar que a data não é no passado
    const bookingDate = parseISO(validatedData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (bookingDate < today) {
      return NextResponse.json(
        { error: 'Não é possível agendar em datas passadas' },
        { status: 400 }
      )
    }
    
    // Limitar agendamentos para no máximo 90 dias no futuro
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 90)
    
    if (bookingDate > maxDate) {
      return NextResponse.json(
        { error: 'Agendamentos podem ser feitos com até 90 dias de antecedência' },
        { status: 400 }
      )
    }
    
    // Buscar configurações de disponibilidade para a data
    const dayAvailability = await availabilityStorage.getByDate(
      validatedData.professionalId,
      validatedData.date
    )
    
    console.log('Booking attempt:', {
      professional: professional.name,
      service: service.name,
      date: validatedData.date,
      time: validatedData.startTime,
      dayAvailability
    })
    
    // Se o dia está bloqueado, retornar erro
    if (dayAvailability && !dayAvailability.isAvailable) {
      console.log('Day is blocked')
      return NextResponse.json(
        { error: 'Este dia não está disponível para agendamentos' },
        { status: 409 }
      )
    }
    
    // Verificar disponibilidade
    const existingBookings = await bookingStorage.getByProfessional(validatedData.professionalId)
    
    console.log('All bookings for professional:', {
      professionalId: validatedData.professionalId,
      totalBookings: existingBookings.length,
      bookingsOnRequestedDate: existingBookings.filter(b => b.date === validatedData.date).length
    })
    
    // Criar um professional temporário com horários customizados se existirem
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayOfWeek = dayNames[bookingDate.getDay()]
    
    const professionalWithCustomHours = dayAvailability?.customHours ? {
      ...professional,
      workingHours: {
        ...professional.workingHours,
        [dayOfWeek]: dayAvailability.customHours
      }
    } : professional
    
    const isAvailable = isTimeSlotAvailable(
      professionalWithCustomHours,
      bookingDate,
      validatedData.startTime,
      service.duration,
      existingBookings
    )
    
    console.log('Time slot availability check:', {
      isAvailable,
      workingHours: professionalWithCustomHours.workingHours,
      existingBookings: existingBookings.length
    })
    
    if (!isAvailable) {
      console.log('Time slot not available')
      return NextResponse.json(
        { error: 'Horário não está disponível' },
        { status: 409 }
      )
    }
    
    // Limitar número de agendamentos por telefone por dia (anti-spam)
    const customerBookingsToday = existingBookings.filter(
      b => b.customerPhone === validatedData.customerPhone && 
      b.date === validatedData.date &&
      b.status !== 'cancelled'
    )
    
    if (customerBookingsToday.length >= 3) {
      return NextResponse.json(
        { error: 'Limite de agendamentos por dia excedido' },
        { status: 429 }
      )
    }
    
    // Criar agendamento (já confirmado automaticamente)
    const booking = await bookingStorage.create({
      ...validatedData,
      status: 'confirmed'
    })
    
    // TODO: Enviar notificação (WhatsApp/Email)
    
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Falha ao criar agendamento' },
      { status: 500 }
    )
  }
}

// Adicionar rate limiting no futuro com middleware