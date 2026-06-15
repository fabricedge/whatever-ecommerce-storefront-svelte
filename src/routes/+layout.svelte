<script lang="ts">
  import '../app.css'
  import Header from '$lib/components/header.svelte'
  import Footer from '$lib/components/footer.svelte'
  import Toast from '$lib/components/toast.svelte'
  import { PUBLIC_API_URL, PUBLIC_STORE_ID } from '$env/static/public'
  import { getStoreId, setStoreId } from '$lib/api'
  import { setAuthState } from '$lib/auth.svelte.js'
  import { setCartState } from '$lib/cart.svelte.js'
  import { onMount } from 'svelte'
  import { navigating } from '$app/stores'
  import { getLocale, setLocale, t } from '$lib/i18n/locale.svelte'

  let { children, data } = $props()

  {
    const hasExplicit = (() => { try { return ['pt','en','es'].includes(localStorage.getItem('locale') || '') } catch { return false } })()
    if (data?.locale && !hasExplicit) setLocale(data.locale as 'pt' | 'en' | 'es')
  }

  const auth = setAuthState()
  const cart = setCartState()

  $effect(() => {
    if (data?.storeId) setStoreId(data.storeId)
  })

  // Token gate for independent storefronts
  let tokenCode = $state('')
  let tokenError = $state('')
  let tokenChecking = $state(true)
  let tokenVerified = $state(false)

  onMount(async () => {
    const sid = data?.storeId || PUBLIC_STORE_ID || ''
    if (!sid) {
      tokenChecking = false
      tokenVerified = true
      return
    }
    // Runtime check: does this store have a token?
    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/stores/${sid}/has-token`)
      const json = await res.json()
      if (!json.hasToken) {
        tokenChecking = false
        tokenVerified = true
        return
      }
    } catch {
      tokenChecking = false
      tokenVerified = true
      return
    }
    const stored = (() => { try { return localStorage.getItem('storefront_token') } catch { return null } })()
    if (stored === 'verified') {
      tokenChecking = false
      tokenVerified = true
    } else {
      tokenChecking = false
    }
  })

  async function verifyToken() {
    if (!tokenCode.trim() || tokenCode.length < 4) return
    tokenError = ''
    const sid = getStoreId() || PUBLIC_STORE_ID || ''
    if (!sid) { tokenError = 'Loja não identificada'; return }
    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/store-requests/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId: sid, code: tokenCode.trim() }),
      })
      const data = await res.json()
      if (data.valid) {
        try { localStorage.setItem('storefront_token', 'verified') } catch {}
        tokenVerified = true
      } else {
        tokenError = 'Código inválido'
      }
    } catch {
      tokenError = 'Erro ao verificar código'
    }
  }

  let loading = $derived($navigating)

  onMount(() => {
    function handleCartSync() {
      cart.mergeToDB()
    }
    window.addEventListener('cart:sync', handleCartSync)
    return () => window.removeEventListener('cart:sync', handleCartSync)
  })

  let storeNotFound = $derived(!data?.storeId && !data?.branding?.primary_color)
  let branding = $derived(data.branding || {})

  $effect(() => {
    const root = document.documentElement
    if (branding.primary_color) root.style.setProperty('--brand-primary', branding.primary_color)
    if (branding.secondary_color) root.style.setProperty('--brand-secondary', branding.secondary_color)
    if (branding.logo_url) root.style.setProperty('--brand-logo-url', `url(${branding.logo_url})`)
    if (branding.favicon_url) {
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (link) link.href = branding.favicon_url
    }
    if (branding.font_family) root.style.setProperty('--brand-font-family', branding.font_family)
  })
</script>

{#if tokenChecking}
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
  </div>
{:else if !tokenVerified}
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-sm w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <h1 class="text-xl font-bold mb-2">Acesso Restrito</h1>
      <p class="text-sm text-gray-500 mb-6">Digite o código de acesso para entrar na loja</p>
      <form onsubmit={(e) => { e.preventDefault(); verifyToken() }} class="space-y-4">
        <input
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="6"
          bind:value={tokenCode}
          placeholder="000000"
          class="w-full text-center text-2xl tracking-[0.5em] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        {#if tokenError}
          <p class="text-sm text-red-600">{tokenError}</p>
        {/if}
        <button
          type="submit"
          disabled={tokenCode.trim().length < 4}
          class="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
{:else if storeNotFound}
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-sm w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <h1 class="text-xl font-bold mb-2">{t('layout.storeNotFoundTitle')}</h1>
      <p class="text-sm text-gray-500 mb-6">{t('layout.storeNotFoundDesc')}</p>
    </div>
  </div>
{:else}
  <a href="#main-content" class="skip-link fixed left-4 top-4 z-50 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary">
    {t('layout.skipLink')}
  </a>

  {#if loading}
    <div class="fixed top-0 left-0 z-50 h-0.5 bg-primary animate-loading-bar" />
  {/if}

  <div class="min-h-screen flex flex-col antialiased">
    <Header {branding} />
    <main id="main-content" class="flex-1">{@render children()}</main>
    <Footer />
  </div>

  <Toast />
{/if}
