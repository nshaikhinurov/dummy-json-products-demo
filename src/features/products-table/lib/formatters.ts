const PRICE_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function getPriceDisplayParts(value: number) {
  const parts = PRICE_FORMATTER.formatToParts(value)

  const major = parts
    .filter(
      (part) =>
        part.type === 'currency' ||
        part.type === 'minusSign' ||
        part.type === 'integer' ||
        part.type === 'group'
    )
    .map((part) => (part.type === 'group' ? ' ' : part.value))
    .join('')

  const fraction = parts.find((part) => part.type === 'fraction')?.value ?? '00'

  return { major, fraction }
}
