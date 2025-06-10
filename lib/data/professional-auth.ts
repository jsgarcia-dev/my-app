// Simple PIN-based authentication for professionals
// In production, use proper authentication with JWT tokens

export const professionalPins: Record<string, string> = {
  '1': '1234', // Ana Silva
  '2': '2345', // Beatriz Santos
  '3': '3456', // Carlos Oliveira
  '4': '4567', // Diana Costa
}

export function validatePin(professionalId: string, pin: string): boolean {
  return professionalPins[professionalId] === pin
}