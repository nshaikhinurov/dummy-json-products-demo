import { Logo } from './logo'
import { UserNav } from './user-nav'

export const PageHeader = () => {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <Logo />
      <UserNav />
    </div>
  )
}
