import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/client'
import { validatePin } from '@/lib/data/professional-auth'
import { z } from 'zod'

// Verificar autenticação do profissional
async function authenticateProfessional(request: NextRequest): Promise<{ isValid: boolean; professionalId?: string }> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false }
  }
  
  try {
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

// Schema de validação
const professionalServiceSchema = z.object({
  professionalId: z.string().uuid(),
  serviceId: z.string().uuid(),
  custom_duration: z.number().min(15).optional().nullable(),
  custom_price: z.number().min(0).optional().nullable(),
  is_available: z.boolean().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')
    
    if (!professionalId) {
      return NextResponse.json(
        { error: 'ID do profissional é obrigatório' },
        { status: 400 }
      )
    }
    
    // Verificar autenticação
    const auth = await authenticateProfessional(request)
    if (!auth.isValid || auth.professionalId !== professionalId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const supabase = getSupabaseAdmin()
    
    // Buscar serviços do profissional
    const { data: professionalServices, error } = await supabase
      .from('services_offered')
      .select(`
        *,
        service:services(*)
      `)
      .eq('professional_id', professionalId)
      .order('created_at')
    
    if (error) {
      console.error('Error fetching professional services:', error)
      return NextResponse.json(
        { error: 'Falha ao buscar serviços do profissional' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(professionalServices || [])
  } catch (error) {
    console.error('Error in professional services GET:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
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
    const validation = professionalServiceSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validation.error.flatten()
        },
        { status: 400 }
      )
    }
    
    const { professionalId, serviceId } = validation.data
    
    // Verificar se o profissional está modificando seus próprios serviços
    if (professionalId !== auth.professionalId) {
      return NextResponse.json(
        { error: 'Você só pode modificar seus próprios serviços' },
        { status: 403 }
      )
    }
    
    const supabase = getSupabaseAdmin()
    
    // Verificar se o serviço já está associado
    const { data: existing } = await supabase
      .from('services_offered')
      .select('id')
      .eq('professional_id', professionalId)
      .eq('service_id', serviceId)
      .single()
    
    if (existing) {
      return NextResponse.json(
        { error: 'Serviço já está associado a este profissional' },
        { status: 409 }
      )
    }
    
    // Criar associação
    const { data, error } = await supabase
      .from('services_offered')
      .insert({
        professional_id: professionalId,
        service_id: serviceId,
        is_available: true
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating professional service:', error)
      return NextResponse.json(
        { error: 'Falha ao adicionar serviço' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in professional services POST:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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
    const validation = professionalServiceSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validation.error.flatten()
        },
        { status: 400 }
      )
    }
    
    const { professionalId, serviceId, custom_duration, custom_price, is_available } = validation.data
    
    // Verificar se o profissional está modificando seus próprios serviços
    if (professionalId !== auth.professionalId) {
      return NextResponse.json(
        { error: 'Você só pode modificar seus próprios serviços' },
        { status: 403 }
      )
    }
    
    const supabase = getSupabaseAdmin()
    
    // Preparar dados para atualização
    const updateData: any = {}
    if (custom_duration !== undefined) updateData.custom_duration = custom_duration
    if (custom_price !== undefined) updateData.custom_price = custom_price
    if (is_available !== undefined) updateData.is_available = is_available
    
    // Atualizar associação
    const { data, error } = await supabase
      .from('services_offered')
      .update(updateData)
      .eq('professional_id', professionalId)
      .eq('service_id', serviceId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating professional service:', error)
      return NextResponse.json(
        { error: 'Falha ao atualizar serviço' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in professional services PATCH:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
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
    
    const body = await request.json()
    const { professionalId, serviceId } = body
    
    // Validar IDs
    if (!professionalId || !serviceId) {
      return NextResponse.json(
        { error: 'IDs obrigatórios' },
        { status: 400 }
      )
    }
    
    // Verificar se o profissional está modificando seus próprios serviços
    if (professionalId !== auth.professionalId) {
      return NextResponse.json(
        { error: 'Você só pode modificar seus próprios serviços' },
        { status: 403 }
      )
    }
    
    const supabase = getSupabaseAdmin()
    
    // Deletar associação
    const { error } = await supabase
      .from('services_offered')
      .delete()
      .eq('professional_id', professionalId)
      .eq('service_id', serviceId)
    
    if (error) {
      console.error('Error deleting professional service:', error)
      return NextResponse.json(
        { error: 'Falha ao remover serviço' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in professional services DELETE:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}