import { AudioLines } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Logo = () => {
  return (
    <Link to="#" className="flex items-center gap-2">
      <AudioLines className="size-5" />
      <span className="text-base font-semibold">Acme Inc.</span>
    </Link>
  )
}
