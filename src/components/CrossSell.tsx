import { Check, Plus } from "lucide-react";
import { formatPrice, type Product } from "@/lib/menu-data";

type Props = {
  title: string;
  products: Product[];
  onPick: (product: Product) => void;
  /** Com `selected`, cada item vira um liga/desliga; sem ele, o toque adiciona na hora. */
  selected?: ReadonlySet<string>;
};

export function CrossSell({ title, products, onPick, selected }: Props) {
  if (products.length === 0) return null;
  return (
    <section className="mt-6" aria-label={title}>
      <p className="eyebrow text-gradient-brand mb-3">{title}</p>
      <ul className="flex flex-col gap-2">
        {products.map((p) => {
          const on = selected?.has(p.id) ?? false;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onPick(p)}
                aria-pressed={selected ? on : undefined}
                aria-label={
                  selected
                    ? `${on ? "Remover" : "Incluir"} ${p.name}`
                    : `Adicionar ${p.name} ao carrinho`
                }
                className={`flex w-full items-center gap-3 rounded-[20px] border p-2 pr-3 text-left transition-colors ${
                  on
                    ? "border-plum-900 bg-cream-100"
                    : "border-cream-200 bg-cream-50 hover:border-plum-500"
                }`}
              >
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-[14px] bg-cream-200 object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-ink">
                    {p.name}
                  </span>
                  <span className="block font-display text-[15px] text-ink-soft">
                    + {formatPrice(p.price)}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors ${
                    on ? "bg-plum-900 text-cream-50" : "gradient-brand text-plum-950"
                  }`}
                >
                  {on ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
