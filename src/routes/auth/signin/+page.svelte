<script lang="ts">
  import { goto } from '$app/navigation'
  import { getAuthState } from '$lib/auth.svelte.js'
  import { t } from '$lib/i18n/locale.svelte'

  const auth = getAuthState()
  let email = $state('')
  let password = $state('')
  let error = $state<string | null>(null)
  let loading = $state(false)

  async function handleSubmit(e: Event) {
    e.preventDefault()
    error = null
    loading = true
    try {
      await auth.login(email, password)
      goto('/')
    } catch (err: any) {
      error = err.error || t('auth.errorLogin')
    }
    loading = false
  }
</script>

<svelte:head>
  <title>{t('auth.pageTitleSignIn')}</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 py-24">
  <h1 class="mb-8 text-center text-2xl font-bold">{t('auth.signIn')}</h1>

  {#if error}
    <div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
  {/if}

  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label for="email" class="mb-1 block text-sm font-medium">{t('auth.email')}</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        required
        class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
    <div>
      <label for="password" class="mb-1 block text-sm font-medium">{t('auth.password')}</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        required
        class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
    <button
      type="submit"
      disabled={loading}
      class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
    >
      {loading ? t('auth.loggingIn') : t('auth.signIn')}
    </button>
  </form>

  <p class="mt-6 text-center text-sm text-muted-foreground">
    {t('auth.noAccount')} <a href="/auth/register" class="font-medium text-primary underline underline-offset-4">{t('auth.registerLink')}</a>
  </p>
</div>
