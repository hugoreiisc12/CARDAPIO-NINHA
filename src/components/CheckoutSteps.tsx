import type { ReactNode } from "react";
import {
  Banknote,
  Check,
  CreditCard,
  Lock,
  MessageCircle,
  QrCode,
  Store,
  Truck,
} from "lucide-react";
import { FormField } from "@/components/FormField";
import {
  CHECKOUT_STEPS,
  PAYMENT_METHODS,
  parseMoney,
  type CheckoutDraft,
  type CheckoutStep,
  type FieldErrors,
  type PaymentMethod,
} from "@/lib/checkout";
import type { CartLine } from "@/lib/cart-context";
import { STORE_ADDRESS, formatPrice, formatVariationSummary } from "@/lib/menu-data";

type StepProps = {
  draft: CheckoutDraft;
  errors: FieldErrors;
  set: <K extends keyof CheckoutDraft>(key: K, value: CheckoutDraft[K]) => void;
};

export function CheckoutProgress({ step }: { step: CheckoutStep }) {
  const current = CHECKOUT_STEPS.findIndex((s) => s.id === step);
  return (
    <div className="px-5 pt-3">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-gradient-brand">
          Etapa {current + 1} de {CHECKOUT_STEPS.length}
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-2.5 py-1 text-[12px] font-medium text-success">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          Checkout seguro
        </span>
      </div>
      <ol className="mt-3 grid grid-cols-4 gap-2" aria-label="Etapas do pedido">
        {CHECKOUT_STEPS.map((s, i) => (
          <li key={s.id} aria-current={i === current ? "step" : undefined}>
            <div
              className={`h-1.5 rounded-full transition-colors duration-300 ${
                i <= current ? "gradient-brand" : "bg-cream-200"
              }`}
            />
            <span
              className={`mt-1.5 block text-[12px] ${
                i === current ? "font-semibold text-ink" : "text-ink-soft"
              }`}
            >
              {s.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-display italic text-[24px] text-ink leading-tight">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{hint}</p>
    </div>
  );
}

function Choice({
  selected,
  disabled,
  onSelect,
  icon,
  title,
  hint,
  badge,
}: {
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  icon: ReactNode;
  title: string;
  hint: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onSelect}
      className={`flex min-h-[64px] w-full items-center gap-3 rounded-[20px] border px-4 py-3 text-left transition-colors ${
        disabled ? "cursor-not-allowed border-cream-200 bg-cream-100/60" : ""
      } ${
        selected
          ? "border-plum-900 bg-cream-100"
          : disabled
            ? ""
            : "border-cream-200 bg-cream-50 enabled:hover:border-plum-500"
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream-100 ${
          disabled ? "text-ink-soft" : "text-plum-900"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={`font-semibold ${disabled ? "text-ink-soft" : "text-ink"}`}>
            {title}
          </span>
          {badge && (
            <span className="rounded-full gradient-brand px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.14em] text-plum-950">
              {badge}
            </span>
          )}
        </span>
        <span className="block text-[13px] text-ink-soft">{hint}</span>
      </span>
      {!badge && (
        <span
          aria-hidden
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
            selected ? "border-plum-900 bg-plum-900 text-cream-50" : "border-cream-200"
          }`}
        >
          {selected && <Check className="h-3.5 w-3.5" />}
        </span>
      )}
    </button>
  );
}

export function DeliveryStep({ draft, errors, set }: StepProps) {
  return (
    <div className="px-5 pt-6 pb-6">
      <StepTitle title="Como você quer receber?" hint="Entregamos em toda Teresópolis." />
      <div role="radiogroup" aria-label="Forma de recebimento" className="flex flex-col gap-3">
        <Choice
          selected={draft.fulfillment === "entrega"}
          onSelect={() => set("fulfillment", "entrega")}
          icon={<Truck className="h-5 w-5" />}
          title="Entrega"
          hint="Taxa combinada na confirmação"
        />
        <Choice
          selected={draft.fulfillment === "retirada"}
          onSelect={() => set("fulfillment", "retirada")}
          icon={<Store className="h-5 w-5" />}
          title="Retirar na loja"
          hint={STORE_ADDRESS}
        />
      </div>
      {draft.fulfillment === "entrega" && (
        <div className="mt-5 flex flex-col gap-4">
          <FormField
            label="Rua e número"
            value={draft.street}
            onChange={(v) => set("street", v)}
            error={errors.street}
            autoComplete="address-line1"
            placeholder="Rua das Flores, 123"
          />
          <FormField
            label="Bairro"
            value={draft.district}
            onChange={(v) => set("district", v)}
            error={errors.district}
            autoComplete="address-level3"
            placeholder="Centro"
          />
          <FormField
            label="Complemento (opcional)"
            value={draft.complement}
            onChange={(v) => set("complement", v)}
            autoComplete="address-line2"
            placeholder="Apto, bloco, referência"
          />
        </div>
      )}
    </div>
  );
}

export function CustomerStep({ draft, errors, set }: StepProps) {
  return (
    <div className="px-5 pt-6 pb-6">
      <StepTitle title="Seus dados" hint="Para a Ninha confirmar o pedido com você." />
      <div className="flex flex-col gap-4">
        <FormField
          label="Nome"
          value={draft.name}
          onChange={(v) => set("name", v)}
          error={errors.name}
          autoComplete="name"
          placeholder="Seu nome completo"
        />
        <FormField
          label="Telefone / WhatsApp"
          type="tel"
          inputMode="tel"
          value={draft.phone}
          onChange={(v) => set("phone", v)}
          error={errors.phone}
          autoComplete="tel-national"
          placeholder="(21) 99999-9999"
        />
        <FormField
          label="Observações (opcional)"
          value={draft.notes}
          onChange={(v) => set("notes", v)}
          placeholder="Ex.: sem granulado, entregar após 18h"
        />
      </div>
    </div>
  );
}

const PAYMENT_ICONS: Record<PaymentMethod, ReactNode> = {
  pix: <QrCode className="h-5 w-5" />,
  "cartao-online": <CreditCard className="h-5 w-5" />,
  "cartao-entrega": <CreditCard className="h-5 w-5" />,
  dinheiro: <Banknote className="h-5 w-5" />,
};

export function PaymentStep({ draft, errors, set, total }: StepProps & { total: number }) {
  const paid = draft.payment === "dinheiro" ? parseMoney(draft.changeFor) : null;
  const due = paid === null ? null : Math.max(paid - total, 0);
  return (
    <div className="px-5 pt-6 pb-6">
      <StepTitle title="Forma de pagamento" hint="Você paga na confirmação ou na entrega." />
      <div role="radiogroup" aria-label="Forma de pagamento" className="flex flex-col gap-3">
        {PAYMENT_METHODS.map((m) => (
          <Choice
            key={m.id}
            selected={draft.payment === m.id}
            disabled={!m.available}
            onSelect={() => set("payment", m.id)}
            icon={PAYMENT_ICONS[m.id]}
            title={m.label}
            hint={m.hint}
            badge={m.badge}
          />
        ))}
      </div>
      {errors.payment && <p className="mt-3 text-[13px] text-error">{errors.payment}</p>}
      {draft.payment === "dinheiro" && (
        <div className="mt-5">
          <FormField
            label="Troco para"
            inputMode="decimal"
            value={draft.changeFor}
            onChange={(v) => set("changeFor", v)}
            error={errors.changeFor}
            placeholder="Ex.: 50,00"
          />
          {due !== null && paid !== null && paid >= total && (
            <p className="mt-2 text-[13px] text-ink-soft">
              {due > 0 ? (
                <>
                  Troco: <strong className="text-ink">{formatPrice(due)}</strong>
                </>
              ) : (
                "Valor exato — sem troco."
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-cream-200 bg-cream-50 px-4 py-3.5">
      <p className="eyebrow text-ink-soft">{title}</p>
      <div className="mt-1.5 text-[15px] text-ink">{children}</div>
    </div>
  );
}

export function ReviewStep({
  draft,
  lines,
  subtotal,
}: {
  draft: CheckoutDraft;
  lines: CartLine[];
  subtotal: number;
}) {
  const method = PAYMENT_METHODS.find((m) => m.id === draft.payment);
  const paid = draft.payment === "dinheiro" ? parseMoney(draft.changeFor) : null;
  const due = paid === null ? 0 : Math.max(paid - subtotal, 0);
  return (
    <div className="px-5 pt-6 pb-6">
      <StepTitle title="Revise seu pedido" hint="Confira tudo antes de confirmar." />
      <div className="flex flex-col gap-3">
        <ReviewBlock title="Itens">
          <ul className="flex flex-col gap-1.5">
            {lines.map((l) => {
              const variation = formatVariationSummary(l.selections);
              return (
                <li key={l.lineId} className="flex justify-between gap-3">
                  <span>
                    {l.quantity}x {l.name}
                    {variation && (
                      <span className="block text-[13px] text-ink-soft">{variation}</span>
                    )}
                  </span>
                  <span className="shrink-0 font-display">
                    {formatPrice(l.unitPrice * l.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>
        </ReviewBlock>
        <ReviewBlock title={draft.fulfillment === "entrega" ? "Entrega" : "Retirada"}>
          {draft.fulfillment === "entrega" ? (
            <>
              {draft.street} — {draft.district}
              {draft.complement && <span className="block text-ink-soft">{draft.complement}</span>}
              <span className="block text-[13px] text-ink-soft">Taxa combinada na confirmação</span>
            </>
          ) : (
            STORE_ADDRESS
          )}
        </ReviewBlock>
        <ReviewBlock title="Pagamento">
          {method?.label}
          {paid !== null && ` · troco para ${formatPrice(paid)}`}
          {due > 0 && (
            <span className="block text-[13px] text-ink-soft">Troco: {formatPrice(due)}</span>
          )}
        </ReviewBlock>
        <ReviewBlock title="Contato">
          {draft.name} · {draft.phone}
          {draft.notes && <span className="block text-ink-soft">{draft.notes}</span>}
        </ReviewBlock>
        <div className="flex items-baseline justify-between px-1 pt-1">
          <span className="text-ink-soft text-sm">Subtotal</span>
          <span className="font-display text-[22px] text-ink">{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}

export function SentStep({ orderLink }: { orderLink: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full gradient-brand text-plum-950">
        <Check className="h-8 w-8" />
      </div>
      <h2 className="mt-5 font-display italic text-[26px] text-ink">Pedido enviado!</h2>
      <p className="mt-2 max-w-[280px] text-sm text-ink-soft">
        Finalize a conversa no WhatsApp — a Ninha confirma o pedido, a taxa e o pagamento por lá.
      </p>
      <a
        href={orderLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-plum-900 underline underline-offset-4"
      >
        <MessageCircle className="h-4 w-4" />O WhatsApp não abriu? Toque aqui
      </a>
    </div>
  );
}
