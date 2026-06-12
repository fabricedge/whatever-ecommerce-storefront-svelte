<script lang="ts">
  import '../app.css'
  import Header from '$lib/components/header.svelte'
  import { setAuthState } from '$lib/auth.svelte.js'
  import { setCartState } from '$lib/cart.svelte.js'

  let { children } = $props()

  setAuthState()
  setCartState()
</script>

<div class="min-h-screen flex flex-col antialiased">
  <Header />
  <main class="flex-1">{@render children()}</main>
</div>
