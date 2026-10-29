---
id: 001
title: Corrigir tipo do ref em RiveProductCard
severity: low
status: done
files:
  - src/components/Rive/RiveProductCard.tsx
---

## Contexto

`npx tsc --noEmit` reporta erro de tipo em `RiveProductCard.tsx`. Não quebra o
build (esbuild não type-checka), mas aparece como erro no editor/CI.

## Problema

```ts
const containerRef = useRef<HTMLDivElement>(null);
...
<motion.button ref={containerRef} ...>
```

`containerRef` está tipado para `HTMLDivElement` mas é usado como `ref` de um
`<motion.button>` (renderiza `<button>`). TS reclama que `HTMLDivElement` não é
`HTMLButtonElement`.

## O que fazer

Trocar:
```ts
const containerRef = useRef<HTMLDivElement>(null);
```
por:
```ts
const containerRef = useRef<HTMLButtonElement>(null);
```

## Critério de aceite

- `npx tsc --noEmit` não reporta mais erro nesse arquivo/linha.
- Nenhum outro comportamento muda (o ref não é usado para nada além do `ref={containerRef}` no botão).

## Implementação

Troquei `useRef<HTMLDivElement>(null)` por `useRef<HTMLButtonElement>(null)` em
`RiveProductCard.tsx` (o ref é usado apenas no `<motion.button ref={containerRef}>`).

Como o critério de aceite é `tsc --noEmit` limpo, também corrigi no mesmo arquivo o
erro pré-existente `RiveProductCard.tsx:43` (TS2367): `input?.type === "boolean"`
comparava com string, mas `StateMachineInputType` é enum numérico (`Boolean = 59`) —
agora usa `StateMachineInputType.Boolean` importado de `@rive-app/canvas/rive`.

Diff relevante:
```diff
- const containerRef = useRef<HTMLDivElement>(null);
+ const containerRef = useRef<HTMLButtonElement>(null);
```
```diff
- if (input?.type === "boolean") input.value = value;
+ if (input?.type === StateMachineInputType.Boolean) input.value = value;
```

Validação: `npx tsc --noEmit` sem erro nesse arquivo; `npm run build` passa.

## Revisão

**Aprovado.** Verifiquei independentemente (não só o relato): `npx tsc --noEmit` limpo, `npx vite build` passa, `npx eslint` sem erros. Li `RiveProductCard.tsx` — `containerRef` agora é `HTMLButtonElement`, único uso é o `ref` do `motion.button`, comportamento inalterado.

Bônus real do fix colateral (`StateMachineInputType.Boolean`): o `input?.type === "boolean"` original nunca dava match, porque `StateMachineInputType` é enum numérico — ou seja, o hover state machine do card **nunca estava sendo acionado**, mesmo com um `.riv` válido. Isso não era só ruído de tipo, era um bug funcional latente. Bom catch.
