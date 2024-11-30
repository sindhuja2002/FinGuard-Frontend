'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { authService } from '@/lib/services/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const logoutTimer = setTimeout(() => {
      authService.logout()
      router.push('/login')
    }, 15 * 60 * 1000)

    return () => clearTimeout(logoutTimer)
  }, [router])

  return <>{children}</>
}