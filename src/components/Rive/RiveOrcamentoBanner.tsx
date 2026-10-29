import { useEffect, useRef } from "react";
import { useRive } from "@rive-app/react-canvas";
import { motion, useInView } from "motion/react";
import { MessageCircle } from "lucide-react";
import { StateMachineInputType } from "@rive-app/canvas/rive";
import { rivePath, coverLayout, RIVE } from "./rive";
import { buildWhatsappLink } from "@/lib/menu-data";

export interface RiveOrcamentoBannerProps {
  artboard?: string;
  stateMachine?: string;
  href?: string;
  photo?: string;
}

/**
 * Banda "Solicite seu orçamento" com fundo Rive animado quando entra em view.
 * Mantém o conteúdo de marca (eyebrow, Fraunces italic, CTA WhatsApp).
 */
export function RiveOrcamentoBanner({
  artboard = RIVE.artboards.orcamento,
  stateMachine = RIVE.stateMachines.orcamento,
  href = buildWhatsappLink("Olá! Gostaria de um orçamento personalizado."),
  photo,
}: RiveOrcamentoBannerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { rive, RiveComponent } = useRive({
    src: rivePath(),
    artboard,
    stateMachines: stateMachine,
    layout: coverLayout(),
    autoplay: true,
  });

  useEffect(() => {
    if (!rive || !isInView) return;
    const input = rive.stateMachineInputs(stateMachine).find((i) => i.name === "inViewTrigger");
    if (input?.type === StateMachineInputType.Trigger) input.fire();
  }, [rive, isInView, stateMachine]);

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mt-10 overflow-hidden rounded-[28px] bg-gradient-to-br from-rose/25 via-coral/15 to-amber/25 border border-cream-200 p-6 sm:p-8"
    >
      <div aria-hidden className="absolute inset-0 opacity-60">
        <RiveComponent />
      </div>
      <div
        aria-hidden
        className="absolute -right-4 -bottom-6 font-display italic text-plum-900/10 text-[110px] leading-none select-none pointer-events-none"
      >
        Ninha
      </div>

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {photo && (
          <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden shadow-warm ring-4 ring-cream-50">
            <img src={photo} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="eyebrow text-plum-900"
          >
            Solicite seu
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-1 font-display italic text-[26px] text-plum-900 leading-tight"
          >
            Orçamento personalizado
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-1 text-sm text-ink-soft"
          >
            Para festas de aniversário, chá de bebê e ocasiões especiais.
          </motion.p>
        </div>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] px-5 rounded-full bg-plum-900 text-cream-50 text-sm font-semibold flex items-center gap-2 hover:bg-plum-950 transition-colors shrink-0"
        >
          <MessageCircle className="h-4 w-4" /> Fazer pedido
        </motion.a>
      </div>
    </motion.section>
  );
}

export default RiveOrcamentoBanner;
