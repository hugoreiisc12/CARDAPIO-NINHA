import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { CartProvider } from "../lib/cart-context";
import { Toaster } from "../components/ui/sonner";

/** Domínio público (ex.: `https://cardapio.ninhacakes.com.br`). Sem ele, o
 *  `og:image` sai relativo e quem resolve é o site que compartilha o link. */
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
const shareImage = `${SITE_URL}/og-image.jpg`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-plum-900 px-5 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-plum-700"
          >
            Voltar ao cardápio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Não foi possível carregar</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente em instantes.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-plum-900 px-5 py-3 text-sm font-medium text-cream-50"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#46182F" },
      { title: "Ninha Cakes — Cardápio Digital" },
      {
        name: "description",
        content:
          "Doces que abraçam. Conheça o cardápio da Ninha Cakes: bolos, tortas, docinhos de festa, sobremesas e encomendas. Peça pelo WhatsApp.",
      },
      { property: "og:title", content: "Ninha Cakes — Cardápio Digital" },
      {
        property: "og:description",
        content:
          "Doces que abraçam. Conheça o cardápio da Ninha Cakes: bolos, tortas, docinhos de festa, sobremesas e encomendas. Peça pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ninha Cakes — Cardápio Digital" },
      {
        name: "twitter:description",
        content:
          "Doces que abraçam. Conheça o cardápio da Ninha Cakes: bolos, tortas, docinhos de festa, sobremesas e encomendas. Peça pelo WhatsApp.",
      },
      { property: "og:image", content: shareImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: shareImage },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Figtree:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Outlet />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}
