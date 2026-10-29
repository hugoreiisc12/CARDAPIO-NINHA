import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useCart, type CartLine } from "@/lib/cart-context";
import {
  buildWhatsappLink,
  formatPrice,
  formatVariationSummary,
  isWhatsappConfigured,
  type Product,
} from "@/lib/menu-data";
import { categories } from "@/lib/catalog";
import { suggestProducts } from "@/lib/cross-sell";
import { CrossSell } from "@/components/CrossSell";
import {
  CHECKOUT_STEPS,
  buildOrderMessage,
  emptyDraft,
  isOnlinePayment,
  loadProfile,
  parseMoney,
  validateStep,
  type CheckoutDraft,
  type CheckoutStep,
  type FieldErrors,
} from "@/lib/checkout";
import { ApiError, STRIPE_PUBLISHABLE_KEY, createOrder, type CreatedOrder } from "@/lib/api";
import { StripePayment } from "@/components/StripePayment";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import {
  CheckoutProgress,
  CustomerStep,
  DeliveryStep,
  PaymentStep,
  ReviewStep,
  SentStep,
} from "@/components/CheckoutSteps";
import mascotUrl from "@/assets/mascot/mascot-urso-ninha.png";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type View = "cart" | CheckoutStep | "pay" | "sent";

type PayInfo = {
  totalCents: number;
  trackingCode: string;
  trackingToken: string;
};

const primaryBtn =
  "flex-1 min-h-[56px] rounded-full bg-plum-900 text-cream-50 font-semibold text-base flex items-center justify-center gap-2.5 hover:bg-plum-700 active:bg-plum-950 transition-colors shadow-warm disabled:opacity-50";

