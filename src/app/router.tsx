import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Login } from '~/pages/login'
import { NotFound } from '~/pages/not-found'
import { ProductsPage } from '~/pages/products'
import { useAuth } from './auth-provider'

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  return <>{children}</>
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    path: '/login',
    element: (
      <PublicOnly>
        <Login />
      </PublicOnly>
    ),
  },
  {
    path: '/products',
    element: (
      <RequireAuth>
        <ProductsPage />
      </RequireAuth>
    ),
  },
  { path: '*', element: <NotFound /> },
])
