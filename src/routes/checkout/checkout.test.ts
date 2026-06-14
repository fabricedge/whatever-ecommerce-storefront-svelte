import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/svelte'

vi.mock('$lib/cart.svelte', () => ({
  getCartState: () => ({ items: [] }),
}))

vi.mock('$lib/auth.svelte', () => ({
  getAuthState: () => ({ loading: false, user: null, logout: vi.fn() }),
}))

vi.mock('$lib/stores.svelte', () => ({
  getUIState: () => ({} as any),
}))

import Checkout from './+page.svelte'

afterEach(() => { cleanup() })

describe('Checkout page (cancel)', () => {
  it('shows cancel message', () => {
    const { getByText } = render(Checkout)
    expect(getByText('Pagamento não concluído')).toBeTruthy()
  })

  it('has link back to cart', () => {
    const { getByText } = render(Checkout)
    const link = getByText('Voltar ao carrinho')
    expect(link?.getAttribute('href')).toBe('/cart')
  })

  it('has link to continue shopping', () => {
    const { getByText } = render(Checkout)
    const link = getByText('Continuar comprando')
    expect(link?.getAttribute('href')).toBe('/products')
  })
})
