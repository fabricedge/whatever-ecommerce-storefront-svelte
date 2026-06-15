import { PUBLIC_API_URL } from '$env/static/public'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent, fetch, url }) => {
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
    fetch(`${PUBLIC_API_URL}/api/products?${params}`, { headers }),
    fetch(`${PUBLIC_API_URL}/api/products/categories`, { headers })
  ])

  const productsData = await productsRes.json()
  const categoriesData = await categoriesRes.json()

  let products = productsData.products || []
  const count = productsData.count || 0

  if (sort === 'price_asc') products = [...products].sort((a: any, b: any) => a.price - b.price)
  else if (sort === 'price_desc') products = [...products].sort((a: any, b: any) => b.price - a.price)
  else if (sort === 'name_asc') products = [...products].sort((a: any, b: any) => a.name.localeCompare(b.name))

  return {
    products,
    count,
    categories: categoriesData.categories || [],
    search,
    category,
    sort,
    offset,
    limit
  }
}
