import { NextRequest, NextResponse } from 'next/server'
import { availabilityStorage } from '@/lib/storage/availability'
import { validatePin } from '@/lib/data/professional-auth'
import { z } from 'zod'

// Schema de validação para disponibilidade
const availabilitySchema = z.object({
  professionalId: z.string().uuid('ID do profissional inválido'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  isAvailable: z.boolean(),
  customHours: z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:mm'),
    end: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:mm'),
    breaks: z.array(z.object({
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/)
    })).optional()
  }).optional(),
  reason: z.string().max(200).optional()
})

// Verificar autenticação do profissional
async function authenticateProfessional(request: NextRequest): Promise<{ isValid: boolean; professionalId?: string }> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false }
  }
  
  try {
    // Formato: Bearer professionalId:pin
    const token = authHeader.substring(7)
    const [professionalId, pin] = token.split(':')
    
    if (!professionalId || !pin) {
      return { isValid: false }
    }
    
    const isValid = await validatePin(professionalId, pin)
    return { isValid, professionalId: isValid ? professionalId : undefined }
  } catch {
    return { isValid: false }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Validar parâmetros
    if (professionalId && !z.string().uuid().safeParse(professionalId).success) {
      return NextResponse.json(
        { error: 'ID do profissional inválido' },
        { status: 400 }
      )
    }
    
    if (startDate && !z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(startDate).success) {
      return NextResponse.json(
        { error: 'Data de início inválida' },
        { status: 400 }
      )
    }
    
    if (endDate && !z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(endDate).success) {
      return NextResponse.json(
        { error: 'Data de fim inválida' },
        { status: 400 }
      )
    }
    
    if (professionalId && startDate && endDate) {
      const availabilities = await availabilityStorage.getByProfessionalAndDateRange(
        professionalId,
        startDate,
        endDate
      )
      return NextResponse.json(availabilities)
    } else if (professionalId) {
      const availabilities = await availabilityStorage.getByProfessional(professionalId)
      return NextResponse.json(availabilities)
    }
    
    // Retornar lista vazia para requisições sem professionalId (não expor todos os dados)
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching availabilities:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar disponibilidades' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const auth = await authenticateProfessional(request)
    if (!auth.isValid) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Validar dados
    const validation = availabilitySchema.safeParse(body)
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
    
    // Verificar se o profissional está modificando sua própria disponibilidade
    if (validatedData.professionalId !== auth.professionalId) {
      return NextResponse.json(
        { error: 'Você só pode modificar sua própria disponibilidade' },
        { status: 403 }
      )
    }
    
    // Validar que a data não é no passado
    const availabilityDate = new Date(validatedData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (availabilityDate < today) {
      return NextResponse.json(
        { error: 'Não é possível modificar disponibilidade de datas passadas' },
        { status: 400 }
      )
    }
    
    // Limitar modificações para no máximo 90 dias no futuro
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 90)
    
    if (availabilityDate > maxDate) {
      return NextResponse.json(
        { error: 'Disponibilidade pode ser configurada com até 90 dias de antecedência' },
        { status: 400 }
      )
    }
    
    const availability = await availabilityStorage.upsert(validatedData)
    return NextResponse.json(availability, { status: 201 })
  } catch (error) {
    console.error('Error creating availability:', error)
    return NextResponse.json(
      { error: 'Falha ao criar disponibilidade' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const auth = await authenticateProfessional(request)
    if (!auth.isValid) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id || !z.string().uuid().safeParse(id).success) {
      return NextResponse.json(
        { error: 'ID de disponibilidade inválido' },
        { status: 400 }
      )
    }
    
    // Verificar se a disponibilidade pertence ao profissional autenticado
    const availabilities = await availabilityStorage.getByProfessional(auth.professionalId!)
    const availability = availabilities.find(a => a.id === id)
    
    if (!availability) {
      return NextResponse.json(
        { error: 'Disponibilidade não encontrada ou não pertence a você' },
        { status: 404 }
      )
    }
    
    const deleted = await availabilityStorage.delete(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Falha ao deletar disponibilidade' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting availability:', error)
    return NextResponse.json(
      { error: 'Falha ao deletar disponibilidade' },
      { status: 500 }
    )
  }
}