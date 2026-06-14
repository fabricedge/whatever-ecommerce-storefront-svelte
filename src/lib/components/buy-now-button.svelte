<script lang="ts">
  import { getCartState } from '$lib/cart.svelte.js'
  import { goto } from '$app/navigation'

  let { productId, name, price, image, quantity = 1, disabled = false }: { productId: string; name: string; price: number; image?: string; quantity?: number; disabled?: boolean } = $props()

  const cart = getCartState()
  let clicked = $state(false)

  function handleBuyNow() {
    cart.addItem(productId, quantity, { name, price, image })
    clicked = true
    goto('/cart')
  }
</script>

<button
  onclick={handleBuyNow}
  disabled={disabled}
  class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-primary px-6 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
>
  {#if clicked}
    <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  {:else}
    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  {/if}
  Comprar agora
</button>
