<script lang="ts">
  import { getCartState } from '$lib/cart.svelte.js'
  import { formatPrice } from '$lib/utils'
  import type { MergedCartItem } from '$lib/types'

  let { item, onUpdate }: {
    item: MergedCartItem
    onUpdate?: (productId: string, quantity: number) => void
  } = $props()

  const cart = getCartState()
  const { quantity: initialQty } = item
  let qty = $state(initialQty)
  let localError = $state<string | null>(null)
  let errorTimeout: ReturnType<typeof setTimeout> | undefined

  function showError(msg: string) {
    localError = msg
    clearTimeout(errorTimeout)
    errorTimeout = setTimeout(() => localError = null, 2000)
  }

  function commitQty() {
    if (isNaN(qty)) { qty = item.quantity; return }
    if (qty < 1) { showError('Mínimo: 1'); qty = item.quantity; return }
    if (qty > 1000) { showError('Máximo: 1000'); qty = item.quantity; return }
    cart.updateQuantity(item.productId, qty)
    onUpdate?.(item.productId, qty)
  }

  function decrement() {
    if (qty <= 1) { showError('Mínimo: 1'); return }
    qty = qty - 1
    commitQty()
  }

  function increment() {
    if (qty >= 1000) { showError('Máximo: 1000'); return }
    qty = qty + 1
    commitQty()
  }

  function remove() {
    cart.removeItem(item.productId)
    onUpdate?.(item.productId, 0)
  }
</script>

<div class="rounded-lg border border-border p-4">
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
    <div class="flex items-start gap-4 sm:flex-1 min-w-0">
      <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {#if item.product?.images?.[0]}
          <img src={item.product.images[0]} alt={item.product.name} loading="lazy" width="80" height="80" class="h-full w-full object-cover" />
        {/if}
      </div>
      <div class="min-w-0 flex-1">
        {#if item.product}
          <p class="font-medium break-words">{item.product.name}</p>
          <p class="text-sm text-muted-foreground">{formatPrice(item.product.price)}</p>
        {:else}
          <p class="font-medium text-muted-foreground">Produto não encontrado</p>
          <p class="text-sm text-muted-foreground">Este item pode ter sido removido.</p>
        {/if}
      </div>
    </div>
    <div class="flex items-center justify-between gap-2 sm:gap-4 sm:flex-shrink-0">
      {#if item.product}
        <div class="flex items-center gap-2">
          <button
            onclick={decrement}
            class="flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm cursor-pointer"
          >−</button>
          <div class="relative">
            <input
              type="number"
              min="1"
              max="1000"
              bind:value={qty}
              oninput={() => { if (qty < 1 || qty > 1000 || isNaN(qty)) qty = item.quantity }}
              onchange={commitQty}
              class="w-12 sm:w-16 text-center text-sm rounded-md border border-border px-2 py-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {#if localError}
              <p class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">{localError}</p>
            {/if}
          </div>
          <button
            onclick={increment}
            class="flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm cursor-pointer"
          >+</button>
        </div>
      {:else}
        <span class="w-8 text-center text-sm text-muted-foreground">{item.quantity}</span>
      {/if}
      {#if item.product}
        <p class="w-20 sm:w-24 text-right font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
      {:else}
        <p class="w-20 sm:w-24 text-right text-sm text-muted-foreground">—</p>
      {/if}
      <button
        onclick={remove}
        class="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >Remover</button>
    </div>
  </div>
</div>
