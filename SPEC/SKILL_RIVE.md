---
name: rive-3d-components
description: Criação de componentes 3D/2.5D interativos com Rive, state machines, character animations, e integração React/TypeScript
tags: [rive, 3d, motion-design, interactive, animation, character-animation, state-machines, react]
version: 1.0.0
---

# Rive 3D Components Skill

Especialização em criar componentes visuais 3D/2.5D altamente interativos usando **Rive** como plataforma de animação vetorial e de estado, integrada com React + TypeScript.

---

## 1. Fundamentos de Rive

### O que é Rive?

Rive é uma plataforma de animação vetorial e state machine que permite:
- **Animações vetoriais** sem rasterização (escalável infinitamente)
- **State Machines** para lógica de interação complexa
- **Bones System** para animação de personagens tipo rigging
- **Constraints** para deformações realistas
- **Runtime interativo** (WebGL, 100% offline)
- **Integração API** com JavaScript/React

### Arquitetura de um Projeto Rive

```
RiveFile (.riv)
├── Artboards (múltiplas composições)
│   ├── Main artboard (composition principal)
│   ├── Character artboard (personagens)
│   └── UI artboard (componentes)
├── Animations (timeline-based)
│   ├── Entrada/saída
│   ├── Loops
│   └── Transições
├── State Machines (lógica de estado)
│   ├── States (idle, hover, active, etc)
│   ├── Transitions (condições de mudança)
│   └── Inputs (triggers/listeners)
└── Assets
    ├── Imagens
    ├── Cores
    └── Fonts
```

---

## 2. Core Patterns — Interactive Character Follow

**Caso de uso**: Personagem que segue o cursor, reage a cliques, muda estado.

### State Machine Design

```
States:
├── Idle → Character em postura neutra, respirando
├── Hover → Eyes acompanham cursor (eye constraint movement)
├── Active → Character interage, animação de resposta
└── Clicked → Animação de clique + sound cue

Inputs (listeners):
├── pointerX (number) → posição X do cursor
├── pointerY (number) → posição Y do cursor
├── isHovered (boolean) → hover state
└── clicked (trigger) → boolean-to-trigger
```

### Implementação React + Rive

```typescript
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useRef, useEffect } from 'react';

export function InteractiveCharacter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rive, RiveComponent } = useRive({
    src: '/character-interactive.riv',
    stateMachines: 'CharacterStateMachine',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      console.log('Character loaded, state machine ready');
    },
  });

  useEffect(() => {
    if (!rive || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Encontra o input "pointerX" e "pointerY"
      const pointerXInput = rive.stateMachineInputs('CharacterStateMachine')[0];
      const pointerYInput = rive.stateMachineInputs('CharacterStateMachine')[1];

      if (pointerXInput?.type === 'number') pointerXInput.value = x;
      if (pointerYInput?.type === 'number') pointerYInput.value = y;
    };

    const handleMouseEnter = () => {
      const isHoveredInput = rive.stateMachineInputs('CharacterStateMachine').find(
        (i) => i.name === 'isHovered'
      );
      if (isHoveredInput?.type === 'boolean') {
        isHoveredInput.value = true;
      }
    };

    const handleMouseLeave = () => {
      const isHoveredInput = rive.stateMachineInputs('CharacterStateMachine').find(
        (i) => i.name === 'isHovered'
      );
      if (isHoveredInput?.type === 'boolean') {
        isHoveredInput.value = false;
      }
    };

    const handleClick = () => {
      const clickedInput = rive.stateMachineInputs('CharacterStateMachine').find(
        (i) => i.name === 'clicked'
      );
      if (clickedInput?.type === 'trigger') {
        clickedInput.fire();
      }
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    containerRef.current.addEventListener('click', handleClick);

    return () => {
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      containerRef.current?.removeEventListener('click', handleClick);
    };
  }, [rive]);

  return (
    <div
      ref={containerRef}
      className="w-96 h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent cursor-pointer"
    >
      <RiveComponent />
    </div>
  );
}
```

