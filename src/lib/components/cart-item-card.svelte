<script lang="ts">
  import { getCartState } from '$lib/cart.svelte.js'
  import { formatPrice } from '$lib/utils'

  type Product = { id: string; name: string; slug: string; price: number; images: string[]; category: string | null; inventory: number }
  type CartItem = { productId: string; quantity: number }

  let { item, onRefresh }: { item: CartItem & { product: Product }; onRefresh: () => void } = $props()

  const cart = getCartState()
</script>

<div class="flex items-center gap-4 rounded-lg border border-border p-4">
  <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
    {#if item.product.images?.[0]}
      <img src={item.product.images[0]} alt={item.product.name} class="h-full w-full object-cover" />
    {/if}
  </div>
  <div class="flex-1">
    <p class="font-medium">{item.product.name}</p>
    <p class="text-sm text-muted-foreground">{formatPrice(item.product.price)}</p>
  </div>
  <div class="flex items-center gap-2">
    <button
      onclick={() => { cart.updateQuantity(item.productId, Math.max(1, item.quantity - 1)); onRefresh() }}
      class="flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm cursor-pointer"
    >−</button>
    <span class="w-8 text-center text-sm">{item.quantity}</span>
    <button
      onclick={() => { cart.updateQuantity(item.productId, item.quantity + 1); onRefresh() }}
      class="flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm cursor-pointer"
    >+</button>
  </div>
  <p class="w-24 text-right font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
  <button
    onclick={() => { cart.removeItem(item.productId); onRefresh() }}
    class="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
  >Remover</button>
</div>
