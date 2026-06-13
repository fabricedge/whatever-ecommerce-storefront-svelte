<script lang="ts">
  import type { PageData } from './$types'
  import { formatPrice } from '$lib/utils'
  import AddToCartButton from '$lib/components/add-to-cart-button.svelte'

  let { data }: { data: PageData } = $props()
  let product = $derived(data.product)
</script>

<div class="mx-auto max-w-7xl px-4 py-12">
  {#if product}
    <div class="grid gap-12 md:grid-cols-2">
      <div class="flex aspect-square items-center justify-center rounded-lg bg-muted">
        {#if product.images?.[0]}
          <img src={product.images[0]} alt={product.name} width="600" height="600" class="h-full w-full rounded-lg object-cover" />
        {:else}
          <span class="text-sm text-muted-foreground">Sem imagem</span>
        {/if}
      </div>
      <div>
        <h1 class="mb-2 text-3xl font-bold">{product.name}</h1>
        {#if product.category}
          <p class="mb-4 text-sm text-muted-foreground">{product.category}</p>
        {/if}
        <p class="mb-6 text-2xl font-semibold">{formatPrice(product.price)}</p>
        <p class="mb-6 leading-relaxed text-muted-foreground">{product.description}</p>
        <p class="mb-6 text-sm text-muted-foreground">
          {product.inventory > 0 ? `${product.inventory} em estoque` : 'Fora de estoque'}
        </p>
        <AddToCartButton productId={product.id} disabled={product.inventory === 0} />
      </div>
    </div>
  {:else}
    <p class="text-muted-foreground">Produto não encontrado.</p>
  {/if}
</div>
