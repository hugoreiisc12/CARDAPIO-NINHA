---
name: ninha-brand
description: Branding da Ninha Cakes (doceria artesanal — paleta plum/cream/rose/coral/amber, tipografia Fraunces+Figtree). Use SEMPRE ao criar, recriar ou estilizar qualquer componente, página, tela, card, header, footer, botão, badge, sheet, dock, arquivo .pen, texto ou recurso visual no projeto — define cores, fontes, assinaturas visuais, padrões de componente e convenções de layout. Trigger: "componente", "página", "tela", "screen", ".pen", "paleta", "cores", "fontes", "branding", "recriar no pen.dev".
---

# Ninha Cakes — Guia de Branding

Identidade visual do **Cardápio Digital Ninha Cakes** (one-page). Regra de ouro: **todo novo componente/página/arquivo .pen deve partir destes tokens — nunca inventar cores, fontes ou estilos novos.** Fontes de verdade: `src/styles.css` (tokens) e `src/lib/menu-data.ts` (catálogo).

---

## 1. Paleta

Todas as cores em hex (`#RRGGBB`). **Nunca usar OKLCH** — não renderiza.

### Plums (dark — fundos principais)
| Token | Hex | Uso |
|---|---|---|
| `plum-950` | `#2E0F1F` | Fundo mais escuro (footer, overlays `plum-950/60`) |
| `plum-900` | `#46182F` | Primário escuro — header, hero, área de imagem do sheet |
| `plum-700` | `#5C2440` | Hover de botões escuros |
| `plum-500` | `#7A3355` | Acento plum médio |

### Creams (light — fundos/cards)
| Token | Hex | Uso |
|---|---|---|
| `cream-50` | `#FFFCFB` | Fundo claro principal (corpo, cards, sheets) |
| `cream-100` | `#FAF2F4` | Fundo claro alternativo |
| `cream-200` | `#F0E0E6` | Bordas, divisores, drag handle, stroke do outline |

### Ink (texto sobre claro)
| Token | Hex | Uso |
|---|---|---|
| `ink` | `#3A1526` | Títulos/texto forte sobre fundo claro |
| `ink-soft` | `#6E4A5C` | Texto de apoio sobre fundo claro |

### Gradiente de marca (accent)
| Token | Hex | Uso |
|---|---|---|
| `rose` | `#E58AA0` | Início do gradiente |
| `coral` | `#E2795B` | Meio do gradiente |
| `amber` | `#E9A25C` | Fim do gradiente |

O **gradiente de marca** (rose → coral → amber) é a assinatura da casa: eyebrows (`text-gradient-brand`), pills/tags de produto, bolinhas do marquee, ring gradiente atrás do bolo do hero, badges de "Feito à mão"/"Top".

### Semânticos
| Token | Hex | Uso |
|---|---|---|
| `rose-dark` | `#C86E88` | Variação escura do rose |
| `success` | `#2F7D5B` | Status "Aberto" / badges positivos |
| `error` | `#B03A48` | Status "Fechado" / erros |

### Sombra e raio
- `shadow-warm`: `0 8px 24px rgba(46, 15, 31, 0.12)` — sombra padrão de cards e sheets
- Raio padrão `--radius`: `1.25rem` (20px) → cards `rounded-[24px]` (ou `--radius-lg` 20px); pills/botões `rounded-full`

---

## 2. Tipografia

| Papel | Fonte | Detalhes |
|---|---|---|
| Display (títulos, logo, nomes, preços, marquee) | **Fraunces** (`font-display`) | Serifada, usar **muito itálico** (`italic`). Pesos 500/600 |
| Corpo (texto, eyebrows, botões, badges) | **Figtree** (`font-sans`) | `font-sans`, pesos 400–700 |

Convenções:
- **Eyebrow** (legenda de seção): Figtree `font-semibold` (600), `uppercase`, `tracking-[0.28em]`, ~12px. Ou em plum-700, ou **gradiente de marca** (`text-gradient-brand`).
- **H1/H2**: Fraunces italic, pesos 500/600. Ex: "Doces que abraçam" (hero), "Favoritos da casa" (seções).
- **Preços**: Fraunces, formato pt-BR (`R$ 145,00`); "Sob consulta" em placeholder.
- **text-outline** (palavras gigantes só com contorno): usar `-webkit-text-stroke`, `color: transparent`.
  - `text-outline-cream`: `1.5px cream-200` → palavra "doces" gigante no hero, watermark "Ninha" no footer/quote band (sobre plum)
  - `text-outline-plum`: `1.5px rgba(70,24,47,0.25)` → números `01`–`06` das categorias (sobre claro)

---

## 3. Assinaturas visuais (repetir em tudo)

