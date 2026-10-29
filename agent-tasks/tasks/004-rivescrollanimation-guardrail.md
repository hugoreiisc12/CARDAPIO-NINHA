---
id: 004
title: Guard-rail para RiveScrollAnimation sem asset carregado
severity: medium
status: done
files:
  - src/components/Rive/RiveScrollAnimation.tsx
---

## Contexto

`RiveScrollAnimation` (`src/components/Rive/RiveScrollAnimation.tsx`) existe mas
**não está integrado** em `src/routes/index.tsx`. É um container `sticky` que,
por padrão, reserva `heightClass="h-[200vh]"` de altura na página para dirigir
uma animação Rive pelo progresso do scroll.

## Problema

`public/animations/ninha.riv` não existe ainda (bloqueado — ação manual do Hugo
no Rive Editor, fora do escopo desta task). Se este componente for integrado do
jeito que está hoje, ele abre **200vh de espaço vazio** no meio do cardápio,
mesmo sem nenhum artboard carregado — regressão de UX, não degradação graciosa.

## O que fazer

1. Adicionar estado `loaded` controlado por `onLoad`/`onLoadError` no `useRive(...)`.
2. Enquanto `loaded === false`: **não** renderizar o wrapper `sticky` de
   `heightClass` (200vh) — renderizar só `children` em fluxo normal (sem altura
   artificial, sem `sticky`), assim quem passar `children` não perde conteúdo e
   a página não abre vão vazio.
3. Quando `loaded === true`: renderizar o comportamento atual (sticky + scrub
   pelo scroll).
4. O hook de scrub (`useEffect` que chama `rive.scrub(...)`) já checa `!rive` —
   adicionar também `!loaded` na guarda, por consistência.

## Critério de aceite

- Sem `.riv` carregado: componente renderiza só `children`, sem `h-[200vh]`.
- Com `.riv` carregado (quando existir): comportamento sticky/scrub funciona como hoje.
- `npx tsc --noEmit` sem novos erros nesse arquivo.
- Ainda **não** integrar este componente em `index.tsx` — decisão de onde/como
  ele entra no fluxo da página fica para depois que o `.riv` existir.

## Implementação

Em `RiveScrollAnimation.tsx`:
1. Estado `loaded` controlado por `onLoad`/`onLoadError` no `useRive(...)`.
2. Quando `loaded === false`: early return renderiza só `children` em fluxo
   normal (`<div className={className}>{children}</div>`), sem o wrapper `sticky`
   e sem `heightClass` (`h-[200vh]`) — a página não abre vão vazio.
3. Quando `loaded === true`: comportamento atual (sticky + scrub) intacto.
4. Guarda do scrub agora checa `!rive || !loaded` (e `animationNames.length === 0`).

Diff relevante:
```diff
+  const [loaded, setLoaded] = useState(false);
   const { scrollYProgress } = useScroll({ target: containerRef, ... });
 
   const { rive, RiveComponent } = useRive({
     src: rivePath(),
     artboard,
     autoplay: false,
     layout: containLayout(),
+    onLoad: () => setLoaded(true),
+    onLoadError: () => setLoaded(false),
   });
 
   useEffect(() => {
-    if (!rive || rive.animationNames.length === 0) return;
+    if (!rive || !loaded || rive.animationNames.length === 0) return;
     ...
-  }, [rive, scrollYProgress]);
+  }, [rive, loaded, scrollYProgress]);
+
+  if (!loaded) {
+    return <div className={className}>{children}</div>;
+  }
```

Nota: `useScroll({ target: containerRef })` lida com ref nulo antes do `loaded`
virar `true`; quando o wrapper com ref monta, o tracking do scroll passa a valer.
Não integrado em `index.tsx` (decisão posterior, como pedido).

Validação: `npx tsc --noEmit` sem novo erro; `npm run build` passa.

## Revisão

**Aprovado.** Li o arquivo final: `if (!loaded) return <div className={className}>{children}</div>;` antes do wrapper `sticky`/`h-[200vh]` — sem `.riv`, não abre vão vazio na página, critério de aceite cumprido. Guarda do scrub agora inclui `!loaded`. Um detalhe menor, não bloqueante: no branch `!loaded` o `<div>` não tem `ref={containerRef}`, então o `useScroll` só passa a rastrear o elemento depois que `loaded` vira `true` e o wrapper com ref é montado — o próprio opencode documentou isso na seção Implementação, e é um comportamento aceitável dado que não há conteúdo scroll-driven até o asset existir mesmo. `tsc --noEmit`/`vite build` limpos. Não integrado em `index.tsx`, como pedido.
