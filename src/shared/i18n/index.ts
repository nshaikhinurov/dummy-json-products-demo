import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './resources'
import { getStoredLanguage, setStoredLanguage } from './storage'

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

  i18n.on('languageChanged', (language) => {
    if (language === 'ru' || language === 'en') {
      setStoredLanguage(language)
    }
  })
}

export { i18n }
