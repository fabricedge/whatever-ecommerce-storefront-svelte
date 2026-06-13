import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/svelte'
import AuthTestHarness from './AuthTestHarness.svelte'

let mockFetch: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockFetch = vi.fn()
  vi.stubGlobal('fetch', mockFetch)
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function setup() {
  const results: any[] = []
  render(AuthTestHarness, { props: { onState: (s: any) => results.push(s) } })
  return () => results[0]
}

describe('AuthState', () => {
  it('sets loading=false and user=null when no token', async () => {
    const getState = setup()
    const auth = getState()
    expect(auth.loading).toBe(false)
    expect(auth.user).toBeNull()
  })

  it('fetches user when token exists', async () => {
    localStorage.setItem('auth_token', 'valid-token')
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ user: { id: '1', email: 'a@b.com', name: 'Test', role: 'USER' } }) })

    const getState = setup()
    const auth = getState()

    expect(auth.loading).toBe(true)
    expect(auth.user).toBeNull()

    await vi.waitFor(() => {
      expect(auth.loading).toBe(false)
    })
    expect(auth.user).toEqual({ id: '1', email: 'a@b.com', name: 'Test', role: 'USER' })
  })

  it('clears token and sets user null on fetch failure', async () => {
    localStorage.setItem('auth_token', 'bad-token')
    mockFetch.mockResolvedValue({ ok: false, json: () => Promise.reject(new Error()) })

    const getState = setup()
    const auth = getState()

    await vi.waitFor(() => {
      expect(auth.loading).toBe(false)
    })
    expect(auth.user).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('login stores token and sets user', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ token: 'new-token', user: { id: '2', email: 'b@b.com', name: null, role: 'USER' } }) })

    const getState = setup()
    const auth = getState()

    await auth.login('b@b.com', 'pass')

    expect(localStorage.getItem('auth_token')).toBe('new-token')
    expect(auth.user).toEqual({ id: '2', email: 'b@b.com', name: null, role: 'USER' })
  })

  it('logout clears token and user', async () => {
    localStorage.setItem('auth_token', 'some-token')

    const getState = setup()
    const auth = getState()

    auth.logout()
    expect(auth.user).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('register stores token and sets user', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ token: 'reg-token', user: { id: '3', email: 'c@c.com', name: 'New', role: 'USER' } }) })

    const getState = setup()
    const auth = getState()

    await auth.register('c@c.com', 'pass', 'New')

    expect(localStorage.getItem('auth_token')).toBe('reg-token')
    expect(auth.user).toEqual({ id: '3', email: 'c@c.com', name: 'New', role: 'USER' })
  })
})
