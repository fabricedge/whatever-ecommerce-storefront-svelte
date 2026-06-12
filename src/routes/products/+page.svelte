<script lang="ts">
  import { onMount } from 'svelte'
  import { api } from '$lib/api'
  import ProductCard from '$lib/components/product-card.svelte'

  type Product = { id: string; name: string; slug: string; price: number; images: string[]; category: string | null; inventory: number }

  let products = $state<Product[]>([])
  let loading = $state(true)

  onMount(() => {
    api('/api/products')
      .then((data) => { products = data.products || [] })
      .catch(() => { products = [] })
      .finally(() => { loading = false })
  })
</script>

<div class="mx-auto max-w-7xl px-4 py-12">
  <h1 class="mb-8 text-3xl font-bold">Todos os Produtos</h1>
  {#if loading}
    <p class="text-muted-foreground">Carregando...</p>
  {:else if products.length > 0}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each products as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>
  {:else}
    <p class="text-muted-foreground">Nenhum produto disponível.</p>
  {/if}
</div>
