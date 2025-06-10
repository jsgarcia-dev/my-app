'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth')
    const professionalId = sessionStorage.getItem('adminProfessionalId')
    
    if (!isAuth || !professionalId) {
      router.push('/admin')
    }
  }, [router])

  return <>{children}</>
}