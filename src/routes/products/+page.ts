import { PUBLIC_API_URL } from '$env/static/public'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`${PUBLIC_API_URL}/api/products`)
  const data = await res.json()
  return { products: data.products || [] }
}
