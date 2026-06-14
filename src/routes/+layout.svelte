<script lang="ts">
  import '../app.css'
  import Header from '$lib/components/header.svelte'
  import Footer from '$lib/components/footer.svelte'
  import Toast from '$lib/components/toast.svelte'
  import { setAuthState } from '$lib/auth.svelte.js'
  import { setCartState } from '$lib/cart.svelte.js'
  import { navigating } from '$app/stores'

  let { children, data } = $props()

  setAuthState()
  setCartState()

  let loading = $derived($navigating)

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

<a href="#main-content" class="skip-link fixed left-4 top-4 z-50 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary">
  Pular para o conteúdo
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