---

## 3. Hero Banner Patterns — Maasai-Inspired Design

**Padrão**: Hero banner interativo com caracteres, layering visual, storytelling.

### Estrutura Compositiva

```
Hero Banner Architecture:
├── Background Layer (Rive)
│   ├── Gradiente de fundo (sunset tones)
│   └── Paisagem estilizada (curves, shapes)
├── Character Layer (Rive)
│   ├── Silhuetas de personagens (postures diferentes)
│   ├── Animações entrance (fade-in, scale)
│   └── Micro-animações (breathing, swaying)
├── Overlay Layer (Rive)
│   ├── Elementos decorativos
│   ├── UI elements (buttons, text)
│   └── Glow effects
└── Interaction Layer
    ├── Scroll trigger → animation progression
    ├── Parallax effect (layering de profundidade)
    └── Hover states (character responds)
```

### Scroll-Triggered Hero Banner

```typescript
import { useRive } from '@rive-app/react-canvas';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export function HeroBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const { RiveComponent } = useRive({
    src: '/hero-banner.riv',
    stateMachines: 'HeroStateMachine',
    autoplay: true,
  });

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale }}
      className="relative w-full min-h-screen bg-black overflow-hidden"
    >
      {/* Background: Rive animation */}
      <div className="absolute inset-0">
        <RiveComponent />
      </div>

      {/* Foreground: React components */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">
        <h1 className="text-8xl font-bold text-white mb-6">
          Maasai Inspired
        </h1>
        <p className="text-xl text-white/60 max-w-2xl">
          Cultural storytelling through web motion and interaction
        </p>
      </div>
    </motion.div>
  );
}
```

---

## 4. Character Animation com Bones System

### O que são Bones?

Bones é um sistema de rigging 2D que permite deformar ilustrações com pontos de articulação:

```
Anatomy (Humanoid):
├── Root (ponto de origem)
├── Spine (coluna: base, mid, chest)
├── Head (cabeça + neck)
├── Arms (shoulder → elbow → hand)
├── Legs (hip → knee → ankle)
└── IK Chains (inverse kinematics para movimentos naturais)
```

### Padrões de Animação com Bones

1. **Idle + Breathing**
   - Spine faz micro-movements (Y oscilação)
   - Head segue o padrão da coluna
   - Chest breathing (scale subtle)

2. **Walk Cycle**
   - Legs alterniam posição (IK target)
   - Spine segue o movimento das pernas (Y offset)
   - Head stabilizado (contrapeso)
   - Arms swinging oposto às pernas

3. **Gesture/Posture**
   - Estados pré-definidos (standing, sitting, excited)
   - Transições suaves entre postures
   - Expressão facial (eyes, mouth bones)

### Implementação: Personagem Posturante

```typescript
import { useRive } from '@rive-app/react-canvas';

export function PostureCharacter() {
  const { rive, RiveComponent } = useRive({
    src: '/character-with-bones.riv',
    stateMachines: 'PostureStateMachine',
    autoplay: true,
  });

  const changePosture = (postureName: string) => {
    if (!rive) return;

    const inputs = rive.stateMachineInputs('PostureStateMachine');
    const postureInput = inputs.find((i) => i.name === 'posture');

    if (postureInput?.type === 'enum') {
      postureInput.value = postureName; // 'standing', 'sitting', 'excited'
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-96 h-96 bg-gradient-to-b from-slate-900 to-black rounded-xl overflow-hidden">
        <RiveComponent />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => changePosture('standing')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
        >
          Standing
        </button>
        <button
          onClick={() => changePosture('sitting')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
        >
          Sitting
        </button>
        <button
          onClick={() => changePosture('excited')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
        >
          Excited
        </button>
      </div>
    </div>
  );
}
```

---

## 5. Advanced Patterns — Scroll-Linked Animations

### Conceito: Rive Progress-Based

Rive permite vincular animações a valores progressivos (0-1):

