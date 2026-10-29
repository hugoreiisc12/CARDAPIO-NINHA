import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
} from "react";

type RiveLazyComponent<TProps> = ComponentType<TProps> & {
  displayName?: string;
};

export function riveLazy<TProps extends object>(
  importer: () => Promise<{ default: ComponentType<TProps> }>,
  fallback: ReactNode = null,
) {
  const Lazy = lazy(importer) as RiveLazyComponent<TProps>;

  function RiveLazyWrapper(props: ComponentProps<typeof Lazy>) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return (
      <Suspense fallback={fallback}>
        <Lazy {...props} />
      </Suspense>
    );
  }
  RiveLazyWrapper.displayName = "RiveLazyWrapper";
  return RiveLazyWrapper;
}
