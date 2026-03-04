import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Login } from '~/pages/login'
import { NotFound } from '~/pages/not-found'
import { Products } from '~/pages/products'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },
  { path: '/products', element: <Products /> },
  { path: '*', element: <NotFound /> },
])
