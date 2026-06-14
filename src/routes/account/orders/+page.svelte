<script lang="ts">
  import { onMount } from 'svelte'
  import type { Order, OrderStatus } from '$lib/types'
  import { ORDER_STATUS_LABELS } from '$lib/types'
  import { formatPrice } from '$lib/utils'

  const STEPS: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED']

  let email = $state('')
  let orders = $state<Order[] | null>(null)
  let loading = $state(false)
  let error = $state<string | null>(null)

  onMount(() => {
    const params = new URLSearchParams(window.location.search)
    const saved = sessionStorage.getItem('checkout_email')
    if (saved) {
      email = saved
      sessionStorage.removeItem('checkout_email')
      const fakeEvent = { preventDefault: () => {} } as Event
      lookup(fakeEvent)
    }
  })

  async function lookup(e: Event) {
    e.preventDefault()
    if (!email) { error = 'Informe seu email'; return }
    error = null
    loading = true
    orders = null
    try {
      const res = await fetch(`/api/orders/lookup?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (!res.ok) { error = data.error || 'Erro ao buscar pedidos'; return }
      orders = data.orders || []
    } catch {
      error = 'Erro ao buscar pedidos'
    }
    loading = false
  }

  function statusIndex(status: OrderStatus) {
    return STEPS.indexOf(status)
  }
</script>

<svelte:head>
  <title>Meus Pedidos — Whatever Ecommerce</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-12">
  <h1 class="mb-8 text-3xl font-bold">Meus Pedidos</h1>

  <form onsubmit={lookup} class="mb-8 flex gap-2">
    <input
      type="email"
      bind:value={email}
      placeholder="Seu email"
      required
      class="flex-1 rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    />
    <button
      type="submit"
      disabled={loading}
      class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
    >
      {loading ? 'Buscando...' : 'Buscar'}
    </button>
  </form>

  {#if error}
    <div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
  {/if}

  {#if loading}
    <div class="space-y-4">
      {#each Array(2) as _}
        <div class="animate-pulse rounded-lg border border-border p-4">
          <div class="mb-3 h-4 w-1/3 rounded bg-muted" />
          <div class="space-y-2">
            <div class="h-3 w-full rounded bg-muted" />
            <div class="h-3 w-3/4 rounded bg-muted" />
          </div>
        </div>
      {/each}
    </div>
  {:else if orders !== null}
    {#if orders.length === 0}
      <div class="py-16 text-center">
        <svg class="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-muted-foreground">Nenhum pedido encontrado para este email.</p>
      </div>
    {:else}
      <div class="space-y-6">
        {#each orders as order}
          <div class="rounded-lg border border-border p-4">
            <div class="mb-3 flex items-center justify-between">
              <span class="text-sm font-medium">Pedido #{order.id.slice(0, 8)}</span>
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {order.status === 'PAID' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
                {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
              </span>
            </div>

            {#if order.status !== 'CANCELLED'}
              <div class="mb-4 flex items-center gap-0.5 sm:gap-1 overflow-x-auto">
                {#each STEPS as step, i}
                  <div class="flex items-center flex-shrink-0">
                    <div class="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-xs font-medium {statusIndex(order.status as OrderStatus) >= i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">
                      {statusIndex(order.status as OrderStatus) > i ? '✓' : i + 1}
                    </div>
                    {#if i < STEPS.length - 1}
                      <div class="h-0.5 w-4 sm:w-8 {statusIndex(order.status as OrderStatus) > i ? 'bg-primary' : 'bg-muted'}" />
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}

            <div class="space-y-1 text-sm text-muted-foreground">
              {#each order.items as item}
                <div class="flex justify-between gap-4">
                  <span class="truncate">{item.product?.name || 'Produto'} × {item.quantity}</span>
                  <span class="flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              {/each}
            </div>

            {#if order.shippingAddress}
              <div class="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
                <p class="font-medium text-foreground">Endereço de entrega</p>
                {#if order.shippingName}<p>{order.shippingName}</p>{/if}
                <p>{order.shippingAddress}</p>
                {#if order.shippingCity && order.shippingState}
                  <p>{order.shippingCity}{#if order.shippingZip} — {order.shippingZip}{/if}</p>
                {/if}
                {#if order.shippingPhone}<p>{order.shippingPhone}</p>{/if}
              </div>
            {/if}

            <div class="mt-3 flex justify-between border-t border-border pt-3 text-sm">
              <span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
              <span class="font-semibold">{formatPrice(order.total)}</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
