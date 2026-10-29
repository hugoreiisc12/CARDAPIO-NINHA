import { useRive } from "@rive-app/react-canvas";
import { rivePath, coverLayout, RIVE, type RiveClassNames } from "./rive";

interface RiveBackgroundMotionProps extends RiveClassNames {
  opacity?: number;
}

/**
 * Camada de fundo animada passiva (autoplay, cobrindo o container).
 * Usada como decoração atrás de hero/bandas — nunca deve capturar clique.
 */
export function RiveBackgroundMotion({ opacity = 40, className = "" }: RiveBackgroundMotionProps) {
  const { RiveComponent } = useRive({
    src: rivePath(),
    artboard: RIVE.artboards.background,
    autoplay: true,
    layout: coverLayout(),
  });

  return (
    <div
      data-rive-container
      aria-hidden
      className={`pointer-events-none overflow-hidden ${className}`}
      style={{ opacity: opacity / 100 }}
    >
      <RiveComponent />
    </div>
  );
}

export default RiveBackgroundMotion;
