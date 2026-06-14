<script lang="ts">
  import { t } from '$lib/i18n/locale.svelte'
</script>

<svelte:head>
  <title>{t('checkout.pageTitle')}</title>
</svelte:head>

<div class="mx-auto max-w-md px-4 py-24 text-center">
  <svg class="mx-auto mb-6 h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
  <h1 class="mb-4 text-2xl font-bold">{t('checkout.cancelledTitle')}</h1>
  <p class="mb-8 text-muted-foreground">{t('checkout.cancelledDesc')}</p>
  <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
    <a href="/cart" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
      {t('checkout.backToCart')}
    </a>
    <a href="/products" class="inline-flex h-10 items-center justify-center rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-muted">
      {t('checkout.continueShopping')}
    </a>
  </div>
</div>
