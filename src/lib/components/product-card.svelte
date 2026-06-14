<script lang="ts">
  import { formatPrice } from '$lib/utils'
  import type { Product } from '$lib/types'

  let { product }: { product: Product } = $props()
</script>

<a href="/products/{product.slug}" class="group rounded-lg border border-border p-4 transition-shadow hover:shadow-sm">
  <div class="mb-3 flex aspect-square items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
    {#if product.images?.[0]}
      <img src={product.images[0]} alt={product.name} loading="lazy" width="400" height="400" class="h-full w-full rounded-md object-cover" />
    {:else}
      Sem imagem
    {/if}
  </div>
  <h3 class="truncate text-sm font-medium">{product.name}</h3>
  {#if product.category}
    <p class="text-xs text-muted-foreground">{product.category}</p>
  {/if}
  <p class="mt-1 font-semibold">{formatPrice(product.price)}</p>
</a>
