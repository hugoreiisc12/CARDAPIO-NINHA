---
id: 008
title: Remover SweetsCover.tsx morto que quebrava o gate de tsc
severity: medium
status: done
files:
  - src/components/SweetsCover.tsx (removido)
---

## Contexto

`src/components/SweetsCover.tsx` é sobra da capa 3D de entrada, cuja lib
(`src/components/SweetsCoverLib/`) já não existe nem em `HEAD`. O arquivo estava
editado na working tree (import de `PIECES` removido, usos mantidos), o que
produzia 5 erros de `tsc` e derrubava o gate do projeto:

```
src/components/SweetsCover.tsx(15,20): TS2304 Cannot find name 'PIECES'.
src/components/SweetsCover.tsx(198,19): TS2304 Cannot find name 'PIECES'.
src/components/SweetsCover.tsx(201,34): TS2304 Cannot find name 'PIECES'.
src/components/SweetsCover.tsx(287,27): TS2552 Cannot find name 'PIECES'.
src/components/SweetsCover.tsx(290,25): TS2731 Implicit conversion of a 'symbol' to 'string'.
```

Evidência de que é código morto:

- nenhum arquivo em `src/` importa `SweetsCover` (`grep -rn SweetsCover src/`
  devolve só a própria definição);
- a introdução da página hoje é o hero com mascote, em `src/routes/index.tsx`;
- `src/components/SweetsCoverLib/` não existe no working tree nem em `HEAD`;
- `three` não é importado em nenhum lugar de `src/` e `src/assets/sweets/`
  (SVGs donut/pirulito/bombom/trufa) também não existe mais.

Reparar em vez de remover exigiria recriar `SweetsCoverLib/pieces.ts` com 40
posições e 4 PNGs de doce — nenhum dos assets está no repo, e o componente não
está montado em lugar nenhum.

Docs `SPEC/` aplicáveis: `SPEC/skill/ninha-brand/SKILL.md` — não há mudança
visual esperada, o componente não é renderizado.

## O que fazer

Remover `src/components/SweetsCover.tsx` com `git rm`.

## Critérios de aceite

- `npx tsc --noEmit` sem nenhuma saída.
- `bun run lint` e `bun run build` verdes.
- `grep -rn "SweetsCover" src/` sem resultados.

## Implementação

`git rm src/components/SweetsCover.tsx`.

- `npx tsc --noEmit` → saída vazia (antes: 5 erros).
- `grep -rn "SweetsCover" src/` → sem resultados.
- Nenhum import, rota ou teste referenciava o componente.

**Pendência conhecida (fora do escopo):** `docs/AGENTS.md` e `README.md` ainda
citam `SweetsCover` + `SweetsCoverLib`/three.js na stack, na árvore de pastas e
na seção "3D — SweetsCoverLib". São trechos já desatualizados antes desta task
(a árvore lista até `HeroCanvas.tsx`, que também não existe). Não foram
reescritos aqui para não misturar refactor de documentação com a correção;
vale uma task própria de saneamento de docs.

## Revisão
