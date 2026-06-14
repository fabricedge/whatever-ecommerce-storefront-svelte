export function optimImg(url: string, opts?: { width?: number; quality?: string }): string {
  if (!url?.includes('cloudinary')) return url
  const [base, path] = url.split('/upload/')
  if (!path) return url
  const t = ['f_auto', `q_${opts?.quality || 'auto'}`, opts?.width ? `w_${opts.width}` : '']
  return `${base}/upload/${t.filter(Boolean).join(',')}/${path}`
}

export function lqipUrl(url: string): string {
  if (!url?.includes('cloudinary')) return url
  const [base, path] = url.split('/upload/')
  if (!path) return url
  return `${base}/upload/w_20,e_blur:1000,q_1/${path}`
}
