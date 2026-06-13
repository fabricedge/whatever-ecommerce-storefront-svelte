import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

let mockFetch: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockFetch = vi.fn()
  vi.stubGlobal('fetch', mockFetch)
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function loadApi() {
  return import('$lib/api')
}

describe('api', () => {
  it('sends GET request without token', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: 'ok' }) })
    const { api } = await loadApi()
    const result = await api('/api/products')
    expect(result).toEqual({ data: 'ok' })
    expect(mockFetch).toHaveBeenCalledWith('/api/products', expect.objectContaining({
      headers: { 'Content-Type': 'application/json' },
    }))
  })

  it('includes auth token when available', async () => {
    localStorage.setItem('auth_token', 'my-jwt')
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
    const { api } = await loadApi()
    await api('/api/auth/me')
    const headers = mockFetch.mock.calls[0][1].headers
    expect(headers['Authorization']).toBe('Bearer my-jwt')
  })

  it('sends POST with body', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ token: 'x' }) })
    const { api } = await loadApi()
    await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'a@b.com', password: 'x' }) })
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.com', password: 'x' }),
    }))
  })

  it('throws error object on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: 'Invalid credentials' }) })
    const { api } = await loadApi()
    await expect(api('/api/auth/login', { method: 'POST' })).rejects.toEqual({ error: 'Invalid credentials' })
  })

  it('throws status text when json parse fails', async () => {
    mockFetch.mockResolvedValue({ ok: false, statusText: 'Not Found', json: () => Promise.reject(new Error()) })
    const { api } = await loadApi()
    await expect(api('/api/unknown')).rejects.toEqual({ error: 'Not Found' })
  })
})

describe('getToken / setToken / clearToken', () => {
  it('returns null when no token', async () => {
    const { getToken } = await loadApi()
    expect(getToken()).toBeNull()
  })

  it('stores and retrieves token', async () => {
    const { setToken, getToken } = await loadApi()
    setToken('abc')
    expect(getToken()).toBe('abc')
  })

  it('clears token', async () => {
    const { setToken, clearToken, getToken } = await loadApi()
    setToken('abc')
    clearToken()
    expect(getToken()).toBeNull()
  })
})
