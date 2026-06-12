<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { loadStripe } from '@stripe/stripe-js'
  import { Elements, PaymentElement } from 'svelte-stripe'
  import { STRIPE_KEY } from '$lib/constants'
  import { formatPrice } from '$lib/utils'
  import { getCartState } from '$lib/cart.svelte.js'

  type Product = { id: string; name: string; slug: string; price: number; images: string[]; category: string | null; inventory: number }
  type CheckoutItem = { productId: string; quantity: number; product: Product }

  const cart = getCartState()

  let items = $state<CheckoutItem[]>([])
  let email = $state('')
  let clientSecret = $state<string | null>(null)
  let error = $state<string | null>(null)
  let processing = $state(false)
  let confirming = $state(false)
  let stripe: any = $state(null)
  let elements: any = $state(null)

  onMount(async () => {
    const raw = cart.items
    if (raw.length === 0) { goto('/cart'); return }
    const ids = raw.map((i) => i.productId).join(',')
    try {
      const data = await fetch(`/api/products?ids=${ids}`).then((r) => r.json())
      const productMap = new Map((data.products || []).map((p: Product) => [p.id, p]))
      items = raw.map((ci) => {
        const product = productMap.get(ci.productId)
        return product ? { ...ci, product } : null
      }).filter(Boolean) as CheckoutItem[]
    } catch { items = [] }
    stripe = await loadStripe(STRIPE_KEY)
  })

  let total = $derived(items.reduce((s, i) => s + i.product.price * i.quantity, 0))

  async function startCheckout() {
    error = null
    if (!email) { error = 'Informe seu email'; return }
    const raw = cart.items
    if (raw.length === 0) { goto('/cart'); return }
    processing = true
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, items: raw })
      })
      const data = await res.json()
      if (!res.ok) { error = data.error || 'Erro ao iniciar checkout'; processing = false; return }
      clientSecret = data.clientSecret
      cart.clear()
    } catch (err: any) {
      error = err.error || 'Erro ao iniciar checkout'
    }
    processing = false
  }

  async function confirmPayment() {
    confirming = true
    error = null
    if (!stripe || !clientSecret) { error = 'Stripe não carregado'; confirming = false; return }
    try {
      const { paymentIntent, error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: window.location.origin + '/account/orders' },
        redirect: 'if_required'
      })
      if (confirmError) {
        error = confirmError.message || 'Erro no pagamento'
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        goto('/account/orders')
      }
    } catch (err: any) {
      error = err.message || 'Erro no pagamento'
    }
    confirming = false
  }
</script>

<div class="mx-auto max-w-2xl px-4 py-12">
  <h1 class="mb-8 text-3xl font-bold">Checkout</h1>

  {#if error}
    <div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
  {/if}

  {#if clientSecret}
    <div class="rounded-lg border border-border p-6">
      <div class="mb-6">
        <h2 class="mb-2 text-lg font-semibold">Resumo do Pedido</h2>
        <div class="space-y-2">
          {#each items as item}
            <div class="flex justify-between text-sm">
              <span>{item.product.name} × {item.quantity}</span>
              <span>{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          {/each}
        </div>
        <div class="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <Elements {stripe} options={{ clientSecret }} bind:elements>
        <PaymentElement />
        <div class="mt-6">
          <button
            onclick={confirmPayment}
            disabled={confirming}
            class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {confirming ? 'Confirmando...' : 'Pagar'}
          </button>
        </div>
      </Elements>
    </div>
  {:else if items.length > 0}
    <div class="mb-8 space-y-4">
      {#each items as item}
        <div class="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p class="font-medium">{item.product.name}</p>
            <p class="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
          </div>
          <p class="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
        </div>
      {/each}
      <div class="flex justify-between border-t border-border pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>

    <div class="mb-4">
      <label for="email" class="mb-1 block text-sm font-medium">Email para confirmação</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="seu@email.com"
      />
    </div>

    <button
      onclick={startCheckout}
      disabled={processing}
      class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
    >
      {processing ? 'Processando...' : 'Ir para pagamento'}
    </button>
  {/if}
</div>
