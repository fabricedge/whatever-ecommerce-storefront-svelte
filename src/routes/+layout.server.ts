import { PUBLIC_API_URL, PUBLIC_STORE_ID } from '$env/static/public'
import type { LayoutServerLoad } from './$types'

type Locale = 'pt' | 'en' | 'es'

function detectLocale(headers: Headers): Locale {
  const accept = headers.get('accept-language') || ''
  for (const part of accept.split(',')) {
    const lang = part.trim().split(';')[0].split('-')[0].toLowerCase()
    if (lang === 'en') return 'en'
    if (lang === 'es') return 'es'
    if (lang === 'pt') return 'pt'
  }
  return 'pt'
}

export const load: LayoutServerLoad = async ({ request, fetch, url }) => {
  const locale = detectLocale(request.headers)
  const host = request.headers.get('host') || ''

  let storeId = url.searchParams.get('store') || ''

  // Priority: PUBLIC_STORE_ID env > ?store= query > Host lookup > default store
  if (PUBLIC_STORE_ID) {
    storeId = PUBLIC_STORE_ID
  }

  if (!storeId && host) {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/stores/lookup?domain=${host}`)
      if (res.ok) {
        const store = await res.json()
        storeId = store.id
      }
    } catch {}
  }

  if (!storeId) {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/stores/default`)
      if (res.ok) {
        const store = await res.json()
        storeId = store.id
      }
    } catch {}
  }

  const seo = {
    siteName: 'Whatever Ecommerce',
    description: 'Whatever Ecommerce — Produtos selecionados para você.'
  }

  let branding: Record<string, string> = {}

  if (storeId) {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/stores/${storeId}/branding`)
      if (res.ok) {
        const data = await res.json()
        branding = data.branding || {}
        seo.siteName = data.store?.name || seo.siteName
      }
    } catch {}
  }

  return { storeId, seo, branding, locale }
}
