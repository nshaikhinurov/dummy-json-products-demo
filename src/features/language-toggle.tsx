import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SupportedLanguage } from '~/shared/i18n/resources'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/ui/select'

const languages: SupportedLanguage[] = ['en', 'ru']

export const LanguageToggle = () => {
  const { i18n, t } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage === 'ru' ? 'ru' : 'en'

  const handleLanguageChange = (language: string | null) => {
    if (language !== 'en' && language !== 'ru') {
      return
    }

    if (language !== currentLanguage) {
      void i18n.changeLanguage(language)
    }
  }

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger
        size="sm"
        aria-label={t('common.languageEn')}
        className="relative pl-9"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-muted-foreground group-has-[select[disabled]]:opacity-50">
          <Globe size={16} aria-hidden="true" />
        </div>
        <SelectValue>
          {currentLanguage === 'en'
            ? t('common.languageEn')
            : t('common.languageRu')}
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="min-w-0">
        {languages.map((language) => (
          <SelectItem key={language} value={language}>
            {language === 'en'
              ? t('common.languageEn')
              : t('common.languageRu')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
