import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/svelte'

const mockGoto = vi.hoisted(() => vi.fn())
const harnessState = vi.hoisted(() => ({
  items: [] as { productId: string; quantity: number }[],
  cleared: false,
}))

vi.mock('$app/navigation', () => ({ goto: mockGoto }))

vi.mock('$lib/cart.svelte', () => ({
  getCartState: () => ({
    get items() { return harnessState.items },
    clear() { harnessState.cleared = true; harnessState.items = [] },
  }),
}))

import Checkout from './+page.svelte'

const sampleProducts = [
  { id: 'p1', name: 'Produto 1', slug: 'prod-1', price: 1990, images: [], category: null, inventory: 10 },
  { id: 'p2', name: 'Produto 2', slug: 'prod-2', price: 5000, images: [], category: null, inventory: 5 },
]

let mockFetch: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockFetch = vi.fn()
  vi.stubGlobal('fetch', mockFetch)
  mockGoto.mockReset()
  harnessState.items = []
  harnessState.cleared = false
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Checkout page', () => {
  it('redirects to /cart when cart is empty', async () => {
    render(Checkout)
    expect(mockGoto).toHaveBeenCalledWith('/cart')
  })

  it('loads products from cart and shows order summary', async () => {
    harnessState.items = [{ productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 1 }]
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ products: sampleProducts }) })

    const { findByText } = render(Checkout)

    expect(await findByText('Produto 1')).toBeTruthy()
    expect(await findByText('Produto 2')).toBeTruthy()
    expect(await findByText('Qtd: 2')).toBeTruthy()
    expect(await findByText('Qtd: 1')).toBeTruthy()
  })

  it('shows error when email is empty', async () => {
    harnessState.items = [{ productId: 'p1', quantity: 1 }]
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ products: sampleProducts }) })

    const { findByText } = render(Checkout)

    const btn = await findByText('Ir para pagamento')
    await fireEvent.click(btn)

    expect(await findByText('Informe seu email')).toBeTruthy()
  })

  it('calls POST /api/create-checkout-session and redirects to Stripe', async () => {
    harnessState.items = [{ productId: 'p1', quantity: 1 }]
    const origLocation = window.location
    const mockLocation = { href: '' } as any
    Object.defineProperty(window, 'location', { value: mockLocation, writable: true })
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ products: sampleProducts }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ url: 'https://checkout.stripe.com/c/pay_cs_test_123' }) })

    const { findByText, findByPlaceholderText } = render(Checkout)

    const input = await findByPlaceholderText('seu@email.com')
    await fireEvent.input(input, { target: { value: 'test@test.com' } })

    const btn = await findByText('Ir para pagamento')
    await fireEvent.click(btn)

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/create-checkout-session', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', items: [{ productId: 'p1', quantity: 1 }] }),
      }))
      expect(harnessState.cleared).toBe(true)
      expect(mockLocation.href).toBe('https://checkout.stripe.com/c/pay_cs_test_123')
    })

    Object.defineProperty(window, 'location', { value: origLocation, writable: true })
  })

  it('shows error when checkout API fails', async () => {
    harnessState.items = [{ productId: 'p1', quantity: 1 }]
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ products: sampleProducts }) })
      .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({ error: 'Estoque insuficiente' }) })

    const { findByText, findByPlaceholderText } = render(Checkout)

    const input = await findByPlaceholderText('seu@email.com')
    await fireEvent.input(input, { target: { value: 'test@test.com' } })

    const btn = await findByText('Ir para pagamento')
    await fireEvent.click(btn)

    expect(await findByText('Estoque insuficiente')).toBeTruthy()
  })
})
