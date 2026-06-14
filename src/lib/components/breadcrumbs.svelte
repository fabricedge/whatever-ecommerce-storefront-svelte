<script lang="ts">
  type Crumb = { label: string; href?: string }

  let { crumbs }: { crumbs: Crumb[] } = $props()
</script>

<nav aria-label="Breadcrumb" class="mb-6 text-sm text-muted-foreground">
  <ol class="flex items-center gap-1.5">
    <li>
      <a href="/" class="hover:text-foreground transition-colors">Home</a>
    </li>
    {#each crumbs as crumb}
      <li class="flex items-center gap-1.5">
        <span>/</span>
        {#if crumb.href}
          <a href={crumb.href} class="hover:text-foreground transition-colors">{crumb.label}</a>
        {:else}
          <span class="text-foreground">{crumb.label}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
