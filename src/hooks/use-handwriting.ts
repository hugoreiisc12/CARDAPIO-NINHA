import { useEffect } from "react";
import gsap from "gsap";

/**
 * Animação de escrita à mão do watermark "doces" do hero.
 * Cada letra é revelada por clip-path inset com duração irregular (ritmo de mão)
 * enquanto um nib (pingo de caneta) percorre a linha de base sincronizado.
 */
export function useHandwriting() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const word = document.querySelector<HTMLElement>(".doce-word");
    const chars = gsap.utils.toArray<HTMLElement>(".doce-char");
    const pen = document.querySelector<HTMLElement>(".doce-pen");
    if (!word || chars.length === 0 || !pen) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(chars, { clipPath: "inset(0 0% 0 0)", opacity: 1 });
      gsap.set(pen, { display: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      const width = word.offsetWidth;

      gsap.fromTo(
        chars,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: () => gsap.utils.random(0.28, 0.55, 0.01),
          stagger: 0.18,
          ease: "power2.inOut",
          delay: 0.6,
        },
      );

      const totalWrite = 0.6 + (chars.length - 1) * 0.18 + 0.55;

      gsap.fromTo(
        pen,
        { x: 0, opacity: 0 },
        {
          x: width,
          opacity: 1,
          duration: totalWrite,
          ease: "power2.inOut",
          delay: 0.6,
          onComplete: () => {
            gsap.to(pen, { opacity: 0, duration: 0.3, ease: "power2.out" });
          },
        },
      );
    }, word);

    return () => {
      ctx.revert();
    };
  }, []);
}
