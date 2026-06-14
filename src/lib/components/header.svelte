<script lang="ts">
  import { getAuthState } from '$lib/auth.svelte.js'
  import { getCartState } from '$lib/cart.svelte.js'

  const auth = getAuthState()
  const cart = getCartState()

  let { branding = {} } = $props()

  let menuOpen = $state(false)
</script>

<header class="border-b border-border bg-card">
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
    <a href="/" class="text-lg font-semibold tracking-tight">
      {#if branding.logo_url}
        <img src={branding.logo_url} alt={branding.store_name || 'Logo'} class="h-8 max-w-32 object-contain" />
      {:else}
        Whatever
      {/if}
    </a>

    <nav class="hidden items-center gap-6 text-sm md:flex">
      <a href="/products" class="text-muted-foreground hover:text-foreground transition-colors">Produtos</a>
      <a href="/cart" class="text-muted-foreground hover:text-foreground transition-colors relative">
        Carrinho
        {#if cart.count > 0}
          <span class="absolute -top-2 -right-4 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
            {cart.count > 99 ? '99+' : cart.count}
          </span>
        {/if}
      </a>
      {#if auth.loading}
        <span class="text-muted-foreground">...</span>
      {:else if auth.user}
        <a href="/account/orders" class="text-muted-foreground hover:text-foreground transition-colors">Pedidos</a>
        <a href="/account/profile" class="text-muted-foreground hover:text-foreground transition-colors">Perfil</a>
        {#if auth.user.role === 'ADMIN'}
          <a href="/admin" class="text-muted-foreground hover:text-foreground transition-colors">Admin</a>
        {/if}
        <button onclick={() => auth.logout()} class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Sair</button>
      {:else}
        <a href="/auth/signin" class="text-muted-foreground hover:text-foreground transition-colors">Entrar</a>
      {/if}
    </nav>

    <div class="flex items-center gap-2 md:hidden">
      <a href="/cart" class="relative flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label="Carrinho">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        {#if cart.count > 0}
          <span class="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
            {cart.count > 99 ? '99+' : cart.count}
          </span>
        {/if}
      </a>
      <button
        onclick={() => menuOpen = !menuOpen}
        class="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer"
        aria-label="Menu"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {#if menuOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  {#if menuOpen}
    <div class="border-t border-border px-4 py-4 md:hidden">
      <nav class="flex flex-col gap-3 text-sm">
        <a href="/products" class="text-muted-foreground hover:text-foreground transition-colors" onclick={() => menuOpen = false}>Produtos</a>
        <a href="/cart" class="text-muted-foreground hover:text-foreground transition-colors" onclick={() => menuOpen = false}>
          Carrinho {cart.count > 0 ? `(${cart.count})` : ''}
        </a>
        {#if auth.loading}
          <span class="text-muted-foreground">...</span>
        {:else if auth.user}
          <a href="/account/orders" class="text-muted-foreground hover:text-foreground transition-colors" onclick={() => menuOpen = false}>Pedidos</a>
          <a href="/account/profile" class="text-muted-foreground hover:text-foreground transition-colors" onclick={() => menuOpen = false}>Perfil</a>
          {#if auth.user.role === 'ADMIN'}
            <a href="/admin" class="text-muted-foreground hover:text-foreground transition-colors" onclick={() => menuOpen = false}>Admin</a>
          {/if}
          <button onclick={() => { auth.logout(); menuOpen = false }} class="text-left text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Sair</button>
        {:else}
          <a href="/auth/signin" class="text-muted-foreground hover:text-foreground transition-colors" onclick={() => menuOpen = false}>Entrar</a>
        {/if}
      </nav>
    </div>
  {/if}
</header>
