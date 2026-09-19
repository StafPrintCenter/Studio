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
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { name: "author", content: `${SITE.manager}` },

      /* Open Graph / Facebook / WhatsApp */
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: `${SITE.tool} - ${SITE.name}` },
      { property: "og:image", content: `${logo.meta}` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${SITE.tool} - ${SITE.name}` },
      { property: "og:url", content: `${SITE_LINK.studioUrl}` },
      { property: "og:locale", content: "fr_BJ" },

      /* Twitter / X */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${logo.meta}` },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESC },
      { name: "twitter:site", content: "@StafPrintCenter" },

      /* Google Verification */
      { name: "google-site-verification", content: "OdKxHpVkBSxk0mj4vD4OTmZPdVi5pWzyCu4QPIMHy9A" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_LINK.studioUrl}` },
      { rel: "stylesheet", href: appCss, },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
    scripts: [
      /* Schéma WebApplication pour l'outil de studio */
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "@id": `${SITE_LINK.studioUrl}/#webapp`,
          url: SITE_LINK.studioUrl,
          name: `${SITE.tool}`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "All",
          description: PAGE_DESC,
          inLanguage: "fr-BJ",
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            logo: { "@type": "ImageObject", url: `${logo.meta}` }
          }
        }),
      }
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
