import { useEffect, useState } from "react";
import { loadMenu } from "@/lib/api";
import { categories as staticCategories } from "@/lib/catalog";
import type { Category } from "@/lib/menu-data";

/** Cardápio via API com fallback estático; nunca deixa a página sem produtos. */
export function useMenu(): { categories: Category[]; source: "api" | "static" | "loading" } {
  const [state, setState] = useState<{
    categories: Category[];
    source: "api" | "static" | "loading";
  }>({ categories: staticCategories, source: "loading" });

  useEffect(() => {
    let alive = true;
    loadMenu().then((result) => {
      if (alive) setState(result);
    });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
