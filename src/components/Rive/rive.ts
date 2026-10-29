import { Layout, Fit, Alignment } from "@rive-app/react-canvas";

export const RIVE = {
  base: "/animations",
  file: "ninha.riv",
  artboards: {
    background: "NinhaBG",
    hero: "NinhaHero",
    scroll: "NinhaScroll",
    card: "NinhaCard",
    orcamento: "NinhaOrcamento",
    showcase: "NinhaShowcase",
  },
  stateMachines: {
    hero: "HeroCharacterMachine",
    card: "ProductStateMachine",
    orcamento: "AboutStateMachine",
  },
} as const;

export const rivePath = () => `${RIVE.base}/${RIVE.file}`;

export const containLayout = () => new Layout({ fit: Fit.Contain, alignment: Alignment.Center });

export const coverLayout = () => new Layout({ fit: Fit.Cover, alignment: Alignment.Center });

export type RiveClassNames = {
  className?: string;
};
