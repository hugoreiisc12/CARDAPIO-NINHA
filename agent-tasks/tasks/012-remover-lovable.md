---
id: 012
title: Remover as dependências e o branding do Lovable (favicon, og:image, vite config)
severity: medium
status: done
files:
  - vite.config.ts
  - package.json
  - bun.lock
  - bunfig.toml
  - .env.example
  - src/routes/__root.tsx
  - src/lib/lovable-error-reporting.ts
  - public/favicon.png
  - public/apple-touch-icon.png
  - public/og-image.jpg
  - AGENTS.md
  - README.md
  - docs/AGENTS.md
---

## Contexto

O projeto foi criado dentro do Lovable e herdou três acoplamentos:

1. **Build**: `vite.config.ts` era só uma chamada a
   `@lovable.dev/vite-tanstack-config`, que injeta TanStack Start, Nitro, Tailwind,
   tsConfigPaths, React, alias `@`, dedupe e `define` das `VITE_*` — além de
   plugins só do sandbox (`lovable-tagger`, `hmr-gate`, `dev-server-bridge`,
   proxy de assets, logger de erro de SSR).
2. **Assets**: o `favicon` era `href="data:,"` (nenhum ícone) e o `og:image`
   apontava para um preview em `pub-*.r2.dev/.../id-preview-*.lovable.app`, que
   é temporário e some quando o preview expira.
3. **Runtime**: `src/lib/lovable-error-reporting.ts` mandava o erro para
   `window.__lovableEvents`, objeto que só existe dentro do editor do Lovable —
   fora dele o handler era no-op.

O `bun.lock` também resolvia 13 tarballs pelo mirror privado do Lovable
(`europe-west{1,4}-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache`).

## O que fazer

1. `vite.config.ts` próprio, replicando só o que é do projeto (nada de sandbox),
   mantendo comportamento idêntico de build: preset `cloudflare-module`,
   `css.transformer: "lightningcss"`, dedupe de React/TanStack e `define` das `VITE_*`.
2. Trocar o pacote no `package.json`; `lightningcss` passa a ser devDependency
   direta (antes vinha de carona).
3. Tirar o bypass do guard de 24 h do `bunfig.toml` — as 4 exceções eram pacotes Lovable.
4. Reescrever os 13 `resolved` do lock para `registry.npmjs.org` (mesmo tarball,
   mesmo `sha512`), sem bumpar nenhuma versão.
5. `__root.tsx`: favicon e apple-touch-icon reais + `og:image` próprio
   (`/og-image.jpg`), absoluto quando `VITE_SITE_URL` está definida.
6. Apagar `lovable-error-reporting.ts` e o uso no `ErrorComponent`.
7. Limpar menções em `AGENTS.md`, `README.md` e `docs/AGENTS.md`.

## Critérios de aceite

- `grep -ri lovable` no repo não encontra dependência, import ou URL de plataforma.
- `bun.lock` sem `pkg.dev` e sem pacote `@lovable.dev/*`.
- `npx tsc --noEmit`, `eslint` nos arquivos tocados, `bun run build`,
  `check-checkout` e `check-cross-sell` verdes.
- Nenhuma versão de dependência alterada em relação ao commit anterior.
- HTML servido com `rel="icon"`, `apple-touch-icon` e `og:image` apontando para
  arquivos locais que respondem 200.

## Implementação

**Build.** `vite.config.ts` agora é config de Vite normal. A ordem dos plugins
segue a do wrapper (Tailwind → tsConfigPaths → TanStack Start → Nitro → React),
porque o `nitro` precisa entrar depois do `tanstackStart` no build. O import do
Nitro é dinâmico e só em `command === "build"`: em dev nada dele é carregado.

Os extras do wrapper que ficaram de fora são todos de sandbox (`lovable-tagger`,
`hmr-gate`, `dev-server-bridge`, proxy `/__l5e/`, `lovable-build-error-diagnostics`,
`@tanstack/devtools-vite`) ou redundantes no Vite 8 (`define` das `VITE_*`, que o
Vite já faz). O logger de erro de SSR do wrapper também saiu: o `src/server.ts` +
`error-capture.ts` já cobrem o caso, e são nossos.

**Lock.** `bun install` do zero bumpava 56 pacotes (React 19.2.5 → 19.3.1, Vite
8.0.16 → 8.3.5 e mais 54), o que transformaria uma limpeza em upgrade de stack.
Caminho usado: restaurar o lock, deixar o `bun install` remover o pacote Lovable e
adicionar o `lightningcss`, depois reescrever só o prefixo das 13 URLs
(`…/sandbox-npm-cache/<nome>/-/<arquivo>` → `registry.npmjs.org/<nome>/-/<arquivo>`).
Os hashes `sha512` são os mesmos, e o `bun install` seguinte respondeu
`Checked 442 installs across 554 packages (no changes)` — ou seja, integridade
confere e nenhuma versão se moveu.

**Assets.** Favicon e og:image gerados a partir dos tokens da casa, não são
imagens de terceiros: fundo `plum-900` `#46182F`, letra `N` em Fraunces itálico
`cream-50` `#FAF2F4` (favicon 64×64 e apple-touch 180×180) e um card 1200×630
com "Ninha" em Fraunces, "CAKES" no `gradient-brand` e a foto
`public/images/hero-bolo-1000.jpg` mascarada à direita. Renderizados com Chrome
headless e reduzidos com `sips`.

**`og:image` absoluto.** `VITE_SITE_URL` (nova, opcional) entra no `.env.example`.
Sem ela o `content` sai relativo (`/og-image.jpg`) — o WhatsApp resolve relativo
contra a URL da página, mas crawler nenhum garante isso. Com ela, vira
`https://dominio/og-image.jpg`.

## Revisão
