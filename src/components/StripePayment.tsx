import { useState, type FormEvent } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY, createPayment } from "@/lib/api";
import { formatPrice } from "@/lib/menu-data";

let stripePromise: Promise<Stripe | null> | null = null;
/** Carrega o Stripe.js (sempre de js.stripe.com) só quando o pagamento abre. */
const getStripe = () => (stripePromise ??= loadStripe(STRIPE_PUBLISHABLE_KEY));

type Props = {
  totalCents: number;
  trackingCode: string;
  trackingToken: string;
  onSubmitted: () => void;
  onFallback: () => void;
};

/** Payment Element: Pix e cartão na mesma tela. O valor mostrado vem do servidor. */
export function StripePayment(props: Props) {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        mode: "payment",
        amount: props.totalCents,
        currency: "brl",
        locale: "pt-BR",
        appearance: { theme: "stripe" },
      }}
    >
      <PayForm {...props} />
    </Elements>
  );
}

function PayForm({ totalCents, trackingCode, trackingToken, onSubmitted, onFallback }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || busy) return;
    setBusy(true);
    setError("");
    try {
      const { error: invalid } = await elements.submit();
      if (invalid) {
        setError(invalid.message ?? "Confira os dados do pagamento.");
        return;
      }
      const { client_secret } = await createPayment(trackingCode, trackingToken);
      const result = await stripe.confirmPayment({
        elements,
        clientSecret: client_secret,
        confirmParams: {
          return_url: `${window.location.origin}/rastreio?code=${encodeURIComponent(trackingCode)}&token=${encodeURIComponent(trackingToken)}`,
        },
        redirect: "if_required",
      });
      if (result.error) {
        setError(result.error.message ?? "Pagamento não concluído. Tente de novo.");
        return;
      }
      // A confirmação real vem do webhook; aqui só seguimos para o acompanhamento.
      onSubmitted();
    } catch {
      setError("Não foi possível iniciar o pagamento. Tente de novo em instantes.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="px-5 pt-6 pb-6">
      <PaymentElement />
      {error && (
        <p role="alert" className="mt-3 text-sm text-error">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || busy}
        className="mt-5 w-full min-h-[56px] rounded-full bg-plum-900 text-cream-50 font-semibold text-base hover:bg-plum-700 active:bg-plum-950 transition-colors shadow-warm disabled:opacity-50"
      >
        {busy ? "Processando…" : `Pagar ${formatPrice(totalCents / 100)}`}
      </button>
      <p className="mt-3 text-center text-[13px] text-ink-soft">
        Pagamento seguro pelo Stripe. A confirmação chega em segundos.
      </p>
      <button
        type="button"
        onClick={onFallback}
        className="mt-2 w-full min-h-[44px] text-sm font-semibold text-plum-900 underline underline-offset-4"
      >
        Prefiro combinar pelo WhatsApp
      </button>
    </form>
  );
}
