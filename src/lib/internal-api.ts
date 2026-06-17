export function withToken(fetch: typeof globalThis.fetch): typeof globalThis.fetch {
  const token = process.env.INTERNAL_API_TOKEN
  if (!token) return fetch
  return (input, init) =>
    fetch(input, {
      ...init,
      headers: { ...init?.headers, 'X-Internal-Token': token }
    })
}
