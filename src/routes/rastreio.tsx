import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { trackOrder, type TrackedOrder } from "@/lib/api";
import { TrackMap } from "@/components/TrackMap";

export const Route = createFileRoute("/rastreio")({
  component: Rastreio,
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === "string" ? search.code : "",
    token: typeof search.token === "string" ? search.token : "",
  }),
});

function Rastreio() {
  const { code, token } = Route.useSearch();
  const [state, setState] = useState<
    { kind: "loading" } | { kind: "error"; message: string } | { kind: "ok"; order: TrackedOrder }
  >({ kind: "loading" });

  useEffect(() => {
    if (!code || !token) {
      setState({ kind: "error", message: "Link incompleto: abra pelo link recebido no pedido." });
      return;
    }
    trackOrder(code, token).then(
      (order) => setState({ kind: "ok", order }),
      () => setState({ kind: "error", message: "Pedido não encontrado. Confira o link." }),
    );
  }, [code, token]);

  // Pagamento confirma por webhook: enquanto aguarda, consulta de novo a cada 4 s.
  const waiting = state.kind === "ok" && state.order.status === "awaiting_payment";
  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => {
      trackOrder(code, token).then(
        (order) => setState({ kind: "ok", order }),
        () => undefined,
      );
    }, 4000);
    return () => clearInterval(timer);
  }, [waiting, code, token]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col gap-5 px-5 py-8">
      <header>
        <p className="font-display italic text-[15px] text-plum-900">Ninha Cakes</p>
        <h1 className="mt-1 font-display text-[30px] text-ink">Acompanhar pedido</h1>
        {code && <p className="mt-1 text-sm font-semibold text-ink-soft">{code}</p>}
      </header>
      {state.kind === "loading" && <p className="text-sm text-ink-soft">Buscando pedido…</p>}
      {state.kind === "error" && <p className="text-sm text-error">{state.message}</p>}
      {state.kind === "ok" && (
        <>
          <section className="rounded-[20px] border border-cream-200 bg-cream-50 px-5 py-4">
            <p className="text-sm text-ink-soft">Status</p>
            <p className="font-display text-[22px] text-ink">{statusLabel(state.order.status)}</p>
            <p className="mt-1 text-sm text-ink-soft">
              {state.order.items.map((i) => `${i.quantity}x ${i.name}`).join(" · ")}
            </p>
          </section>
          <TrackMap checkpoints={state.order.checkpoints} />
        </>
      )}
    </main>
  );
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Rascunho",
    awaiting_payment: "Aguardando pagamento",
    paid: "Pago",
    preparing: "Em preparo",
    ready: "Pronto",
    out_for_delivery: "Saiu para entrega",
    delivered: "Entregue",
    cancelled: "Cancelado",
    refunded: "Estornado",
    failed: "Falhou",
  };
  return labels[status] ?? status;
}