- **Eyebrow gradiente** — texto em `text-gradient-brand` (rose→coral→amber), uppercase
- **Pills de tag** — `rounded-full` com gradiente de marca (ou plum-900) + texto cream; ex: "Mais pedido", "Novidade", "Sazonal", "Sob encomenda"
- **Ring gradiente do bolo** — anel circular com gradiente de marca atrás da foto do bolo no hero (pulsante, ver `pulse-ring`)
- **Dots do marquee** — bolinhas com gradiente de marca separando nomes no ribbon
- **Marquee** — faixa horizontal com nomes de doces em Fraunces italic + dots, scroll infinito (`@keyframes marquee`)
- **Grão de papel** — overlay fractal noise com opacidade ~0.045 sobre o body (textura rústica)
- **Fundo pontilhado** — radial dots (plum ~5% + rose ~6%, grid ~26px) em áreas claras
- **Divider em onda** — curva SVG em cream separando o hero plum do conteúdo claro
- **Watermark "Ninha"** — palavra gigante em outline por trás do conteúdo (quote band, footer)
- **StatusBadge** — pill com dot pulsante (success = "Aberto", error = "Fechado")
- **Swash** — traço/curva decorativa no hero
- **SVGs de doces** — ilustrações `src/assets/sweets/`: `donut.svg`, `pirulito.svg`, `bombom.svg`, `trufa.svg` (gloss/3D style); usadas na capa 3D (`SweetsCover`) e como decoração

---

## 4. Padrões de componentes

| Componente | Especificação |
|---|---|
| **ProductCard** | Imagem 4:5 topo (`rounded-t-[24px]`, hover zoom `scale(1.06)`), pills de tag sobrepostas, nome Fraunces italic, descrição `ink-soft`, linha com preço (Fraunces) + botão add (`rounded-full`, plum-900). Card `bg-cream-50 rounded-[24px] shadow-warm` |
| **Botão primário** | `rounded-full`, `bg-plum-900` text cream, hover `bg-plum-700`. CTA de carrinho usa gradiente de marca |
| **Botão WhatsApp** | Fundo gradiente de marca (rose→coral→amber) ou plum-900, com ícone WhatsApp |
| **BottomSheet** | Mobile: bottom sheet `rounded-t-[24px]` + drag handle (`h-1.5 w-10 bg-cream-200`). Desktop: modal central `max-w-lg rounded-[24px]`. Overlay `plum-950/60` com blur. Rodapé com CTA fixo + safe-area |
| **Dock** | Estilo macOS, barra inferior centralizada, ícones dos 6 setores + carrinho, efeito magnético (escala perto do cursor) |
| **FABs** | Botões flutuantes fixos: carrinho (com badge de qty) + WhatsApp |
| **Header** | Sticky, `bg-plum-900`, logo `BrandLogo` + `StatusBadge` |
| **Footer** | `bg-plum-950`, 3 colunas (Endereço `MapPin`, Horário `Clock`, Instagram), copyright + watermark "Ninha" outline |
| **SectionHeader** | Eyebrow gradiente + título Fraunces italic (40–56px) + barra gradiente (curta) ou número outline `01`–`06` |

### Convenções de layout
- Container: `max-w-7xl` (~1200px) centralizado, padding lateral `px-6`–`px-8`
- Padding vertical de seção: ~96–128px
- Grids: categorias 3 colunas desktop / 2 mobile; "Favoritos" em scroll horizontal
- Cards `rounded-[24px]`; pills e botões `rounded-full`; `shadow-warm` em tudo que flutua

---

## 5. Convenções para arquivos `.pen` (pen.dev)

- Arquivos em `src/components/*.pen` (ex.: `sweets-cover.pen` já criado, 1440×900)
- Formato **JSON puro, version `2.x`** — pode ser escrito/validado direto (formato aberto)
- **Nunca OKLCH**: usar só hex (`#RRGGBB`)
- Definir `variables` de paleta no topo do arquivo: `plum-950` … `cream-200`, gradiente de marca (rose→coral→amber), `ink`, `ink-soft`, `shadow-warm`
- Componentes reutilizáveis (ProductCard, Button, Pill, SectionHeader, BrandLogo) com `reusable: true`, instanciados via `ref` + `slot` (manter `textGrowth` para auto-height em textos)
- **Imagens**: referenciar arquivos locais por caminho relativo ao `.pen` em `src/components/assets/products/<slug>.jpg` (fotos dos produtos já baixadas localmente); SVGs de doces em `src/assets/sweets/`
- Fontes referenciadas por família (`Fraunces`, `Figtree`) — renderizam do sistema local; se não instaladas, caem para serifa/sans padrão
- Frames de tela: mobile 390–430 de largura; desktop 1440

---

## 6. Mapa das telas

