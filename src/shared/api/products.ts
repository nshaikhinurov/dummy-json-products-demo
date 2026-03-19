import { i18n } from '~/shared/i18n'

export type ProductSortBy = 'title' | 'brand' | 'sku' | 'rating' | 'price'

export interface Product {
  id: number
  title: string
  category: string
  brand?: string
  sku?: string
  rating: number
  price: number
}

export interface ProductsListResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

interface ProductsRequestParams {
  limit: number
  skip: number
  sortBy?: ProductSortBy
  order?: 'asc' | 'desc'
  select?: string[]
}

interface ProductsSearchRequestParams extends ProductsRequestParams {
  q: string
}

export class ProductsApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProductsApiError'
  }
}

const PRODUCTS_ENDPOINT = 'https://dummyjson.com/products'
const SEARCH_ENDPOINT = 'https://dummyjson.com/products/search'

function buildProductsUrl(
  endpoint: string,
  params: ProductsRequestParams | ProductsSearchRequestParams
) {
  const url = new URL(endpoint)

  url.searchParams.set('limit', String(params.limit))
  url.searchParams.set('skip', String(params.skip))

  if (params.sortBy) {
    url.searchParams.set('sortBy', params.sortBy)
  }

  if (params.order) {
    url.searchParams.set('order', params.order)
  }

  if (params.select?.length) {
    url.searchParams.set('select', params.select.join(','))
  }

  if ('q' in params && params.q.trim()) {
    url.searchParams.set('q', params.q.trim())
  }

  return url.toString()
}

function parseProductsResponse(
  json: unknown,
  fallbackMessage: string
): ProductsListResponse {
  const data = json as Partial<ProductsListResponse> & { message?: string }

  if (
    !Array.isArray(data.products) ||
    typeof data.total !== 'number' ||
    typeof data.skip !== 'number' ||
    typeof data.limit !== 'number'
  ) {
    throw new ProductsApiError(data.message ?? fallbackMessage)
  }

  return {
    products: data.products,
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  }
}

async function fetchProducts(
  endpoint: string,
  params: ProductsRequestParams | ProductsSearchRequestParams
): Promise<ProductsListResponse> {
  const response = await fetch(buildProductsUrl(endpoint, params), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const json = (await response.json()) as unknown

  if (!response.ok) {
    const message =
      typeof json === 'object' && json !== null && 'message' in json
        ? String(
            (json as { message?: string }).message ??
              i18n.t('errors.productsLoadFailed')
          )
        : i18n.t('errors.productsLoadFailed')

    throw new ProductsApiError(message)
  }

  return parseProductsResponse(json, i18n.t('errors.productsInvalidList'))
}

export async function getProducts(
  params: ProductsRequestParams
): Promise<ProductsListResponse> {
  return fetchProducts(PRODUCTS_ENDPOINT, params)
}

export async function searchProducts(
  params: ProductsSearchRequestParams
): Promise<ProductsListResponse> {
  return fetchProducts(SEARCH_ENDPOINT, params)
}
