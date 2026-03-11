import { LogOut, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/app/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '~/shared/ui/avatar'
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
  const navigate = useNavigate()
  const { session, logout } = useAuth()

  const handleLogout = () => {
    logout()
    void navigate('/login', { replace: true })
  }

  const userInfoBlock = (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8 rounded-lg grayscale">
        <AvatarImage src={session?.image} alt={session?.username} />
        <AvatarFallback className="rounded-lg">
          {session?.firstName?.[0]}
          {session?.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">
          {session?.firstName} {session?.lastName}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {session?.username}
        </span>
      </div>
    </div>
  )

  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center rounded-lg focus:outline-none">
          {userInfoBlock}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56 rounded-lg"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-0 px-1 py-1.5 font-normal">
              {userInfoBlock}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserCircle />
              Аккаунт
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
