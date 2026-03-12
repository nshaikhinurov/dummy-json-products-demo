import { useEffect, useState } from 'react'

export const useDebouncedValue = <T>(
  value: T,
  delay: number = 300,
  onChange?: (newValue: T) => void
) => {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => clearTimeout(id)
  }, [value, delay])

  useEffect(() => {
    onChange?.(debounced)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return debounced
}
