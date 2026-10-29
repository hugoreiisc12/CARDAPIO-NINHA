# 🎬 Rive 3D Components — Setup Guide para Landing Asme

## Quick Start (5 minutos)

### 1. Instalar dependências

```bash
npm install @rive-app/react-canvas @rive-app/js

# Se ainda não tiver framer-motion (necessário para integração)
npm install framer-motion
```

### 2. Criar pasta de animações

```bash
mkdir -p public/animations
# Coloque seus arquivos .riv aqui
```

### 3. Importar componentes

```typescript
// src/components/Rive/RiveHero.tsx
import { RiveHeroWithCharacter } from '@/components/Rive/RiveHeroWithCharacter';

// Em sua página
<RiveHeroWithCharacter />
```

---

## 📁 Estrutura Recomendada

```
src/
├── components/
│   ├── Rive/
│   │   ├── RiveHeroWithCharacter.tsx
│   │   ├── RiveScrollAnimation.tsx
│   │   ├── RiveProductCard.tsx
│   │   ├── RiveBackgroundMotion.tsx
│   │   ├── hooks.ts (useRiveStateMachine, etc)
│   │   └── types.ts (interfaces)
│   ├── Sections/
│   │   ├── HeroSection.tsx (usa RiveHero)
│   │   ├── AboutSection.tsx (usa RiveAboutHeroBanner)
│   │   ├── FeaturedVideo.tsx (usa RiveFeaturedVideoSection)
│   │   └── PhilosophySection.tsx
│   └── ...
├── styles/
│   └── rive.css (estilos específicos)
└── pages/
    └── index.tsx
public/
└── animations/
    ├── hero-character.riv
    ├── about-hero.riv
    ├── video-overlay.riv
    ├── scroll-progress.riv
    ├── bg-motion.riv
    └── product-preview.riv
```

---

## 🔧 Setup Detalhado por Seção

### SEÇÃO 1: HERO COM PERSONAGEM

**O que você vai fazer no Rive Editor:**

1. Crie um novo arquivo `.riv`
2. Artboard: `Main` (1920x1080)
3. State Machine: `HeroCharacterMachine`
   - **States**: `Idle`, `Hover`, `Active`
   - **Inputs**:
     - `pointerX` (number, 0-100)
     - `pointerY` (number, 0-100)
     - `isHovered` (boolean)
   - **Transitions**:
     - Idle → Hover (on `isHovered` = true)
     - Hover → Idle (on `isHovered` = false)

**Exemplo de animações**:
- Idle: personagem respirando (subtle scale)
- Hover: "eyes follow cursor" usando constraints + pointerX/Y
- Active: pop animation

**Arquivo React**: `components/Rive/RiveHeroWithCharacter.tsx`
```typescript
// Copia do arquivo `rive-implementation-examples.tsx` acima
export function RiveHeroWithCharacter() {
  // ... implementation
}
```

**Uso**:
```typescript
// src/pages/index.tsx
import { RiveHeroWithCharacter } from '@/components/Rive/RiveHeroWithCharacter';

export default function Home() {
  return (
    <section className="relative w-full min-h-screen">
      <RiveHeroWithCharacter />
    </section>
  );
}
```

---

### SEÇÃO 2: ABOUT COM HERO BANNER

**Setup Rive:**

1. Novo arquivo `.riv`
2. Artboard: `About` (1920x1080)
3. Elementos:
   - Background landscape (shapes, gradients)
   - Character silhouettes
   - Entrance animations
4. State Machine: `AboutStateMachine`
   - Input: `inViewTrigger` (trigger)
   - Animation on trigger: fade-in + slide-up

**Arquivo React**: `components/Rive/RiveAboutHeroBanner.tsx`
```typescript
// Copia do exemplo acima
export function RiveAboutHeroBanner() {
  // ... implementation
}
```

**Uso em AboutSection.tsx**:
```typescript
import { RiveAboutHeroBanner } from '@/components/Rive/RiveAboutHeroBanner';

export function AboutSection() {
  return (
    <div>
      <RiveAboutHeroBanner />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Seu conteúdo de texto */}
      </div>
    </div>
  );
}
```

---

### SEÇÃO 3: FEATURED VIDEO COM OVERLAY

**Setup Rive:**

1. Novo arquivo `.riv`
2. Artboard: `VideoOverlay` (16:9 aspect ratio)
3. Elementos decorativos (glow effects, particles, etc)
4. Auto-play

**Arquivo React**: `components/Rive/RiveFeaturedVideoSection.tsx`
```typescript
export function RiveFeaturedVideoSection() {
  // ... implementation com video + rive overlay
}
```

**Uso**:
```typescript
// src/components/Sections/FeaturedVideo.tsx
import { RiveFeaturedVideoSection } from '@/components/Rive/RiveFeaturedVideoSection';

export function FeaturedVideoSection() {
  return (
    <section className="bg-black py-20 md:py-32">
      <RiveFeaturedVideoSection />
    </section>
  );
}
```

---

### SEÇÃO 4: PRODUCT/SERVICE CARDS

**Setup Rive:**

1. Arquivo `.riv` para cada card (ou 1 arquivo com múltiplos artboards)
2. Artboard: `CardPreview` (aspect-video)
3. State Machine: `CardStateMachine`
   - Input: `isHovered` (boolean)
   - Animações: scale, color shift on hover

**Arquivo React**: `components/Rive/RiveProductCard.tsx`
```typescript
export interface RiveProductCardProps {
  title: string;
  description: string;
  riveFile: string;
  stateMachine: string;
}

export function RiveProductCard({ title, description, riveFile, stateMachine }: RiveProductCardProps) {
  // ... implementation
}
```

