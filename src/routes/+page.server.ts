import { PUBLIC_API_URL } from '$env/static/public'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent, fetch }) => {
  const { storeId } = await parent() as { storeId?: string }

  try {
    const res = await fetch(`${PUBLIC_API_URL}/api/products?limit=8`, {
      headers: storeId ? { 'X-Store-Id': storeId } : {}
    })
    if (!res.ok) return { products: [] }
    const result = await res.json() as { products?: unknown[] }
    return { products: result.products || [] }
  } catch {
    return { products: [] }
  }
}
