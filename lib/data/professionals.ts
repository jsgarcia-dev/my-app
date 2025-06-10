import { getSupabaseAdmin } from '@/lib/supabase/client'
import { Professional } from '@/lib/types/booking'

// Cache para evitar muitas consultas ao banco
let professionalsCache: Professional[] | null = null
let cacheExpiry: number = 0

export async function getAllProfessionals(): Promise<Professional[]> {
  // Verificar cache (válido por 5 minutos)
  if (professionalsCache && Date.now() < cacheExpiry) {
    return professionalsCache
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data: professionalsData, error } = await supabase
      .from('professionals')
      .select(`
        *,
        working_hours(*)
      `)
      .eq('status', 'active')
      .order('name')

    if (error) {
      console.error('Error fetching professionals:', error)
      // Retornar dados estáticos em caso de erro
      return getStaticProfessionals()
    }

    // Buscar todos os serviços
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')

    if (servicesError) {
      console.error('Error fetching services:', servicesError)
      return getStaticProfessionals()
    }

    // Buscar a tabela de associação services_offered
    const { data: servicesOfferedData, error: servicesOfferedError } = await supabase
      .from('services_offered')
      .select('*')

    if (servicesOfferedError) {
      console.error('Error fetching services_offered:', servicesOfferedError)
    }

    const professionals: Professional[] = professionalsData?.map(prof => {
      // Mapear horários de trabalho
      const workingHours: any = {}
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      
      prof.working_hours?.forEach((wh: any) => {
        const dayName = dayNames[wh.day_of_week]
        if (wh.is_working) {
          workingHours[dayName] = {
            start: wh.start_time,
            end: wh.end_time,
            breaks: [{ start: '12:00', end: '13:00' }] // Padrão por enquanto
          }
        } else {
          workingHours[dayName] = null
        }
      })

      // Mapear serviços oferecidos baseado na tabela services_offered
      const professionalServicesOffered = servicesOfferedData?.filter(
        so => so.professional_id === prof.id && so.is_available
      ) || []
      
      const servicesOffered = professionalServicesOffered.map(so => {
        const service = servicesData?.find(s => s.id === so.service_id)
        if (!service) return null
        
        return {
          id: service.id,
          name: service.name,
          duration: so.custom_duration || service.base_duration,
          price: so.custom_price || service.base_price,
          description: service.description
        }
      }).filter(Boolean)

      return {
        id: prof.id,
        name: prof.name,
        specialties: prof.specialties || [],
        avatar: prof.avatar_url || '/logo.png',
        bio: prof.bio || '',
        workingHours,
        servicesOffered
      }
    }) || []

    // Atualizar cache
    professionalsCache = professionals
    cacheExpiry = Date.now() + 5 * 60 * 1000 // 5 minutos

    return professionals
  } catch (error) {
    console.error('Error fetching professionals:', error)
    return getStaticProfessionals()
  }
}

export async function getProfessionalById(id: string): Promise<Professional | undefined> {
  const professionals = await getAllProfessionals()
  return professionals.find(p => p.id === id)
}

// Função para buscar profissional por UUIDs do banco
export async function getProfessionalByUUID(uuid: string): Promise<Professional | undefined> {
  const professionals = await getAllProfessionals()
  return professionals.find(p => p.id === uuid)
}

// Limpar cache (útil para desenvolvimento)
export function clearProfessionalsCache() {
  professionalsCache = null
  cacheExpiry = 0
}

// Dados estáticos como fallback
function getStaticProfessionals(): Professional[] {
  return [
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Ana Silva',
      specialties: ['Coloração', 'Corte', 'Escova'],
      avatar: '/logo.png',
      bio: 'Especialista em coloração e cortes modernos com mais de 10 anos de experiência.',
      workingHours: {
        monday: { start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        tuesday: { start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        wednesday: { start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        thursday: { start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        friday: { start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        saturday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
        sunday: null
      },
      servicesOffered: [
        {
          id: '00000000-0000-0000-0000-000000000101',
          name: 'Corte Feminino',
          duration: 60,
          price: 80,
          description: 'Corte feminino com lavagem e secagem'
        },
        {
          id: '00000000-0000-0000-0000-000000000102',
          name: 'Coloração',
          duration: 180,
          price: 250,
          description: 'Coloração completa com produtos premium'
        }
      ]
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Beatriz Santos',
      specialties: ['Maquiagem', 'Design de Sobrancelhas'],
      avatar: '/logo.png',
      bio: 'Maquiadora profissional especializada em makes para noivas e eventos.',
      workingHours: {
        monday: { start: '10:00', end: '19:00', breaks: [{ start: '12:00', end: '13:00' }] },
        tuesday: { start: '10:00', end: '19:00', breaks: [{ start: '12:00', end: '13:00' }] },
        wednesday: { start: '10:00', end: '19:00', breaks: [{ start: '12:00', end: '13:00' }] },
        thursday: { start: '10:00', end: '19:00', breaks: [{ start: '12:00', end: '13:00' }] },
        friday: { start: '10:00', end: '19:00', breaks: [{ start: '12:00', end: '13:00' }] },
        saturday: { start: '10:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        sunday: null
      },
      servicesOffered: [
        {
          id: '00000000-0000-0000-0000-000000000201',
          name: 'Maquiagem Social',
          duration: 60,
          price: 150,
          description: 'Maquiagem para eventos sociais'
        }
      ]
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Carlos Oliveira',
      specialties: ['Barbearia', 'Corte Masculino'],
      avatar: '/logo.png',
      bio: 'Barbeiro especializado em cortes masculinos modernos e barbas.',
      workingHours: {
        monday: { start: '08:00', end: '20:00', breaks: [{ start: '12:00', end: '13:00' }] },
        tuesday: { start: '08:00', end: '20:00', breaks: [{ start: '12:00', end: '13:00' }] },
        wednesday: { start: '08:00', end: '20:00', breaks: [{ start: '12:00', end: '13:00' }] },
        thursday: { start: '08:00', end: '20:00', breaks: [{ start: '12:00', end: '13:00' }] },
        friday: { start: '08:00', end: '20:00', breaks: [{ start: '12:00', end: '13:00' }] },
        saturday: { start: '08:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        sunday: null
      },
      servicesOffered: [
        {
          id: '00000000-0000-0000-0000-000000000301',
          name: 'Corte Masculino',
          duration: 45,
          price: 50,
          description: 'Corte masculino tradicional ou moderno'
        }
      ]
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Diana Costa',
      specialties: ['Manicure', 'Pedicure', 'Nail Art'],
      avatar: '/logo.png',
      bio: 'Especialista em nail art e técnicas modernas de manicure.',
      workingHours: {
        monday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
        tuesday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
        wednesday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
        thursday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
        friday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00' }] },
        saturday: { start: '09:00', end: '16:00', breaks: [{ start: '12:00', end: '13:00' }] },
        sunday: null
      },
      servicesOffered: [
        {
          id: '00000000-0000-0000-0000-000000000401',
          name: 'Manicure',
          duration: 60,
          price: 45,
          description: 'Manicure completa com esmaltação'
        }
      ]
    }
  ]
}

// Compatibilidade temporária - remover após atualizar todo o código
export const professionals = getStaticProfessionals()