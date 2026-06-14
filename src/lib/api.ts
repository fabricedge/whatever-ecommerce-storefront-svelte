const TOKEN_KEY = 'auth_token'

export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export function setToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token) } catch {}
}

export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY) } catch {}
}

async function fetchWithRetry(path: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(path, options)
      if (res.status !== 502 && res.status !== 503) return res
      if (attempt === retries) return res
    } catch (e) {
      if (attempt === retries) throw e
    }
    await new Promise(r => setTimeout(r, attempt * 500))
  }
  throw new Error('fetch failed')
}

export async function api(path: string, options?: RequestInit) {
  const token = getToken()
  const res = await fetchWithRetry(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers
    }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw err
  }
  return res.json()
}
