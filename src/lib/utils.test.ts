import { describe, it, expect } from 'vitest'

describe('formatPrice', () => {
  async function load() {
    const mod = await import('$lib/utils')
    return mod.formatPrice
  }

  it('formats 0 cents', async () => {
    const formatPrice = await load()
    expect(formatPrice(0)).toBe('R$\u00a00,00')
  })

  it('formats 100 cents as R$ 1,00', async () => {
    const formatPrice = await load()
    expect(formatPrice(100)).toBe('R$\u00a01,00')
  })

  it('formats 1990 cents as R$ 19,90', async () => {
    const formatPrice = await load()
    expect(formatPrice(1990)).toBe('R$\u00a019,90')
  })

  it('formats 150000 cents as R$ 1.500,00', async () => {
    const formatPrice = await load()
    expect(formatPrice(150000)).toBe('R$\u00a01.500,00')
  })

  it('formats 99 cents as R$ 0,99', async () => {
    const formatPrice = await load()
    expect(formatPrice(99)).toBe('R$\u00a00,99')
  })
})
