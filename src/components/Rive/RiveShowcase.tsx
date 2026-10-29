import { useRef } from "react";
import { useRive } from "@rive-app/react-canvas";
import { motion, useInView } from "motion/react";
import { rivePath, coverLayout, RIVE } from "./rive";

export interface RiveShowcaseProps {
  artboard?: string;
  image: string;
  eyebrow?: string;
  title: string;
  description: string;
  cta?: string;
  href?: string;
  className?: string;
}

/**
 * Vitrine de destaque com overlay Rive decorativo (ativa no hover).
 * Substitui a seção de vídeo externo do exemplo por uma imagem local de marca.
 */
export function RiveShowcase({
  artboard = RIVE.artboards.showcase,
  image,
  eyebrow = "Favoritos da casa",
  title,
  description,
  cta = "Ver cardápio",
  href = "#",
  className = "",
}: RiveShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { RiveComponent } = useRive({
    src: rivePath(),
    artboard,
    autoplay: true,
    layout: coverLayout(),
  });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.9 }}
      className={`mx-auto max-w-3xl px-5 ${className}`}
    >
      <div className="group relative aspect-[4/3] overflow-hidden rounded-[24px] bg-plum-900 shadow-warm">
        <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />

        {/* Rive overlay decorativo (aparece no hover) */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <RiveComponent />
        </div>

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start sm:items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            <p className="eyebrow text-gradient-brand">{eyebrow}</p>
            <h3 className="mt-2 font-display italic text-[clamp(24px,6vw,32px)] text-cream-50 leading-tight">
              {title}
            </h3>
            <p className="mt-2 max-w-md text-sm text-cream-50/80 leading-relaxed">{description}</p>
          </motion.div>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={href}
            className="rounded-full px-6 py-3 bg-cream-50 text-plum-900 text-sm font-semibold hover:bg-cream-100 transition-colors shrink-0"
          >
            {cta}
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export default RiveShowcase;
