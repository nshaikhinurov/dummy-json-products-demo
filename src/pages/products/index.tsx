import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/app/auth-provider'
import { Button } from '~/shared/ui/button'

export const Products = () => {
  const navigate = useNavigate()
  const { session, logout } = useAuth()

  const handleLogout = () => {
    logout()
    void navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-xl rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Вы успешно авторизованы как {session?.firstName} {session?.lastName}.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Username: {session?.username}
        </p>
        <Button className="mt-6" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </div>
  )
}
