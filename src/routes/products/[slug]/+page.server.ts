import { PUBLIC_API_URL } from '$env/static/public'
import type { PageServerLoad } from './$types'
import { withToken } from '$lib/internal-api'

export const load: PageServerLoad = async ({ parent, params, fetch }) => {
  const authedFetch = withToken(fetch)
  const { storeId } = await parent() as { storeId?: string }
  const headers: Record<string, string> = storeId ? { 'X-Store-Id': storeId } : {}

  try {
    const res = await authedFetch(`${PUBLIC_API_URL}/api/products?slug=${params.slug}`, { headers })
    if (!res.ok) return { product: null, loadError: false }
    let result
    try { result = await res.json() } catch { return { product: null, loadError: true } }
    return { product: result.products?.[0] || null, loadError: false }
  } catch {
    return { product: null, loadError: true }
  }
}
