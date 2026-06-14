<script lang="ts">
  import { getCartState } from '$lib/cart.svelte.js'
  import { getToastState } from '$lib/toast.svelte.js'

  let { productId, quantity = 1, disabled = false }: { productId: string; quantity?: number; disabled?: boolean } = $props()

  const cart = getCartState()
  const toast = getToastState()
  let added = $state(false)

  function handleClick() {
    cart.addItem(productId, quantity)
    added = true
    toast.success('Adicionado ao carrinho!')
    setTimeout(() => added = false, 2000)
  }
</script>

<button
  onclick={handleClick}
  disabled={disabled}
  class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer {added ? 'bg-green-600' : ''}"
>
  {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
</button>
