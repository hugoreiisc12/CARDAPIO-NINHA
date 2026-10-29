import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DockItem = {
  id: string;
  label: string;
  icon: ReactNode;
};

type DockProps = {
  items: DockItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
};

/**
 * macOS-style magnifying dock. Icons closest to the cursor scale up,
 * neighbors follow with a softer curve. Falls back gracefully on touch.
 */
export default function Dock({ items, activeId, onSelect, className }: DockProps) {
  const mouseX = useMotionValue<number>(Number.POSITIVE_INFINITY);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-40 flex justify-center px-4",
        "bottom-[max(1rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className={cn(
          "pointer-events-auto relative flex h-16 items-end gap-1.5 rounded-full px-3 pb-2 pt-1.5",
          "bg-plum-900/90 backdrop-blur-xl border border-plum-700/60",
          "shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)]",
        )}
      >
        {/* gradient hairline */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-4 -top-px h-px gradient-brand opacity-70"
        />
        {items.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            active={item.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </motion.div>
    </div>
  );
}

function DockIcon({
  item,
  mouseX,
  active,
  onSelect,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  active: boolean;
  onSelect?: (id: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeRaw = useTransform(distance, [-110, 0, 110], [40, 60, 40]);
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 180, damping: 14 });

  return (
    <div className="group relative flex flex-col items-center">
      {/* tooltip */}
      <span
        className={cn(
          "pointer-events-none absolute -top-9 whitespace-nowrap rounded-full",
          "bg-cream-50 text-plum-900 px-2.5 py-1 text-[11px] font-medium shadow-warm",
          "opacity-0 translate-y-1 transition-all duration-150",
          "group-hover:opacity-100 group-hover:translate-y-0",
        )}
      >
        {item.label}
      </span>

      <motion.button
        ref={ref}
        type="button"
        onClick={() => onSelect?.(item.id)}
        aria-label={item.label}
        aria-current={active ? "true" : undefined}
        style={{ width: size, height: size }}
        className={cn(
          "grid place-items-center rounded-2xl transition-colors",
          "text-cream-50",
          active
            ? "bg-gradient-to-br from-rose/90 via-coral/90 to-amber/90 text-plum-950 shadow-warm"
            : "bg-plum-950/60 hover:bg-plum-700/70 border border-plum-700/50",
        )}
      >
        <motion.span
          style={{ width: useTransform(size, (s) => s * 0.5), height: useTransform(size, (s) => s * 0.5) }}
          className="grid place-items-center"
        >
          {item.icon}
        </motion.span>
      </motion.button>

      {/* active dot */}
      <span
        className={cn(
          "mt-1 h-1 w-1 rounded-full transition-opacity",
          active ? "bg-amber opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
