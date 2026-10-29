import { defineConfig, loadEnv, type PluginOption, type UserConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig(async ({ command, mode }) => {
  // Só as `VITE_*` entram no bundle; o resto do `.env` fica no servidor.
  const define: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), "VITE_"))) {
    define[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const plugins: PluginOption[] = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // `server-only` e `**/server/**` não podem vazar para o bundle do cliente.
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // O Nitro builda a partir de `src/server.ts` (wrapper de erro de SSR).
      server: { entry: "server" },
    }),
  ];

  // Nitro só no build: o dev server é o do Vite. O preset Cloudflare é o alvo
  // de deploy (wrangler); em dev nada disso é carregado.
  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    plugins.push(nitro({ defaultPreset: "cloudflare-module" }));
  }

  plugins.push(viteReact());

  const isDevBuild = command === "build" && mode === "development";

  const config: UserConfig = {
    define,
    // Um NODE_ENV global emitiria jsxDEV, que o runtime de SSR não resolve —
    // por isso o define é escopado no cliente.
    ...(isDevBuild
      ? {
          environments: {
            client: { define: { "process.env.NODE_ENV": JSON.stringify("development") } },
          },
          esbuild: { keepNames: true },
        }
      : {}),
    // Mesmo pipeline de CSS no dev e no build: o preview não mente.
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    // Re-otimização de deps gira o hash e dá 504 em abas abertas: pré-bundle
    // o que sempre existe e tolere requisição com hash velho.
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    server: { host: "::", port: 8080 },
    plugins,
  };

  return config;
});
