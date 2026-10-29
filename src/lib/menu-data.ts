export type Variation = {
  label: string;
  options: { label: string; priceDelta?: number; note?: string }[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel?: string; // when "sob consulta"
  image: string;
  tags?: string[];
  featured?: boolean;
  soldOut?: boolean;
  minOrderNote?: string;
  variations?: Variation[];
};

export type Category = {
  id: string;
  label: string;
  eyebrow: string;
  products: Product[];
};

export const STORE_ADDRESS = "Rua Tenente Luiz Meireles, 1100 — Bom Retiro, Teresópolis/RJ";

/** WhatsApp da loja: (21) 98807-3217. `VITE_WHATSAPP_NUMBER` sobrepõe (ex.: número de teste). */
export const STORE_WHATSAPP_NUMBER = "5521988073217";

export const WHATSAPP_NUMBER: string =
  import.meta.env?.VITE_WHATSAPP_NUMBER || STORE_WHATSAPP_NUMBER;

export function isWhatsappConfigured(n: string = WHATSAPP_NUMBER) {
  return /^\d{10,15}$/.test(n);
}

export function formatPrice(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function buildWhatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function computeVariationDelta(product: Product, selections: Record<string, string>) {
  return (
    product.variations?.reduce((sum, v) => {
      const sel = v.options.find((o) => o.label === selections[v.label]);
      return sum + (sel?.priceDelta ?? 0);
    }, 0) ?? 0
  );
}

export function formatVariationSummary(selections: Record<string, string>) {
  return Object.entries(selections)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

export type CartLineForMessage = {
  name: string;
  selections: Record<string, string>;
  quantity: number;
  unitPrice: number;
};
