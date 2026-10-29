# SKILL_VECTOR_3D — Pipeline vetorial determinística (SVG → geometria Three)

> Padrão reutilizável deste projeto para renderizar assets vetoriais como
> geometria 3D real em **three.js**, sem rasterização nem etapas externas.
> Aplicado em `SweetsCoverLib` (task 006). Linguagem: TypeScript / three.js.

## Princípio

Quando a fonte do asset é **vetorial** (`.svg`), a forma 3D deve derivar da
silhueta e das partes do próprio SVG — **nunca** de primitivas soltas nem de
texturas rasterizadas. Requisitos derivados da skill `3d-vector-rive-engineering`:

- **Determinística**: mesmo SVG → mesma geometria, sempre (sem aleatório no build).
- **Fidelidade**: silhueta, proporção e profundidade relativas iguais ao desenho;
- **Profundidade por regra**: `z` é função explícita da parte (extrusão bevel,
  lathe, tube) — nada de "chutômetro de aparência";
- **Sem etapas mortas**: sem Blender, sem GLB, sem CDN — a pipeline tem UMA rota;
- **Medir**, não assumir: verificação por critérios observáveis (furo aberto,
  glace com espessura, relevo dos fios).

## Pipeline

```
SVG  --?raw-->  SVGLoader.parse(text)          (uso em runtime: parse usa DOMParser)
     --> paths (THREE.ShapePath, userData.style preenchido p/ defs/gradients)
     --> collectFilled(): shapes com fill "url(#…)"  (+ collectStrokes para strokes)
     --> por kind: Shape(holes) → ExtrudeGeometry | LatheGeometry | Sphere + Tube
     --> normalizeGeometries(): union AABB → translate(-centro) → scale(1/maxDim)
     --> template (THREE.Group): 1 geo + 1 material POR TIPO, clonado por peça
     --> shadow = malha do body (dark transparent) atrás do template
```

### Regras da construção por tipo

| Parte | Técnica | Em unidades do viewBox do SVG |
| --- | --- | --- |
| Silhueta plana (anel, disco, forminha) | `Shape` + `ExtrudeGeometry` com bevel | profundidade ~20–25% do maior eixo |
| Glace / cobertura fina | extrusão fina com furo (`holes`) | espessura ~½ da massa |
| Cúpula (chocolate) | `LatheGeometry` com perfil do lado direito | raio ≈ meia-largura, seguindo o path |
| Bola / esfera | `SphereGeometry` a partir do `<circle>` | raio = r do circle |
| Fios em relevo (drizzle) | strokes → `subPaths.getPoints()` → `CatmullRomCurve3` → `TubeGeometry` | raio do tubo ~9–10% do raio da esfera |
| Confeitos (sprinkles) | várias extrusões → `mergeGeometries` + `vertexColors` (cor fixa por fill) | 1 cor por parte do SVG |

### Decisões de engenharia

- **Seleção por painel**: gradients ficam em `userData.style.fill/stroke` como
  `"url(#nome)"` — usa-se isso para escolher partes, nunca cor hardcoded de
  posição.
- **Merge + vertexColors**: sprinkles pedem 1 cor por parte → merge preserva a
  ordem dos `getAttribute("position").count` por bloco (sem `useGroups`).
- **Normalização**: geometrias de cada campo são normalizadas juntas (box
  unitário), preservando as relações relativas entre partes (glace vs massa).
- **Compartilhamento**: geometria e material são criados UMA vez por tipo e
  compartilhados entre clones do template → custo por peça é desprezível;
  `dispose()` único por campo.
- **Normals**: extruge/lathe/sphere já geram normals; após `translate+scale`
  uniforme as normals continuam válidas. **Não** recomputar.
- **Cores**: extraídas dos gradients (token-semente da brand), nunca inventadas
  — ver `SPEC/skill/ninha-brand/SKILL.md`.

## Critérios de aceite observáveis

- A silhueta renderizada = a do SVG (sobreponha o trace);
- A parte de relevo é visível em perfil (glace, fios, cúpula);
- O furo/anel é um furo real (geometria, não textura);
- Bounding box aproximada do asset respeita box unitário; peças compartilham
  disposição; `vite build` e `tsc --noEmit` limpos.

## Cuidados

- `SVGLoader.parse` usa `DOMParser` — runtime apenas (dentro de `useEffect`).
- `mergeGeometries` lança em casos vazios → sempre guardar (`mergeParts`/`try`).
- Bevel + `holes`: verificar no render (artefatos → remover bevel e usar depth).
- Não adicionar etapas (UV mapping, texturas) sem necessidade real no protótipo.