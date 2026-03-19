import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '~/shared/ui/button'

export const NotFound = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">{t('common.notFoundCode')}</h1>
      <p className="text-muted-foreground">{t('common.notFoundTitle')}</p>
      <Button className="mt-2" onClick={() => navigate('/')}>
        {t('common.backToHome')}
      </Button>
    </div>
  )
}
