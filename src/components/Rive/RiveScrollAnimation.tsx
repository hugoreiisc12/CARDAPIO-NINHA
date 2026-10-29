import { useEffect, useRef, useState } from "react";
import { useRive } from "@rive-app/react-canvas";
import { useScroll } from "motion/react";
import { rivePath, containLayout, RIVE } from "./rive";

interface RiveScrollAnimationProps {
  artboard?: string;
  className?: string;
  /** altura do container (padrão 200vh) — define quanto scroll dirige a animação */
  heightClass?: string;
  /** conteúdo a rolar (colunas de texto etc.) — os filhos aparecem sobre o sticky */
  children?: React.ReactNode;
}

/**
 * Animação Rive dirigida por scroll (scrub 0→1 conforme o progresso).
 * Container sticky: a animação ocupa a tela enquanto o usuário rola.
 */
export function RiveScrollAnimation({
  artboard = RIVE.artboards.scroll,
  className = "",
  heightClass = "h-[200vh]",
  children,
}: RiveScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { rive, RiveComponent } = useRive({
    src: rivePath(),
    artboard,
    autoplay: false,
    layout: containLayout(),
    onLoad: () => setLoaded(true),
    onLoadError: () => setLoaded(false),
  });

  useEffect(() => {
    if (!rive || !loaded || rive.animationNames.length === 0) return;
    const name = rive.animationNames[0];
    return scrollYProgress.on("change", (progress: number) => {
      rive.scrub(name, progress);
    });
  }, [rive, loaded, scrollYProgress]);

  if (!loaded) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={`relative ${heightClass} ${className}`}>
      <div className="sticky top-0 flex h-dvh w-full items-center justify-center">
        <div className="h-full w-full">
          <RiveComponent />
        </div>
      </div>
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

export default RiveScrollAnimation;
