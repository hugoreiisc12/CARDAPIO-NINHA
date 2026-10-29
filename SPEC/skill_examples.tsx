/**
 * IMPLEMENTAÇÕES PRÁTICAS - Rive 3D Components
 * Para: Landing Site Asme
 * 
 * Padrões prontos:
 * 1. RiveHeroWithCharacter - Hero com personagem interativo
 * 2. RiveScrollAnimation - Animação linkedgem a scroll
 * 3. RiveProductCard - Card com hover interativo
 * 4. RiveBackgroundMotion - Background movimento passivo
 */

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ===========================
// 1. HERO COM PERSONAGEM INTERATIVO
// ===========================

export function RiveHeroWithCharacter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rive, RiveComponent } = useRive({
    src: '/animations/hero-character.riv', // Coloque seu arquivo .riv aqui
    stateMachines: 'HeroCharacterMachine',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!rive || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePos({ x, y });

      // Atualiza inputs do state machine
      const inputs = rive.stateMachineInputs('HeroCharacterMachine');
      
      inputs.forEach((input) => {
        if (input.name === 'pointerX' && input.type === 'number') {
          input.value = x;
        }
        if (input.name === 'pointerY' && input.type === 'number') {
          input.value = y;
        }
      });
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    return () => {
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [rive]);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Rive Background Animation */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-crosshair"
      >
        <RiveComponent />
      </div>

      {/* Content Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 text-center px-6"
      >
        <h1 className="text-9xl font-bold text-white mb-4 font-['Instrument_Serif']">
          Know it then <em className="italic">all</em>
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto text-lg">
          Stay updated with the latest news and insights
        </p>
      </motion.div>
    </div>
  );
}

// ===========================
// 2. SCROLL-LINKED ANIMATION
// ===========================

export function RiveScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const { rive, RiveComponent } = useRive({
    src: '/animations/scroll-progress.riv',
    autoplay: false, // Controle manual via scroll
  });

  useEffect(() => {
    if (!rive) return;

    // Atualiza a animação baseado no progresso de scroll
    const unsubscribe = scrollYProgress.on('change', (progress: number) => {
      // Encontra a animação no Rive
      if (rive.animator) {
        const animations = rive.animationNames;
        const animation = animations[0]; // Usa primeira animação

        if (animation) {
          // Busca a duração e seta o tempo baseado no progresso
          const anim = rive.animator.animationByName(animation);
          if (anim) {
            anim.time = progress * anim.duration;
          }
        }
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [rive, scrollYProgress]);

  return (
    <div ref={containerRef} className="w-full h-[300vh] relative">
      {/* Rive Animation sticky */}
      <div className="sticky top-0 w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full h-full max-w-4xl">
          <RiveComponent />
        </div>
      </div>

      {/* Content que triggers scroll */}
      <div className="relative z-10 bg-black px-6 py-20 text-white">
        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-4xl font-bold mb-4">Section 1</h2>
            <p className="text-white/60 leading-relaxed">
              Rolar para ver a animação Rive progredir suavemente...
            </p>
          </section>
          <section>
            <h2 className="text-4xl font-bold mb-4">Section 2</h2>
            <p className="text-white/60 leading-relaxed">
              Observe como a animação responde ao seu scroll
            </p>
          </section>
          <section>
            <h2 className="text-4xl font-bold mb-4">Section 3</h2>
            <p className="text-white/60 leading-relaxed">
              Padrão perfeito para storytelling visual
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// ===========================
// 3. PRODUCT CARD COM HOVER
// ===========================

interface RiveProductCardProps {
  title: string;
  description: string;
  riveFile: string;
  stateMachine: string;
}

export function RiveProductCard({
  title,
  description,
  riveFile,
  stateMachine,
}: RiveProductCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: riveFile,
    stateMachines: stateMachine,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (rive) {
      const inputs = rive.stateMachineInputs(stateMachine);
      const hoverInput = inputs.find((i) => i.name === 'isHovered');
      if (hoverInput?.type === 'boolean') {
        hoverInput.value = true;
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (rive) {
      const inputs = rive.stateMachineInputs(stateMachine);
      const hoverInput = inputs.find((i) => i.name === 'isHovered');
      if (hoverInput?.type === 'boolean') {
        hoverInput.value = false;
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8 }}
      className="group rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-white/0 border border-white/10 backdrop-blur-sm cursor-pointer transition-all hover:border-white/20"
    >
      {/* Rive Preview */}
      <div className="aspect-video overflow-hidden bg-black relative">
        <RiveComponent />
        <motion.div
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          className="absolute inset-0 bg-white/5"
        />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
              {title}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isHovered ? 45 : 0 }}
            className="rounded-full bg-white/10 p-2"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16 l10-10m0 0l-4 4m4-4l4-4"
              />
            </svg>
          </motion.div>
        </div>

        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ===========================
// 4. BACKGROUND MOTION PASSIVO
// ===========================

export function RiveBackgroundMotion() {
  const { RiveComponent } = useRive({
    src: '/animations/bg-motion.riv',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <RiveComponent />
    </div>
  );
}

// ===========================
// 5. HERO BANNER COMPLETO (para About Section)
// ===========================

export function RiveAboutHeroBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: '-100px',
  });

  const { rive, RiveComponent } = useRive({
    src: '/animations/about-hero.riv',
    stateMachines: 'AboutStateMachine',
    autoplay: true,
  });

  useEffect(() => {
    if (!rive || !isInView) return;

    // Dispara animação de entrada quando elemento entra em view
    const inputs = rive.stateMachineInputs('AboutStateMachine');
    const triggerInput = inputs.find((i) => i.name === 'inViewTrigger');

    if (triggerInput?.type === 'trigger') {
      triggerInput.fire();
    }
  }, [rive, isInView]);

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full py-32 md:py-44 bg-black overflow-hidden"
    >
      {/* Rive Background */}
      <div className="absolute inset-0">
        <RiveComponent />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <p className="text-white/40 text-sm tracking-widest uppercase mb-6">
            About Us
          </p>
          <h2 className="text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] tracking-tight">
            Pioneering <em className="italic text-white/60">ideas</em> for minds that{' '}
            <em className="italic text-white/60">create, build, and inspire</em>
          </h2>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ===========================
// 6. FEATURED VIDEO COM OVERLAY RIVE
// ===========================

export function RiveFeaturedVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const { RiveComponent } = useRive({
    src: '/animations/video-overlay.riv',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.9 }}
      className="max-w-6xl mx-auto px-6"
    >
      <div className="rounded-3xl overflow-hidden aspect-video bg-black relative group">
        {/* Video Principal */}
        <video
          className="w-full h-full object-cover"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4"
            type="video/mp4"
          />
        </video>

        {/* Rive Overlay (decorativo/interativo) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <RiveComponent />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="md:flex-1 rounded-2xl p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10"
          >
            <p className="text-white/50 text-xs tracking-widest uppercase mb-3">
              Our Approach
            </p>
            <p className="text-white text-sm md:text-base leading-relaxed">
              We believe in the power of curiosity-driven exploration. Every project
              starts with a question, and every answer opens a new door to innovation.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:self-end rounded-full px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Explore more
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ===========================
// 7. UTILITIES - Helper Hooks
// ===========================

/**
 * Hook personalizado para controlar state machine inputs
 */
export function useRiveStateMachine(stateMachineName: string) {
  const [riveInstance, setRiveInstance] = useState<any>(null);

  const setInput = (inputName: string, value: any) => {
    if (!riveInstance) return;

    const inputs = riveInstance.stateMachineInputs(stateMachineName);
    const input = inputs.find((i: any) => i.name === inputName);

    if (input) {
      if (input.type === 'boolean') {
        input.value = value;
      } else if (input.type === 'number') {
        input.value = value;
      } else if (input.type === 'trigger') {
        if (value === true) input.fire();
      }
    }
  };

  const fireEvent = (inputName: string) => {
    if (!riveInstance) return;

    const inputs = riveInstance.stateMachineInputs(stateMachineName);
    const input = inputs.find((i: any) => i.name === inputName);

    if (input?.type === 'trigger') {
      input.fire();
    }
  };

  return { setInput, fireEvent, setRiveInstance };
}

/**
 * Hook para pausar Rive quando off-screen
 */
export function useRiveInViewControl(ref: React.RefObject<HTMLDivElement>) {
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  useEffect(() => {
    if (!ref.current) return;

    const riveContainer = ref.current.querySelector('[data-rive-container]');
    if (!riveContainer) return;

    // Implementar controle de play/pause baseado em visibility
    // (depende da exportação específica do seu Rive)
  }, [isInView, ref]);
}

export default {
  RiveHeroWithCharacter,
  RiveScrollAnimation,
  RiveProductCard,
  RiveBackgroundMotion,
  RiveAboutHeroBanner,
  RiveFeaturedVideoSection,
};