```typescript
import { useRive } from '@rive-app/react-canvas';
import { useScroll, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { useRef } from 'react';

export function ScrollLinkedAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const { rive, RiveComponent } = useRive({
    src: '/scroll-animation.riv',
    autoplay: false, // Manual control
  });

  useEffect(() => {
    if (!rive) return;

    const unsubscribe = scrollYProgress.on('change', (progress: number) => {
      // Controla uma animação pelo progresso de scroll
      if (rive.animator) {
        const animation = rive.animator.animationByName('scrollAnimation');
        if (animation) {
          // Progress de 0 a 1 mapeia para frames da animação
          animation.time = animation.duration * progress;
        }
      }
    });

    return unsubscribe;
  }, [rive, scrollYProgress]);

  return (
    <div ref={containerRef} className="w-full min-h-screen">
      <RiveComponent />
    </div>
  );
}
```

---

## 6. State Machine Patterns — Transições Complexas

### Exemplo: E-commerce Product Viewer

```
States Diagram:
├── Idle
│   └── onHover → Hover (animation: rotate-in)
├── Hover
│   ├── onPointerEnter → Active (animation: scale-up)
│   ├── onPointerLeave → Idle (animation: scale-down)
│   └── onAddToCart → Success (animation: checkmark-burst)
├── Active
│   ├── onPointerLeave → Hover (animation: rotate-out)
│   └── onAddToCart → Success
└── Success
    └── onComplete → Idle (animation: fade-out)

Inputs:
├── pointerX: number (para rotação 3D simulada)
├── pointerY: number
├── isHovered: boolean
├── isActive: boolean
└── addToCart: trigger
```

### Implementação: Product Card Interativa

```typescript
import { useRive } from '@rive-app/react-canvas';
import { useRef, useEffect } from 'react';

export function ProductCardRive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rive, RiveComponent } = useRive({
    src: '/product-viewer.riv',
    stateMachines: 'ProductStateMachine',
    autoplay: true,
  });

  const getInput = (name: string) => {
    if (!rive) return null;
    return rive.stateMachineInputs('ProductStateMachine').find((i) => i.name === name);
  };

  useEffect(() => {
    if (!rive || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      const xInput = getInput('pointerX');
      const yInput = getInput('pointerY');

      if (xInput?.type === 'number') xInput.value = x * 100;
      if (yInput?.type === 'number') yInput.value = y * 100;
    };

    const handleMouseEnter = () => {
      const input = getInput('isHovered');
      if (input?.type === 'boolean') input.value = true;
    };

    const handleMouseLeave = () => {
      const input = getInput('isHovered');
      if (input?.type === 'boolean') input.value = false;
    };

    const handleAddToCart = () => {
      const trigger = getInput('addToCart');
      if (trigger?.type === 'trigger') trigger.fire();
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);

    const button = containerRef.current.querySelector('[data-action="add-to-cart"]');
    button?.addEventListener('click', handleAddToCart);

    return () => {
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      button?.removeEventListener('click', handleAddToCart);
    };
  }, [rive]);

  return (
    <div className="flex gap-8">
      <div
        ref={containerRef}
        className="w-96 h-96 bg-gradient-to-br from-slate-900 to-black rounded-2xl overflow-hidden cursor-pointer group"
      >
        <RiveComponent />
      </div>

      <div className="flex flex-col justify-center gap-4">
        <h3 className="text-2xl font-bold text-white">Premium Product</h3>
        <p className="text-white/60">Interactive 3D preview</p>
        <button
          data-action="add-to-cart"
          className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
```

---

## 7. Performance Optimization

### Core Practices

1. **Code Splitting + Lazy Loading**
   ```typescript
   const InteractiveCharacter = lazy(() => import('./InteractiveCharacter'));
   
   <Suspense fallback={<div className="w-96 h-96 bg-slate-900 rounded-xl" />}>
     <InteractiveCharacter />
   </Suspense>
   ```

