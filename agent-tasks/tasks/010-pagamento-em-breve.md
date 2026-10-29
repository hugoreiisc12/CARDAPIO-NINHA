---
id: 010
title: Pagamento — só Cartão na entrega e Dinheiro; Pix e Cartão Online como "Em breve"
severity: medium
status: done
files:
  - src/lib/checkout.ts
  - src/components/CheckoutSteps.tsx
  - src/components/CartSheet.tsx
  - scripts/check-checkout.ts
---

## Contexto

O checkout oferecia três formas de pagamento, com `online` habilitado
("Pix ou cartão online", via Stripe Payment Element). A loja só aceita, por ora,
**cartão na entrega** e **dinheiro**; Pix e Cartão Online entram depois.

O modelo tinha um único id `online` para as duas modalidades online. Para exibir
"Pix" e "Cartão Online" como linhas separadas, o tipo foi desdobrado em `pix` e
`cartao-online`, ambos `available: false` com `badge: "Em breve"`.

Docs `SPEC/` aplicáveis: `SPEC/skill/ninha-brand/SKILL.md` — badge novo usa o
`gradient-brand` (assinatura da casa para pills), `rounded-full`, texto
`plum-950`, tracking `0.14em`; nenhuma cor fora da paleta.

## O que fazer

1. `PaymentMethod` → `"pix" | "cartao-online" | "cartao-entrega" | "dinheiro"`.
2. `PAYMENT_METHODS`: disponíveis primeiro (cartão na entrega, dinheiro), depois
   Pix e Cartão Online desabilitados com badge "Em breve"; campo opcional `badge`.
3. `Choice` aceita `badge` e, quando presente, troca o círculo de rádio pelo pill
   (não há o que selecionar).
4. `CartSheet` decide o fluxo online por `isOnlinePayment(...)` em vez de comparar
   com a string `"online"` — reativar depois é só virar `available: true`.
5. `scripts/check-checkout.ts`: o assert de passo válido usava `"online"`, que
   agora é indisponível. Passa a usar `"cartao-entrega"` e ganha um assert de que
   método indisponível (`pix`) é recusado.

## Critérios de aceite

- Só cartão na entrega e dinheiro selecionáveis; Pix e Cartão Online com badge
  "Em breve" e `disabled`.
- `npx tsc --noEmit`, `eslint` nos arquivos tocados, `bun scripts/check-checkout.ts`
  e `bun run build` verdes.
- Mensagem de WhatsApp com o label correto do método escolhido.

## Implementação

- `checkout.ts`: tipo desdobrado, `PAYMENT_METHODS` reordenado (disponíveis
  primeiro), `badge?: string` e helper `isOnlinePayment` com a lista
  `ONLINE_METHODS` (`pix`, `cartao-online`) — ponto único para religar o gateway.
- `CheckoutSteps.tsx`: `PAYMENT_ICONS` cobre os 4 ids (QrCode para Pix,
  CreditCard para os dois de cartão, Banknote para dinheiro). `Choice` ganhou
  `badge` e `aria-disabled`; o estilo desabilitado não usa mais `opacity-50` no
  botão inteiro (isso apagava o pill), e sim borda/fundo `cream` + texto
  `ink-soft`, mantendo o badge com o gradiente em força total.
- `CartSheet.tsx`: `const online = isOnlinePayment(draft.payment)`.
- `scripts/check-checkout.ts`: asserts atualizados + caso de método indisponível.

Validação de render (SSR isolado do `PaymentStep`):

```
Cartão na entrega    badge=-         disabled=false aria-disabled=false
Dinheiro             badge=-         disabled=false aria-disabled=false
Pix                  badge=Em breve  disabled=true  aria-disabled=true
Cartão Online        badge=Em breve  disabled=true  aria-disabled=true
```

Backend não foi tocado: a tabela `payment_methods` continua com `online`
disponível, mas o front não oferece mais esse id. Ao religar Pix/Cartão Online
será preciso criar os ids correspondentes no back (`PaymentMethodKind` + seed),
porque hoje o `payment_method` enviado precisa existir no banco.

## Revisão
