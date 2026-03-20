import { DarkModeToggle } from './dark-mode-toggle'
import { LanguageToggle } from './language-toggle'
import { Logo } from './logo'
import { UserNav } from './user-nav'

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
