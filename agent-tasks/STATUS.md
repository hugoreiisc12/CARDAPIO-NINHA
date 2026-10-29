# Status — log cronológico

Cada linha = uma atualização. Adicionada pelo opencode ao concluir/bloquear uma task,
e pelo Claude ao revisar. Formato: `AAAA-MM-DD HH:MM | task | quem | resumo`.

<!-- Adicionar novas linhas no topo -->

2026-10-28 21:05 | 011 | opencode | `agua-sem-gas.jpg` trocada pelo packshot Crystal sem gás 500ml (Mambo/VTEX), recorte Vision + cream, 900×1125, 99 KB. Seed do back rodado; `test_shared_svg_photo` virou `test_each_beverage_has_own_photo` e a suíte do back passou.

2026-10-28 21:05 | 010 | opencode | Pagamento: só `cartao-entrega` e `dinheiro` selecionáveis; Pix e Cartão Online desdobrados em ids próprios, `available: false` e badge "Em breve" no `Choice`. `CartSheet` usa `isOnlinePayment`; `check-checkout.ts` atualizado.

2026-10-28 20:40 | 009 | opencode | Fotos reais nas 8 bebidas: packshots VTEX (Mambo/Prezuni) recortados via Vision e recompostos em `#FAF2F4`, 900×1125, <120 KB. `catalog.ts` sem `photo("bebida")`, `bebida.svg` removido, origem em `docs/CREDITS.md`.

2026-10-28 20:40 | 008 | opencode | `SweetsCover.tsx` removido (código morto, lib inexistente). `tsc --noEmit` de 5 erros para zero; nenhum import pendente. Docs (`AGENTS.md`/`README`) ainda citam o componente — pendência registrada na task.

2026-09-23 01:30 | 007 | Claude | Commit do checkout/cardápio iFood/venda cruzada entrou com `--no-verify` (hook de tamanho, decisão do Hugo). Task 007 aberta para o refactor.

2026-09-20 14:30 | 005-006 | opencode | **Validação OK.** `tsc --noEmit` limpo; `eslint --fix` aplicado (só prettier); `vite build` passa (three.mjs 1,44 MB client). Runtime: probe temporária (`data-probe`) via pencil_browser confirmou **4/4 campos** construídos e **24 peças** no viewport mobile 402px (6 por tipo); canvas WebGL presente, sem exceções. Probe removida e rebuild limpo.

2026-09-20 14:10 | 005 | opencode | Implementado: `BrandLogo` xl `clamp(84px,28vw,123px)`/`clamp(50px,16vw,79px)`; mascote `w-[min(50vw,254px)]`. Revisão visual pendente.

2026-09-20 14:10 | 006 | opencode | Implementado: pipeline vetorial `SweetsCoverLib` (materials+geometry: donut anel+glace+sprinkles+nonpareil, pirulito disco+pétalas+palito, bombom lathe+forminha, trufa esfera+tube drizzle) com template/dispose; `SweetsCover.tsx` reescrito (spawn síncrono, sem raster). SPEC: `SPEC/SKILL_VECTOR_3D.md`. Validação: `tsc --noEmit` + `eslint` + `vite build` pendentes.

2026-09-20 14:10 | 005-006 | Claude | Abertura das tasks 005 e 006 (aumento de label/mascote; vetorização 2D→3D) com decisão de geometria 100% vetorial e escopo React-only.

2026-08-09 22:52 | 001-004 | Claude | Revisão concluída — **4/4 aprovadas**. Validação independente: `tsc --noEmit`, `eslint`, `vite build` limpos; código lido e conferido contra critério de aceite de cada task (não só o relato do opencode). Destaque: fix colateral da task 001 corrigiu um bug funcional real (comparação de `StateMachineInputType` como string nunca dava match — hover state machine nunca era acionado mesmo com `.riv` válido). Prontas para commit.

2026-08-09 22:41 | 001-004 | opencode | Tasks concluídas: ref type (001), inferência genérica do riveLazy (002), fallback de imagem no RiveProductCard (003), guard-rail no RiveScrollAnimation (004). Também corrigidos erros colaterais de tipo (StateMachineInputType enum numérico em 3 arquivos + import do tipo Rive em hooks.ts). tsc/eslint/build limpos.

2026-08-09 22:20 | — | Claude | Pasta criada. 4 tasks abertas em `tasks/` para o opencode (ver 001–004).
