---
id: 011
title: Trocar a foto da Água sem Gás pelo packshot Crystal 500ml
severity: low
status: done
files:
  - src/assets/products/agua-sem-gas.jpg
  - docs/CREDITS.md
---

## Contexto

`agua-sem-gas.jpg` era a única foto da categoria fora do padrão: 500×375
(paisagem, 4:3), vinda da migração do iFood em 2026-09-23. No card 4:5 com
`object-cover` ela era recortada e ficava visivelmente menor que as vizinhas.
As outras 8 bebidas já tinham sido trocadas por packshots (task 009).

## O que fazer

Mesma pesquisa e mesmo pipeline da task 009: packshot do SKU, recorte do fundo
via Vision, recomposição sobre `#FAF2F4` em 900×1125, JPG abaixo de 120 KB.
Preferência por **Crystal sem gás 500ml**, da mesma linha da água com gás que já
está no catálogo, para as duas águas ficarem coerentes.

## Critérios de aceite

- `agua-sem-gas.jpg` em 900×1125, < 120 KB.
- Nome do arquivo inalterado (o `photo("agua-sem-gas")` e o seed do back não mudam).
- `docs/CREDITS.md` com a origem da nova imagem.

## Implementação

Fonte: Mambo (VTEX) — "Água Mineral sem Gás Crystal 500ml", imagem `248274`
(`mambodelivery.vteximg.com.br/arquivos/ids/248274`), 1000×1000, fundo cinza
claro (`#EDEEF0`).

Pipeline idêntico ao da task 009 (Vision `VNGenerateForegroundInstanceMaskRequest`
→ composição em `#FAF2F4` → 900×1125). Bbox do produto no resultado: 306×984,
desvio de 1% em relação ao esperado. Arquivo final: 900×1125, 99 KB.

O seed do backend foi rodado de novo (`[seed] ... 38 fotos`) e
`media/products/agua-sem-gas.jpg` passou de 11.565 para 99.362 bytes.

**Teste do back atualizado:** `tests/test_seed.py::test_shared_svg_photo`
afirmava que as bebidas compartilhavam `bebida.svg` — contrato que deixou de
existir na task 009. Virou `test_each_beverage_has_own_photo`, que exige foto
própria por bebida (`.jpg`) e nenhuma URL repetida. Suíte completa do back verde.

## Revisão
