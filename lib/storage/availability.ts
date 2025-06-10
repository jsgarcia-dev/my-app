import { getSupabaseAdmin } from '@/lib/supabase/client'
import { DayAvailability } from '@/lib/types/availability'
import { formatTimeBR } from '@/lib/utils/date-time-br'

export const availabilityStorage = {
  getAll: async (): Promise<DayAvailability[]> => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('availability_settings')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) {
      console.error('Error fetching availabilities:', error)
      throw error
    }
    
    return data?.map(item => ({
      id: item.id,
      professionalId: item.professional_id,
      date: item.date,
      isAvailable: item.is_available,
      customHours: item.custom_start_time && item.custom_end_time ? {
        start: formatTimeBR(item.custom_start_time), // Convert to HH:mm
        end: formatTimeBR(item.custom_end_time),     // Convert to HH:mm
        breaks: []
      } : undefined,
      reason: item.reason
    })) || []
  },

  getByProfessional: async (professionalId: string): Promise<DayAvailability[]> => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('availability_settings')
      .select('*')
      .eq('professional_id', professionalId)
      .order('date', { ascending: true })
    
    if (error) {
      console.error('Error fetching availabilities by professional:', error)
      throw error
    }
    
    return data?.map(item => ({
      id: item.id,
      professionalId: item.professional_id,
      date: item.date,
      isAvailable: item.is_available,
      customHours: item.custom_start_time && item.custom_end_time ? {
        start: formatTimeBR(item.custom_start_time), // Convert to HH:mm
        end: formatTimeBR(item.custom_end_time),     // Convert to HH:mm
        breaks: []
      } : undefined,
      reason: item.reason
    })) || []
  },

  getByProfessionalAndDateRange: async (
    professionalId: string,
    startDate: string,
    endDate: string
  ): Promise<DayAvailability[]> => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('availability_settings')
      .select('*')
      .eq('professional_id', professionalId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
    
    if (error) {
      console.error('Error fetching availabilities by date range:', error)
      throw error
    }
    
    return data?.map(item => ({
      id: item.id,
      professionalId: item.professional_id,
      date: item.date,
      isAvailable: item.is_available,
      customHours: item.custom_start_time && item.custom_end_time ? {
        start: formatTimeBR(item.custom_start_time), // Convert to HH:mm
        end: formatTimeBR(item.custom_end_time),     // Convert to HH:mm
        breaks: []
      } : undefined,
      reason: item.reason
    })) || []
  },

  getByDate: async (professionalId: string, date: string): Promise<DayAvailability | null> => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('availability_settings')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('date', date)
      .single()
    
    if (error || !data) return null
    
    return {
      id: data.id,
      professionalId: data.professional_id,
      date: data.date,
      isAvailable: data.is_available,
      customHours: data.custom_start_time && data.custom_end_time ? {
        start: data.custom_start_time.substring(0, 5), // Convert HH:mm:ss to HH:mm
        end: data.custom_end_time.substring(0, 5),     // Convert HH:mm:ss to HH:mm
        breaks: []
      } : undefined,
      reason: data.reason
    }
  },

  create: async (availability: Omit<DayAvailability, 'id'>): Promise<DayAvailability> => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('availability_settings')
      .insert({
        professional_id: availability.professionalId,
        date: availability.date,
        is_available: availability.isAvailable,
        custom_start_time: availability.customHours?.start || null,
        custom_end_time: availability.customHours?.end || null,
        reason: availability.reason || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating availability:', error)
      throw error
    }

    return {
      id: data.id,
      professionalId: data.professional_id,
      date: data.date,
      isAvailable: data.is_available,
      customHours: data.custom_start_time && data.custom_end_time ? {
        start: data.custom_start_time.substring(0, 5), // Convert HH:mm:ss to HH:mm
        end: data.custom_end_time.substring(0, 5),     // Convert HH:mm:ss to HH:mm
        breaks: []
      } : undefined,
      reason: data.reason
    }
  },

  update: async (id: string, updates: Partial<DayAvailability>): Promise<DayAvailability | null> => {
    const supabase = getSupabaseAdmin()
    const updateData: any = {}
    
    if (updates.isAvailable !== undefined) updateData.is_available = updates.isAvailable
    if (updates.reason !== undefined) updateData.reason = updates.reason
    if (updates.customHours) {
      updateData.custom_start_time = updates.customHours.start
      updateData.custom_end_time = updates.customHours.end
    }

    const { data, error } = await supabase
      .from('availability_settings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      professionalId: data.professional_id,
      date: data.date,
      isAvailable: data.is_available,
      customHours: data.custom_start_time && data.custom_end_time ? {
        start: data.custom_start_time.substring(0, 5), // Convert HH:mm:ss to HH:mm
        end: data.custom_end_time.substring(0, 5),     // Convert HH:mm:ss to HH:mm
        breaks: []
      } : undefined,
      reason: data.reason
    }
  },

  upsert: async (availability: Omit<DayAvailability, 'id'>): Promise<DayAvailability> => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('availability_settings')
      .upsert({
        professional_id: availability.professionalId,
        date: availability.date,
        is_available: availability.isAvailable,
        custom_start_time: availability.customHours?.start || null,
        custom_end_time: availability.customHours?.end || null,
        reason: availability.reason || null
      }, {
        onConflict: 'professional_id,date'
      })
      .select()
      .single()

    if (error) {
      console.error('Error upserting availability:', error)
      throw error
    }

    return {
      id: data.id,
      professionalId: data.professional_id,
      date: data.date,
      isAvailable: data.is_available,
      customHours: data.custom_start_time && data.custom_end_time ? {
        start: data.custom_start_time.substring(0, 5), // Convert HH:mm:ss to HH:mm
        end: data.custom_end_time.substring(0, 5),     // Convert HH:mm:ss to HH:mm
        breaks: []
      } : undefined,
      reason: data.reason
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('availability_settings')
      .delete()
      .eq('id', id)

    return !error
  }
}