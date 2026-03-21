import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '~/shared/ui/sonner'
import { AuthProvider } from './auth-provider'
import { queryClient } from './query-client'
import { router } from './router'
import { ThemeProvider } from './theme-provider'

export function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

export default App
