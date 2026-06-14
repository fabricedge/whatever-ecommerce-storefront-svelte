<script lang="ts">
  import { goto } from '$app/navigation'
  import { getAuthState } from '$lib/auth.svelte.js'

  const auth = getAuthState()
  let email = $state('')
  let password = $state('')
  let name = $state('')
  let error = $state<string | null>(null)
  let loading = $state(false)

  async function handleSubmit(e: Event) {
    e.preventDefault()
    error = null
    loading = true
    try {
      await auth.register(email, password, name || undefined)
      goto('/')
    } catch (err: any) {
      error = err.error || 'Erro ao cadastrar'
    }
    loading = false
  }
</script>

<svelte:head>
  <title>Criar conta — Whatever Ecommerce</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 py-24">
  <h1 class="mb-8 text-center text-2xl font-bold">Criar Conta</h1>

  {#if error}
    <div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
  {/if}

  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label for="name" class="mb-1 block text-sm font-medium">Nome (opcional)</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
    <div>
      <label for="email" class="mb-1 block text-sm font-medium">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        required
        class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
    <div>
      <label for="password" class="mb-1 block text-sm font-medium">Senha</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        required
        minlength={6}
        class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
    <button
      type="submit"
      disabled={loading}
      class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
    >
      {loading ? 'Cadastrando...' : 'Criar conta'}
    </button>
  </form>

  <p class="mt-6 text-center text-sm text-muted-foreground">
    Já tem uma conta? <a href="/auth/signin" class="font-medium text-primary underline underline-offset-4">Entrar</a>
  </p>
</div>
