/**
 * Portas do cardápio — espelho de `back-api-menu/core/ports.py`.
 * O front define o contrato; o backend implementa. Sem comportamento aqui,
 * só tipos: se uma ponta mudar a forma, o `tsc --strict` quebra primeiro.
 */

export interface PricedOrderLike {
  readonly subtotalCents: number;
  readonly deliveryFeeCents: number;
  readonly totalCents: number;
}

export interface PaymentPreference {
  readonly preferenceId: string;
  readonly initPoint: string;
}

/** Porta do gateway (Mercado Pago no backend, mock nos testes de UI). */
export interface PaymentGatewayPort {
  createPreference(order: PricedOrderLike): Promise<PaymentPreference>;
}

/** Porta de leitura do cardápio servido pela API (B5). */
export interface MenuReaderPort {
  fetchMenu(): Promise<unknown>;
}
