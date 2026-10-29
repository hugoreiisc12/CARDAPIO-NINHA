import {
  STORE_ADDRESS,
  formatPrice,
  formatVariationSummary,
  type CartLineForMessage,
} from "@/lib/menu-data";

export type Fulfillment = "entrega" | "retirada";
export type PaymentMethod = "pix" | "cartao-online" | "cartao-entrega" | "dinheiro";

/** Só o que está `available` pode ser escolhido; o resto aparece desabilitado com o badge. */
export const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  hint: string;
  available: boolean;
  badge?: string;
}[] = [
  {
    id: "cartao-entrega",
    label: "Cartão na entrega",
    hint: "Crédito ou débito na maquininha",
    available: true,
  },
  { id: "dinheiro", label: "Dinheiro", hint: "Informe o valor para o troco", available: true },
  {
    id: "pix",
    label: "Pix",
    hint: "Pagamento na hora pelo app do banco",
    available: false,
    badge: "Em breve",
  },
  {
    id: "cartao-online",
    label: "Cartão Online",
    hint: "Crédito ou débito direto no cardápio",
    available: false,
    badge: "Em breve",
  },
];

/** Métodos que passariam pelo gateway (Stripe) quando forem liberados. */
const ONLINE_METHODS: PaymentMethod[] = ["pix", "cartao-online"];

export const isOnlinePayment = (method: PaymentMethod | null) =>
  method !== null && ONLINE_METHODS.includes(method);

export const CHECKOUT_STEPS = [
  { id: "entrega", label: "Entrega" },
  { id: "dados", label: "Dados" },
  { id: "pagamento", label: "Pagamento" },
  { id: "revisao", label: "Revisão" },
] as const;

export type CheckoutStep = (typeof CHECKOUT_STEPS)[number]["id"];

export type CheckoutDraft = {
  fulfillment: Fulfillment;
  street: string;
  district: string;
  complement: string;
  name: string;
  phone: string;
  notes: string;
  payment: PaymentMethod | null;
  changeFor: string;
};

export type FieldErrors = Partial<Record<keyof CheckoutDraft, string>>;

export function emptyDraft(profile: CustomerProfile | null): CheckoutDraft {
  return {
    fulfillment: "entrega",
    street: "",
    district: "",
    complement: "",
    name: profile?.name ?? "",
    phone: profile?.phone ?? "",
    notes: "",
    payment: null,
    changeFor: "",
  };
}

const digits = (s: string) => s.replace(/\D/g, "");

export const isValidPhone = (s: string) => /^\d{10,11}$/.test(digits(s));

/** "50" | "50,00" | "R$ 50,5" → 50.5; vazio ou inválido → null. */
export function parseMoney(s: string): number | null {
  const clean = s
    .replace(/[^\d,.]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (!clean) return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
}

/** Troco a devolver: valor entregue − total, nunca negativo. null se o campo está vazio/inválido. */
export function changeDue(changeFor: string, total: number): number | null {
  const paid = parseMoney(changeFor);
  if (paid === null) return null;
  return Math.max(paid - total, 0);
}

export function validateStep(step: CheckoutStep, d: CheckoutDraft, total: number): FieldErrors {
  const e: FieldErrors = {};
  if (step === "entrega" && d.fulfillment === "entrega") {
    if (d.street.trim().length < 3) e.street = "Informe rua e número";
    if (d.district.trim().length < 2) e.district = "Informe o bairro";
  }
  if (step === "dados") {
    if (d.name.trim().length < 2) e.name = "Informe seu nome";
    if (!isValidPhone(d.phone)) e.phone = "Telefone com DDD, ex.: (21) 99999-9999";
  }
  if (step === "pagamento") {
    const method = PAYMENT_METHODS.find((m) => m.id === d.payment);
    if (!method || !method.available) e.payment = "Escolha uma forma de pagamento";
    // Dinheiro exige o valor do troco. Não comparamos com o total: quem paga em
    // dinheiro pode entregar menos e acertar o resto na hora, e o troco é
    // calculado sobre o que foi digitado (nunca negativo).
    if (d.payment === "dinheiro") {
      const n = parseMoney(d.changeFor);
      if (!d.changeFor.trim()) e.changeFor = "Informe o valor para o troco";
      else if (n === null || n <= 0) e.changeFor = "Informe um valor válido, ex.: 50,00";
    }
  }
  return e;
}

export function buildOrderMessage(lines: CartLineForMessage[], d: CheckoutDraft) {
  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const items = lines.map((l) => {
    const variation = formatVariationSummary(l.selections);
    return `• ${l.quantity}x ${l.name}${variation ? ` (${variation})` : ""} — ${formatPrice(l.unitPrice * l.quantity)}`;
  });
  const method = PAYMENT_METHODS.find((m) => m.id === d.payment);
  const paid = d.payment === "dinheiro" ? parseMoney(d.changeFor) : null;
  const due = paid === null ? 0 : Math.max(paid - total, 0);
  // O valor que o cliente entrega e o troco que a Ninha separa; sem "troco de"
  // quando o valor é exato (ou menor que o total — a diferença é acertada na hora).
  const changeText =
    paid === null
      ? ""
      : due > 0
        ? ` (troco para ${formatPrice(paid)} · troco de ${formatPrice(due)})`
        : ` (troco para ${formatPrice(paid)})`;
  const fulfillment =
    d.fulfillment === "entrega"
      ? [
          "*Entrega*",
          `${d.street.trim()} — ${d.district.trim()}`,
          d.complement.trim() ? `Complemento: ${d.complement.trim()}` : null,
          "Taxa de entrega: a combinar",
        ]
      : ["*Retirada na loja*", STORE_ADDRESS];

  return [
    "Olá! Vim pelo cardápio e quero confirmar meu pedido:",
    "",
    ...items,
    "",
    `*Subtotal:* ${formatPrice(total)}`,
    "",
    ...fulfillment,
    "",
    `*Pagamento:* ${method?.label ?? "—"}${changeText}`,
    "",
    `*Cliente:* ${d.name.trim()} · ${d.phone.trim()}`,
    d.notes.trim() ? `*Observações:* ${d.notes.trim()}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

// Cadastro local até existir o banco: saveProfile/loadProfile são o único ponto a trocar.
export type CustomerProfile = { name: string; phone: string; email: string };

const PROFILE_KEY = "ninha-profile-v1";

export function loadProfile(): CustomerProfile | null {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Record<string, unknown>;
    if (typeof p.name !== "string" || typeof p.phone !== "string") return null;
    return { name: p.name, phone: p.phone, email: typeof p.email === "string" ? p.email : "" };
  } catch {
    return null;
  }
}

/** Lança se o armazenamento estiver indisponível (aba anônima, cota) — o chamador avisa o usuário. */
export function saveProfile(profile: CustomerProfile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
