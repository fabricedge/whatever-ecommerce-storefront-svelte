import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/svelte'

const mockCartState = vi.hoisted(() => ({
  items: [] as { productId: string; quantity: number }[],
}))

vi.mock('$lib/cart.svelte', () => ({
  getCartState: () => ({
    get items() { return mockCartState.items },
    get count() { return mockCartState.items.reduce((s: number, i: any) => s + i.quantity, 0) },
  }),
}))

vi.mock('$lib/auth.svelte', () => ({
  getAuthState: () => ({
    loading: false,
    user: null,
    logout: vi.fn(),
  }),
}))

import Header from './header.svelte'

describe('Header', () => {
  beforeEach(() => {
    mockCartState.items = []
  })

  afterEach(() => {
    cleanup()
  })

  it('links to cart page', () => {
    render(Header)
    const cartLink = screen.getByText('Carrinho')
    expect(cartLink).toBeTruthy()
    expect(cartLink.closest('a')?.getAttribute('href')).toBe('/cart')
  })

  it('shows cart count badge when there are items', () => {
    mockCartState.items = [{ productId: 'p1', quantity: 2 }]
    render(Header)
    const badges = screen.getAllByText('2')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  it('does not show cart count badge when cart is empty', () => {
    render(Header)
    const badge = screen.queryByText(/^\d+$/)
    expect(badge).toBeNull()
  })
})
