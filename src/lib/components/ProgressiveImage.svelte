<script lang="ts">
  import { optimImg, lqipUrl } from '$lib/images'

  let { src, alt, class: className = '', width, height }: { src: string; alt: string; class?: string; width?: number; height?: number } = $props()

  let loaded = $state(false)
  let lqip = $derived(lqipUrl(src))
  let full = $derived(optimImg(src, { width }))
</script>

<div class="relative overflow-hidden bg-muted {className}">
  <img src={lqip} alt="" class="absolute inset-0 h-full w-full object-cover blur-2xl scale-110" />
  <img
    src={full}
    {alt}
    {width}
    {height}
    loading="lazy"
    onload={() => loaded = true}
    class="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 {loaded ? 'opacity-100' : 'opacity-0'}"
  />
</div>
