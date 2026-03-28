import type { SortingState } from '@tanstack/react-table'
import { type ProductSortBy } from '~/shared/api/products'

export function mapSortingToApi(sorting: SortingState): {
  sortBy?: ProductSortBy
  order?: 'asc' | 'desc'
} {
  if (!sorting.length) {
    return {}
  }

  const [firstSort] = sorting
  const validColumns: ProductSortBy[] = [
    'title',
    'brand',
    'sku',
    'rating',
    'price',
  ]

  if (!validColumns.includes(firstSort.id as ProductSortBy)) {
    return {}
  }

  return {
    sortBy: firstSort.id as ProductSortBy,
    order: firstSort.desc ? 'desc' : 'asc',
  }
}
