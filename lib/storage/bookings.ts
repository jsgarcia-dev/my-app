import { getSupabaseAdmin } from '@/lib/supabase/client'
import { Booking } from '@/lib/types/booking'
import { formatTimeBR } from '@/lib/utils/date-time-br'

export const bookingStorage = {
  getAll: async (): Promise<Booking[]> => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        professional:professionals(id, name, specialties),
        service:services(id, name, base_duration, base_price)
      `)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
    
    return data?.map(booking => ({
      id: booking.id,
      professionalId: booking.professional_id,
      serviceId: booking.service_id,
      customerName: booking.customer_name,
      customerPhone: booking.customer_phone,
      date: booking.date,
      startTime: formatTimeBR(booking.start_time), // Convert to HH:mm
      endTime: formatTimeBR(booking.end_time),     // Convert to HH:mm
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.created_at,
      confirmationToken: booking.confirmation_token,
      // Dados relacionados para compatibilidade
      professional: booking.professional,
      service: booking.service
    })) || []
  },

  getById: async (id: string): Promise<Booking | null> => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        professional:professionals(id, name, specialties),
        service:services(id, name, base_duration, base_price)
      `)
      .eq('id', id)
      .single()
    
    if (error || !data) return null
    
    return {
      id: data.id,
      professionalId: data.professional_id,
      serviceId: data.service_id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      notes: data.notes,
      createdAt: data.created_at,
      confirmationToken: data.confirmation_token,
      professional: data.professional,
      service: data.service
    }
  },

  getByToken: async (token: string): Promise<Booking | null> => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        professional:professionals(id, name, specialties),
        service:services(id, name, base_duration, base_price)
      `)
      .eq('confirmation_token', token)
      .single()
    
    if (error || !data) return null
    
    return {
      id: data.id,
      professionalId: data.professional_id,
      serviceId: data.service_id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      notes: data.notes,
      createdAt: data.created_at,
      confirmationToken: data.confirmation_token,
      professional: data.professional,
      service: data.service
    }
  },

  getByProfessional: async (professionalId: string): Promise<Booking[]> => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        professional:professionals(id, name, specialties),
        service:services(id, name, base_duration, base_price)
      `)
      .eq('professional_id', professionalId)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) {
      console.error('Error fetching bookings by professional:', error)
      throw error
    }
    
    console.log('Bookings found for professional:', {
      professionalId,
      count: data?.length || 0,
      bookings: data?.map(b => ({
        id: b.id,
        date: b.date,
        time: `${b.start_time} - ${b.end_time}`,
        customer: b.customer_name,
        status: b.status
      }))
    })
    
    return data?.map(booking => ({
      id: booking.id,
      professionalId: booking.professional_id,
      serviceId: booking.service_id,
      customerName: booking.customer_name,
      customerPhone: booking.customer_phone,
      date: booking.date,
      startTime: formatTimeBR(booking.start_time), // Convert to HH:mm
      endTime: formatTimeBR(booking.end_time),     // Convert to HH:mm
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.created_at,
      confirmationToken: booking.confirmation_token,
      professional: booking.professional,
      service: booking.service
    })) || []
  },

  create: async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    const supabase = getSupabaseAdmin()
    
    // Buscar dados do serviço para calcular preço e duração
    const { data: serviceData } = await supabase
      .from('services_offered')
      .select(`
        custom_duration,
        custom_price,
        service:services(base_duration, base_price)
      `)
      .eq('professional_id', booking.professionalId)
      .eq('service_id', booking.serviceId)
      .single()

    const duration = serviceData?.custom_duration || serviceData?.service.base_duration || 60
    const price = serviceData?.custom_price || serviceData?.service.base_price || 0

    // Calcular horário de término
    const startTime = new Date(`2000-01-01 ${booking.startTime}`)
    const endTime = new Date(startTime.getTime() + duration * 60000)
    const endTimeString = endTime.toTimeString().slice(0, 5)

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        professional_id: booking.professionalId,
        service_id: booking.serviceId,
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        date: booking.date,
        start_time: booking.startTime,
        end_time: endTimeString,
        duration: duration,
        price: price,
        status: 'pending',
        notes: booking.notes || null
      })
      .select(`
        *,
        professional:professionals(id, name, specialties),
        service:services(id, name, base_duration, base_price)
      `)
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      throw error
    }

    return {
      id: data.id,
      professionalId: data.professional_id,
      serviceId: data.service_id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      notes: data.notes,
      createdAt: data.created_at,
      confirmationToken: data.confirmation_token,
      professional: data.professional,
      service: data.service
    }
  },

  update: async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
    const supabase = getSupabaseAdmin()
    const updateData: any = {}
    
    if (updates.status) updateData.status = updates.status
    if (updates.notes !== undefined) updateData.notes = updates.notes
    if (updates.customerName) updateData.customer_name = updates.customerName
    if (updates.customerPhone) updateData.customer_phone = updates.customerPhone

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        professional:professionals(id, name, specialties),
        service:services(id, name, base_duration, base_price)
      `)
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      professionalId: data.professional_id,
      serviceId: data.service_id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      notes: data.notes,
      createdAt: data.created_at,
      confirmationToken: data.confirmation_token,
      professional: data.professional,
      service: data.service
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    return !error
  }
}