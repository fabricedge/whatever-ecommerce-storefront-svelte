<script lang="ts">
  import { api } from '$lib/api'

  let { productId, onDone }: { productId: string; onDone: () => void } = $props()

  async function handleDelete() {
    if (!confirm('Tem certeza?')) return
    await api(`/api/products/${productId}`, { method: 'DELETE' })
    onDone()
  }
</script>

<button onclick={handleDelete} class="text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer">Excluir</button>
