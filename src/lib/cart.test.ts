import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/svelte'
import CartTestHarness from './CartTestHarness.svelte'

const STORAGE_KEY = 'cart_items'

beforeEach(() => {
  localStorage.clear()
})

function setup() {
  const results: any[] = []
  const { unmount } = render(CartTestHarness, { props: { onState: (s: any) => results.push(s) } })
  return { getState: () => results[0], unmount }
}

describe('CartState', () => {
  it('starts with empty items', () => {
    const { getState } = setup()
    expect(getState().items).toEqual([])
  })

  it('adds an item', () => {
    const { getState } = setup()
    const state = getState()
    state.addItem('prod-1', 2)
    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toEqual({ productId: 'prod-1', quantity: 2, name: '', price: 0 })
  })

  it('increments quantity when adding existing item', () => {
    const { getState } = setup()
    const state = getState()
    state.addItem('prod-1')
    state.addItem('prod-1', 3)
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(4)
  })

  it('updates quantity', () => {
    const { getState } = setup()
    const state = getState()
    state.addItem('prod-1', 5)
    state.updateQuantity('prod-1', 3)
    expect(state.items[0].quantity).toBe(3)
  })

  it('removes an item', () => {
    const { getState } = setup()
    const state = getState()
    state.addItem('prod-1')
    state.addItem('prod-2')
    state.removeItem('prod-1')
    expect(state.items).toHaveLength(1)
    expect(state.items[0].productId).toBe('prod-2')
  })

  it('clears all items', () => {
    const { getState } = setup()
    const state = getState()
    state.addItem('prod-1')
    state.addItem('prod-2')
    state.clear()
    expect(state.items).toEqual([])
  })

  it('persists items to localStorage', () => {
    const { getState } = setup()
    const state = getState()
    state.addItem('prod-1', 1)
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(saved).toEqual([{ productId: 'prod-1', quantity: 1, name: '', price: 0 }])
  })

  it('restores items from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ productId: 'prod-1', quantity: 3, name: '', price: 0 }]))
    const { getState } = setup()
    expect(getState().items).toEqual([{ productId: 'prod-1', quantity: 3, name: '', price: 0 }])
  })

  it('restores from localStorage after add', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ productId: 'existing', quantity: 1, name: '', price: 0 }]))
    const { getState } = setup()
    const state = getState()
    state.addItem('new', 2)
    expect(state.items).toHaveLength(2)
    expect(state.items[0]).toEqual({ productId: 'existing', quantity: 1, name: '', price: 0 })
    expect(state.items[1]).toEqual({ productId: 'new', quantity: 2, name: '', price: 0 })
  })
})
