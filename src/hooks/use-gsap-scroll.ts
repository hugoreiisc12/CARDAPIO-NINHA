import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Registers GSAP scroll animations for menu screens.
 * - `.gsap-fade`: fades + slides up on enter
 * - `.gsap-cat-title`: category eyebrow numeral slides in from left
 */
export function useGsapScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gsap-fade").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".gsap-cat-title").forEach((el) => {
        gsap.fromTo(
          el,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });

      // subtle scale-in on product cards using stagger per section
      gsap.utils.toArray<HTMLElement>(".gsap-card-group").forEach((group) => {
        const cards = group.querySelectorAll<HTMLElement>(".gsap-card");
        gsap.fromTo(
          cards,
          { y: 24, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 85%" },
          },
        );
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);
}
