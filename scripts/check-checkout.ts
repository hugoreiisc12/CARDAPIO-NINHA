// Self-check da lógica de checkout: `bun scripts/check-checkout.ts`
import assert from "node:assert/strict";
import {
  buildOrderMessage,
  changeDue,
  emptyDraft,
  parseMoney,
  validateStep,
} from "../src/lib/checkout";

assert.equal(parseMoney("50"), 50);
assert.equal(parseMoney("R$ 1.050,50"), 1050.5);
assert.equal(parseMoney(""), null);

const d = emptyDraft(null);
assert.deepEqual(Object.keys(validateStep("entrega", d, 40)), ["street", "district"]);
assert.deepEqual(validateStep("entrega", { ...d, fulfillment: "retirada" }, 40), {});
assert.ok(validateStep("dados", { ...d, name: "Ana", phone: "(21) 9999-999" }, 40).phone);
assert.deepEqual(validateStep("dados", { ...d, name: "Ana", phone: "(21) 99999-9999" }, 40), {});
assert.ok(validateStep("pagamento", { ...d, payment: null }, 40).payment);
assert.ok(validateStep("pagamento", { ...d, payment: "pix" }, 40).payment);
assert.deepEqual(validateStep("pagamento", { ...d, payment: "cartao-entrega" }, 40), {});
assert.ok(validateStep("pagamento", { ...d, payment: "dinheiro" }, 40).changeFor);
assert.ok(validateStep("pagamento", { ...d, payment: "dinheiro", changeFor: "abc" }, 40).changeFor);
assert.ok(validateStep("pagamento", { ...d, payment: "dinheiro", changeFor: "0" }, 40).changeFor);
// Sem mínimo em relação ao total: 30 para um pedido de 40 é aceito (o resto se acerta na entrega).
assert.deepEqual(validateStep("pagamento", { ...d, payment: "dinheiro", changeFor: "30" }, 40), {});
assert.deepEqual(validateStep("pagamento", { ...d, payment: "dinheiro", changeFor: "50" }, 40), {});
assert.equal(changeDue("50", 40), 10);
assert.equal(changeDue("30", 40), 0);
assert.equal(changeDue("", 40), null);

const msg = buildOrderMessage([{ name: "Mousse", selections: {}, quantity: 2, unitPrice: 16 }], {
  ...d,
  street: "Rua A, 10",
  district: "Centro",
  name: "Ana",
  phone: "21999999999",
  payment: "cartao-entrega",
});
assert.match(msg, /2x Mousse — R\$\s32,00/);
assert.match(msg, /\*Pagamento:\* Cartão na entrega/);
assert.ok(!msg.includes("Complemento") && !msg.includes("Observações"));

const cash = buildOrderMessage([{ name: "Mousse", selections: {}, quantity: 2, unitPrice: 16 }], {
  ...d,
  fulfillment: "retirada",
  name: "Ana",
  phone: "21999999999",
  payment: "dinheiro",
  changeFor: "50",
});
assert.match(cash, /\*Pagamento:\* Dinheiro \(troco para R\$\s50,00 · troco de R\$\s18,00\)/);
console.log("checkout ok");
