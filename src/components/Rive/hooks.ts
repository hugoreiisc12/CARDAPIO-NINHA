import { useEffect, useState, type RefObject } from "react";
import { useInView } from "motion/react";
import { type Rive, StateMachineInputType } from "@rive-app/canvas/rive";

type RiveLike = Pick<Rive, "stateMachineInputs" | "play" | "pause" | "scrub" | "animationNames">;

export function useRiveStateMachine(stateMachineName: string) {
  const [rive, setRive] = useState<RiveLike | null>(null);

  const setInput = (inputName: string, value: boolean | number) => {
    if (!rive) return;
    const inputs = rive.stateMachineInputs(stateMachineName);
    const input = inputs.find((i) => i.name === inputName);
    if (!input) return;
    if (input.type === StateMachineInputType.Boolean && typeof value === "boolean") {
      input.value = value;
    } else if (input.type === StateMachineInputType.Number && typeof value === "number") {
      input.value = value;
    }
  };

  const fireEvent = (inputName: string) => {
    if (!rive) return;
    const input = rive.stateMachineInputs(stateMachineName).find((i) => i.name === inputName);
    if (input?.type === StateMachineInputType.Trigger) input.fire();
  };

  return { setInput, fireEvent, setRive, rive };
}

export function useRiveInViewControl(ref: RefObject<HTMLElement>) {
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const el = ref.current;
    if (!el) return;
    const container = el.querySelector<HTMLElement>("[data-rive-container]");
    container?.classList.add("rive-in-view");
  }, [isInView, ref]);

  return isInView;
}

export function useRiveScrub(rive: RiveLike | null, progress: number, animationName?: string) {
  useEffect(() => {
    if (!rive || rive.animationNames.length === 0) return;
    const name = animationName ?? rive.animationNames[0];
    rive.scrub(name, progress);
  }, [rive, progress, animationName]);
}
