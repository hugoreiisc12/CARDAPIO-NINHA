import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/menu-data";
import { computeVariationDelta } from "@/lib/menu-data";

export type CartLineSelections = Record<string, string>;

export type CartLine = {
  lineId: string;
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  selections: CartLineSelections;
  quantity: number;
};

type AddLineInput = {
  product: Product;
  selections: CartLineSelections;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  addLine: (input: AddLineInput) => void;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "ninha-cart-v1";

function sameSelections(a: CartLineSelections, b: CartLineSelections) {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((k) => a[k] === b[k]);
}

function isValidStoredLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.lineId !== "string" || typeof v.productId !== "string") return false;
  if (typeof v.name !== "string" || typeof v.image !== "string") return false;
  if (typeof v.unitPrice !== "number" || !Number.isFinite(v.unitPrice) || v.unitPrice < 0)
    return false;
  if (typeof v.quantity !== "number" || !Number.isInteger(v.quantity) || v.quantity < 1)
    return false;
  if (typeof v.selections !== "object" || v.selections === null) return false;
  return Object.values(v.selections as Record<string, unknown>).every((s) => typeof s === "string");
}

function newLineId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function readStoredLines(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidStoredLine);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readStoredLines());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addLine = ({ product, selections, quantity }: AddLineInput) => {
    setLines((prev) => {
      const existing = prev.find(
        (l) => l.productId === product.id && sameSelections(l.selections, selections),
      );
      if (existing) {
        return prev.map((l) =>
          l.lineId === existing.lineId ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      const unitPrice = product.price + computeVariationDelta(product, selections);
      const newLine: CartLine = {
        lineId: newLineId(),
        productId: product.id,
        name: product.name,
        image: product.image,
        unitPrice,
        selections,
        quantity,
      };
      return [...prev, newLine];
    });
  };

  const removeLine = (lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity < 1) {
      removeLine(lineId);
      return;
    }
    setLines((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l)));
  };

  const clear = () => setLines([]);

  const { itemCount, subtotal } = useMemo(
    () => ({
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    }),
    [lines],
  );

  const value: CartContextValue = {
    lines,
    addLine,
    removeLine,
    updateQuantity,
    clear,
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
