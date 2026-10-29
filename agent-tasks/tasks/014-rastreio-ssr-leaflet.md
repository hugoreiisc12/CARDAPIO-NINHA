---
id: 014
title: Corrigir o erro ao abrir /rastreio depois do pagamento (Leaflet quebrava o SSR)
severity: critical
status: done
files:
  - src/components/TrackMap.tsx
---

## Contexto

Cliente finaliza o pedido e, ao seguir para o acompanhamento
(`/rastreio?code=…&token=…` — o `return_url` do Stripe e o link "Acompanhar
pedido"), recebe a tela cheia do `ErrorComponent`:

> **Não foi possível carregar**
> Tente novamente em instantes.

Reproduzido no dev server ao pedir a página direto (SSR), sem nenhum navegador
malicioso no meio:

```
Error in renderToReadableStream: ReferenceError: window is not defined
    at leaflet/src/core/Util.js:217:24
    at leaflet/dist/leaflet-src.js:7:66
```

E no cliente, ao hidratar:

```
Error: Switched to client rendering because the server rendering errored
```

## Causa

`src/components/TrackMap.tsx` importava o Leaflet no topo do módulo:

```ts
import L from "leaflet";
```

O Leaflet lê `window` **na avaliação do módulo** (`leaflet/src/core/Util.js`
monta `L.Browser` a partir de `window.navigator`). No servidor não existe
`window`, então qualquer render SSR que carregue esse módulo explode. E
`/rastreio` é a única rota que importa `TrackMap` — por isso o resto do site
nunca deu sinal.

O erro passou por três redes de segurança sem ser pego:

| Rede | Por que não pegou |
|---|---|
| `tsc` | `window` existe nos types; é erro de runtime |
| `bun run build` | o bundle é gerado, só a execução no servidor quebra |
| dev server | o React troca para renderização no cliente e a página *parece* funcionar |

## Correção

- `import L from "leaflet"` virou `import type { Map } from "leaflet"` (só tipo,
  apagado no build) + `await import("leaflet")` **dentro do `useEffect`**, que
  nunca roda no servidor. O Leaflet passa a sair num chunk próprio do cliente
  (`leaflet-src-*.js`).
- O mapa agora tem estado de falha: se o chunk não carregar (rede/offline), o
  componente mostra "Não foi possível carregar o mapa" e a linha do tempo
  continua intacta — ela é o dado real do rastreio, o mapa é enfeite.
- `STORE_POINT` centralizado (as coordenadas estavam duplicadas em três
  chamadas).
- Cleanup com flag `cancelled` + `map?.remove()`: fechar a aba antes do import
  resolver não deixa mapa órfão.

## Critérios de aceite

- `GET /rastreio?code=…&token=…` responde 200 **com o conteúdo renderizado no
  HTML** (sem `window is not defined` no log do servidor).
- Nenhum erro de console/hidratação ao abrir a página no browser.
- Mapa continua montando no cliente (tiles do OpenStreetMap visíveis).
- Fluxo completo do carrinho segue verde.

## Validação

```
dev SSR /rastreio?code&token .... 200, "Acompanhar pedido" no HTML, 0 erros
build node_server /rastreio ...... 200, 4472 bytes com conteúdo
browser (cliente) ................ 0 erros, mapa com 3 tiles, 224px
checkout E2E (carrinho → envio) .. ok, wa.me correto
tsc / eslint / build ............. limpos
check-checkout / check-cross-sell  ok
```

## Revisão

Pendente: só se confirma com o redeploy no Vercel.
