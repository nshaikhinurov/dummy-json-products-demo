import { useId } from 'react'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '~/app/theme-provider'
import { Switch } from '~/shared/ui/switch'

export const DarkModeToggle = () => {
  const id = useId()
  const { resolvedTheme, setTheme } = useTheme()
  const checked = resolvedTheme === 'dark'

  const toggleSwitch = () => {
    setTheme(checked ? 'light' : 'dark')
  }

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={checked ? 'checked' : 'unchecked'}
      onClick={toggleSwitch}
    >
      <span
        id={`${id}-light`}
        className="text-left text-sm font-medium group-data-[state=checked]:text-muted-foreground/70"
        aria-controls={id}
      >
        <SunIcon className="size-4" aria-hidden="true" />
      </span>
      <Switch
        id={id}
        checked={checked}
        aria-labelledby={`${id}-dark ${id}-light`}
        aria-label="Toggle between dark and light mode"
      />
      <span
        id={`${id}-dark`}
        className="text-right text-sm font-medium group-data-[state=unchecked]:text-muted-foreground/70"
        aria-controls={id}
      >
        <MoonIcon className="size-4" aria-hidden="true" />
      </span>
    </div>
  )
}
