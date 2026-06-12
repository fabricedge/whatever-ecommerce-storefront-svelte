<script lang="ts">
  import { getCartState } from '$lib/cart.svelte.js'
  import { goto } from '$app/navigation'

  let { productId, disabled = false }: { productId: string; disabled: boolean } = $props()

  const cart = getCartState()

  function handleClick() {
    cart.addItem(productId, 1)
    goto('/cart')
  }
</script>

<button
  onclick={handleClick}
  disabled={disabled}
  class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
>
  Adicionar ao carrinho
</button>
