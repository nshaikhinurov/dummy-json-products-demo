import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  type Updater,
} from '@tanstack/react-table'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getPaginationModel } from '~/features/products-table/model/pagination'
import type { Product } from '~/shared/api/products'
import { cn } from '~/shared/lib/utils'
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
import { useProductsTableColumns } from './products-table-columns'

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

  const columns = useProductsTableColumns()

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
                  <div className="flex flex-col items-center justify-center gap-2 p-10">
                    <span
                      className="size-40 bg-muted-foreground/70"
                      aria-hidden="true"
                      style={{
                        mask: "url('/no-products-found.svg') center / contain no-repeat",
                        WebkitMask:
                          "url('/no-products-found.svg') center / contain no-repeat",
                      }}
                    />
                    <h2 className="mt-5 text-lg font-semibold">
                      {t('products.emptyStateTitle')}
                    </h2>
                    <p className="max-w-sm text-center text-sm text-pretty wrap-break-word whitespace-normal">
                      {t('products.emptyStateDescription')}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={cn(
            'text-sm text-muted-foreground',
            isPending && 'invisible'
          )}
        >
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
