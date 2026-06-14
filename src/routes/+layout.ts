import { PUBLIC_API_URL, PUBLIC_STORE_ID } from '$env/static/public'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ fetch }) => {
  const seo = {
    siteName: 'Whatever Ecommerce',
    description: 'Whatever Ecommerce — Produtos selecionados para você.'
  }

  let branding: Record<string, string> = {}

  if (PUBLIC_STORE_ID) {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/stores/${PUBLIC_STORE_ID}/branding`)
      if (res.ok) {
        const data = await res.json()
        branding = data.branding || {}
        seo.siteName = data.store?.name || seo.siteName
      }
    } catch {}
  }

  return {
    seo,
    branding,
  }
}
