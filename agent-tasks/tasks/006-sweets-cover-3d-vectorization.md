---
id: 006
title: Vetorização dos doces do SweetsCover em geometria 3D real (SVG → Three)
severity: medium
status: done
files:
  - src/components/SweetsCoverLib/materials.ts
  - src/components/SweetsCoverLib/geometry.ts
  - src/components/SweetsCover.tsx
  - SPEC/SKILL_VECTOR_3D.md
---

## Contexto

O cover (`SweetsCover.tsx`) rastreava o SVG em `CanvasTexture` e o aplicava
como `map` sobre um "puck" extruído genérico (rounded-rect) — o desenho em si
continuava 2D plano, com a silhueta mal aproveitada. Aprovado com o Hugo:
**geometria 100% vetorial**, derivada deterministicamente dos SVGs de origem
(`src/assets/sweets/*.svg`), usando a skill inline `3d-vector-rive-engineering`
(rota SVG → path → geometria via `SVGLoader`, sem texturas raster, sem GLB).

Docs `SPEC/` aplicáveis: `SPEC/skill/ninha-brand/SKILL.md` (cores derivadas dos
gradients dos SVGs, não tokens novos) e o desta task, `SPEC/SKILL_VECTOR_3D.md`.

## O que fazer

1. `SweetsCoverLib/materials.ts` — paleta vetorial (extraída de `url(#...)` dos
   SVGs) + fábrica `sweetMaterial()` (MeshPhysicalMaterial, clearcoat, PBR).
2. `SweetsCoverLib/geometry.ts` — `buildSweetField(id, shadowMat)`:
   - `donut.svg` → anel (Shape com `holes` = furo) extruído com bevel +
     glace (icing) como extrusão fina do furo + 21 sprinkles fundidos em
     uma geometria com `vertexColors` (cor por fill) + nonpareil esferas.
   - `pirulito.svg` → disco extruído (bola) + 6 pétalas (spiral) fundidas +
     palito extruído.
   - `bombom.svg` → cúpula de chocolate por `LatheGeometry` (perfil do lado
     direito, eixo no centro) + forminha extruída fina.
   - `trufa.svg` → `SphereGeometry` (raio do `<circle>`) + fios de chocolate
     (strokes de `url(#drizzleGrad)`) → `CatmullRomCurve3` → `TubeGeometry`
     projetados na superfície da esfera (z = √(r²−x²−y²)).
   - Normalização: union dos AABBs → translate(-centro) + scale(1/maxDim).
   - Geometria/material criados UMA vez por tipo; o template (`THREE.Group`) é
     clonado por peça (compartilha geo/material). Shadow = malha do body atrás.
3. `SweetsCover.tsx` — remover pipeline raster (`loadSvgTexture`,
   `buildPuckGeometry`, `roundedRectShape`, UVGenerator, `Promise.all`,
   imports `?url`); spawn **síncrono** a partir dos templates; manter
   loop de chuva/sway/tilt/spin, luz 3-pontos, PMREM, foreground e conteiners.
   `SWEET_KINDS`/`buildSweetField` substituem `KINDS` tipado.
4. Registrar a pipeline reutilizável em `SPEC/SKILL_VECTOR_3D.md`.

## Critério de aceite

- Doces surgem como volumes reais, não pucks texturizados; furo do donut
  visível, glace com espessura própria, cúpula do bombom e fios da trufa em
  relevo; silhueta = a do SVG (não primitivas soltas).
- Count de peças preservado: 24 (mobile, <640px) / 44 (desktop).
- Dispose completo (geo/material/templates/sombra+PMREM) no cleanup.
- `npx tsc --noEmit` e `vite build` limpos; sem warnings novos no bundle.

## Implementação

- `SweetsCoverLib/materials.ts` e `SweetsCoverLib/geometry.ts` criados com a
  pipeline acima; parâmetros de extrusão calibrados em unidades do viewBox de
  cada SVG (profundidade ~20–25% do maior eixo para leitura de volume).
- `SweetsCover.tsx` reescrito no pipeline vetorial.

Validação: `npx tsc --noEmit`; `eslint`; `vite build`; checagem visual no
`:8080` (docs em relevo, furo do donut, trufa rosa com fios).

- Validação executada: `tsc --noEmit` e `eslint` limpos (auto-fix só prettier);
  `vite build` passa. Probe via pencil_browser: 4/4 campos + 24 peças (mobile)
  sem exceção; canvas WebGL presente. Revisão estética dos doces pendente.

## Revisão

(pendente — Claude tech lead)