**Home** (one-page) — frame desktop ~1440×~5600, em ordem:
1. Header sticky (plum-900 + BrandLogo + StatusBadge)
2. Hero plum-900: outline gigante "doces" (cream), eyebrow "Doceria artesanal", H1 **"Doces que abraçam"** (gradiente em "abraçam"), parágrafo, **card flutuante do bolo** (ring gradiente + foto circular + badges "Feito à mão"/"+200 pedidos/mês"), faixa de confiança 3 colunas (entrega/qualidade/pagamento), swash decorativo, divider em onda
3. Marquee (nomes de doces + dots)
4. **Favoritos da casa** — 4 cards em scroll (featured)
5. **6 categorias** com números outline `01`–`06`: Bolos (4) · Tortas (3) · Docinhos de festa (3) · Sobremesas na taça (2) · Chocolates (2) · Encomendas (1) — cada uma com SectionHeader + grid de ProductCards
6. Banda "Orçamento personalizado" (após Tortas) — foto circular + CTA WhatsApp
7. Footer plum-950 (Endereço/Horário/Instagram) + watermark "Ninha"
8. FABs flutuantes (carrinho + WhatsApp) + Dock (6 categorias)

**ProductSheet** (bottom-sheet): imagem plum 4:5 com X fechar → pills de tags → nome Fraunces italic → descrição → preço → variações em pills (ex: Tamanho P/M/G com priceDelta) → stepper de quantidade → CTA "Adicionar ao carrinho". Variante "Sob consulta": sem preço, CTA "Pedir pelo WhatsApp" + nota de pedido mínimo quando houver.

**CartSheet** (bottom-sheet): estado vazio (ícone + "Seu carrinho está vazio") OU linhas de item (imagem ~80px `rounded`, nome, resumo de variação, stepper qty, subtotal da linha, botão remover) → subtotal → "Finalizar pedido no WhatsApp" → "Continuar comprando".

---

## 7. Catálogo de produtos (`src/lib/menu-data.ts`)

15 produtos em 6 categorias. Fotos locais: `src/components/assets/products/<slug>.jpg`.

### Bolos — "Bolos artesanais"
| slug | nome | preço | tags | extras |
|---|---|---|---|---|
| `red-velvet` | Red Velvet | R$ 145,00 | Mais pedido | ⭐featured · variação Tamanho P(±0)/M(+60)/G(+120) |
| `ninho-morango` | Bolo de Ninho com Morango | R$ 155,00 | Mais pedido | ⭐featured |
| `chocolate-belga` | Chocolate Belga | R$ 165,00 | Novidade | |
| `cenoura-brigadeiro` | Cenoura com Brigadeiro | R$ 110,00 | — | |

### Tortas — "Tortas geladas"
| slug | nome | preço | extras |
|---|---|---|---|
| `limao-siciliano` | Torta de Limão Siciliano | R$ 125,00 | ⭐featured |
| `banoffee` | Banoffee | R$ 130,00 | |
| `holandesa` | Torta Holandesa | R$ 135,00 | |

### Docinhos de festa — "Docinhos gourmet"
| slug | nome | preço | tags | extras |
|---|---|---|---|---|
| `brigadeiro-gourmet` | Brigadeiro Gourmet | R$ 4,50 | Mais pedido | ⭐featured · mín. 25 un |
| `beijinho` | Beijinho | R$ 4,50 | — | mín. 25 un |
| `ninho-nutella` | Ninho com Nutella | R$ 5,50 | Novidade | mín. 25 un |

### Sobremesas na taça — "Servido na taça"
| slug | nome | preço |
|---|---|---|
| `pave-ninho` | Pavê de Ninho | R$ 24,00 |
| `mousse-maracuja` | Mousse de Maracujá | R$ 22,00 |

### Chocolates — "Chocolates artesanais"
| slug | nome | preço | tags |
|---|---|---|---|
| `ovo-colher` | Ovo de Colher | R$ 89,00 | Sazonal |
| `barra-recheada` | Barra Recheada | R$ 45,00 | — |

### Encomendas — "Sob encomenda"
| slug | nome | preço | tags |
|---|---|---|---|
| `bolo-personalizado` | Bolo Personalizado | **Sob consulta** | Sob encomenda |

**Favoritos (featured)** — 4: `red-velvet`, `ninho-morango`, `limao-siciliano`, `brigadeiro-gourmet`.

Helpers disponíveis em `menu-data.ts`: `formatPrice` (pt-BR BRL), `buildWhatsappLink`, `buildCartWhatsappMessage`, `formatVariationSummary`. WhatsApp: `5511999999999`.

---

## 8. Fontes de verdade (consultar antes de criar)

- `src/styles.css` — tokens, utilities (`text-gradient-brand`, `text-outline-cream/plum`), keyframes (`marquee`, `soft-float`, `pulse-ring`, `reveal-up`, `shimmer-bg`), grain, dotted bg
- `src/lib/menu-data.ts` — catálogo, preços, variações, helpers de WhatsApp
- `src/assets/sweets/` — SVGs de doces
- `src/components/` — componentes React atuais e arquivos `.pen`
- `src/components/ui/` — shadcn/radix (dock, bottom-sheet, button, badge, etc.)
- `src/routes/index.tsx` — composição das telas; `src/routes/__root.tsx` — fonts, grão, pontilhado, 404
