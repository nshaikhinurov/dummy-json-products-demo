export type AuthStorageMode = 'local' | 'session'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthSession extends AuthTokens {
  userId: number
  username: string
  firstName: string
  lastName: string
  image: string
}

export interface LoginRequest {
  username: string
  password: string
  expiresInMins?: number
}

export interface LoginResponse {
  id: number
  username: string
  firstName: string
  lastName: string
  image: string
  accessToken: string
  refreshToken: string
}
