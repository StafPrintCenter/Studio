import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { useStudio } from "@/lib/studio/store";
import { SITE, SITE_LINK } from "@/data/site";
import logo from "@/assets/logos.json";
import { NotFoundComponent, ErrorComponent } from "@/components/errors";

const PAGE_TITLE = `${SITE.tool} - Outils de modélisation 3D et de réalité augmentée | ${SITE.name}`;
const PAGE_DESC = `Studio 3D professionnel pour prévisualiser vos supports imprimés, générer un BAT et les voir en réalité augmentée ${SITE.name}.`;


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SPC 3D Studio & AR — STAF PRINT CENTER" },
      {
        name: "description",
        content:
          "Studio 3D professionnel pour prévisualiser vos supports imprimés, générer un BAT et les voir en réalité augmentée.",
      },
      { name: "author", content: "STAF PRINT CENTER" },
      { property: "og:title", content: "SPC 3D Studio & AR" },
      {
        property: "og:description",
        content: "Prévisualisation 3D, BAT et réalité augmentée pour vos supports imprimés.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
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
  const theme = useStudio((s) => s.layout.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme !== "light");
    root.classList.toggle("light", theme === "light");
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
