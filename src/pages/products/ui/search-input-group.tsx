import { Search, X } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '~/shared/ui/input-group'

interface SearchInputGroupProps {
  value: string
  onChange: (value: string) => void
}

export const SearchInputGroup = ({
  value,
  onChange,
}: SearchInputGroupProps) => {
  return (
    <InputGroup className="max-w-md">
      <InputGroupInput
        placeholder="Search products..."
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label="Clear search"
          disabled={!value}
          onClick={() => {
            onChange('')
          }}
          size="icon-xs"
          type="button"
          className={'hover:bg-transparent'}
        >
          <X />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
