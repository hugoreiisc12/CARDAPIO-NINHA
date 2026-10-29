# AGENTS.md — Contexto do projeto (Ninha Cakes · Cardápio Digital)

> Documento de contextualização para agentes de IA. Leia este arquivo por
> completo antes de propor, modificar ou revisar qualquer código. Em dúvida,
> consulte `SPEC/` (mapa na seção abaixo) — especialmente para qualquer coisa
> visual.

## O que é o projeto

Cardápio digital **one-page** da doceria artesanal **Ninha Cakes**. O visitante
navega pelas categorias (bolos, tortas, docinhos, taças, chocolates, encomendas),
monta o pedido em um carrinho **100% local** e finaliza via **WhatsApp**. Não há
backend de pedidos nem checkout de pagamento.

Projeto publicado a partir do repositório `hugoreiisc12/CARDAPIO-NINHA` — ver **Regras duras** abaixo.
Publicado a partir do repositório `hugoreiisc12/plum-sweet-menu`.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework SSR | **TanStack Start** (React 19, SSR via **Nitro**) |
| Bundler / dev | **Vite 8** (`vite.config.ts` próprio: TanStack Start + Tailwind + Nitro) |
| Estilos | **Tailwind CSS v4** (via `@tailwindcss/vite`, CSS-first, import em `src/styles.css`) |
| UI components | **shadcn/ui** + Radix (componentes em `src/components/ui/`) |
| 3D | **three 0.185** (`SweetsCover` + `SweetsCoverLib`) |
| Motion | **Rive** (`@rive-app/react-canvas`), **GSAP**, **motion** (framer) |
| Ícones | **lucide-react**; toasts **sonner**; sheets **vaul** |
| Forms | react-hook-form + zod |
| Roteamento | `@tanstack/react-router` (arquivo gerado `src/routeTree.gen.ts`) |

## Ambiente (toolchain)

- Gerenciador de pacotes: **Bun** (~1.3.x). **Não usar npm** — `package-lock.json`
  é ignorado pelo git; se um `npm i` rodar, apague o lockfile gerado.
- Node 20+ (desenvolvido com v24). Não há `.nvmrc`.
- Instalação: `bun install`.

### Variáveis de ambiente

Nenhuma é obrigatória. A única variável usada:

- `VITE_WHATSAPP_NUMBER` — sobrepõe o WhatsApp da loja (formato internacional,
  só dígitos). Sem ela, o app usa o número real `5521988073217`
  (`STORE_WHATSAPP_NUMBER` em `src/lib/menu-data.ts`). Se o valor não for só dígitos (10–15), o checkout
  bloqueia o envio (`isWhatsappConfigured`).

Crie `.env` a partir de `.env.example` se quiser sobrepor. **`.env*` é
ignorado pelo git** — nunca commitar.

## Comandos

| Comando | O que faz |
|---|---|
| `bun run dev` | Dev server (Vite + TanStack Start) |
| `bun run build` | Build de produção (SSR via Nitro → `.output/`) |
| `bun run preview` | Preview do build local |
| `bun run lint` | eslint (com plugin prettier: erros de formatação aparecem aqui) |
| `bun run lint --fix` | eslint com auto-fix (formatação + regras) |
| `bun run format` | prettier --write no repositório |
| `npx tsc --noEmit` | Type-check (strict) |

**Não há testes automatizados neste repositório.** O ciclo de verificação é:
`npx tsc --noEmit` → `bun run lint --fix` → `bun run build`. Sempre rodar os
três ao finalizar uma mudança.

## Estrutura

```
src/
├── routes/            # __root.tsx (layout, providers) · index.tsx (página única)
├── components/
│   ├── ui/            # shadcn/ui (Radix, bottom-sheet, etc.)
│   ├── SweetsCover.tsx + SweetsCoverLib/   # intro 3D (three.js) — ver abaixo
│   ├── Rive/          # componentes Rive + hooks, riveLazy, rive.ts
│   ├── BrandLogo.tsx, HeroCanvas.tsx, CartSheet.tsx, ProductSheet.tsx
│   ├── assets/products/  # imagens locais dos produtos (jpg)
│   └── *.pen          # arquivos criptografados do pen.dev (NÃO abrir com texto)
├── lib/
│   ├── cart-context.tsx   # estado do carrinho (localStorage)
│   ├── menu-data.ts       # categorias/produtos + WhatsApp env
│   ├── utils.ts           # cn() (tailwind-merge + clsx)
│   ├── error-page.ts / error-capture.ts
└── styles.css          # Tailwind v4 + tokens de cor (ver Branding)
```

- Alias de import: `@/*` → `./src/*` (tsconfig `paths`).
- `tsconfig` inclui `"types": ["vite/client"]` — os imports `?raw` e `?url`
  dos assets são tipados.

### Estado e dados

- **Carrinho**: React context em `src/lib/cart-context.tsx`, persistido em
  `localStorage` sob a chave `ninha-cart-v1`. UI: `src/components/CartSheet.tsx`.
