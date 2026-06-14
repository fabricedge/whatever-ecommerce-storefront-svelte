<script lang="ts">
  import { getToastState } from '$lib/toast.svelte.js'

  const toast = getToastState()

  function typeClass(type: string) {
    if (type === 'success') return 'border-green-200 bg-green-50 text-green-700'
    if (type === 'error') return 'border-red-200 bg-red-50 text-red-700'
    return 'border-blue-200 bg-blue-50 text-blue-700'
  }
</script>

{#if toast.toasts.length > 0}
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    {#each toast.toasts as t (t.id)}
      <div class="animate-slide-up flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg {typeClass(t.type)}">
        <span class="flex-1">{t.message}</span>
        <button onclick={() => toast.remove(t.id)} class="cursor-pointer opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">&times;</button>
      </div>
    {/each}
  </div>
{/if}
