// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * TanStack's development source inspector adds `data-tsd-source` to every JSX
 * element. React Three Fiber interprets dashed props as nested object paths and
 * consequently tries to write to `object.data.tsd-source`, which crashes for
 * Three.js primitives. Remove only that development metadata from files that
 * render the R3F scene, after the inspector has injected it and before React
 * compiles the JSX.
 */
function stripR3fSourceMetadata(): Plugin[] {
  const r3fModule = /\/src\/components\/studio\//;
  const strip = (code: string) =>
    code
      .replace(/\sdata-tsd-source=(?:"[^"]*"|'[^']*'|\{[^{}]*\})/g, "")
      .replace(/(?:"data-tsd-source"|'data-tsd-source')\s*:\s*(?:"[^"]*"|'[^']*'|`[^`]*`)\s*,?/g, "");

  const make = (enforce: "pre" | "post"): Plugin => ({
    name: `strip-r3f-source-metadata-${enforce}`,
    enforce,
    transform(code, id) {
      const cleanId = id.split("?", 1)[0]?.replaceAll("\\", "/") ?? id;
      if (!r3fModule.test(cleanId) || !code.includes("data-tsd-source")) return null;
      return { code: strip(code), map: null };
    },
  });

  return [make("pre"), make("post")];
}

export default defineConfig({
  plugins: [stripR3fSourceMetadata()],

  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
