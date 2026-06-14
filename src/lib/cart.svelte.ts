import { getContext, setContext } from 'svelte'

const CART_KEY = 'cart_items'

export type CartItem = { productId: string; quantity: number }

class CartState {
  items = $state<CartItem[]>([])
  count = $derived(this.items.reduce((sum, i) => sum + i.quantity, 0))

  constructor() {
    const raw = this.#read()
    this.items = raw || []
  }

  #read(): CartItem[] | null {
    try {
      const raw = localStorage.getItem(CART_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  }

  #save() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(this.items)) } catch {}
  }

  addItem(productId: string, quantity = 1) {
    const existing = this.items.find((i) => i.productId === productId)
    if (existing) {
      this.items = this.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
      )
    } else {
      this.items = [...this.items, { productId, quantity }]
    }
    this.#save()
  }

  updateQuantity(productId: string, quantity: number) {
    const clamped = Math.min(1000, Math.max(1, quantity))
    this.items = this.items.map((i) =>
      i.productId === productId ? { ...i, quantity: clamped } : i
    )
    this.#save()
  }

  removeItem(productId: string) {
    this.items = this.items.filter((i) => i.productId !== productId)
    this.#save()
  }

  clear() {
    this.items = []
    this.#save()
  }
}

const CART_STATE_KEY = Symbol('cart')

export function setCartState() {
  const state = new CartState()
  setContext(CART_STATE_KEY, state)
  return state
}

export function getCartState(): CartState {
  return getContext(CART_STATE_KEY)
}
