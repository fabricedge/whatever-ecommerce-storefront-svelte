<script lang="ts">
  import { t } from '$lib/i18n/locale.svelte'
</script>

<footer class="border-t border-border bg-card mt-12">
  <div class="mx-auto max-w-7xl px-4 py-8">
    <div class="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
      <p>&copy; {new Date().getFullYear()} Whatever Ecommerce. {t('footer.rights')}</p>
      <div class="flex gap-6">
        <a href="/products" class="hover:text-foreground transition-colors">{t('footer.products')}</a>
        <a href="/cart" class="hover:text-foreground transition-colors">{t('footer.cart')}</a>
      </div>
    </div>
  </div>
</footer>
