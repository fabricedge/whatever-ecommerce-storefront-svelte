<script lang="ts">
  import { formatPrice } from '$lib/utils'
  import ProductCard from '$lib/components/product-card.svelte'
  import type { PageData } from './$types'

  type Product = { id: string; name: string; slug: string; price: number; images: string[]; category: string | null; inventory: number }

  let { data }: { data: PageData } = $props()
  let products = $derived(data.products as Product[])
</script>

<div class="mx-auto max-w-7xl px-4 py-12">
  <section class="mb-12">
    <h1 class="mb-4 text-4xl font-bold">Whatever Ecommerce</h1>
    <p class="mb-6 text-lg text-muted-foreground">Produtos selecionados para você.</p>
    <a href="/products" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
      Ver todos os produtos
    </a>
  </section>

  <section>
    <h2 class="mb-6 text-2xl font-semibold">Novidades</h2>
    {#if products.length > 0}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {#each products as product (product.id)}
          <ProductCard {product} />
        {/each}
      </div>
    {:else}
      <p class="text-muted-foreground">Nenhum produto encontrado.</p>
    {/if}
  </section>
</div>
