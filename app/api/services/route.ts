import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    
    // Fetch all active services
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('category')
      .order('name')
    
    if (error) {
      console.error('Error fetching services:', error)
      return NextResponse.json(
        { error: 'Falha ao buscar serviços' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(services || [])
  } catch (error) {
    console.error('Error in services GET:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}