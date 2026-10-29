---
id: 007
title: Quebrar arquivos/funções acima do limite do hook de tamanho (300 linhas / 30 por função)
severity: low
status: pending
files:
  - src/components/CheckoutSteps.tsx
  - src/components/CartSheet.tsx
  - src/lib/catalog.ts
  - src/components/ProductSheet.tsx
  - src/routes/index.tsx
---

## Contexto

O commit do checkout em etapas + cardápio do iFood + venda cruzada (2026-09-23)
entrou com `--no-verify`, decisão do Hugo: o hook `~/.claude/hooks/nio/check-code-size.py`
bloqueia arquivo > 300 linhas e função > 30 linhas. Parte das violações já existia
(`index.tsx` com a função `Menu` de ~445 linhas, `ProductSheet`, `RiveOrcamentoBanner`);
parte veio desse commit.

Docs `SPEC/` aplicáveis: `SPEC/skill/ninha-brand/SKILL.md` (nenhuma mudança visual
é esperada — refactor puro).

## O que fazer

Refactor **sem mudança de comportamento**, por responsabilidade:

1. `CheckoutSteps.tsx` (341 linhas) → uma pasta `src/components/checkout/` com um
   arquivo por etapa (`DeliveryStep`, `CustomerStep`, `PaymentStep`, `ReviewStep`,
   `SentStep`) + `Choice`/`CheckoutProgress` compartilhados.
2. `CartSheet.tsx` → extrair o rodapé por etapa (`CheckoutFooter`) e a lista do
   carrinho (`CartLines` + `EmptyCart`) para arquivos próprios; manter no `CartSheet`
   só o estado da esteira.
3. `catalog.ts` (349 linhas, quase só dados) → um arquivo por categoria em
   `src/lib/catalog/` e um `index.ts` que monta `categories`/`featuredProducts`.
4. `index.tsx` → extrair Header, Hero, Footer, FABs e `ProductCard` para componentes.
5. `ProductSheet.tsx` → extrair o rodapé (quantidade + CTA) e o bloco de variações.

## Critérios de aceite

- `git commit` passa pelo hook sem `--no-verify` para os arquivos tocados.
- `npx tsc --noEmit` (fora `SweetsCover.tsx`), `eslint` nos arquivos tocados,
  `bun scripts/check-checkout.ts`, `bun scripts/check-cross-sell.ts` e `bun run build` verdes.
- Fluxo no navegador idêntico: produto → "Combina com" → carrinho → "Que tal levar
  também?" → 4 etapas → revisão.

## Implementação

## Revisão
