---
id: 009
title: Fotos reais para os 8 produtos de Bebidas (substituir bebida.svg)
severity: low
status: done
files:
  - src/assets/products/coca-cola-200ml.jpg (novo)
  - src/assets/products/coca-cola-sem-acucar-200ml.jpg (novo)
  - src/assets/products/coca-cola-220ml.jpg (novo)
  - src/assets/products/coca-cola-350ml.jpg (novo)
  - src/assets/products/coca-cola-sem-acucar-350ml.jpg (novo)
  - src/assets/products/coca-cola-1-5l.jpg (novo)
  - src/assets/products/guarana-guaravita-290ml.jpg (novo)
  - src/assets/products/agua-com-gas-500ml.jpg (novo)
  - src/assets/products/bebida.svg (removido)
  - src/lib/catalog.ts
  - docs/CREDITS.md (novo)
---

## Contexto

Dos 9 produtos da categoria `bebidas` em `src/lib/catalog.ts`, 8 usavam
`image: photo("bebida")` — o placeholder `src/assets/products/bebida.svg`
(400×500, copo com canudo em gradiente da marca). Só `agua-sem-gas` tinha foto
real. As descrições são mínimas e é delas que sai a especificação do SKU:
"Garrafa 200ml", "Lata 220ml", "Lata 350ml", "Garrafa 1,5L", "Embalagem 290ml",
"Garrafa 500ml" — o diferenciador é embalagem + volume + variante
(Original × Sem Açúcar).

Docs `SPEC/` aplicáveis: `SPEC/skill/ninha-brand/SKILL.md`. O card já existe
(`ProductSheet.tsx`, `aspect-[4/5]` + `object-cover`), então nenhum token novo
foi criado; o único valor de marca usado foi `cream` (`#FAF2F4`) como fundo de
composição dos packshots.

## O que fazer

1. Um packshot por SKU, com embalagem, volume e variante corretos.
2. Recortar o produto do fundo de estúdio e recompor sobre `#FAF2F4` em
   900×1125 (4:5).
3. Salvar como `src/assets/products/<id-do-produto>.jpg`, trocar as 8 chamadas
   `photo("bebida")` pelo slug do próprio produto.
4. Remover `bebida.svg` e registrar origem/licença em `docs/CREDITS.md`.

## Critérios de aceite

- `grep 'photo("bebida")' src/lib/catalog.ts` vazio.
- 8 imagens em 4:5, nenhuma acima de ~120 KB.
- `npx tsc --noEmit`, `bun run lint`, `bun run build` verdes.
- Seed do backend (`back-api-menu/scripts/seed_from_catalog.py`) copiando os 8
  arquivos para `media/products/`.

## Implementação

**Fonte.** Banco de imagens foi descartado depois da pesquisa: Pexels e Unsplash
só têm cola genérica ou de marca estrangeira (incoerente com um card chamado
"Coca-Cola Original 200ml"); Wikimedia Commons tem `Guaravita.jpg` real, mas em
CC BY-SA e enquadramento amador; Open Food Facts tem os códigos de barra certos
com fotos de celular enviadas por usuário. A solução foi a API pública de
catálogo VTEX de dois varejistas brasileiros (Mambo e Prezuni), que devolve o
packshot do SKU exato:

```
GET https://www.mambo.com.br/api/catalog_system/pub/products/search?ft=<termo>
```

**Tratamento.** Os packshots não vinham em fundo branco — fundo de estúdio
coral, rosa, areia e cinza. Pipeline local (scripts descartáveis, fora do repo):

1. `VNGenerateForegroundInstanceMaskRequest` (Vision, macOS 26) para recortar o
   produto;
2. recomposição sobre `#FAF2F4` em canvas 900×1125, produto centralizado
   ocupando ~88% da altura;
3. JPG 62–82 — 8/8 abaixo de 120 KB;
4. validação do recorte por bbox: o retângulo do produto no resultado foi
   conferido contra o tamanho esperado (desvio ≤ 2% em todos).

**Código.** `catalog.ts`: 8 substituições `photo("bebida")` → `photo("<id>")`.
Nenhum import novo — `PHOTOS` usa `import.meta.glob` eager, então basta o arquivo
existir (e `photo()` estoura no build se o slug não bater, o que serve de
validação). `bebida.svg` removido: era o único uso.

**Registro.** `docs/CREDITS.md` com tabela SKU → loja de origem → ID da imagem,
o tratamento aplicado e a nota de licença (são embalagens de marca registrada,
mesmo uso de qualquer cardápio/delivery; o caminho para eliminar a dependência é
fotografar as embalagens da loja mantendo os mesmos nomes de arquivo).

## Revisão