- **Cardápio**: dados estáticos de categorias/produtos em `src/lib/menu-data.ts`.
  Imagens tanto por URL (Unsplash via helper `img()`) quanto via assets locais.
- **Pedido**: montagem + link `wa.me` com a mensagem; número de `VITE_WHATSAPP_NUMBER`.

## 3D — SweetsCoverLib (three.js)

O cover da página usa geometria **100% vetorial** construída a partir dos SVGs
de `src/assets/sweets/` (donut, pirulito, bombom, trufa) — **sem texturas
rasterizadas**. Detalhes e regras de construção em `SPEC/SKILL_VECTOR_3D.md`:

1. `SVGLoader.parse(text)` → paths (runtime apenas: usa `DOMParser`, não existe
   em SSR → sempre chamar dentro de `useEffect`, nunca no render/SSR);
2. Seleção de partes pelos gradients (`userData.style.fill = "url(#…)")`);
3. Por tipo: `ExtrudeGeometry` com `holes`, `LatheGeometry`, `SphereGeometry` +
   `TubeGeometry` (CatmullRomCurve3); sprinkles fusionados com `vertexColors`;
4. Normalização a box unitário; geometria/material **uma vez por tipo**, clonado
   por peça; `dispose()` único por campo.

## Rive

Componentes em `src/components/Rive/` (RiveHero, RiveProductCard,
RiveScrollAnimation, etc.) usam o **fallback de imagem** quando o `.riv` não
existe — o arquivo `ninha.riv` **não está no repositório** (é esperado:
documentação de setup em `public/animations/RIVE_SETUP_GUIDE.md`, referência
completa em `SPEC/SKILL_RIVE.md`). O estado machine usa **inputs numéricos**
(`StateMachineInputType` é enum numérico — não comparar com string).

## Branding — fonte da verdade (OBRIGATÓRIO)

Para **qualquer** componente/página/style visual, consulte primeiro
`SPEC/skill/ninha-brand/SKILL.md`. É o documento canônico:

- Paleta plum/cream/rose/coral/amber; tipografia **Fraunces + Figtree**;
- **Nunca inventar token novo** de cor/fonte/espaçamento;
- Não usar cores formatos modernos não suportados (ex.: OKLCH) — seguir o que o
  doc define.

## Backend (plano e decisões)

O backend Python **por debaixo do cardápio** está planejado e com decisões
travadas. O código vive **fora deste repositório**, em
`/Users/hugo/Desktop/CARDAPIO_NINHA/back-api-menu` (módulo Django próprio) —
nunca criar `plum-sweet-menu/backend/`. Leia antes de mexer em dados, checkout,
frete ou painel admin:

| Tarefa | Doc |
|---|---|
| Arquitetura, decisões travadas, fases, riscos | `docs/BACKEND_PLAN.md` |
| Schema do Postgres, invariantes, seed | `docs/DATA_MODEL.md` |
| Trazer o que já existe no iFood para o banco | `docs/IFOOD_IMPORT.md` |

Resumo do que está decidido: **Django 6 + DRF** · **Postgres local** ·
cardápio servido por `GET /api/v1/menu` (fallback estático) · **Mercado Pago
Brick embutido** no passo de Pagamento, sem redirect · **WhatsApp vira
notificação**, não checkout · rastreio por `tracking_code` + mapa com status e
ETA · **frete por tabela de bairro** (`delivery_zones`) · iFood entra por
**import manual** na fase 1 · **um único painel `/admin`** (cardápio, pedidos,
entrega, frete, iFood, loja).

O código do checkout atual (`src/lib/checkout.ts`, `src/components/CartSheet.tsx`,
`src/components/CheckoutSteps.tsx`) é a referência de regra de negócio: passo a
passo para o servidor. As funções puras `parseMoney`, `isValidPhone`,
`validateStep`, `buildOrderMessage` e `suggestProducts` **têm self-check** em
`scripts/check-checkout.ts` e `scripts/check-cross-sell.ts` — ao replicá-las no
Django, porte os testes junto (rodar `bun scripts/check-checkout.ts` e
`bun scripts/check-cross-sell.ts` para confirmar a referência).

Pendências bloqueantes que dependem da loja: tabela de frete por bairro,
horário de funcionamento real (o footer diz `10h–20h`, o código diz `h >= 14`),
credenciais do Mercado Pago e titularidade da conta iFood.

## Mapa dos docs `SPEC/`

| Tarefa | Doc |
|---|---|
| Qualquer UI (cor, fonte, card, sheet, botão, marca) | `SPEC/skill/ninha-brand/SKILL.md` |
| Checklist de UX/estilo (quando não é só aplicar a marca) | `SPEC/UI/UX.md` |
| Prototipagem exploratória (antes de virar React) | `SPEC/huashu.md` |
| 3D / geometria a partir de SVG | `SPEC/SKILL_VECTOR_3D.md` |
| Rive (referência completa) | `SPEC/SKILL_RIVE.md` · `SPEC/SKILL_3D.md` · `SPEC/skill_setup_guid.md` · `SPEC/skill_examples.tsx` |

