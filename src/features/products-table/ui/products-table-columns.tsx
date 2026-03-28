import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getPriceDisplayParts } from '~/features/products-table/lib/formatters'
import type { Product } from '~/shared/api/products'
import { cn } from '~/shared/lib/utils'
import { Button } from '~/shared/ui/button'
import { Checkbox } from '~/shared/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/shared/ui/dropdown-menu'
import { SortButton } from './sort-button'

export function useProductsTableColumns(): ColumnDef<Product>[] {
  const { t } = useTranslation()

  return useMemo(
    () => [
      {
        id: 'select',
        enableSorting: false,
        header: ({ table }) => (
          <div className="flex h-full items-center justify-center">
            <Checkbox
              aria-label="Select all"
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(Boolean(value))
              }
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex h-full items-center justify-center">
            <Checkbox
              aria-label={`Select row ${row.original.id}`}
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
            />
          </div>
        ),
        meta: {
          className: 'w-8 text-center',
        },
      },
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <SortButton
            label={t('products.columnTitle')}
            isSorted={column.getIsSorted()}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold">{row.original.title}</span>
            <span className="text-sm text-muted-foreground capitalize">
              {row.original.category}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'brand',
        header: ({ column }) => (
          <SortButton
            label={t('products.columnBrand')}
            isSorted={column.getIsSorted()}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => (
          <span className={cn(!row.original.brand && 'text-muted-foreground')}>
            {row.original.brand ?? t('products.brandNoName')}
          </span>
        ),
        meta: {
          className: 'w-70',
        },
      },
      {
        accessorKey: 'sku',
        header: ({ column }) => (
          <SortButton
            label={t('products.columnSku')}
            isSorted={column.getIsSorted()}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => (
          <span className="font-mono">
            {row.original.sku ?? t('products.skuPlaceholder')}
          </span>
        ),
        meta: {
          className: 'w-70',
        },
      },
      {
        accessorKey: 'rating',
        header: ({ column }) => (
          <SortButton
            label={t('products.columnRating')}
            isSorted={column.getIsSorted()}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => (
          <span
            className={cn(
              'tabular-nums',
              row.original.rating < 3 && 'text-destructive'
            )}
          >
            {row.original.rating.toFixed(2)}
          </span>
        ),
        meta: {
          className: 'text-right w-25',
        },
      },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <SortButton
            label={t('products.columnPrice')}
            isSorted={column.getIsSorted()}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        ),
        cell: ({ row }) => {
          const { major, fraction } = getPriceDisplayParts(row.original.price)

          return (
            <span className="whitespace-nowrap tabular-nums">
              <span>{major}</span>
              <span className="text-muted-foreground">.{fraction}</span>
            </span>
          )
        },
        meta: {
          className: 'text-right w-40',
        },
      },
      {
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" />}
              aria-label={`Open actions for ${row.original.title}`}
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem>
                <Pencil className="size-4" />
                {t('products.actionEdit')}
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Trash className="size-4" />
                {t('products.actionDelete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        meta: {
          className: 'w-18 text-center',
        },
      },
    ],
    [t]
  )
}
