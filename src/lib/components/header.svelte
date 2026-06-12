<script lang="ts">
  import { getAuthState } from '$lib/auth.svelte.js'

  const auth = getAuthState()
</script>

<header class="border-b border-border bg-card">
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
    <a href="/" class="text-lg font-semibold tracking-tight">Whatever</a>
    <nav class="flex items-center gap-6 text-sm">
      <a href="/products" class="text-muted-foreground hover:text-foreground transition-colors">Produtos</a>
      <a href="/cart" class="text-muted-foreground hover:text-foreground transition-colors">Carrinho</a>
      {#if auth.loading}
        <span class="text-muted-foreground">...</span>
      {:else if auth.user}
        <a href="/account/orders" class="text-muted-foreground hover:text-foreground transition-colors">Pedidos</a>
        {#if auth.user.role === 'ADMIN'}
          <a href="/admin" class="text-muted-foreground hover:text-foreground transition-colors">Admin</a>
        {/if}
        <button onclick={() => auth.logout()} class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Sair</button>
      {:else}
        <a href="/auth/signin" class="text-muted-foreground hover:text-foreground transition-colors">Entrar</a>
      {/if}
    </nav>
  </div>
</header>
