---
id: 002
title: Corrigir inferência genérica do riveLazy
severity: low
status: done
files:
  - src/components/Rive/riveLazy.tsx
  - src/routes/index.tsx
---

## Contexto

`npx tsc --noEmit` reporta 3 erros em `src/routes/index.tsx`, nas linhas onde
`riveLazy(...)` é chamado para `RiveHero`, `RiveOrcamentoBanner` e `RiveShowcase`.
Não bloqueia o build (esbuild ignora tipos), mas gera ruído no editor/CI.

## Problema

`riveLazy<TProps extends object>(importer, fallback)` depende de TS inferir
`TProps` a partir do retorno do `importer`. Na prática, ao inferir através do
tipo `ComponentType<TProps>` (que é uma união `FunctionComponent | ComponentClass`),
o TS produz uma união espúria com `ComponentType<never>`, e o erro aparece nos
3 call sites em `index.tsx`:

```ts
const LazyRiveHero = riveLazy(
  () => import("@/components/Rive/RiveHero").then((m) => ({ default: m.RiveHero })),
  null,
);
```

## O que fazer

1. Exportar as interfaces de props dos 3 componentes (hoje são `interface X {...}`
   sem `export`):
   - `src/components/Rive/RiveHero.tsx` → `export interface RiveHeroProps`
   - `src/components/Rive/RiveOrcamentoBanner.tsx` → `export interface RiveOrcamentoBannerProps`
   - `src/components/Rive/RiveShowcase.tsx` → `export interface RiveShowcaseProps`
2. Em `src/routes/index.tsx`, importar os tipos e passar o generic explicitamente
   em cada chamada, para não depender da inferência bidirecional que está falhando:

```ts
import type { RiveHeroProps } from "@/components/Rive/RiveHero";
import type { RiveOrcamentoBannerProps } from "@/components/Rive/RiveOrcamentoBanner";
import type { RiveShowcaseProps } from "@/components/Rive/RiveShowcase";

const LazyRiveHero = riveLazy<RiveHeroProps>(
  () => import("@/components/Rive/RiveHero").then((m) => ({ default: m.RiveHero })),
  null,
);
const LazyRiveOrcamentoBanner = riveLazy<RiveOrcamentoBannerProps>(
  () => import("@/components/Rive/RiveOrcamentoBanner").then((m) => ({ default: m.RiveOrcamentoBanner })),
  null,
);
const LazyRiveShowcase = riveLazy<RiveShowcaseProps>(
  () => import("@/components/Rive/RiveShowcase").then((m) => ({ default: m.RiveShowcase })),
  null,
);
```

3. Se ainda sobrar erro de inferência depois disso, é aceitável ajustar a
   assinatura de `riveLazy` (ex.: remover o `= null` default do parâmetro
   `fallback` e exigir explicitamente, ou tipar `fallback` fora do bloco
   genérico) — desde que os 3 call sites continuem funcionando sem `as any`.

## Critério de aceite

- `npx tsc --noEmit` não reporta mais os 3 erros em `index.tsx`.
- Nenhum `as any` / `@ts-ignore` usado para silenciar o erro.
- `npx vite build` continua passando.

## Implementação

1. Exportadas as interfaces nos 3 componentes: `RiveHeroProps` (RiveHero.tsx),
   `RiveOrcamentoBannerProps` (RiveOrcamentoBanner.tsx), `RiveShowcaseProps`
   (RiveShowcase.tsx).
2. Em `src/routes/index.tsx`, importados os tipos e passado o generic explícito
   nos 3 call sites:

```ts
import type { RiveHeroProps } from "@/components/Rive/RiveHero";
import type { RiveOrcamentoBannerProps } from "@/components/Rive/RiveOrcamentoBanner";
import type { RiveShowcaseProps } from "@/components/Rive/RiveShowcase";

const LazyRiveHero = riveLazy<RiveHeroProps>(...);
const LazyRiveOrcamentoBanner = riveLazy<RiveOrcamentoBannerProps>(...);
const LazyRiveShowcase = riveLazy<RiveShowcaseProps>(...);
```

Não foi preciso alterar a assinatura de `riveLazy` — o generic explícito eliminou
a inferência bidirecional que produzia a união espúria com `ComponentType<never>`.
Sem `as any`/`@ts-ignore`.

Validação: `npx tsc --noEmit` sem erro; `npm run build` passa.

## Revisão

**Aprovado.** Confirmei os 3 `export interface` (grep em `RiveHero.tsx:7`, `RiveShowcase.tsx:6`, `RiveOrcamentoBanner.tsx:8`), `tsc --noEmit` limpo, `vite build` passa, sem `as any`/`@ts-ignore`. `riveLazy.tsx` ficou intocado como relatado — o generic explícito nos 3 call sites em `index.tsx` foi suficiente.

Revisei o `git diff` completo de `index.tsx`: o restante das mudanças no arquivo (carrinho `CartSheet`/`useCart`, formatação Prettier) é de outra frente de trabalho, não relacionado a esta task. Confirmado também que `RiveProductCard`/`RiveScrollAnimation` (tasks 003/004) **não** foram integradas em `index.tsx` — como pedido, ficou fora do escopo.
