<script lang="ts">
  import { setCartState } from '$lib/cart.svelte'

  let { onState }: { onState: (state: any) => void } = $props()

  const cart = setCartState()
  $effect(() => { onState(cart) })
</script>