export function CartSheet({ open, onOpenChange }: Props) {
  const { lines, addLine, removeLine, updateQuantity, clear, subtotal } = useCart();
  const suggestions = useMemo(
    () => suggestProducts(categories, new Set(lines.map((l) => l.productId))),
    [lines],
  );

  const addSuggestion = (product: Product) => {
    addLine({ product, selections: {}, quantity: 1 });
    toast.success(`${product.name} adicionado`);
  };
  const [view, setView] = useState<View>("cart");
  const [draft, setDraft] = useState<CheckoutDraft>(() => emptyDraft(null));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [orderLink, setOrderLink] = useState("");
  // Fluxo online: pedido criado na API + Payment Element do Stripe.
  const [payInfo, setPayInfo] = useState<PayInfo | null>(null);
  const [paidOnline, setPaidOnline] = useState<{ code: string; token: string } | null>(null);
  const [pendingOnline, setPendingOnline] = useState<CreatedOrder | null>(null);
  const [placing, setPlacing] = useState(false);
  // Mesma chave em retries do mesmo pedido; nova chave quando os dados mudam.
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setView("cart");
    setErrors({});
    setPayInfo(null);
    setPaidOnline(null);
    setPendingOnline(null);
    idempotencyKey.current = null;
    const profile = loadProfile();
    if (profile) {
      setDraft((d) => ({ ...d, name: d.name || profile.name, phone: d.phone || profile.phone }));
    }
  }, [open]);

  const stepIndex = CHECKOUT_STEPS.findIndex((s) => s.id === view);
  const inCheckout = stepIndex >= 0 || view === "pay";

  const set = <K extends keyof CheckoutDraft>(key: K, value: CheckoutDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setPendingOnline(null);
    idempotencyKey.current = null;
  };

  const handleOpenChange = (next: boolean) => {
    // O carrinho só é limpo depois que o cliente viu a confirmação de envio.
    if (!next && view === "sent") clear();
    onOpenChange(next);
  };

  const goNext = () => {
    const step = CHECKOUT_STEPS[stepIndex];
    const found = validateStep(step.id, draft, subtotal);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setView(CHECKOUT_STEPS[stepIndex + 1].id);
  };

  const goBack = () => {
    setErrors({});
    setView(stepIndex === 0 ? "cart" : CHECKOUT_STEPS[stepIndex - 1].id);
  };

  const openWhatsapp = (message: string) => {
    const link = buildWhatsappLink(message);
    setOrderLink(link);
    window.open(link, "_blank", "noopener,noreferrer");
    setView("sent");
  };

  // Só para API fora do ar: o pedido segue pelo WhatsApp sem registro no servidor.
  const fallbackWhatsapp = () => openWhatsapp(buildOrderMessage(lines, draft));

  const confirmOrder = async () => {
    if (!isWhatsappConfigured()) {
      toast.error("WhatsApp da loja não configurado. Tente novamente em instantes.");
      return;
    }
    const online = isOnlinePayment(draft.payment);
    if (online && !STRIPE_PUBLISHABLE_KEY) {
      toast.error("Pagamento online indisponível agora. Escolha outra forma de pagamento.");
      return;
    }
    setPlacing(true);
    try {
      const change = draft.payment === "dinheiro" ? parseMoney(draft.changeFor) : null;
      idempotencyKey.current ??= crypto.randomUUID();
      const created =
        pendingOnline ??
        (await createOrder(idempotencyKey.current, {
          fulfillment: draft.fulfillment,
          street: draft.street,
          district: draft.district,
          complement: draft.complement,
          name: draft.name,
          phone: draft.phone,
          notes: draft.notes,
          payment_method: draft.payment ?? "",
          ...(change === null ? {} : { change_for_cents: Math.round(change * 100) }),
          items: lines.map((l) => ({
            product_slug: l.productId,
            quantity: l.quantity,
            selections: { ...l.selections },
          })),
        }));
      setPendingOnline(created);
      if (!online) {
        openWhatsapp(created.whatsapp_message);
        return;
      }
      setPayInfo({
        totalCents: created.total_cents,
        trackingCode: created.tracking_code,
        trackingToken: created.tracking_token,
      });
      setView("pay");
    } catch (error) {
      if (error instanceof ApiError && error.http < 500) {
        // Regra de negócio (esgotado, bairro fora da área...): o servidor manda, não contornamos.
        toast.error(error.detail || "Não foi possível registrar o pedido. Revise os dados.");
        return;
      }
      fallbackWhatsapp();
    } finally {
      setPlacing(false);
    }
  };

  const footer =
    view === "cart" ? (
      <>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-ink-soft text-sm">Subtotal</span>
          <span className="font-display text-[20px] text-ink">{formatPrice(subtotal)}</span>
        </div>
        <button
          type="button"
          onClick={() => setView(CHECKOUT_STEPS[0].id)}
          disabled={lines.length === 0}
          className={`w-full ${primaryBtn}`}
        >
          Continuar para entrega
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => handleOpenChange(false)}
          className="w-full mt-2 text-ink-soft text-sm py-2 min-h-[44px]"
        >
          Continuar comprando
        </button>
      </>
    ) : view === "sent" ? (
      <button
        type="button"
        onClick={() => handleOpenChange(false)}
        className={`w-full ${primaryBtn}`}
      >
        Concluir
      </button>
    ) : view === "pay" ? (
      <button type="button" onClick={() => setView("revisao")} className={`w-full ${primaryBtn}`}>
        <ArrowLeft className="h-4 w-4" />
        Voltar à revisão
      </button>
    ) : (
      <div className="flex gap-3">
        <button
          type="button"
          onClick={goBack}
          aria-label="Voltar"
          className="min-h-[56px] w-14 shrink-0 rounded-full border border-cream-200 text-ink grid place-items-center hover:bg-cream-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        {view === "revisao" ? (
          <button type="button" onClick={confirmOrder} disabled={placing} className={primaryBtn}>
            <Lock className="h-4 w-4" />
            {placing ? "Criando pedido…" : "Confirmar pedido"}
          </button>
        ) : (
          <button type="button" onClick={goNext} className={primaryBtn}>
            Continuar
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    );

  const stepProps = { draft, errors, set };

  return (
    <BottomSheet
      open={open}
      onOpenChange={handleOpenChange}
      title={inCheckout ? "Finalizar pedido" : "Seu carrinho"}
      description={
        inCheckout ? "Etapas para concluir o pedido" : "Itens selecionados para o pedido"
      }
      footer={footer}
    >
      {inCheckout && (
        <CheckoutProgress step={view === "pay" ? "pagamento" : (view as CheckoutStep)} />
      )}
      {view === "cart" && (
        <div className="px-5 pt-5 pb-6">
          {lines.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="flex flex-col gap-4">
              {lines.map((line) => (
                <CartLineRow
                  key={line.lineId}
                  line={line}
                  onRemove={() => removeLine(line.lineId)}
                  onQuantityChange={(q) => updateQuantity(line.lineId, q)}
                />
              ))}
              <CrossSell
                title="Que tal levar também?"
                products={suggestions}
                onPick={addSuggestion}
              />
            </div>
          )}
        </div>
      )}
      {view === "entrega" && <DeliveryStep {...stepProps} />}
      {view === "dados" && <CustomerStep {...stepProps} />}
      {view === "pagamento" && <PaymentStep {...stepProps} total={subtotal} />}
      {view === "revisao" && <ReviewStep draft={draft} lines={lines} subtotal={subtotal} />}
      {view === "pay" && payInfo && (
        <StripePayment
          totalCents={payInfo.totalCents}
          trackingCode={payInfo.trackingCode}
          trackingToken={payInfo.trackingToken}
          onSubmitted={() => {
            setPaidOnline({ code: payInfo.trackingCode, token: payInfo.trackingToken });
            setView("sent");
          }}
          onFallback={() =>
            pendingOnline ? openWhatsapp(pendingOnline.whatsapp_message) : fallbackWhatsapp()
          }
        />
      )}
      {view === "sent" &&
        (paidOnline ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full gradient-brand text-plum-950">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-5 font-display italic text-[26px] text-ink">Pedido recebido!</h2>
            <p className="mt-2 max-w-[280px] text-sm text-ink-soft">
              Assim que o pagamento for confirmado, seu pedido entra em preparo.
            </p>
            <a
              href={`/rastreio?code=${paidOnline.code}&token=${paidOnline.token}`}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-plum-900 underline underline-offset-4"
            >
              Acompanhar pedido {paidOnline.code}
            </a>
          </div>
        ) : (
          <SentStep orderLink={orderLink} />
        ))}
    </BottomSheet>
  );
}

