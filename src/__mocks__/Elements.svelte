<script lang="ts">
  let { stripe, options, children, ...rest }: {
    stripe?: any; options?: any; children?: any; elements?: any
  } = $props()
</script>

{@render children?.()}
