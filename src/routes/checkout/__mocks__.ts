import { vi } from 'vitest'

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}))

vi.mock('$lib/cart.svelte', () => ({
  getCartState: vi.fn(),
  CartState: class {
    items = $state([])
    clear() { this.items = [] }
  },
}))
