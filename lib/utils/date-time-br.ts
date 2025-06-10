import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

/**
 * Formata uma data para o padrão brasileiro DD/MM/YYYY
 */
export function formatDateBR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR })
}

/**
 * Formata uma data completa para exibição em português
 * Ex: "11 de junho de 2025"
 */
export function formatFullDateBR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

/**
 * Formata hora para HH:mm removendo segundos se existirem
 * Aceita formatos: "10:00", "10:00:00", "10:00:00.000"
 */
export function formatTimeBR(time: string): string {
  // Remove tudo após os primeiros 5 caracteres (HH:mm)
  if (time.length >= 5) {
    return time.substring(0, 5)
  }
  return time
}

/**
 * Garante que o horário está no formato HH:mm
 * Se vier com segundos, remove. Se vier inválido, retorna null
 */
export function normalizeTime(time: string | null | undefined): string | null {
  if (!time) return null
  
  // Remove espaços em branco
  const trimmed = time.trim()
  
  // Verifica se tem pelo menos HH:mm
  if (trimmed.length < 5) return null
  
  // Pega apenas HH:mm
  const normalized = trimmed.substring(0, 5)
  
  // Valida formato
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(normalized)) return null
  
  return normalized
}

/**
 * Converte objeto de horários garantindo formato HH:mm
 */
export function normalizeWorkingHours(hours: {
  start: string
  end: string
  breaks?: Array<{ start: string; end: string }>
}): {
  start: string
  end: string
  breaks?: Array<{ start: string; end: string }>
} {
  const normalizedBreaks = hours.breaks?.map(breakTime => ({
    start: formatTimeBR(breakTime.start),
    end: formatTimeBR(breakTime.end)
  }))

  return {
    start: formatTimeBR(hours.start),
    end: formatTimeBR(hours.end),
    breaks: normalizedBreaks
  }
}

/**
 * Formata data e hora juntos no padrão brasileiro
 * Ex: "11/06/2025 às 14:30"
 */
export function formatDateTimeBR(date: Date | string, time: string): string {
  const dateStr = formatDateBR(date)
  const timeStr = formatTimeBR(time)
  return `${dateStr} às ${timeStr}`
}

/**
 * Parse de data no formato brasileiro DD/MM/YYYY para Date
 */
export function parseDateBR(dateStr: string): Date | null {
  try {
    return parse(dateStr, 'dd/MM/yyyy', new Date(), { locale: ptBR })
  } catch {
    return null
  }
}

/**
 * Valida se uma string está no formato de hora HH:mm
 */
export function isValidTime(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

/**
 * Compara dois horários no formato HH:mm
 * Retorna: -1 se time1 < time2, 0 se iguais, 1 se time1 > time2
 */
export function compareTimesBR(time1: string, time2: string): number {
  const [h1, m1] = time1.split(':').map(Number)
  const [h2, m2] = time2.split(':').map(Number)
  
  const minutes1 = h1 * 60 + m1
  const minutes2 = h2 * 60 + m2
  
  if (minutes1 < minutes2) return -1
  if (minutes1 > minutes2) return 1
  return 0
}