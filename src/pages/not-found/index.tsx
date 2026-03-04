import { useNavigate } from 'react-router-dom'
import { Button } from '~/shared/ui/button'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Button className="mt-2" onClick={() => navigate('/')}>
        Back to home
      </Button>
    </div>
  )
}
