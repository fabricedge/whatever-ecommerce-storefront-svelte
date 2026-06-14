<script lang="ts">
  import ProductCard from '$lib/components/product-card.svelte'
  import type { PageData } from './$types'
  import type { Product } from '$lib/types'
  import { t } from '$lib/i18n/locale.svelte'

  let { data }: { data: PageData } = $props()
  let products = $derived(data.products as Product[])
</script>

<div class="mx-auto max-w-7xl px-4 py-12">
  <section class="mb-12">
    <h1 class="mb-4 text-3xl font-bold break-words md:text-4xl">{t('home.title')}</h1>
    <p class="mb-6 text-lg text-muted-foreground">{t('home.subtitle')}</p>
    <a href="/products" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
      {t('home.cta')}
    </a>
  </section>

  <section>
    <h2 class="mb-6 text-2xl font-semibold">{t('home.newsHeading')}</h2>
    {#if products.length > 0}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {#each products as product (product.id)}
          <ProductCard {product} />
        {/each}
      </div>
    {:else}
      <p class="text-muted-foreground">{t('home.noProducts')}</p>
    {/if}
  </section>
</div>
