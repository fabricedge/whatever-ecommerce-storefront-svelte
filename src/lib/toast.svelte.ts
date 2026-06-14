type Toast = { id: string; message: string; type: 'success' | 'error' | 'info' }

let toasts = $state<Toast[]>([])

export function getToastState() {
  function add(message: string, type: Toast['type'] = 'info') {
    const id = crypto.randomUUID()
    toasts = [...toasts, { id, message, type }]
    setTimeout(() => remove(id), 3000)
  }

  function remove(id: string) {
    toasts = toasts.filter((t) => t.id !== id)
  }

  return {
    get toasts() { return toasts },
    success: (msg: string) => add(msg, 'success'),
    error: (msg: string) => add(msg, 'error'),
    info: (msg: string) => add(msg, 'info'),
    remove
  }
}
