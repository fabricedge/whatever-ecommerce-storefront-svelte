import { PUBLIC_API_URL } from '$env/static/public'
import type { PageLoad } from './$types'

export const prerender = true

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`${PUBLIC_API_URL}/api/products?limit=8`)
  const data = await res.json()
  return { products: data.products || [] }
}
