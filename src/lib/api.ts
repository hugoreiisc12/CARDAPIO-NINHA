/**
 * Cliente da API do cardápio (`back-api-menu`, `/api/v1`).
 * Tudo aqui degrada para o fluxo estático atual quando a API não responde —
 * o cardápio nunca quebra por causa do backend.
 */
import type { Category } from "@/lib/menu-data";
import { categories as staticCategories } from "@/lib/catalog";

const API_URL = import.meta.env?.VITE_API_URL ?? "http://localhost:8000/api/v1";

/** Chave publicável (pk_...); a secreta nunca chega ao front. */
export const STRIPE_PUBLISHABLE_KEY = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY ?? "";

export interface ApiCategory {
  slug: string;
  label: string;
  eyebrow: string;
  sort_order: number;
  products: ApiProduct[];
}

export interface ApiProduct {
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  price_label: string;
  image_url: string;
  tags: string[];
  featured: boolean;
  sold_out: boolean;
  min_order_note: string;
  sort_order: number;
  variations: { label: string; sort_order: number; options: unknown[] }[];
}

export interface CreatedOrder {
  tracking_code: string;
  tracking_token: string;
  status: string;
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  whatsapp_message: string;
}

export interface PaymentSecret {
  client_secret: string;
}

export interface TrackedOrder {
  tracking_code: string;
  status: string;
  fulfillment: string;
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  created_at: string;
  items: { name: string; quantity: number; unit_price_cents: number }[];
  checkpoints: { label: string; status: string; eta_at: string | null; created_at: string }[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.code ?? "http_error", body.detail ?? "");
  }
  return response.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    readonly http: number,
    readonly code: string,
    readonly detail: string,
  ) {
    super(detail || code);
  }
}

/** GET /menu com fallback para o catálogo estático (B11). */
export async function loadMenu(): Promise<{ categories: Category[]; source: "api" | "static" }> {
  try {
    const data = await request<ApiCategory[]>("/menu");
    return { categories: data.map(toCategory), source: "api" };
  } catch {
    return { categories: staticCategories, source: "static" };
  }
}

function toCategory(c: ApiCategory): Category {
  return {
    id: c.slug,
    label: c.label,
    eyebrow: c.eyebrow,
    products: c.products.map((p) => ({
      id: p.slug,
      name: p.name,
      description: p.description,
      price: p.price_cents / 100,
      ...(p.price_label ? { priceLabel: p.price_label } : {}),
      image: p.image_url,
      tags: p.tags,
      featured: p.featured,
      soldOut: p.sold_out,
      ...(p.min_order_note ? { minOrderNote: p.min_order_note } : {}),
    })),
  };
}

export interface OrderItemInput {
  product_slug: string;
  quantity: number;
  selections: Record<string, string>;
}

/** POST /orders — o servidor recalcula tudo; 400 com `code` em regra de negócio.
 * `idempotencyKey` faz o retry devolver o mesmo pedido em vez de criar outro. */
export function createOrder(
  idempotencyKey: string,
  input: {
    fulfillment: string;
    street: string;
    district: string;
    complement: string;
    name: string;
    phone: string;
    notes: string;
    payment_method: string;
    change_for_cents?: number | null;
    items: OrderItemInput[];
  },
): Promise<CreatedOrder> {
  return request<CreatedOrder>("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(input),
  });
}

/** POST /orders/{code}/payment-intent — client_secret para o Payment Element. */
export function createPayment(trackingCode: string, trackingToken: string): Promise<PaymentSecret> {
  return request<PaymentSecret>(`/orders/${trackingCode}/payment-intent`, {
    method: "POST",
    body: JSON.stringify({ tracking_token: trackingToken }),
  });
}

/** GET /track — consulta pública com código + token. */
export function trackOrder(code: string, token: string): Promise<TrackedOrder> {
  const params = new URLSearchParams({ code, token });
  return request<TrackedOrder>(`/track?${params}`);
}
