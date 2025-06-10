// Utility functions for authentication

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('authToken')
}

export function setAuthToken(professionalId: string, pin: string): void {
  if (typeof window === 'undefined') return
  const token = `${professionalId}:${pin}`
  sessionStorage.setItem('authToken', token)
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('authToken')
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  if (!token) {
    return { 'Content-Type': 'application/json' }
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}