/** CartSheetEmpty (pencil KtGnW): mascote urso + selo da sacola, sem sobrepor o texto. */
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className="relative">
        <img
          src={mascotUrl}
          alt=""
          width={560}
          height={768}
          loading="lazy"
          decoding="async"
          className="h-40 w-auto object-contain drop-shadow-[0_12px_24px_rgba(46,15,31,0.18)]"
        />
        <div className="absolute -right-3 bottom-2 h-14 w-14 rounded-full bg-cream-100 border-4 border-cream-50 grid place-items-center">
          <ShoppingBag className="h-6 w-6 text-ink-soft" />
        </div>
      </div>
      <h2 className="mt-5 text-[20px] font-semibold text-ink">Seu carrinho está vazio</h2>
      <p className="mt-2 text-ink-soft text-sm max-w-[240px]">
        Volte ao cardápio e adicione seus doces favoritos.
      </p>
    </div>
  );
}

function CartLineRow({
  line,
  onRemove,
  onQuantityChange,
}: {
  line: CartLine;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}) {
  const variationSummary = formatVariationSummary(line.selections);
  const stepBtn =
    "h-11 w-11 rounded-full bg-cream-100 border border-cream-200 grid place-items-center text-ink";

  return (
    <div className="flex gap-3">
      <div className="h-20 w-20 shrink-0 rounded-[16px] overflow-hidden bg-cream-200">
        <img src={line.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[16px] text-ink leading-tight pt-2">{line.name}</h3>
          <button
            type="button"
            aria-label={`Remover ${line.name}`}
            onClick={onRemove}
            className="-mr-2 -mt-1 h-11 w-11 shrink-0 grid place-items-center text-ink-soft hover:text-error transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        {variationSummary && <p className="text-ink-soft text-[12px]">{variationSummary}</p>}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              onClick={() => onQuantityChange(line.quantity - 1)}
              className={stepBtn}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-ink text-sm w-7 text-center" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() => onQuantityChange(line.quantity + 1)}
              className={stepBtn}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="font-display text-[15px] text-ink">
            {formatPrice(line.unitPrice * line.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
