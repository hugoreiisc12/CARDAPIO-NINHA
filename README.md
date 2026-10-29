# Ninha Cakes — Cardápio Digital

Cardápio digital (one-page) para a doceria artesanal **Ninha Cakes**. O visitante navega pelas categorias (bolos, tortas, docinhos, taças, chocolates, encomendas), monta o pedido em um carrinho local e finaliza via **WhatsApp** — não há checkout de pagamento nem backend de pedidos.

Projeto sincronizado com o [Lovable](https://lovable.dev) (ver `.lovable/`) e publicado a partir do repositório `hugoreiisc12/plum-sweet-menu`.

## Stack

- **TanStack Start** (`@tanstack/react-start`) + **TanStack Router** — roteamento file-based (ver `src/routes/README.md` para as convenções)
- **React 19**, **TypeScript**, **Vite 8**
- **Tailwind CSS v4** (config inline em `src/styles.css`, tokens de marca `plum` / `cream` / `rose` / `coral` / `amber`)
- **shadcn/radix-ui** para os componentes de UI (`src/components/ui`)
- **GSAP** (`use-gsap-scroll`) para scroll reveal e parallax; **Three.js** para a capa 3D de entrada (`SweetsCover`)
- **Bun** como runtime/gerenciador de pacotes (`bun.lock`, `bunfig.toml`)

## Rodando localmente

```bash
bun install
bun run dev      # vite dev
bun run build    # build de produção
bun run preview  # preview do build
bun run lint
bun run format
```

## Estrutura principal

```
src/
  routes/index.tsx        # página única do cardápio (hero, categorias, footer, dock, sheets)
  routes/__root.tsx       # shell da aplicação
  lib/menu-data.ts        # catálogo de produtos/categorias, preços, link do WhatsApp
  lib/cart-context.tsx    # estado do carrinho (persistido em localStorage)
  components/
    ProductSheet.tsx      # bottom sheet de detalhe/variações do produto
    CartSheet.tsx         # bottom sheet do carrinho
    SweetsCover.tsx        # intro 3D (chuva de doces)
    BackgroundPaths.tsx    # camada de fundo com scroll parallax
    ui/dock.tsx             # navegação flutuante por categoria
```

## O que já funciona

- Catálogo por categorias com produtos em destaque ("Favoritos da casa")
- Variações de produto com delta de preço (ex.: tamanho do bolo)
- Carrinho persistente em `localStorage` (`ninha-cart-v1`), com contador flutuante
- Finalização de pedido via link `wa.me` com mensagem formatada (itens, variações, total)
- Badge de "Aberto agora / Fechado" calculado no cliente (Ter–Dom, 10h–20h)
- Animações de entrada (GSAP reveal, dock com categoria ativa via `IntersectionObserver`)

## Pendências / dados de placeholder (atenção antes de publicar)

Estes valores em `src/lib/menu-data.ts` e `src/routes/index.tsx` ainda são **fictícios** e precisam ser substituídos pelos dados reais da Ninha:

- `WHATSAPP_NUMBER = "5511999999999"` — número de WhatsApp real do negócio
- Imagens dos produtos e do hero são fotos de banco (Unsplash), não fotos da Ninha
- Endereço no footer: "Rua das Confeitarias, 123 — São Paulo/SP" (fictício)
- Link do Instagram no footer aponta para `#` (placeholder, texto "@ninhacakes")
- Preços, sabores e regras de pedido mínimo em `menu-data.ts` devem ser conferidos com o cardápio real

## Estado do git a observar

Há alterações **não commitadas** no working tree (feature de carrinho em andamento):
`cart-context.tsx`, `CartSheet.tsx`, `ui/bottom-sheet.tsx` são novos; `ProductSheet.tsx`, `SweetsCover.tsx`, `index.tsx`, `styles.css`, `routeTree.gen.ts` e os SVGs em `assets/sweets/` foram modificados. Vale revisar e commitar antes de seguir para não perder esse progresso — e lembrar que o branch está conectado ao Lovable, então evite `push --force`/rebase de commits já publicados (ver `AGENTS.md`).

## Próximos passos sugeridos

1. Substituir os placeholders acima pelos dados reais (WhatsApp, fotos, endereço, Instagram)
2. Revisar/commitar o trabalho em andamento do carrinho
3. Definir se o catálogo (`menu-data.ts`) continua hardcoded no front ou passa a vir de alguma fonte editável (CMS/planilha) para a Ninha atualizar sem depender de deploy
4. Testar o fluxo completo em mobile (é o uso predominante): abrir produto → escolher variação → adicionar ao carrinho → revisar carrinho → enviar WhatsApp
