<script lang="ts">
  import ProductCard from '$lib/components/product-card.svelte'
  import Breadcrumbs from '$lib/components/breadcrumbs.svelte'
  import type { PageData } from './$types'
  import type { Product, Category, SortOption } from '$lib/types'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { t } from '$lib/i18n/locale.svelte'

  let { data }: { data: PageData } = $props()

  let products = $derived(data.products as Product[])
  let count = $derived(data.count as number)
  let categories = $derived(data.categories as Category[])
  let currentSearch = $derived(data.search as string)
  let currentCategory = $derived(data.category as string)
  let currentSort = $derived(data.sort as SortOption)
  let currentOffset = $derived(data.offset as number)
  let limit = $derived(data.limit as number)

  let totalPages = $derived(Math.ceil(count / limit))
  let currentPage = $derived(Math.floor(currentOffset / limit) + 1)

  let searchValue = $state(currentSearch)

  function buildUrl(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams()
    const search = params.search ?? currentSearch
    const category = params.category ?? currentCategory
    const sort = params.sort ?? currentSort
    const offset = params.offset ?? String(currentOffset)
    if (search) sp.set('search', search)
    if (category) sp.set('category', category)
    if (sort && sort !== 'newest') sp.set('sort', sort)
    if (offset && offset !== '0') sp.set('offset', offset)
    const qs = sp.toString()
    return `/products${qs ? '?' + qs : ''}`
  }

  function handleSearch() {
    goto(buildUrl({ search: searchValue, offset: '0' }))
  }

  function handleCategoryChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value
    goto(buildUrl({ category: value || undefined, offset: '0' }))
  }

  function handleSortChange(e: Event) {
    goto(buildUrl({ sort: (e.target as HTMLSelectElement).value, offset: '0' }))
  }

  function goToPage(page: number) {
    goto(buildUrl({ offset: String((page - 1) * limit) }))
  }

  let loading = $state(true)
  $effect(() => {
    data
    loading = false
  })
</script>

<svelte:head>
  <title>{currentSearch ? `"${currentSearch}" — ` : ''}{t('products.pageTitle')}</title>
  <meta name="description" content={t('products.pageDescription')} />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12">
  <Breadcrumbs crumbs={[{ label: t('products.title') }]} />

<h1 class="mb-6 text-3xl font-bold">{t('products.allProducts')}</h1>

  <div class="mb-6 flex flex-col gap-4 sm:flex-row">
    <form onsubmit={(e) => { e.preventDefault(); handleSearch() }} class="flex-1">
      <div class="relative">
        <input
          type="text"
          bind:value={searchValue}
          placeholder={t('products.searchPlaceholder')}
          class="w-full rounded-md border border-border px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </form>

    <select
      value={currentCategory}
      onchange={handleCategoryChange}
      class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-48"
    >
      <option value="">{t('products.allCategories')}</option>
      {#each categories as cat}
        <option value={cat.name}>{cat.name} ({cat.productCount})</option>
      {/each}
    </select>

    <select
      value={currentSort}
      onchange={handleSortChange}
      class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-40"
    >
      <option value="newest">{t('products.newest')}</option>
      <option value="price_asc">{t('products.priceAsc')}</option>
      <option value="price_desc">{t('products.priceDesc')}</option>
      <option value="name_asc">{t('products.nameAsc')}</option>
    </select>
  </div>

  {#if loading}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each Array(8) as _}
        <div class="animate-pulse rounded-lg border border-border p-4">
          <div class="mb-3 aspect-square rounded-md bg-muted" />
          <div class="mb-2 h-4 w-3/4 rounded bg-muted" />
          <div class="mb-1 h-3 w-1/2 rounded bg-muted" />
          <div class="h-4 w-1/3 rounded bg-muted" />
        </div>
      {/each}
    </div>
  {:else if products.length > 0}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each products as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>

    {#if totalPages > 1}
      <div class="mt-8 flex flex-wrap items-center justify-center gap-2">
        <button
          onclick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          class="inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {t('products.previous')}
        </button>

        {#each Array(totalPages) as _, i}
          {#if Math.abs(i + 1 - currentPage) <= 2 || i === 0 || i === totalPages - 1}
            {#if i > 0 && Math.abs(i + 1 - currentPage) > 2 && Math.abs(i - currentPage) > 2}
              <span class="text-muted-foreground">...</span>
            {:else}
              <button
                onclick={() => goToPage(i + 1)}
                class="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors cursor-pointer {i + 1 === currentPage ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}"
              >
                {i + 1}
              </button>
            {/if}
          {/if}
        {/each}

        <button
          onclick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          class="inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {t('products.next')}
        </button>
      </div>
    {/if}
  {:else}
    <div class="py-16 text-center">
      <svg class="mx-auto mb-4 h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <p class="text-lg text-muted-foreground">{t('products.noProducts')}</p>
      {#if currentSearch || currentCategory}
        <a href="/products" class="mt-2 inline-block text-sm font-medium text-primary underline underline-offset-4">{t('products.clearFilters')}</a>
      {/if}
    </div>
  {/if}
</div>
