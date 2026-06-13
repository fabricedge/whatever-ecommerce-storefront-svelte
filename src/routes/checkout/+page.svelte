<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { formatPrice } from '$lib/utils'
  import { getCartState } from '$lib/cart.svelte.js'

  type Product = { id: string; name: string; slug: string; price: number; images: string[]; category: string | null; inventory: number }
  type CheckoutItem = { productId: string; quantity: number; product: Product }

  const cart = getCartState()

  let items = $state<CheckoutItem[]>([])
  let email = $state('')
  let error = $state<string | null>(null)
  let processing = $state(false)

  onMount(() => {
    init()
    async function init() {
      const raw = cart.items
      if (raw.length === 0) { goto('/cart'); return }
      const ids = raw.map((i) => i.productId).join(',')
      try {
        const data = await fetch(`/api/products?ids=${ids}`).then((r) => r.json())
        const productMap = new Map((data.products || []).map((p: Product) => [p.id, p]))
        items = raw.map((ci) => {
          const product = productMap.get(ci.productId)
          return product ? { ...ci, product } : null
        }).filter(Boolean) as CheckoutItem[]
      } catch { items = [] }
    }
  })

  let total = $derived(items.reduce((s, i) => s + i.product.price * i.quantity, 0))

  async function startCheckout() {
    error = null
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

<div class="mx-auto max-w-2xl px-4 py-12">
  <h1 class="mb-8 text-3xl font-bold">Checkout</h1>

  {#if error}
    <div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
  {/if}

  {#if items.length > 0}
    <div class="mb-8 space-y-4">
      {#each items as item}
        <div class="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p class="font-medium">{item.product.name}</p>
            <p class="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
          </div>
          <p class="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
        </div>
      {/each}
      <div class="flex justify-between border-t border-border pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
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

    <button
      onclick={startCheckout}
      disabled={processing}
      class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
    >
      {processing ? 'Redirecionando...' : 'Ir para pagamento'}
    </button>
  {/if}
</div>
