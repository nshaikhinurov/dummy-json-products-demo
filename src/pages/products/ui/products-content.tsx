import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SortingState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  type CreateProductPayload,
  getProducts,
  type Product,
  ProductsApiError,
  type ProductsListResponse,
  searchProducts,
} from '~/shared/api/products'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import { Button } from '~/shared/ui/button'
import {
  PAGE_SIZE,
  PRODUCTS_SORTING_STORAGE_KEY,
  SEARCH_DEBOUNCE_MS,
} from '../consts'
import { mapSortingToApi } from '../lib'
import { AddProductDialog } from './add-product-dialog'
import { ProductsTable } from './products-table'
import { SearchInputGroup } from './search-input-group'

const SORTABLE_COLUMNS = new Set(['title', 'brand', 'sku', 'rating', 'price'])

function createLocalProduct(payload: CreateProductPayload): Product {
  return {
    id: Date.now() + Math.floor(Math.random() * 10_000),
    title: payload.title,
    category: payload.category,
    brand: payload.brand,
    sku: payload.sku,
    rating: 0,
    price: payload.price,
  }
}

function updateProductsCache(
  queryClient: ReturnType<typeof useQueryClient>,
  nextProduct: Product
) {
  const allProductsQueries = queryClient.getQueriesData<ProductsListResponse>({
    queryKey: ['products'],
  })

  for (const [queryKey, cacheValue] of allProductsQueries) {
    if (!cacheValue) {
      continue
    }

    const keyParams =
      Array.isArray(queryKey) &&
      queryKey.length > 1 &&
      typeof queryKey[1] === 'object' &&
      queryKey[1] !== null
        ? (queryKey[1] as { q?: string })
        : undefined

    const queryText = keyParams?.q?.trim().toLowerCase() ?? ''
    const isMatchingSearch =
      queryText.length === 0 ||
      nextProduct.title.toLowerCase().includes(queryText)

    if (!isMatchingSearch) {
      continue
    }

    queryClient.setQueryData<ProductsListResponse>(queryKey, (currentValue) => {
      if (!currentValue) {
        return currentValue
      }

      const total = currentValue.total + 1

      if (currentValue.skip !== 0) {
        return {
          ...currentValue,
          total,
        }
      }

      return {
        ...currentValue,
        total,
        products: [nextProduct, ...currentValue.products].slice(
          0,
          currentValue.limit
        ),
      }
    })
  }
}

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
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
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

  const [lastKnownTotal, setLastKnownTotal] = useState<number>(1)
  const currentTotal = productsQuery.data?.total
  if (currentTotal !== undefined && currentTotal !== lastKnownTotal) {
    setLastKnownTotal(currentTotal)
  }

  const addProductMutation = useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const delay = Math.floor(Math.random() * 2001)
      await new Promise((resolve) => {
        window.setTimeout(resolve, delay)
      })

      if (Math.random() < 0.05) {
        throw new ProductsApiError(t('errors.productsAddFailed'))
      }

      return createLocalProduct(payload)
    },
    onSuccess: (addedProduct) => {
      updateProductsCache(queryClient, addedProduct)
      setIsAddDialogOpen(false)
      toast.success(t('products.addSuccessToast'))
    },
    onError: (error) => {
      const errorMessage =
        error instanceof ProductsApiError
          ? error.message
          : t('products.addErrorToast')

      toast.error(errorMessage)
    },
  })

  return (
    <div className="space-y-4 px-6 py-4">
      <h1 className="text-2xl font-bold">{t('products.pageTitle')}</h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInputGroup
          value={searchValue}
          onChange={(value) => {
            setSearchValue(value)
            setPage(1)
          }}
        />

        <Button type="button" onClick={() => setIsAddDialogOpen(true)}>
          <Plus />
          {t('products.addButton')}
        </Button>
      </div>

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
        total={productsQuery.data?.total ?? lastKnownTotal}
        sorting={sorting}
        onPageChange={setPage}
        onSortingChange={(updater) => {
          setPage(1)
          setSorting(updater)
        }}
      />

      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={async (value) => {
          await addProductMutation.mutateAsync(value)
        }}
        isSubmitting={addProductMutation.isPending}
      />
    </div>
  )
}
