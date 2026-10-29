---
id: 005
title: Aumento de label "Ninha Cakes" e mascote no cover (+10–15px)
severity: low
status: done
files:
  - src/components/BrandLogo.tsx
  - src/components/SweetsCover.tsx
---

## Contexto

Cobertura de entrada (`SweetsCover.tsx`) usa o mascote e o `BrandLogo size="xl"`
centrado. Aprovado com o Hugo: aumentar label e mascote em ~+14px, **somente no
app React** (não mexer nos `.pen`).

Docs `SPEC/` aplicáveis: `SPEC/skill/ninha-brand/SKILL.md` (só reescala de
elementos existentes — nenhum token novo, fontes intactas).

## O que fazer

1. `BrandLogo.tsx` — variante `xl`:
   - `Ninha`: `text-[clamp(70px,25vw,109px)]` → `text-[clamp(84px,28vw,123px)]`
   - `Cakes`: `text-[clamp(36px,14vw,65px)]` → `text-[clamp(50px,16vw,79px)]`
2. `SweetsCover.tsx` (linha ~411) — mascote:
   - `w-[min(46vw,240px)]` → `w-[min(50vw,254px)]`

## Critério de aceite

- Mascote chega a 254px no desktop e ~+16px em celular de 390px.
- Label cresce ~+14px no cap e ~+11px em mobile (sem estouro vertical em
  altura 667px — hint de scroll já some em `max-height:700px`).
- `npx tsc --noEmit` e `vite build` limpos.

## Implementação

- `BrandLogo.tsx`: ajustados os dois `clamp` da variante `xl` (valores acima).
- `SweetsCover.tsx`: `className` do `<img>` do mascote → `w-[min(50vw,254px)]`.

Validação: `npx tsc --noEmit` limpo; `vite build` passa após task 006 (build
rodado no final do batch para poupar um ciclo).

## Revisão

(pendente — Claude tech lead)