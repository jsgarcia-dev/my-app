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
const customServiceSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  description: z.string().max(500),
  category: z.string(),
  base_duration: z.number().min(15),
  base_price: z.number().min(0),
  professionalId: z.string().uuid()
})

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
    const validation = customServiceSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validation.error.flatten()
        },
        { status: 400 }
      )
    }
    
    const { professionalId, ...serviceData } = validation.data
    
    // Verificar se o profissional está criando para si mesmo
    if (professionalId !== auth.professionalId) {
      return NextResponse.json(
        { error: 'Você só pode criar serviços para seu próprio perfil' },
        { status: 403 }
      )
    }
    
    const supabase = getSupabaseAdmin()
    
    // Criar o serviço personalizado
    const { data: newService, error: serviceError } = await supabase
      .from('services')
      .insert({
        ...serviceData,
        status: 'active'
      })
      .select()
      .single()
    
    if (serviceError) {
      console.error('Error creating custom service:', serviceError)
      return NextResponse.json(
        { error: 'Falha ao criar serviço personalizado' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error('Error in custom service POST:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}