# IFOOD_IMPORT — Ninha Cakes

> Como bringar o que já existe no iFood para o Postgres local.
> Decisão relacionada: `docs/BACKEND_PLAN.md` §D6, §6. Modelo: `docs/DATA_MODEL.md`.

## Por que import manual primeiro

A Catalog API oficial do iFood (`merchant-api.ifood.com.br`) exige credenciais de parceiro, `merchantId` e passar pelo processo de homologação. Isso não está disponível agora. Então a fase 1 é: **exportar a planilha do iFood e importar por script**, com o mesmo normalizador que a fase 2 vai usar. Quando as credenciais chegarem, troca-se só a fonte — o dedupe, a classificação e a tela de revisão não mudam.

## Formato aceito

CSV com cabeçalho, `;` como separador (padrão de export BR):

```csv
ifood_item_id;name;description;price;status;image_url;category;external_code
```

| Coluna | Obrigatória | Observação |
|---|---|---|
| `ifood_item_id` | sim | Identificador do item no iFood. Vira `ifood_links.ifood_item_id` |
| `name` | sim | Se vazio, a linha é pulada com aviso no relatório |
| `description` | não | Aceita HTML; o normalizador remove tags |
| `price` | sim | Ponto **ou** vírgula decimal: `21.99` e `21,99` → `2199` centavos |
| `status` | não | `AVAILABLE` → `sold_out = false`; qualquer outro valor → `true` |
| `image_url` | não | Baixada para `backend/static/products/` |
| `category` | não | Casa por nome normalizado; categoria nova é criada com `sort_order` no fim |
| `external_code` | não | Segunda chave de dedupe, atrás do `ifood_item_id` |

## Dedupe em 3 níveis

Para cada linha da planilha, nesta ordem:

1. **`ifood_links`** — existe vínculo por `(ifood_merchant_id, ifood_item_id)`? É o mesmo produto. Atualiza `last_seen_at` e segue para a comparação.
2. **`external_code`** — o código externo bate com algum `products.slug`? Mesmo produto.
3. **slug/nome normalizado** — normaliza (minúsculo, sem acento, troca hífen) e procura. Mesmo produto.

Sem match nos três: produto novo.

Cada linha sai classificada como:

| Resultado | Significado | O que acontece |
|---|---|---|
| `novo` | Não existe no banco | Cria `products` + `ifood_links` |
| `igual` | Mesmos preço, descrição e disponibilidade | Só atualiza `last_seen_at` |
| `divergente` | Mesmo produto, algum campo diferente | **Não sobrescreve.** Vai para a fila "Revisar" |

## Fila de revisão (no admin)

Cada divergência mostra lado a lado: campo, valor local, valor do iFood. Ações:

* **Aplicar** — adota o valor do iFood no produto local.
* **Manter local** — marca a linha como revisada sem mudar nada (`ifood_links.last_seen_at` avança, `ifood_sync_run.deactivated` conta).

Sugestão de implementação: guardar as divergências numa tabela `ifood_conflicts` (payload do iFood + payload local + decisão) em vez de improvisar. Não está no DDL inicial porque a fase 1 pode resolver com o `raw_payload` de `ifood_sync_runs` + o admin lendo — mas se a fila virar rotina diária, merece tabela própria.

## Regra de conflito

**A foto local vence até revisão humana.** Os 38 produtos atuais já têm foto local curada em `src/assets/products/`, e 9 bebidas compartilham a mesma `bebida.svg` genérica (`src/lib/catalog.ts`, `photo("bebida")`). O import baixa a foto do iFood para `static/`, mas não troca a `image_url` do produto automaticamente — entra como sugestão na fila de revisão, para o operador aceitar produto por produto.

## Auditoria

Toda execução grava uma linha em `ifood_sync_runs` com `source`, `started_at`, `finished_at`, contagem de `created/updated/deactivated` e o `raw_payload` da planilha inteira em JSONB. Reprocessar a mesma planilha é seguro: o dedupe reidentifica tudo e o resultado é `igual` ou `divergente`, nunca duplica.

## Fase 2 — Catalog API oficial

Quando houver `Client ID`, `Client Secret` e `merchantId`, o mesmo normalizador passa a ler de:

```
GET https://merchant-api.ifood.com.br/catalog/v2.0/merchants/{merchantId}/catalogs
GET .../catalogs/{groupId}/categories?include_items=true
GET .../catalogs/{groupId}/sellableItems
GET .../catalogs/{groupId}/nonSellableItems
```

Estrutura do item no iFood → nosso banco:

| Campo iFood | Coluna local | Transformação |
|---|---|---|
| `id` | `ifood_links.ifood_item_id` | — |
| `externalCode` | `products.slug` | se vier preenchido |
| `name` | `products.name` | — |
| `description` | `products.description` | remove HTML |
| `price` | `products.price_cents` | float → int |
| `status` | `products.sold_out` | `AVAILABLE` → falso |
| `imageUrl` | `products.image_url` | baixa o arquivo |
| `optionGroups[]` | `variations` + `variation_options` | `priceDelta` → `price_delta_cents` |
| `contextModifiers` | **ignorar na v1** | o iFood tem preço por canal (Delivery/Whitelabel/Indoor); nossa tabela tem um preço só |

Escrita de volta ao iFood (`PUT /items`, `PATCH /items/price`, `PATCH /items/status`) fica **desligada por padrão** — pausar um item no admin não deve alterar o iFood sem ninguém pedir.

## Pendências

1. Export real do iFood para validar nomes de coluna e formato de `price` (o separador decimal muda entre exports).
2. Decidir se a foto do iFood entra em `static/` ou em storage externo quando o backend subir para fora da máquina local.
3. Confirmar se o `contextModifiers` precisa de modelo próprio (`product_prices` por canal) — só faz sentido se o iFood tiver preço diferente do cardápio web.
