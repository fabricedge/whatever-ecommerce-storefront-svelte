import { getContext, setContext } from 'svelte'
import { api, setToken, clearToken, getToken } from './api'

type User = { id: string; email: string; name: string | null; role: string }

class AuthState {
  user = $state<User | null>(null)
  loading = $state(true)

  constructor() {
    if (getToken()) {
      api('/api/auth/me')
        .then((data) => { this.user = data.user })
        .catch(() => clearToken())
        .finally(() => { this.loading = false })
    } else {
      this.loading = false
    }
  }

  async login(email: string, password: string) {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    setToken(data.token)
    this.user = data.user
    setTimeout(() => window.dispatchEvent(new CustomEvent('cart:sync')), 2000)
  }

  async register(email: string, password: string, name?: string) {
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    })
    setToken(data.token)
    this.user = data.user
    setTimeout(() => window.dispatchEvent(new CustomEvent('cart:sync')), 2000)
  }

  logout() {
    clearToken()
    this.user = null
  }
}

const AUTH_KEY = Symbol('auth')

export function setAuthState() {
  const state = new AuthState()
  setContext(AUTH_KEY, state)
  return state
}

export function getAuthState(): AuthState {
  return getContext(AUTH_KEY)
}
