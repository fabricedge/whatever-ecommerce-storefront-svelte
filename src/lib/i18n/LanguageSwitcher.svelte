<script lang="ts">
  import { getLocale, setLocale } from './locale.svelte'
  import type { Locale } from './translations'

  const locales: Locale[] = ['pt', 'en', 'es']

  function handleClick(locale: Locale) {
    setLocale(locale)
  }
</script>

<div class="flex items-center gap-0.5 rounded-md border border-border p-0.5 text-xs">
  {#each locales as locale}
    <button
      onclick={() => handleClick(locale)}
      class="rounded px-1.5 py-0.5 font-medium transition-colors cursor-pointer uppercase {getLocale() === locale ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}"
    >
      {locale}
    </button>
  {/each}
</div>
