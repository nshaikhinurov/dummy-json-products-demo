import { ChevronsUpDown, LogOut, UserCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/app/auth-provider'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '~/shared/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/shared/ui/dropdown-menu'

export const UserNav = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { session, logout } = useAuth()

  const handleLogout = () => {
    logout()
    void navigate('/login', { replace: true })
  }

  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center rounded-lg focus:outline-none"
          render={
            <div className="flex items-center gap-2 rounded-md p-2 hover:bg-secondary">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={session?.image} alt={session?.username} />
                <AvatarFallback className="rounded-lg">
                  {session?.firstName?.[0]}
                  {session?.lastName?.[0]}
                </AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session?.username}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {session?.firstName} {session?.lastName}
                </span>
              </div>
              <ChevronsUpDown className="size-5" />
            </div>
          }
        ></DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56 rounded-lg"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-0 px-1 py-1.5 font-normal">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={session?.image} alt={session?.username} />
                  <AvatarFallback className="rounded-lg">
                    {session?.firstName?.[0]}
                    {session?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-foreground">
                    {session?.username}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {session?.firstName} {session?.lastName}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserCircle />
              {t('common.account')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            {t('common.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
