<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { api } from '$lib/api'
  import { formatPrice } from '$lib/utils'
  import { getCartState } from '$lib/cart.svelte.js'
  import CartItemCard from '$lib/components/cart-item-card.svelte'
  import type { Product, MergedCartItem } from '$lib/types'

  const cart = getCartState()
  let items = $state<MergedCartItem[]>([])
  let loading = $state(true)
  let email = $state('')
  let error = $state<string | null>(null)
  let processing = $state(false)

  async function loadCart() {
    const raw = cart.items
    if (raw.length === 0) {
      items = []
      loading = false
      return
    }
    const ids = raw.map((i) => i.productId).join(',')
    try {
      const data = await api(`/api/products?ids=${ids}`)
      const productMap = new Map((data.products || []).map((p: Product) => [p.id, p]))
      items = raw.map((ci) => ({
        ...ci,
        product: productMap.get(ci.productId) || undefined
      }))
    } catch {
      items = raw.map((ci) => ({ ...ci, product: undefined }))
    }
    loading = false
  }

  onMount(loadCart)

  function handleUpdate(productId: string, qty: number) {
    items = items
      .map(i => i.productId === productId ? { ...i, quantity: qty } : i)
      .filter(i => i.quantity > 0)
  }

  let subtotal = $derived(
    items.reduce((s, i) => s + (i.product ? i.product.price * i.quantity : 0), 0)
  )

  let hasMissingProducts = $derived(items.some((i) => !i.product))

  async function startCheckout() {
    error = null
    if (hasMissingProducts) { error = 'Remova itens não encontrados antes de finalizar.'; return }
    if (!email) { error = 'Informe seu email'; return }
    const raw = cart.items
    if (raw.length === 0) { goto('/cart'); return }
    processing = true
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, items: raw })
      })
      const data = await res.json()
      if (!res.ok) { error = data.error || 'Erro ao iniciar checkout'; processing = false; return }
      sessionStorage.setItem('checkout_email', email)
      window.location.href = data.url
    } catch (err: any) {
      error = err.error || 'Erro ao iniciar checkout'
    }
    processing = false
  }
</script>

<svelte:head>
  <title>Carrinho — Whatever Ecommerce</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
  <h1 class="mb-8 text-3xl font-bold">Carrinho</h1>

  {#if error}
    <div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
  {/if}

  {#if loading}
    <div class="space-y-4">
      {#each Array(2) as _}
        <div class="animate-pulse rounded-lg border border-border p-4">
          <div class="flex gap-4">
            <div class="h-20 w-20 rounded-md bg-muted" />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-1/3 rounded bg-muted" />
              <div class="h-3 w-1/4 rounded bg-muted" />
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else if items.length === 0}
    <div class="py-16 text-center">
      <svg class="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      <p class="mb-2 text-lg font-medium text-muted-foreground">Seu carrinho está vazio</p>
      <p class="mb-6 text-sm text-muted-foreground">Adicione produtos para começar suas compras.</p>
      <a href="/products" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
        Ver produtos
      </a>
    </div>
  {:else}
    <div class="mb-8 space-y-4">
      {#each items as item (item.productId)}
        <CartItemCard {item} onUpdate={handleUpdate} />
      {/each}
    </div>

    <div class="mb-6 rounded-lg border border-border p-4">
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div class="flex justify-between border-t border-border pt-2 text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <label for="email" class="mb-1 block text-sm font-medium">Email para confirmação</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="seu@email.com"
      />
    </div>

    <p class="mb-4 text-sm text-muted-foreground">
      Você será redirecionado para a página de pagamento do Stripe.
    </p>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4">
      <p class="text-lg font-semibold">Total: {formatPrice(subtotal)}</p>
      <button
        onclick={startCheckout}
        disabled={processing || hasMissingProducts}
        class="inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
      >
        {processing ? 'Redirecionando...' : 'Finalizar compra'}
      </button>
    </div>
  {/if}
</div>
