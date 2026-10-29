---
id: 003
title: Dar fallback de imagem ao RiveProductCard
severity: medium
status: done
files:
  - src/components/Rive/RiveProductCard.tsx
depends_on: 001
---

## Contexto

`RiveProductCard` (`src/components/Rive/RiveProductCard.tsx`) existe mas ainda
**não está integrado** em `src/routes/index.tsx` — o grid de produtos usa o
`ProductCard` normal (função local em `index.tsx`), que mostra a foto real do
produto (`product.image`, de `src/lib/menu-data.ts`).

## Problema

`RiveProductCard` não tem prop de imagem — ele renderiza só `<RiveComponent />`
como visual do card. Hoje `public/animations/ninha.riv` não existe (bloqueado,
depende de ação manual do Hugo no Rive Editor — não é task de código). Enquanto
isso, se este componente for usado no lugar do `ProductCard` atual, **as fotos
reais dos 15 produtos desaparecem** — regressão visível, não uma degradação
graciosa.

Este componente só pode substituir o `ProductCard` atual com segurança depois
desta task.

## O que fazer

1. Adicionar prop `image?: string` a `RiveProductCardProps`.
2. Renderizar a foto (`<img src={image} ... className="absolute inset-0 h-full w-full object-cover" />`)
   como camada de base, sempre visível quando `image` existir.
3. O `<RiveComponent />` deve ficar em uma camada por cima, **só renderizada
   depois que o Rive carregar com sucesso** — usar `onLoad`/`onLoadError` no
   `useRive(...)` para controlar um estado `loaded`, e só montar
   `<RiveComponent />` quando `loaded === true`. Isso evita um canvas vazio
   competindo com a foto real enquanto o `.riv` não existir.
4. Manter o resto do comportamento atual (hover state machine, tag, preço,
   overlay de tint no hover) intacto.

## Critério de aceite

- Sem `.riv` carregado: card mostra a foto real (`image`), sem canvas vazio por cima.
- Com `.riv` carregado (quando existir): Rive aparece por cima da foto normalmente.
- `npx tsc --noEmit` sem novos erros nesse arquivo.
- Ainda **não** integrar este componente em `index.tsx` — isso é outra decisão,
  fora do escopo desta task.

## Implementação

Em `RiveProductCard.tsx`:
1. Prop `image?: string` adicionada a `RiveProductCardProps`.
2. Estado `loaded` controlado por `onLoad`/`onLoadError` no `useRive(...)`.
3. A foto é a camada de base (`<img>` com `absolute inset-0 h-full w-full object-cover`),
   sempre visível quando `image` existe.
4. `<RiveComponent />` só é montado quando `loaded === true` — sem `.riv` em
   `public/animations/`, o `onLoadError` mantém `loaded` como `false` e o card
   mostra só a foto real, sem canvas vazio competindo.

Diff relevante:
```diff
+  image?: string;
...
+  image,
  ...
   const containerRef = useRef<HTMLButtonElement>(null);
   const [isHovered, setIsHovered] = useState(false);
+  const [loaded, setLoaded] = useState(false);
 
   const { rive, RiveComponent } = useRive({
     src: rivePath(),
     artboard,
     stateMachines: stateMachine,
     layout: containLayout(),
     autoplay: true,
+    onLoad: () => setLoaded(true),
+    onLoadError: () => setLoaded(false),
   });
```
```diff
   <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
-    <RiveComponent />
+    {image && (
+      <img src={image} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
+    )}
+    {loaded && <RiveComponent />}
```

Hover state machine, tag, preço e overlay de tint no hover permanecem intactos.
Não integrado em `index.tsx` (fora do escopo, como pedido).

Validação: `npx tsc --noEmit` sem novo erro; `npm run build` passa.

## Revisão

**Aprovado.** Li o arquivo final: `image?: string` renderiza `<img>` incondicional como base; `{loaded && <RiveComponent />}` só monta o canvas depois do `onLoad`. Sem `.riv`, o card mostra só a foto real — critério de aceite cumprido. `tsc --noEmit`/`vite build` limpos. Não integrado em `index.tsx`, como pedido.
