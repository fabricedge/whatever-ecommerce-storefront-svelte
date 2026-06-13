<script lang="ts">
  import { setAuthState } from '$lib/auth.svelte'

  let { onState }: { onState: (state: any) => void } = $props()

  const auth = setAuthState()
  $effect(() => { onState(auth) })
</script>
