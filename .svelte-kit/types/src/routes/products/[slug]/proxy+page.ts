// @ts-nocheck
import { PUBLIC_API_URL } from '$env/static/public'
import type { PageLoad } from './$types'

export const load = async ({ params, fetch }: Parameters<PageLoad>[0]) => {
  const res = await fetch(`${PUBLIC_API_URL}/api/products?slug=${params.slug}`)
  const data = await res.json()
  return { product: data.products?.[0] || null }
}
