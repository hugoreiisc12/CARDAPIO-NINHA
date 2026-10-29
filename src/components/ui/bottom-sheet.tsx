import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type BottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  showDragHandle?: boolean;
};

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  showDragHandle = true,
}: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-plum-950/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed z-50 bg-cream-50 shadow-warm
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=open]:duration-300 data-[state=closed]:duration-200
            inset-x-0 bottom-0 rounded-t-[24px] max-h-[92dvh] flex flex-col
            data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom
            sm:inset-0 sm:m-auto sm:max-w-lg sm:rounded-[24px] sm:max-h-[90vh]
            sm:data-[state=open]:slide-in-from-bottom-4 sm:data-[state=open]:fade-in-0
            sm:data-[state=closed]:slide-out-to-bottom-4 sm:data-[state=closed]:fade-out-0"
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {description && <Dialog.Description className="sr-only">{description}</Dialog.Description>}

          {showDragHandle && (
            <div className="pt-2 pb-1 flex justify-center sm:hidden">
              <div className="h-1.5 w-10 rounded-full bg-cream-200" />
            </div>
          )}

          <div className="overflow-y-auto flex-1 overscroll-contain">{children}</div>

          {footer && (
            <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-cream-200 bg-cream-50">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const SheetClose = Dialog.Close;
