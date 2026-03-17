import { useQuery } from '@tanstack/react-query'
import type { SortingState } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { getProducts, searchProducts } from '~/shared/api/products'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import {
  PAGE_SIZE,
  PRODUCTS_SORTING_STORAGE_KEY,
  SEARCH_DEBOUNCE_MS,
} from '../consts'
import { mapSortingToApi } from '../lib'
import { ProductsTable } from './products-table'
import { SearchInputGroup } from './search-input-group'

const SORTABLE_COLUMNS = new Set(['title', 'brand', 'sku', 'rating', 'price'])

function getInitialSorting(): SortingState {
  try {
    const rawValue = localStorage.getItem(PRODUCTS_SORTING_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (
        item
      ): item is {
        id: string
        desc: boolean
      } =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'desc' in item &&
        typeof item.id === 'string' &&
        SORTABLE_COLUMNS.has(item.id) &&
        typeof item.desc === 'boolean'
    )
  } catch {
    return []
  }
}

export const ProductsContent = () => {
  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebouncedValue(searchValue, SEARCH_DEBOUNCE_MS)
  const [sorting, setSorting] = useState<SortingState>(() =>
    getInitialSorting()
  )
  const sortingParams = useMemo(() => mapSortingToApi(sorting), [sorting])

  useEffect(() => {
    try {
      if (sorting.length) {
        localStorage.setItem(
          PRODUCTS_SORTING_STORAGE_KEY,
          JSON.stringify(sorting)
        )
        return
      }

      localStorage.removeItem(PRODUCTS_SORTING_STORAGE_KEY)
    } catch {
      // Ignore storage failures, table should still work with in-memory state.
    }
  }, [sorting])

  const productsQuery = useQuery({
    queryKey: [
      'products',
      {
        page,
        pageSize: PAGE_SIZE,
        q: debouncedSearch,
        sortBy: sortingParams.sortBy,
        order: sortingParams.order,
      },
    ],
    queryFn: () => {
      const baseParams = {
        limit: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        sortBy: sortingParams.sortBy,
        order: sortingParams.order,
        select: ['id', 'title', 'category', 'brand', 'sku', 'rating', 'price'],
      }

      if (debouncedSearch) {
        return searchProducts({
          ...baseParams,
          q: debouncedSearch,
        })
      }

      return getProducts(baseParams)
    },
    staleTime: 5 * 60 * 1000,
  })

  const isPending = productsQuery.isPending

  return (
    <div className="space-y-4 px-6 py-4">
      <h1 className="text-2xl font-bold">Products</h1>

      <SearchInputGroup
        value={searchValue}
        onChange={(value) => {
          setSearchValue(value)
          setPage(1)
        }}
      />

      {productsQuery.error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {productsQuery.error.message}
        </div>
      )}

      <ProductsTable
        products={productsQuery.data?.products ?? []}
        isPending={isPending}
        page={page}
        pageSize={PAGE_SIZE}
        total={productsQuery.data?.total ?? 0}
        sorting={sorting}
        onPageChange={setPage}
        onSortingChange={(updater) => {
          setPage(1)
          setSorting(updater)
        }}
      />
    </div>
  )
}
