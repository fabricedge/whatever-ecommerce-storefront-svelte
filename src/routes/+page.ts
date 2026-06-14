import { PUBLIC_API_URL } from '$env/static/public'
import type { PageLoad } from './$types'

export const config = {
  isr: { expiration: 60 }
}

export const load: PageLoad = async ({ data, fetch }) => {
  const storeId = (data as any)?.storeId || ''

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