## Skills para o agente (carregar)

Skills de IA disponíveis e **quando carregar cada uma** neste projeto. "Carregar"
= invocar a skill antes de executar a tarefa; o conteúdo vira instrução para o
agente. As skills vivem em `SPEC/skill/` (projeto, commitado) ou na config do agente.

### Obrigatórias — carregar no início de cada sessão

| Skill | Papel |
|---|---|
| `ninha-brand` | Fonte da verdade visual (cores paleta plum/cream/rose/coral/amber, Fraunces+Figtree, regras de componente). É a skill de projeto em `SPEC/skill/ninha-brand/SKILL.md` — **carregar antes de qualquer trabalho visual**. |
| `senior-engineering-core` | Postura de engenharia sênior (loop de trabalho, evidência, contrato de saída). Carregar **antes** de qualquer pedido técnico — mesmo os triviais. |

### 3D / Rive — quando a tarefa envolver geometria ou motion vetorial

| Skill | Papel |
|---|---|
| `3d-vector-rive-engineering` | Skill inline fornecida para construção 3D a partir de vetores/Rive (silhueta fiel, profundidade por regra, pipeline mínima). Normas já materializadas neste repo em `SPEC/SKILL_VECTOR_3D.md` e `SPEC/SKILL_3D.md`. |

### UI / Motion — tarefas visuais e de animação

| Skill | Papel |
|---|---|
| `emil-design-eng` | Decisões de polish e micro-interação (usar junto com `ninha-brand`). |
| `review-animations` | Revisar animação/motion contra régua de craft (aprovação é conquistada). |
| `animation-vocabulary` | Traduzir descrição vaga de efeito visual no termo técnico exato (ex.: pop-in, rubber-banding). |
| `uiux-pro-max` | Decidir estilo/paleta/tipografia de forma **justificada** (checklist de UX/acessibilidade; para quando não é só aplicar a marca). |
| `huashu-design` | Prototipar/explorar direções visuais em HTML/CSS/SVG antes de virar React (mockups navegáveis, reviews de design). |

### Higiene / qualidade — antes de commitar ou revisar

| Skill | Papel |
|---|---|
| `review-changes` | Higiene do diff antes do commit (comentários em excesso, duplicação, abstração). |
| `drytify` | Encontrar e remover duplicação genuína (cópias, gêmeos estruturais). |
| `council` | Decisões grandes/ambíguas (contraponto antes de bater o martelo). |
| `handoff` | Compactar a conversa em doc de handoff para o parceiro continuar. |

### Opcionais — conforme o fluxo de trabalho

| Skill | Quando |
|---|---|
| `detect-patterns` | Quando existir harness de patterns (`docs/_patterns.md`) a semear ou atualizar. |
| `to-doc` / `to-tickets` / `init-sdd` | Se o fluxo `agent-tasks/` evoluir para spec-driven completo (specs, bugs, ADRs, tickets). |
| `docs` | Quando o usuário pedir um documento vivo (spec, memo, PRD) para compartilhar/editar. |

Regra: a ausência de uma skill já carregada **não** desobriga seguir o que
`SPEC/` e `docs/AGENTS.md` definem — eles são a fonte de verdade persistente.

## Loop de tasks (agente ⇄ agente)

`agent-tasks/` coordena trabalho entre agentes de IA: `README.md` define o
protocolo (criar task em `tasks/NNN-slug.md`, marcar `pending → done/blocked`,
preencher `## Implementação`, registrar em `STATUS.md`, revisão em
`## Revisão`). **Consultar `SPEC/` antes de criar ou implementar qualquer task
visual**; nunca apagar task concluída.

## Regras duras

1. **Git**: não reescrever histórico publicado (nada de force-push,
   rebase/amend/squash de commits já enviados). Só commitar/push quando o
   usuário pedir.
2. **Nunca commitar segredos**: `.env*`, `security_config.json`, `opencode.json`
   estão no `.gitignore`. Cuidado com chaves/URLs acidentalmente coladas no
   código/documentos.
3. **Arquivos `.pen`** (em `src/components/`) são **criptografados** — somente via
   ferramentas MCP do pen.dev. Nunca ler/editar com Read/Grep/Edit.
4. **Bun, não npm** (`package-lock.json` é órfão e ignorado).
5. **`tssc/tsc`, eslint e build** são a validação do projeto — rodar sempre.
6. **Branding**: nunca inventar token visual; seguir `SPEC/skill/ninha-brand/SKILL.md`.
7. **Backend**: mudança de regra de negócio do cardápio/checkout/frete precisa
   atualizar `docs/BACKEND_PLAN.md` e `docs/DATA_MODEL.md` no mesmo commit. Preço
   é `price_cents` (int) em qualquer lugar novo — nunca float de BRL.
8. **Segredos do backend** (`backend/.env`, tokens do Mercado Pago) nunca vão para
   commit nem para documento.