---
id: 015
title: Reajuste de preços — aplicar a tabela de 2026-10-28 no catálogo
severity: medium
status: done
files:
  - src/lib/catalog.ts
  - docs/DATA_MODEL.md
---

## Contexto

A loja mandou a tabela nova de preços (`Ninhão Cakes — Cardápio digitalizado`).
Nenhum preço antigo permaneceu: 35 dos 38 produtos mudaram, dois subiram e um
desceu. O catálogo está em `src/lib/catalog.ts`, fonte única — o backend
(`seed_from_catalog.py`) lê esse arquivo, então o reajuste vale para os dois
lados no próximo seed.

## O que mudou

| Seção | Produto | Antes | Depois |
|---|---|---|---|
| Sobremesas | Banoffe | 23,99 | **22,00** |
| Sobremesas | Torta de Limão | 25,90 | **23,00** |
| Sobremesas | Mousse de Chocolate | 16,90 | **15,00** |
| Sobremesas | Pudim de Sorvete | 16,90 | **15,50** |
| Sobremesas | Pudim | 17,90 | **17,00** |
| Sobremesas | Palha Italiana Ninho com Nutella | 13,99 | **12,00** |
| Sobremesas | Capitão Jack | 23,00 | **21,00** |
| Sobremesas | Crunchy Cake | 24,99 | **23,00** |
| Sobremesas | Pavê Ninho com Nutella | 23,90 | **21,50** |
| Sobremesas | Pavê de Abacaxi com Côco | 21,99 | **19,90** |
| Sobremesas | Slice Kinder Bueno | 26,99 | **25,00** |
| Sobremesas | Slice Dupla Tentação | 24,99 | **23,00** |
| Sobremesas | Slice Palha Italiana Supreme | 26,99 | **24,00** |
| Mini Vulcão | Cenoura com Brigadeiro | 19,99 | **18,50** |
| Geladinhos | Pudim | 13,99 | **13,00** |
| Geladinhos | Ninho com Geleia de Morango | 12,99 | **12,00** |
| Geladinhos | Ferrero Rocher | 12,90 | **12,00** |
| Geladinhos | Chocolate | 11,90 | **12,00** ↑ |
| Geladinhos | Abacate | 10,99 | **10,00** |
| Salgados | Quiche (3 sabores) | 18,00 | **14,00** |
| Salgados | Empadão de Frango | 21,99 | **19,00** |
| Salgados | Empadão de Carne Seca | 22,99 | **20,00** |
| Salgados | Empadão de Palmito | 20,99 | **18,00** |
| Salgados | Empadinha de Frango | 11,00 | **12,00** ↑ |
| Salgados | Empadinha de Palmito | 12,00 | **13,00** ↑ |
| Salgados | Empadinha de Carne Seca | 13,00 | 13,00 (sem mudança) |
| Bebidas | Coca-Cola 200ml (2 versões) | 5,99 | **5,00** |
| Bebidas | Coca-Cola 220ml | 7,50 | **6,50** |
| Bebidas | Coca-Cola 350ml sem açúcar | 8,15 | **7,15** |
| Bebidas | Coca-Cola 1,5L | 17,00 | **13,00** |
| Bebidas | Guaravita 290ml | 4,99 | **3,99** |
| Bebidas | Água com Gás 500ml | 5,00 | **4,50** |
| Bebidas | Água sem Gás 500ml | 4,00 | **3,50** |

## Pendências que a tabela trouxe

**21 itens da tabela não existem no catálogo** (não foram criados: precisam de
foto em `src/assets/products/` e, alguns, de categoria nova):

- Sobremesas: Mousse de maracujá (13,00) · Palha Italiana Oreo (12,00)
- Slice Cakes: Abacaxi com coco (23,00) · Red Velvet (23,00) · Black Sensação
  (23,00) · Oreo (23,00) · Pudim (24,00)
- Bolo Família 800g: Cenoura com brigadeiro gourmet (50,00) — categoria nova
- Geladinhos frutados (10,00): manga, maracujá, abacaxi
- Geladinhos premium (12,00): milho verde, paçoca, prestígio, sensação, ninho
  com Nutella, Oreo
- Geladinhos especial (13,00): morango cravejado
- Bebidas: Guaraná Zero 350ml, Guaraná Zero, Pepsi Zero (7,15)

**2 produtos do catálogo não estão na tabela** e ficaram com o preço antigo:
Morango Cravejado (21,99) e Coca-Cola Original 350ml (8,15 — a tabela lista só
a versão sem açúcar a 7,15).

`photo()` lança erro no build se o slug não tiver imagem, então criar os itens
acima exige as fotos antes.

## Validação

Script de conferência linha a linha (tabela × catálogo):

```
produtos no catálogo ........ 38
linhas da tabela ............ 57 (36 com produto, 21 sem produto)
preços divergentes .......... 0
```

E no browser, os 34 produtos existentes renderizam o preço novo (Crunchy Cake
R$ 23,00, Slice Kinder Bueno R$ 25,00, Quiche R$ 14,00, Coca-Cola 1,5L
R$ 13,00, Água sem gás R$ 3,50…). `tsc`, `eslint`, `bun run build`,
`check-checkout` e `check-cross-sell` verdes.

## Revisão

Dois pontos para o dono confirmar: preço do Morango Cravejado (não veio na
tabela) e da Coca-Cola Original 350ml (só a sem açúcar foi listada).
