import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Button } from '~/shared/ui/button'

interface SortButtonProps {
  label: string
  isSorted: false | 'asc' | 'desc'
  onClick: () => void
}

export function SortButton({ label, isSorted, onClick }: SortButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 border-none px-0 hover:bg-transparent dark:hover:bg-transparent"
      onClick={onClick}
      type="button"
    >
      {label}
      {isSorted === 'asc' ? (
        <ArrowUp className="size-4 text-muted-foreground group-hover/button:text-foreground" />
      ) : isSorted === 'desc' ? (
        <ArrowDown className="size-4 text-muted-foreground group-hover/button:text-foreground" />
      ) : (
        <ArrowUpDown className="size-4 text-muted-foreground group-hover/button:text-foreground" />
      )}
    </Button>
  )
}