2. **Memory Management**
   ```typescript
   useEffect(() => {
     return () => {
       rive?.cleanup(); // Limpa recursos WebGL
     };
   }, [rive]);
   ```

3. **Animation Optimization**
   - Use `.riv` comprimidos (Gzip ~30-50KB)
   - Limite animações simultâneas (máx 3-5 em view)
   - Pause animations quando off-screen (`Intersection Observer`)

4. **Off-Screen Detection**
   ```typescript
   import { useInView } from 'framer-motion';
   
   const ref = useRef(null);
   const isInView = useInView(ref, { once: false, margin: '-100px' });
   
   useEffect(() => {
     if (rive && isInView !== undefined) {
       if (isInView) rive.play();
       else rive.pause();
     }
   }, [isInView, rive]);
   ```

---

## 8. Asset Organization — Rive Marketplace Insights

### Do Rive Marketplace (análise de padrões)

**First Rive Test Creation** (baseline)
- Product design testing
- UI/UX exploration
- Estado simples → complexo

**Interactive Character Follow** (state machines)
- Cursor tracking via state machine inputs
- Constraints para eye movement
- Smooth interpolation (built-in no Rive)

**Maasai-Inspired Hero Banner** (storytelling)
- Layering visual (background, characters, overlays)
- Warm color palettes (African aesthetic)
- State-driven transitions
- Scroll integration

**Posture Animation** (bones system)
- Bone rigging completo (spine, limbs)
- Multiple artboards por tipo de pose
- Animation blending entre states

### Best Practices Extraídos

✅ **Do's**
- Organize artboards por contexto (character, UI, background)
- Use state machines para lógica; animations para movimento
- Prefira constraints a animação manual (mais performático)
- Teste iterativamente: preview → edit → export

❌ **Don'ts**
- Não misture muitas animações em 1 state machine
- Não abuse de nested state machines (profundidade > 3)
- Não ignore frame rate (30fps minimum)
- Não animar tudo simultaneamente

---

## 9. Integração com Motion Design (MotionSites Patterns)

### Padrões de Reveal/Hero

**Reveal Hero Pattern**
```typescript
// Combina Rive + Framer Motion para máximo impacto

export function RevealHeroWithRive() {
  const { RiveComponent } = useRive({ src: '/reveal-hero.riv' });
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full"
    >
      <div className="relative aspect-video overflow-hidden rounded-3xl">
        <RiveComponent />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
        />
      </div>
    </motion.div>
  );
}
```

**Modern UI Reveal**
- Background Rive animation subtle
- Foreground React components reveal sequencialmente
- Staggered children animations
- Gradient overlays (Rive + CSS)

---

## 10. Checklist de Implementação

### Quando iniciar um novo componente Rive:

- [ ] Defina a funcionalidade (interativa? scroll-linked? auto-play?)
- [ ] Esboce a state machine (quantos states? transições?)
- [ ] Organize assets no Rive (artboards lógicos)
- [ ] Exporte `.riv` comprimido
- [ ] Configure Rive React SDK (@rive-app/react-canvas)
- [ ] Implemente state machine inputs (listeners)
- [ ] Otimize: lazy loading + intersection observer
- [ ] Teste em múltiplos navegadores (Chrome, Safari, Firefox)
- [ ] Monitore performance (DevTools → performance panel)
- [ ] Integre com Framer Motion se necessário
- [ ] Documente inputs/outputs para reuso

---

## Recursos Adicionais

**Rive Official**
- Marketplace: rive.app/marketplace
- Docs: rive.app/docs
- Community: discord (Rive community)

**React Integration**
- npm: @rive-app/react-canvas
- Docs: github.com/rive-app/rive-react

**Exemplos Referência**
- Character follow: cursor-tracking state machine
- Hero banner: scroll + parallax integration
- Posture: bones rigging + pose blending
- Product: interactive 3D rotation simulation

---

**Última atualização**: Agosto 2026  
**Padrões incluem**: Rive 2.5+, React 18+, TypeScript 5+, Framer Motion 10+