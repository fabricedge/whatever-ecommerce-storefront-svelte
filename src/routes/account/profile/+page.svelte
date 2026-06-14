<script lang="ts">
  import { goto } from '$app/navigation'
  import { getAuthState } from '$lib/auth.svelte.js'
  import { api } from '$lib/api'

  const auth = getAuthState()

  let name = $state(auth.user?.name || '')
  let currentPassword = $state('')
  let newPassword = $state('')
  let error = $state<string | null>(null)
  let success = $state<string | null>(null)
  let loading = $state(false)

  async function handleSubmit(e: Event) {
    e.preventDefault()
    error = null
    success = null
    loading = true
    try {
      const body: Record<string, string> = { name }
      if (currentPassword && newPassword) {
        body.currentPassword = currentPassword
        body.newPassword = newPassword
      }
      await api('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(body)
      })
      success = 'Perfil atualizado.'
      currentPassword = ''
      newPassword = ''
    } catch (err: any) {
      error = err.error || 'Erro ao atualizar perfil'
    }
    loading = false
  }
</script>

<svelte:head>
  <title>Meu Perfil — Whatever Ecommerce</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 py-12">
  <h1 class="mb-8 text-2xl font-bold">Meu Perfil</h1>

  {#if error}
    <div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
  {/if}
  {#if success}
    <div class="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>
  {/if}

  {#if !auth.user}
    <p class="text-muted-foreground">Você precisa estar logado para acessar esta página.</p>
    <a href="/auth/signin" class="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4">Entrar</a>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="email" class="mb-1 block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          value={auth.user.email}
          disabled
          class="w-full rounded-md border border-border px-3 py-2 text-sm opacity-60 cursor-not-allowed"
        />
      </div>
      <div>
        <label for="name" class="mb-1 block text-sm font-medium">Nome</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <hr class="border-border" />
      <p class="text-sm font-medium">Alterar senha (opcional)</p>
      <div>
        <label for="currentPassword" class="mb-1 block text-sm font-medium">Senha atual</label>
        <input
          id="currentPassword"
          type="password"
          bind:value={currentPassword}
          class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label for="newPassword" class="mb-1 block text-sm font-medium">Nova senha</label>
        <input
          id="newPassword"
          type="password"
          bind:value={newPassword}
          minlength={6}
          class="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  {/if}
</div>
