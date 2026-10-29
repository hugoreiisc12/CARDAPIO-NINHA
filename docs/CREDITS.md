# Créditos e origem das imagens de produto

## Bebidas (adicionadas em 2026-10-28)

As fotos da categoria **Bebidas** substituíram o placeholder genérico
`bebida.svg` (removido). São packshots de catálogo de varejista, escolhidos
para casar exatamente com o SKU vendido — embalagem, volume e variante
(Original × Sem Açúcar).

| Arquivo | Produto | Origem (catálogo) | ID da imagem |
|---|---|---|---|
| `coca-cola-200ml.jpg` | Coca-Cola Original 200ml | Mambo — "Refrigerante Original Coca-Cola Garrafa 200ml" | `249311` |
| `coca-cola-sem-acucar-200ml.jpg` | Coca-Cola Sem Açúcar 200ml | Mambo — "Refrigerante Sem Açúcar Coca-Cola Garrafa 200ml" | `178868` |
| `coca-cola-220ml.jpg` | Coca-Cola 220ml | Mambo — "Refrigerante Original Coca-Cola Lata 220ml" | `249360` |
| `coca-cola-350ml.jpg` | Coca-Cola Original 350ml | Mambo — "Refrigerante Coca-Cola Lata 350ml" | `259973` |
| `coca-cola-sem-acucar-350ml.jpg` | Coca-Cola Sem Açúcar 350ml | Mambo — "Refrigerante Sem Açúcar Coca-Cola Lata 350ml" | `260002` |
| `coca-cola-1-5l.jpg` | Coca-Cola Original 1,5L | Mambo — "Refrigerante Original Coca-Cola Garrafa 1,5L" | `249475` |
| `guarana-guaravita-290ml.jpg` | Guaraná Natural Guaravita 290ml | Prezuni — "Bebida Guaraná Guaravita Adoçada Copo 290ml" | `184062` |
| `agua-com-gas-500ml.jpg` | Água Mineral com Gás 500ml | Mambo — "Água Mineral com Gás Crystal 500ml" | `248273` |
| `agua-sem-gas.jpg` | Água sem Gás | Mambo — "Água Mineral sem Gás Crystal 500ml" | `248274` |

Domínio das imagens: `mambodelivery.vteximg.com.br` e `prezunic.vteximg.com.br`
(CDN VTEX), servidas a 1000×1000 e capturadas em 2026-10-28.

### Tratamento aplicado

1. Recorte do produto do fundo de estúdio original via Vision (macOS),
   `VNGenerateForegroundInstanceMaskRequest`.
2. Recomposição sobre o cream da marca `#FAF2F4`.
3. Canvas 900×1125 (4:5, igual ao `aspect-[4/5]` do card em `ProductSheet.tsx`),
   produto centralizado ocupando ~88% da altura.
4. JPG qualidade 62–82, todos abaixo de 120 KB.

### Licença — atenção

São **embalagens de marcas registradas** (The Coca-Cola Company, Guaravita,
Crystal), coletadas de catálogo de terceiro. Não há licença de uso livre
associada: o uso é o mesmo de qualquer cardápio/delivery que exibe o produto
que vende — referência visual do item, sem alteração de rótulo e sem sugerir
endosso da marca ao estabelecimento.

Se o objetivo for eliminar essa dependência, o caminho é fotografar as
embalagens reais da loja e substituir os arquivos mantendo os mesmos nomes
(nada mais no código precisa mudar).

## Demais categorias

As fotos de doces e salgados foram migradas do iFood da Ninha em 2026-09-23
(ver `src/lib/catalog.ts`).

`agua-sem-gas.jpg` também veio do iFood nessa migração (foto de 500×375, a única
fora do padrão 4:5 da categoria) e foi substituída em 2026-10-28 pelo packshot
Crystal sem gás 500ml, da mesma linha da água com gás.

## Identidade gerada (não é imagem de terceiros)

`public/favicon.png` (64×64), `public/apple-touch-icon.png` (180×180) e
`public/og-image.jpg` (1200×630) são gerados a partir dos tokens do projeto:
fundo `plum-900` `#46182F`, letra em Fraunces itálico `cream-50` `#FAF2F4` e,
no card de compartilhamento, o `gradient-brand` (`#E58AA0 → #E2795B → #E9A25C`)
sobre a foto `public/images/hero-bolo-1000.jpg`. Nenhum asset de marca de
terceiros é usado.