**Uso em ServicesSection.tsx**:
```typescript
import { RiveProductCard } from '@/components/Rive/RiveProductCard';

const services = [
  {
    title: 'Research & Insight',
    description: 'We dig deep into data, culture, and human behavior...',
    riveFile: '/animations/service-research.riv',
    stateMachine: 'ServiceCardMachine',
  },
  {
    title: 'Design & Execution',
    description: 'From concept to launch, we obsess over every detail...',
    riveFile: '/animations/service-design.riv',
    stateMachine: 'ServiceCardMachine',
  },
];

export function ServicesSection() {
  return (
    <section className="bg-black py-28 md:py-40 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {services.map((service) => (
          <RiveProductCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
}
```

---

## 🎨 Integração com Seu Design System

### Cores & Theming

Se você usa Tailwind com temas personalizados, adicione em `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        rive: {
          glow: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.05)',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
};
```

### CSS Classes

Em `styles/rive.css`:

```css
@layer components {
  .rive-container {
    @apply relative rounded-xl overflow-hidden;
  }

  .rive-hero-overlay {
    @apply absolute inset-0 pointer-events-none;
  }

  .rive-card {
    @apply rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-white/0 border border-white/10 backdrop-blur-sm transition-all hover:border-white/20;
  }

  .rive-loading {
    @apply bg-slate-900 rounded-xl animate-pulse;
  }
}
```

---

## 📊 Performance Optimization

### 1. Lazy Loading com Suspense

```typescript
import { lazy, Suspense } from 'react';

const RiveHeroWithCharacter = lazy(() => 
  import('@/components/Rive/RiveHeroWithCharacter').then(m => ({
    default: m.RiveHeroWithCharacter
  }))
);

export function HomePage() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-black" />}>
      <RiveHeroWithCharacter />
    </Suspense>
  );
}
```

### 2. Intersection Observer para Pause/Play

```typescript
// hooks/useRiveVisibility.ts
import { useEffect } from 'react';

export function useRiveVisibility(ref: React.RefObject<HTMLDivElement>, rive: any) {
  useEffect(() => {
    if (!ref.current || !rive) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          rive.play();
        } else {
          rive.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rive, ref]);
}
```

### 3. Memory Cleanup

```typescript
useEffect(() => {
  return () => {
    // Cleanup quando componente unmount
    if (rive) {
      // Não precisa chamar explicitamente, React Canvas faz isso
      // Mas você pode adicionar logging para debug
      console.log('Rive component cleanup');
    }
  };
}, [rive]);
```

---

## 🐛 Troubleshooting

### Problema: "Rive não carrega"

**Solução 1**: Verifique o caminho do arquivo
```typescript
// ✅ Correto
src: '/animations/hero-character.riv'

// ❌ Errado
src: './animations/hero-character.riv'
src: '/public/animations/hero-character.riv'
```

**Solução 2**: Verifique o estado de carregamento
```typescript
const { rive, RiveComponent } = useRive({
  src: '/animations/hero-character.riv',
  onLoad: () => console.log('✅ Rive loaded'),
  onError: (e) => console.error('❌ Rive error:', e),
});
```

### Problema: "State Machine inputs não respondem"

**Causa**: State machine não está configurado corretamente no Rive Editor

**Solução**:
1. No Rive Editor, abra `Inspect` → `State Machines`
2. Verifique se o nome da state machine está correto
3. Verifique se os inputs têm os nomes exatos
4. Teste no preview do Rive

### Problema: "Performance lenta"

**Causas & Soluções**:
- Muitas animações simultâneas → Pause animations off-screen
- Arquivo `.riv` grande → Comprimir no Rive (export otimizado)
- Constraints complexos → Simplificar a estrutura
- WebGL issues → Fallback para canvas (menos comum)

---

## 📚 Recursos Oficiais

| Recurso | Link |
|---------|------|
| Rive Docs | https://rive.app/docs |
| React SDK | https://github.com/rive-app/rive-react |
| Marketplace | https://rive.app/marketplace |
| Community Discord | https://discord.gg/rive |

---

## 🎯 Checklist de Implementação

Antes de enviar para produção:

- [ ] Todos os arquivos `.riv` estão em `public/animations/`
- [ ] State machines têm nomes consistentes
- [ ] Inputs do state machine estão documentados
- [ ] Componentes React testam `onError`
- [ ] Lazy loading implementado para componentes acima da fold
- [ ] Intersection observer para pause/play
- [ ] Performance testada em Lighthouse (CLS, LCP, FID)
- [ ] Tested em Chrome, Safari, Firefox (desktop + mobile)
- [ ] Fallback UI para quando Rive não carrega
- [ ] Documentação dos inputs/outputs por componente

---

## 🚀 Próximos Passos

1. **Criar seus arquivos Rive**
   - Acesse rive.app/editor
   - Crie designs baseados nos padrões documentados
   - Exporte como `.riv`

2. **Copiar componentes React**
   - Copie do `rive-implementation-examples.tsx`
   - Ajuste caminhos e nomes de state machines

3. **Integrar nas seções**
   - HeroSection → RiveHeroWithCharacter
   - AboutSection → RiveAboutHeroBanner
   - FeaturedVideoSection → RiveFeaturedVideoSection
   - ServicesSection → RiveProductCard (grid)

4. **Testar & Otimizar**
   - DevTools → Performance tab
   - Lighthouse audit
   - Cross-browser testing

---

**Última atualização**: Agosto 2026  
**Desenvolvido para**: Hugo — Projeto Asme Landing Site