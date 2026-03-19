import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Updater,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/shared/ui/pagination'
import { Skeleton } from '~/shared/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/shared/ui/table'

interface ProductsTableProps {
  products: Product[]
  isPending: boolean
  page: number
  pageSize: number
  total: number
  sorting: SortingState
  onPageChange: (page: number) => void
  onSortingChange: (updater: Updater<SortingState>) => void
}

const PRICE_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function getPriceDisplayParts(value: number) {
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

function getPaginationModel(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages] as const
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ] as const
}

function SortButton({
  label,
  isSorted,
  onClick,
}: {
  label: string
  isSorted: false | 'asc' | 'desc'
  onClick: () => void
}) {
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

export function ProductsTable({
  products,
  isPending,
  page,
  pageSize,
  total,
  sorting,
  onPageChange,
  onSortingChange,
}: ProductsTableProps) {
  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState({})

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const columns = useMemo<ColumnDef<Product>[]>(
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
              render={<Button variant="outline" size="icon-sm" />}
              aria-label={`Open actions for ${row.original.title}`}
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem>{t('products.actionEdit')}</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    manualPagination: true,
    enableRowSelection: true,
    pageCount: totalPages,
    getRowId: (row) => String(row.id),
  })

  const visibleColumns = table.getVisibleLeafColumns()
  const pages = getPaginationModel(page, totalPages)

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: pageSize }, (_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {visibleColumns.map((column) => {
                    return (
                      <TableCell key={`skeleton-${index}-${column.id}`}>
                        <div className="flex w-full flex-col items-start justify-center gap-1 overflow-hidden">
                          {column.id === 'title' ? (
                            <>
                              <Skeleton className={'h-5 w-1/4'} />
                              <Skeleton className={'h-4 w-2/4'} />
                            </>
                          ) : (
                            <Skeleton
                              className={cn('h-5 w-full', {
                                invisible:
                                  column.id === 'select' ||
                                  column.id === 'actions',
                                'w-4/5': column.id === 'brand',
                                'w-29': column.id === 'sku',
                                'w-10 self-end': column.id === 'rating',
                                'w-6/10 self-end': column.id === 'price',
                              })}
                            />
                          )}
                        </div>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t('products.emptyState')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t('products.rowsSelected', {
            selected: table.getSelectedRowModel().rows.length,
            total: table.getRowModel().rows.length,
          })}
        </p>

        <Pagination className="mx-0 w-auto justify-start sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text={t('common.previous')}
                onClick={(event) => {
                  event.preventDefault()

                  if (page > 1) {
                    onPageChange(page - 1)
                  }
                }}
                aria-disabled={page === 1}
                className={
                  page === 1 ? 'pointer-events-none opacity-50' : undefined
                }
              />
            </PaginationItem>

            {pages.map((item, index) =>
              item === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === page}
                    onClick={(event) => {
                      event.preventDefault()
                      onPageChange(item)
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                text={t('common.next')}
                onClick={(event) => {
                  event.preventDefault()

                  if (page < totalPages) {
                    onPageChange(page + 1)
                  }
                }}
                aria-disabled={page >= totalPages}
                className={
                  page >= totalPages
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
