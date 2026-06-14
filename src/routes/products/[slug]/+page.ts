import { PUBLIC_API_URL } from '$env/static/public'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const res = await fetch(`${PUBLIC_API_URL}/api/products?slug=${params.slug}`)
    if (!res.ok) return { product: null, loadError: false }
    const data = await res.json()
    return { product: data.products?.[0] || null, loadError: false }
  } catch {
    return { product: null, loadError: true }
  }
}
