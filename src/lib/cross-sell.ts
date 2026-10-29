import type { Category, Product } from "@/lib/menu-data";

const DRINKS_CATEGORY = "bebidas";

/**
 * Venda cruzada: 1 bebida + o primeiro produto de cada categoria que ainda não está no pedido,
 * na ordem do cardápio. Completa com o restante do cardápio se faltar sugestão.
 * Só sugere o que dá para adicionar em 1 toque (sem variação, sem "sob consulta", não esgotado).
 */
export function suggestProducts(
  categories: Category[],
  inOrder: ReadonlySet<string>,
  limit = 3,
): Product[] {
  const eligible = (p: Product) =>
    !inOrder.has(p.id) && !p.soldOut && !p.priceLabel && !p.variations?.length;
  const orderCats = new Set(
    categories.filter((c) => c.products.some((p) => inOrder.has(p.id))).map((c) => c.id),
  );
  const fresh = categories.filter((c) => !orderCats.has(c.id));
  const drinks = fresh.filter((c) => c.id === DRINKS_CATEGORY);
  const others = fresh.filter((c) => c.id !== DRINKS_CATEGORY);

  const picks = [
    ...[...drinks, ...others].map((c) => c.products.find(eligible)),
    ...categories.flatMap((c) => c.products.filter(eligible)),
  ].filter((p): p is Product => p !== undefined);

  return [...new Set(picks)].slice(0, limit);
}
