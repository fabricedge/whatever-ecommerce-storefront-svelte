import { PUBLIC_API_URL } from '$env/static/public'
import type { PageServerLoad } from './$types'
import { withToken } from '$lib/internal-api'

export const load: PageServerLoad = async ({ parent, fetch }) => {
  const authedFetch = withToken(fetch)
  const { storeId } = await parent() as { storeId?: string }

  try {
    const res = await authedFetch(`${PUBLIC_API_URL}/api/products?limit=8`, {
      headers: storeId ? { 'X-Store-Id': storeId } : {}
    })
    if (!res.ok) return { products: [] }
    let result
    try { result = await res.json() } catch { return { products: [] } }
    return { products: (result as any).products || [] }
  } catch {
    return { products: [] }
  }
}
