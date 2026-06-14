import { getContext, setContext } from 'svelte'
import { getToken, getStoreId } from './api'

const CART_KEY = 'cart_items'
const API_BASE = '/api'

export type CartItem = { productId: string; quantity: number; name: string; price: number; image?: string }

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
      if (!raw) return null
      const items: CartItem[] = JSON.parse(raw)
      return items.map((i) => ({ ...i, name: i.name ?? '', price: i.price ?? 0 }))
    } catch { return null }
  }

  #save() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(this.items)) } catch {}
  }

  async #syncToDB() {
    const token = getToken()
    if (!token) return
    const storeId = getStoreId()
    try {
      await fetch(`${API_BASE}/cart/sync`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(storeId ? { 'X-Store-Id': storeId } : {}),
        },
        body: JSON.stringify({ items: this.items.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
      })
    } catch {}
  }

  async mergeToDB() {
    const token = getToken()
    if (!token || this.items.length === 0) return
    const storeId = getStoreId()
    try {
      await fetch(`${API_BASE}/cart/sync`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(storeId ? { 'X-Store-Id': storeId } : {}),
        },
        body: JSON.stringify({ items: this.items.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
      })
      this.clear()
    } catch {}
  }

  async fetchFromDB() {
    const token = getToken()
    if (!token) return
    const storeId = getStoreId()
    try {
      const res = await fetch(`${API_BASE}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(storeId ? { 'X-Store-Id': storeId } : {}),
        },
      })
      if (!res.ok) return
      const data = await res.json()
      const dbItems: CartItem[] = (data.cartItems || []).map((ci: any) => ({
        productId: ci.productId,
        quantity: ci.quantity,
        name: ci.product?.name ?? '',
        price: ci.product?.price ?? 0,
        image: ci.product?.images?.[0],
      }))
      this.items = dbItems
      this.#save()
    } catch {}
  }

  addItem(productId: string, quantity = 1, product?: { name: string; price: number; image?: string }) {
    const existing = this.items.find((i) => i.productId === productId)
    if (existing) {
      this.items = this.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
      )
    } else {
      this.items = [...this.items, { productId, quantity, name: product?.name ?? '', price: product?.price ?? 0, ...(product?.image ? { image: product.image } : {}) }]
    }
    this.#save()
    this.#syncToDB()
  }

  updateQuantity(productId: string, quantity: number) {
    const clamped = Math.min(1000, Math.max(1, quantity))
    this.items = this.items.map((i) =>
      i.productId === productId ? { ...i, quantity: clamped } : i
    )
    this.#save()
    this.#syncToDB()
  }

  removeItem(productId: string) {
    this.items = this.items.filter((i) => i.productId !== productId)
    this.#save()
    this.#syncToDB()
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
