# whatever-ecommerce-storefront-svelte

Loja virtual para clientes finais. SvelteKit 5 + Tailwind CSS 4.

## Função

- **Home** — Grade de produtos em destaque
- **Produtos** — Listagem por categoria + página de detalhes
- **Carrinho** — Gerenciamento de itens com persistência
- **Checkout** — Pagamento via Stripe (checkout session)
- **Minha Conta** — Perfil e histórico de pedidos
- **Autenticação** — Login/register de clientes
- **Token Gate** — Tela de acesso com código para lojas independentes
- **Branding Dinâmico** — Cores, logo e fonte carregados da API por loja

## Arquitetura

Uma única instância atende **múltiplas lojas** via subdomínio:

```
{slug}.fskk.site  →  DNS A record  →  76.76.21.21 (Vercel)
                      ↓
                   Vercel (wildcard *.fskk.site)
                      ↓
                   Storefront lê Host header
                      ↓
                   GET /api/stores/lookup?domain={host}
                      ↓
                   Renderiza produtos + branding da loja
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | SvelteKit 5 |
| Estilos | Tailwind CSS 4 |
| Pagamentos | Stripe (svelte-stripe) |
| Deploy | Vercel (SSR) |
| Domínio | `stfront.fskk.site` + wildcard `*.fskk.site` |
