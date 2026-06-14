# Storefront Improvement Plan

## Current State
SvelteKit 5 + Tailwind CSS 4 + Stripe Checkout. Server-rendered, deployed on Vercel with API proxy.

## ✅ Phase 1 — Foundation
- [x] Shared types (`$lib/types.ts`) — `Product`, `CartItem`, `Order`, `User`, `Category`
- [x] UI state store (`$lib/stores.svelte.ts`) — reactive cart count for header badge
- [x] Favicon + meta tags in `app.html`
- [x] All inline `Product` types replaced with shared imports

## ✅ Phase 2 — Header & Navigation
- [x] Cart badge count (visible in desktop nav + mobile button)
- [x] Mobile hamburger menu with all nav links
- [x] Footer component with links
- [x] Breadcrumbs component (`src/lib/components/breadcrumbs.svelte`)
- [x] Profile link in header when authenticated

## ✅ Phase 3 — Products Page (`/products`)
- [x] Search bar (`?search=` param, backend `search` query)
- [x] Category filter dropdown (fetches from `GET /api/products/categories`)
- [x] Sort dropdown (newest, price asc/desc, name)
- [x] Pagination (offset/limit, prev/next buttons, page numbers with ellipsis)
- [x] Loading skeleton grid (8 animated placeholders)
- [x] Empty state with icon + "Limpar filtros" link
- [x] SEO meta tags (`<svelte:head>`)

## ✅ Phase 4 — Product Detail (`/products/[slug]`)
- [x] Quantity selector with +/- buttons (min 1, max inventory)
- [x] Button feedback ("Adicionado!" → green, auto-revert)
- [x] Image placeholder SVG when no image
- [x] Low stock badge (inventory ≤ 5, yellow pill)
- [x] Open Graph meta tags (title, description, image, type)

## ✅ Phase 5 — Cart & Checkout
- [x] Removed redundant `/checkout` form page → converted to cancel/thank-you page
- [x] Cart: subtotal/total summary box
- [x] Better empty state with icon + CTA
- [x] Loading skeleton in cart page

## ✅ Phase 6 — Authentication
- [x] Register page (`/auth/register`) — uses `auth.register()` method
- [x] Link "Não tem conta? Cadastre-se" on sign-in page
- [x] Profile page (`/account/profile`) — edit name + change password

## ✅ Phase 7 — Orders (`/account/orders`)
- [x] Loading skeleton
- [x] Shipping address section
- [x] Status timeline (stepper: PENDING → PAID → SHIPPED → DELIVERED)
- [x] Uses shared `Order`, `OrderStatus`, `ORDER_STATUS_LABELS` types

## ✅ Phase 8 — Layout & Infrastructure
- [x] `+error.svelte` — custom 404/500 error page with layout (header, footer, navigation)
- [x] Toast notification system (`$lib/toast.svelte.ts` + `$lib/components/toast.svelte`)
- [x] `+layout.ts` — shared SEO default data via layout load
- [x] Skip-to-content link (a11y, WCAG compliant)
- [x] Navigation loading bar (thin animated bar at top during page transitions)
- [x] AddToCartButton uses toast instead of inline feedback

## ☐ Phase 9 — Performance & SEO
- [ ] Image optimization (`@sveltejs/enhanced-img` or srcset via Cloudinary)
- [ ] `sitemap.xml` endpoint
- [ ] `robots.txt`

## ☐ Phase 9 — Tests
- [x] Header tests updated for new badge + mobile menu structure
- [x] Checkout tests rewritten for cancel page
- [ ] Products page integration tests (search, filter, sort, pagination)
- [ ] Product detail page tests (quantity selector, add to cart)
- [ ] Auth pages tests (register, profile, signin)
