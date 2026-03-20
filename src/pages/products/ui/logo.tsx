import { AudioLines } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const Logo = () => {
  const { t } = useTranslation()

  return (
    <Link
      to="#"
      className="flex grow items-center justify-center gap-2 sm:grow-0 sm:justify-start"
    >
      <AudioLines className="size-5" />
      <span className="text-base font-semibold">{t('common.brandName')}</span>
    </Link>
  )
}
