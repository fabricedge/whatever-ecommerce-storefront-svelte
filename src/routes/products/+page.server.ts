import { PUBLIC_API_URL } from '$env/static/public'
import type { PageServerLoad } from './$types'
import { withToken } from '$lib/internal-api'

export const load: PageServerLoad = async ({ parent, fetch, url }) => {
  const authedFetch = withToken(fetch)
  const { storeId } = await parent() as { storeId?: string }
  const headers: Record<string, string> = storeId ? { 'X-Store-Id': storeId } : {}

  const search = url.searchParams.get('search') || ''
  const category = url.searchParams.get('category') || ''
  const sort = url.searchParams.get('sort') || 'newest'
  const offset = parseInt(url.searchParams.get('offset') || '0', 10)
  const limit = 20

  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('offset', String(offset))
  if (search) params.set('search', search)
  if (category) params.set('category', category)

  const [productsRes, categoriesRes] = await Promise.all([
    authedFetch(`${PUBLIC_API_URL}/api/products?${params}`, { headers }),
    authedFetch(`${PUBLIC_API_URL}/api/products/categories`, { headers })
  ])

  let products: any[] = []
  let count = 0
  let categories: any[] = []

  if (productsRes.ok) {
    try {
      const data = await productsRes.json()
      products = data.products || []
      count = data.count || 0
    } catch {}
  }

  if (categoriesRes.ok) {
    try {
      const data = await categoriesRes.json()
      categories = data.categories || []
    } catch {}
  }

  if (sort === 'price_asc') products = [...products].sort((a: any, b: any) => a.price - b.price)
  else if (sort === 'price_desc') products = [...products].sort((a: any, b: any) => b.price - a.price)
  else if (sort === 'name_asc') products = [...products].sort((a: any, b: any) => a.name.localeCompare(b.name))

  return {
    products,
    count,
    categories,
    search,
    category,
    sort,
    offset,
    limit
  }
}
