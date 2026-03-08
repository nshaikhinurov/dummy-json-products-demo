import type { AuthSession, AuthStorageMode } from './types'

const AUTH_STORAGE_KEY = 'auth.session.v1'

function hasBrowserStorage() {
  return typeof window !== 'undefined'
}

function serialize(session: AuthSession): string {
  return JSON.stringify(session)
}

function deserialize(raw: string | null): AuthSession | null {
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession

    if (!parsed.accessToken || !parsed.refreshToken) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function loadAuthSession(): {
  session: AuthSession | null
  mode: AuthStorageMode | null
} {
  if (!hasBrowserStorage()) {
    return { session: null, mode: null }
  }

  const local = deserialize(window.localStorage.getItem(AUTH_STORAGE_KEY))
  if (local) {
    return { session: local, mode: 'local' }
  }

  const session = deserialize(window.sessionStorage.getItem(AUTH_STORAGE_KEY))
  if (session) {
    return { session, mode: 'session' }
  }

  return { session: null, mode: null }
}

export function saveAuthSession(
  authSession: AuthSession,
  mode: AuthStorageMode
): void {
  if (!hasBrowserStorage()) {
    return
  }

  const payload = serialize(authSession)

  if (mode === 'local') {
    window.localStorage.setItem(AUTH_STORAGE_KEY, payload)
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  window.sessionStorage.setItem(AUTH_STORAGE_KEY, payload)
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function clearAuthSession(): void {
  if (!hasBrowserStorage()) {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
}
