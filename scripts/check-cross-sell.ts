// Self-check da venda cruzada: `bun scripts/check-cross-sell.ts`
import assert from "node:assert/strict";
import { suggestProducts } from "../src/lib/cross-sell";
import type { Category, Product } from "../src/lib/menu-data";

const p = (id: string, extra: Partial<Product> = {}): Product => ({
  id,
  name: id,
  description: "",
  price: 10,
  image: "",
  ...extra,
});
const cat = (id: string, products: Product[]): Category => ({
  id,
  label: id,
  eyebrow: "",
  products,
});

const menu = [
  cat("sobremesas", [p("bolo"), p("torta")]),
  cat("salgados", [p("quiche", { soldOut: true }), p("empada")]),
  cat("bebidas", [p("coca"), p("agua")]),
];
const ids = (xs: Product[]) => xs.map((x) => x.id);

// Doce no pedido: bebida primeiro, depois outra categoria, pulando esgotado.
assert.deepEqual(ids(suggestProducts(menu, new Set(["bolo"]))), ["coca", "empada", "torta"]);
// Já tem bebida: não oferece outra como primeira opção.
assert.deepEqual(ids(suggestProducts(menu, new Set(["bolo", "coca"]), 2)), ["empada", "torta"]);
// Nunca sugere o que já está no pedido; pedido vazio vira vitrine.
assert.deepEqual(ids(suggestProducts(menu, new Set(), 3)), ["coca", "bolo", "empada"]);
assert.deepEqual(suggestProducts(menu, new Set(["bolo", "torta", "empada", "coca", "agua"])), []);
console.log("cross-sell ok");
