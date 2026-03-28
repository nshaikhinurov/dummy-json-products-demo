import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Login } from '~/pages/login'
import { NotFound } from '~/pages/not-found'
import { ProductsPage } from '~/pages/products'
import { PublicOnly, RequireAuth } from './route-guards'

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
