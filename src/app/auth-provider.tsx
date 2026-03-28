import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { mapLoginResponseToSession } from '~/shared/auth/mappers'
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
} from '~/shared/auth/storage'
import type { AuthSession, LoginResponse } from '~/shared/auth/types'

interface AuthContextValue {
  session: AuthSession | null
  isAuthenticated: boolean
  accessToken: string | null
  login: (response: LoginResponse, rememberMe: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(
    () => loadAuthSession().session
  )

  const login = useCallback((response: LoginResponse, rememberMe: boolean) => {
    const nextSession = mapLoginResponseToSession(response)

    saveAuthSession(nextSession, rememberMe ? 'local' : 'session')
    setSession(nextSession)
  }, [])

  const logout = useCallback(() => {
    clearAuthSession()
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session?.accessToken),
      accessToken: session?.accessToken ?? null,
      login,
      logout,
    }),
    [session, login, logout]
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
