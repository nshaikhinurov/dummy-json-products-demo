import type { LoginRequest, LoginResponse } from '~/shared/auth/types'
import { i18n } from '~/shared/i18n'

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
    throw new AuthApiError(json.message ?? i18n.t('errors.authLoginFailed'))
  }

  if (!json.accessToken || !json.refreshToken || !json.username || !json.id) {
    throw new AuthApiError(i18n.t('errors.authIncompleteData'))
  }

  return json as LoginResponse
}
