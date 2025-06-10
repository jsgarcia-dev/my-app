import { getSupabaseAdmin } from '@/lib/supabase/client'
import bcrypt from 'bcryptjs'

export async function validatePin(professionalId: string, pin: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin()
    const { data: auth, error } = await supabase
      .from('professional_auth')
      .select('pin_hash, failed_attempts, locked_until')
      .eq('professional_id', professionalId)
      .single()

    if (error || !auth) {
      console.error('Professional auth not found:', professionalId)
      return false
    }

    // Verificar se está bloqueado
    if (auth.locked_until && new Date(auth.locked_until) > new Date()) {
      console.log('Professional account is locked:', professionalId)
      return false
    }

    const isValid = await bcrypt.compare(pin, auth.pin_hash)

    if (isValid) {
      // Reset tentativas falhas e registrar login
      await supabase
        .from('professional_auth')
        .update({ 
          failed_attempts: 0,
          last_login: new Date().toISOString(),
          locked_until: null
        })
        .eq('professional_id', professionalId)
      
      console.log('Successful login for professional:', professionalId)
    } else {
      // Incrementar tentativas falhas
      const newAttempts = (auth.failed_attempts || 0) + 1
      const updates: any = { failed_attempts: newAttempts }
      
      // Bloquear após 5 tentativas por 30 minutos
      if (newAttempts >= 5) {
        updates.locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString()
        console.log('Account locked due to too many failed attempts:', professionalId)
      }
      
      await supabase
        .from('professional_auth')
        .update(updates)
        .eq('professional_id', professionalId)
      
      console.log(`Failed login attempt ${newAttempts} for professional:`, professionalId)
    }

    return isValid
  } catch (error) {
    console.error('Error validating PIN:', error)
    return false
  }
}

// Compatibilidade temporária com o código antigo
export const professionalPins: Record<string, string> = {
  '00000000-0000-0000-0000-000000000001': '1234', // Ana Silva
  '00000000-0000-0000-0000-000000000002': '2345', // Beatriz Santos
  '00000000-0000-0000-0000-000000000003': '3456', // Carlos Oliveira
  '00000000-0000-0000-0000-000000000004': '4567', // Diana Costa
}