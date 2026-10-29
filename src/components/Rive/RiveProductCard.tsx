import { useRef, useState } from "react";
import { useRive } from "@rive-app/react-canvas";
import { motion } from "motion/react";
import { StateMachineInputType } from "@rive-app/canvas/rive";
import { rivePath, containLayout, RIVE } from "./rive";
interface RiveProductCardProps {
  title: string;
  description: string;
  image?: string;
  price?: string;
  tag?: string;
  artboard?: string;
  stateMachine?: string;
  onOpen?: () => void;
}

/**
 * Card de produto com preview Rive interativo (hover state machine).
 * Estilo segue o ProductCard da marca: cream, rounded-[24px], shadow-warm.
 */
export function RiveProductCard({
  title,
  description,
  image,
  price,
  tag,
  artboard = RIVE.artboards.card,
  stateMachine = RIVE.stateMachines.card,
  onOpen,
}: RiveProductCardProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: rivePath(),
    artboard,
    stateMachines: stateMachine,
    layout: containLayout(),
    autoplay: true,
    onLoad: () => setLoaded(true),
    onLoadError: () => setLoaded(false),
  });

  const setHover = (value: boolean) => {
    setIsHovered(value);
    if (!rive) return;
    const input = rive.stateMachineInputs(stateMachine).find((i) => i.name === "isHovered");
    if (input?.type === StateMachineInputType.Boolean) input.value = value;
  };

  return (
    <motion.button
      type="button"
      ref={containerRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ y: -8 }}
      onClick={onOpen}
      className="group w-full cursor-pointer overflow-hidden rounded-[24px] bg-cream-50 text-left shadow-warm card-hover"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
        {image && (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {loaded && <RiveComponent />}
        <motion.div
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute inset-0 bg-plum-900"
        />
        {tag && (
          <span className="absolute top-3 left-3 rounded-full bg-plum-900 text-cream-50 px-2.5 py-1 text-[11px] font-semibold">
            {tag}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[18px] text-ink leading-tight">{title}</h3>
          <motion.span
            animate={{ rotate: isHovered ? 45 : 0 }}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cream-200 text-plum-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16 l10-10m0 0l-4 4m4-4l-4 4"
              />
            </svg>
          </motion.span>
        </div>
        <p className="mt-1 text-[13px] text-ink-soft line-clamp-2 leading-relaxed">{description}</p>
        {price && <p className="mt-3 font-display text-[18px] text-ink">{price}</p>}
      </div>
    </motion.button>
  );
}

export default RiveProductCard;
