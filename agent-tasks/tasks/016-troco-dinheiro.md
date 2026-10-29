---
id: 016
title: Troco do pagamento em dinheiro — obrigatório, validado e calculado
severity: medium
status: done
files:
  - src/lib/checkout.ts
  - src/components/CheckoutSteps.tsx
  - src/components/CartSheet.tsx
  - scripts/check-checkout.ts
  - docs/DATA_MODEL.md
---

## Contexto

Duas queixas do dono no checkout, na etapa Pagamento, quando escolhia **Dinheiro**:

1. o valor do troco não era usado para nada além de aparecer na mensagem —
   ninguém via quanto deveria voltar;
2. ao digitar um valor menor que o total, o campo acusava *"O troco precisa ser
   para R$ 49,90 ou mais"*. O `49,90` não era uma regra fixa: era o subtotal
   daquele carrinho interpolado na mensagem. Ainda assim, na prática o campo
   ficava proibido de receber valores abaixo do total, e o campo era
   **opcional** (`if (... && d.changeFor.trim())`), então dava para fechar o
   pedido em dinheiro sem informar nada.

## Decisão

- **Campo obrigatório** quando a forma de pagamento é dinheiro.
- **Valor válido** = número parseável maior que zero (`parseMoney`). Nada de
  comparação com o total: quem paga em dinheiro pode entregar menos e acertar a
  diferença na hora — a regra antiga saiu, no front e no servidor.
- **Troco calculado** = `valor informado − total`, nunca negativo.
  - Na etapa Pagamento aparece ao lado do campo (`Troco: R$ 27,00`, ou
    "Valor exato — sem troco").
  - Na Revisão aparece como linha sob a forma de pagamento.
  - Na mensagem do WhatsApp vai o valor entregue **e** o troco:
    `*Pagamento:* Dinheiro (troco para R$ 50,00 · troco de R$ 27,00)`.
  - No ticket da cozinha (back) entra "Troco a devolver", para o operador não
    precisar fazer a conta.

## O que mudou

| Arquivo | Mudança |
|---|---|
| `src/lib/checkout.ts` | `validateStep` exige o campo e valida `> 0`; novo `changeDue()`; mensagem leva o troco |
| `src/components/CheckoutSteps.tsx` | `PaymentStep` recebe o subtotal e mostra o troco ao vivo; `ReviewStep` mostra a linha de troco; hint do método virou "Informe o valor para o troco" |
| `src/components/CartSheet.tsx` | passa `total={subtotal}` para o `PaymentStep` |
| `back-api-menu/core/validation.py` | espelha a regra (paridade com o front) |
| `back-api-menu/apps/orders/services.py` | sai o `OrderRejected("change_too_small")` que barrava `< total` |
| `back-api-menu/core/message.py` | mensagem com `· troco de R$ X`, calculado sobre o **total com frete** quando a API monta |
| `back-api-menu/core/ticket.py` | linha "Troco a devolver" |
| `back-api-menu/scripts/seed_from_catalog.py` | hint do método alinhado ao front |

## Validação

Browser (dev, 1x Crunchy Cake = R$ 23,00):

```
dinheiro sem valor ......... "Informe o valor para o troco", não avança
dinheiro com "abc" ......... "Informe um valor válido, ex.: 50,00", não avança
dinheiro com 50 ............ "Troco: R$ 27,00" ao vivo, revisão com o mesmo valor
dinheiro com 20 (< total) .. aceito (regra antiga barrava), sem linha de troco
mensagem final ............. "Dinheiro (troco para R$ 50,00 · troco de R$ 27,00)"
```

Gates: `tsc`, `eslint`, `bun run build`, `check-checkout`, `check-cross-sell`
verdes; back com `pytest` 195 passed e `ruff` limpo.

## Pendência

Se o valor informado for menor que o total, o pedido passa e a mensagem mostra
só o valor entregue — a diferença é acertada na entrega. Se a loja preferir um
aviso (não bloqueante) nesse caso, é uma linha no `PaymentStep`.
