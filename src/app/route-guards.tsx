import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './auth-provider'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  return <>{children}</>
}
