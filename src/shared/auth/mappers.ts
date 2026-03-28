import type { AuthSession, LoginResponse } from './types'

export function mapLoginResponseToSession(
  response: LoginResponse
): AuthSession {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    userId: response.id,
    username: response.username,
    firstName: response.firstName,
    lastName: response.lastName,
    image: response.image,
  }
}
