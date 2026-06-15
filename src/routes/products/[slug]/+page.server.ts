import { PUBLIC_API_URL } from '$env/static/public'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent, params, fetch }) => {
  const { storeId } = await parent() as { storeId?: string }
  const headers: Record<string, string> = storeId ? { 'X-Store-Id': storeId } : {}

  try {
    const res = await fetch(`${PUBLIC_API_URL}/api/products?slug=${params.slug}`, { headers })
    if (!res.ok) return { product: null, loadError: false }
    const result = await res.json()
    return { product: result.products?.[0] || null, loadError: false }
  } catch {
    return { product: null, loadError: true }
  }
}
