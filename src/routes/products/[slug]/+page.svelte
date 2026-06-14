<script lang="ts">
  import type { PageData } from './$types'
  import { formatPrice } from '$lib/utils'
  import AddToCartButton from '$lib/components/add-to-cart-button.svelte'
  import BuyNowButton from '$lib/components/buy-now-button.svelte'
  import Breadcrumbs from '$lib/components/breadcrumbs.svelte'
  import type { Product } from '$lib/types'

  let { data }: { data: PageData } = $props()
  let product = $derived(data.product as Product | null)
  let loadError = $derived(data.loadError as boolean | undefined)
  let quantity = $state(1)
</script>

<svelte:head>
  {#if product}
    <title>{product.name} — Whatever Ecommerce</title>
    <meta name="description" content={product.description || `${product.name} por ${formatPrice(product.price)}`} />
    <meta property="og:title" content={product.name} />
    <meta property="og:description" content={product.description || `${product.name} — Whatever Ecommerce`} />
    {#if product.images?.[0]}
      <meta property="og:image" content={product.images[0]} />
    {/if}
    <meta property="og:type" content="product" />
  {/if}
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12">
  {#if product}
    <Breadcrumbs crumbs={[{ label: 'Produtos', href: '/products' }, { label: product.name }]} />

    <div class="grid gap-12 md:grid-cols-2">
      <div class="flex aspect-square items-center justify-center rounded-lg bg-muted overflow-hidden">
        {#if product.images?.[0]}
          <img src={product.images[0]} alt={product.name} width="600" height="600" class="h-full w-full rounded-lg object-cover" />
        {:else}
          <svg class="h-24 w-24 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        {/if}
      </div>
      <div>
        <h1 class="mb-2 text-3xl font-bold break-words">{product.name}</h1>
        {#if product.category}
          <p class="mb-4 text-sm text-muted-foreground">{product.category}</p>
        {/if}
        <p class="mb-6 text-2xl font-semibold">{formatPrice(product.price)}</p>

        {#if product.inventory > 0 && product.inventory <= 5}
          <p class="mb-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Apenas {product.inventory} em estoque
          </p>
        {/if}

        <p class="mb-6 leading-relaxed text-muted-foreground">{product.description}</p>

        {#if product.inventory > 0}
          <div class="mb-4 flex items-center gap-3">
            <label for="qty" class="text-sm font-medium">Quantidade</label>
            <div class="flex items-center gap-1">
              <button
                onclick={() => { if (quantity > 1) quantity-- }}
                class="flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm cursor-pointer hover:bg-muted transition-colors"
                disabled={quantity <= 1}
              >−</button>
              <input
                id="qty"
                type="number"
                bind:value={quantity}
                min="1"
                max={product.inventory}
                class="h-9 w-16 rounded-md border border-border px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onclick={() => { if (quantity < product.inventory) quantity++ }}
                class="flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm cursor-pointer hover:bg-muted transition-colors"
                disabled={quantity >= product.inventory}
              >+</button>
            </div>
          </div>
        {/if}

        <p class="mb-6 text-sm text-muted-foreground">
          {product.inventory > 0 ? `${product.inventory} em estoque` : 'Fora de estoque'}
        </p>

        <div class="flex flex-col gap-2 sm:flex-row">
          <div class="flex-1">
            <AddToCartButton productId={product.id} {quantity} disabled={product.inventory === 0} />
          </div>
          <BuyNowButton productId={product.id} {quantity} disabled={product.inventory === 0} />
        </div>
      </div>
    </div>
  {:else if loadError}
    <div class="py-16 text-center">
      <p class="text-lg text-red-600">Erro ao carregar o produto.</p>
      <p class="mt-2 text-sm text-muted-foreground">Tente recarregar a página ou volte para <a href="/products" class="text-primary underline underline-offset-4">todos os produtos</a>.</p>
    </div>
  {:else}
    <div class="py-16 text-center">
      <p class="text-lg text-muted-foreground">Produto não encontrado.</p>
      <p class="mt-2 text-sm text-muted-foreground">Este produto pode ter sido removido. <a href="/products" class="text-primary underline underline-offset-4">Ver todos os produtos</a>.</p>
    </div>
  {/if}
</div>
