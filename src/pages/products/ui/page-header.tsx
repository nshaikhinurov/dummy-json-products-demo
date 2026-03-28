import { DarkModeToggle } from '~/features/dark-mode-toggle'
import { LanguageToggle } from '~/features/language-toggle'
import { UserNav } from '~/features/user-nav'
import { Logo } from './logo'

export const PageHeader = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b px-6 py-4">
      <Logo />
      <div className="flex grow items-center justify-between gap-6 sm:grow-0">
        <DarkModeToggle />
        <LanguageToggle />
        <UserNav />
      </div>
    </div>
  )
}
