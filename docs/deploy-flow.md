# Fluxo de Deploy — Storefront (whatever-ecommerce-storefront-svelte)

O storefront é o ponto final do fluxo: onde o cliente final navega e compra.

## Papel no fluxo

```
Usuário acessa {slug}.fskk.site
  │
  ▼
DNS → 76.76.21.21 (Vercel)
  │
  ▼
Vercel roteia para storefront (wildcard *.fskk.site)
  │
  ▼
Storefront lê Host header
  │
  ▼
GET /api/stores/lookup?domain={host}
  │
  ├── 404 → mostra erro "Loja não encontrada"
  │
  └── 200 → carrega dados da loja
        │
        ▼
    GET /api/stores/:id/branding
        │
        ▼
    Aplica CSS variables (--brand-primary, etc.)
        │
        ▼
    GET /api/stores/:id/has-token
        │
        ├── true → mostra token gate (input de 6 dígitos)
        │           POST /api/store-requests/verify-token
        │
        └── false → entra direto na loja
```

## Identificação da loja

O storefront identifica qual loja servir através do **Host header** da requisição:

```typescript
// +layout.server.ts
const host = request.headers.get("host") // "minha-loja.fskk.site"
const res = await fetch(`${API_URL}/api/stores/lookup?domain=${host}`)
const { id, name, slug } = await res.json()
```

Isso permite que uma única instância atenda N lojas diferentes.

## Branding dinâmico

As variáveis CSS são setadas no `+layout.svelte`:

```css
:root {
  --brand-primary: {branding.primary_color};
  --brand-secondary: {branding.secondary_color};
  --brand-logo: url({branding.logo_url});
  --brand-font: {branding.font_family};
}
```

## Token gate

Se a loja tem `deploymentToken`:
1. Tela de bloqueio com input de 6 dígitos
2. Verificação via POST `/api/store-requests/verify-token`
3. Acerto → libera acesso (armazena em sessionStorage)
4. Erro → mensagem "Código inválido"

## Requisitos de ambiente

| Variável | Descrição |
|----------|-----------|
| `PUBLIC_API_URL` | URL do backend (`https://whatever-ecommerce-backend.vercel.app`) |
| `PUBLIC_HAS_TOKEN` | (substituído por runtime fetch `/api/stores/:id/has-token`) |

## Deploy na Vercel

- Projeto: `whatever-ecommerce-storefront-svelte`
- Domínios: `stfront.fskk.site` + wildcard `*.fskk.site`
- Build: `npm run build`
- SSR habilitado (layout.server.ts roda no servidor para identificar loja por Host)
