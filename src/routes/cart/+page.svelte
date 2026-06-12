<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api'
  import { formatPrice } from '$lib/utils'
  import { getCartState } from '$lib/cart.svelte.js'
  import CartItemCard from '$lib/components/cart-item-card.svelte'

  type Product = { id: string; name: string; slug: string; price: number; images: string[]; category: string | null; inventory: number }
  type MergedItem = { productId: string; quantity: number; product: Product }

  const cart = getCartState()
  let items = $state<MergedItem[]>([])
  let loading = $state(true)

  async function loadCart() {
    loading = true
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
      items = raw
        .map((ci) => {
          const product = productMap.get(ci.productId)
          return product ? { ...ci, product } : null
        })
        .filter(Boolean) as MergedItem[]
    } catch {
      items = []
    }
    loading = false
  }

  onMount(loadCart)

  let total = $derived(items.reduce((s, i) => s + i.product.price * i.quantity, 0))
</script>

<div class="mx-auto max-w-4xl px-4 py-12">
  <h1 class="mb-8 text-3xl font-bold">Carrinho</h1>

  {#if loading}
    <p class="text-muted-foreground">Carregando...</p>
  {:else if items.length === 0}
    <div class="py-12 text-center">
      <p class="mb-4 text-muted-foreground">Seu carrinho está vazio.</p>
      <a href="/products" class="text-sm font-medium text-primary underline underline-offset-4">Ver produtos</a>
    </div>
  {:else}
    <div class="mb-8 space-y-4">
      {#each items as item (item.productId)}
        <CartItemCard {item} onRefresh={loadCart} />
      {/each}
    </div>
    <div class="flex items-center justify-between border-t border-border pt-4">
      <p class="text-lg font-semibold">Total: {formatPrice(total)}</p>
      <a href="/checkout" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
        Finalizar compra
      </a>
    </div>
  {/if}
</div>
