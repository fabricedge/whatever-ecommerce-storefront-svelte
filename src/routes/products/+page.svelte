<script lang="ts">
  import ProductCard from '$lib/components/product-card.svelte'
  import type { PageData } from './$types'

  type Product = { id: string; name: string; slug: string; price: number; images: string[]; category: string | null; inventory: number }

  let { data }: { data: PageData } = $props()
  let products = $derived(data.products as Product[])
</script>

<div class="mx-auto max-w-7xl px-4 py-12">
  <h1 class="mb-8 text-3xl font-bold">Todos os Produtos</h1>
  {#if products.length > 0}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each products as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>
  {:else}
    <p class="text-muted-foreground">Nenhum produto disponível.</p>
  {/if}
</div>
