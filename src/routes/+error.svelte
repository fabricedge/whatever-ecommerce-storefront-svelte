<script lang="ts">
  import { page } from '$app/stores'
  import Footer from '$lib/components/footer.svelte'
  import { setAuthState } from '$lib/auth.svelte.js'
  import { setCartState } from '$lib/cart.svelte.js'
  import { setUIState } from '$lib/stores.svelte.js'
  import { t } from '$lib/i18n/locale.svelte'

  setAuthState()
  setCartState()
  setUIState()

  let status = $derived($page.status)
  let message = $derived(
    status === 404 ? t('error.notFound') :
    status === 403 ? t('error.forbidden') :
    t('error.serverError')
  )
  let detail = $derived(
    status === 404 ? t('error.notFoundDetail') :
    status === 403 ? t('error.forbiddenDetail') :
    t('error.serverErrorDetail')
  )
</script>

<svelte:head>
  <title>{t('error.title', { status })}</title>
</svelte:head>

<div class="min-h-screen flex flex-col antialiased">
  <main class="flex-1 flex items-center justify-center">
    <div class="mx-auto max-w-md px-4 py-24 text-center">
      <p class="mb-4 text-7xl font-bold text-muted-foreground/30">{status}</p>
      <h1 class="mb-2 text-2xl font-bold">{message}</h1>
      <p class="mb-8 text-muted-foreground">{detail}</p>
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a href="/" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          {t('error.home')}
        </a>
        <a href="/products" class="inline-flex h-10 items-center justify-center rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-muted">
          {t('error.viewProducts')}
        </a>
      </div>
    </div>
  </main>
  <Footer />
</div>
