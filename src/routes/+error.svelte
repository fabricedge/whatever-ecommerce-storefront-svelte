<script lang="ts">
  import { page } from '$app/stores'
  import Header from '$lib/components/header.svelte'
  import Footer from '$lib/components/footer.svelte'
  import { setAuthState } from '$lib/auth.svelte.js'
  import { setCartState } from '$lib/cart.svelte.js'
  import { setUIState } from '$lib/stores.svelte.js'

  setAuthState()
  setCartState()
  setUIState()

  let status = $derived($page.status)
  let message = $derived(
    status === 404 ? 'Página não encontrada' :
    status === 403 ? 'Acesso negado' :
    'Erro interno do servidor'
  )
  let detail = $derived(
    status === 404 ? 'A página que você procura não existe ou foi removida.' :
    status === 403 ? 'Você não tem permissão para acessar esta página.' :
    'Ocorreu um erro inesperado. Tente novamente mais tarde.'
  )
</script>

<svelte:head>
  <title>{status} — Whatever Ecommerce</title>
</svelte:head>

<div class="min-h-screen flex flex-col antialiased">
  <Header />
  <main class="flex-1 flex items-center justify-center">
    <div class="mx-auto max-w-md px-4 py-24 text-center">
      <p class="mb-4 text-7xl font-bold text-muted-foreground/30">{status}</p>
      <h1 class="mb-2 text-2xl font-bold">{message}</h1>
      <p class="mb-8 text-muted-foreground">{detail}</p>
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a href="/" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          Página inicial
        </a>
        <a href="/products" class="inline-flex h-10 items-center justify-center rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-muted">
          Ver produtos
        </a>
      </div>
    </div>
  </main>
  <Footer />
</div>
