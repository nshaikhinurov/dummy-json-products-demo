import type { LoginRequest, LoginResponse } from '~/shared/auth/types'

const LOGIN_ENDPOINT = 'https://dummyjson.com/user/login'

export class AuthApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthApiError'
  }
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const json = (await response.json()) as Partial<LoginResponse> & {
    message?: string
  }

  if (!response.ok) {
    throw new AuthApiError(json.message ?? 'Не удалось войти')
  }

  if (!json.accessToken || !json.refreshToken || !json.username || !json.id) {
    throw new AuthApiError('Сервер вернул неполные данные авторизации')
  }

  return json as LoginResponse
}
