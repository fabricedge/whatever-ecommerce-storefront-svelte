<script lang="ts">
  type Order = {
    id: string
    total: number
    status: string
    createdAt: string
    items: { productId: string; name?: string; quantity: number; price: number }[]
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado'
  }

  let email = $state('')
  let orders = $state<Order[] | null>(null)
  let loading = $state(false)
  let error = $state<string | null>(null)

  async function lookup(e: Event) {
    e.preventDefault()
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
</script>

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

  {#if orders !== null}
    {#if orders.length === 0}
      <p class="text-muted-foreground">Nenhum pedido encontrado para este email.</p>
    {:else}
      <div class="space-y-4">
        {#each orders as order}
          <div class="rounded-lg border border-border p-4">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-medium">Pedido #{order.id.slice(0, 8)}</span>
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {order.status === 'PAID' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            <div class="space-y-1 text-sm text-muted-foreground">
              {#each order.items as item}
                <div class="flex justify-between">
                  <span>{item.name || 'Produto'} × {item.quantity}</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price / 100)}</span>
                </div>
              {/each}
            </div>
            <div class="mt-2 flex justify-between border-t border-border pt-2 text-sm">
              <span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
              <span class="font-semibold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total / 100)}</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
