import type { SupportedLanguage } from './resources'

const LANGUAGE_STORAGE_KEY = 'app.language'
const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

export function getStoredLanguage(): SupportedLanguage {
  try {
    const value = localStorage.getItem(LANGUAGE_STORAGE_KEY)

    if (value === 'ru' || value === 'en') {
      return value
    }
  } catch {
    // Ignore storage access errors and use default.
  }

  return DEFAULT_LANGUAGE
}

export function setStoredLanguage(language: SupportedLanguage) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Ignore storage access errors.
  }
}
