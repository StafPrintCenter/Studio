import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/studio/StudioApp";
import { SITE } from "@/data/site";

const PAGE_TITLE = `${SITE.tool} - Outils de modélisation 3D et de réalité augmentée | ${SITE.name}`;
const PAGE_DESC = `Studio 3D professionnel pour prévisualiser vos supports imprimés, générer un BAT et les voir en réalité augmentée ${SITE.name}.`;

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-background px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">
          <MonitorSmartphone size={30} className="text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-xl font-semibold">
            Le studio 3D se travaille sur ordinateur
          </h1>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            L'édition des supports 3D nécessite un écran plus large. Ouvrez
            studio.stafprint.com sur un ordinateur pour créer ou modifier vos projets.
          </p>
        </div>
        <p className="max-w-sm text-xs text-muted-foreground">
          Les liens de validation BAT et de réalité augmentée restent consultables sur mobile.
        </p>
        <Link
          to="/cgu"
          className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Conditions générales d'utilisation
        </Link>
      </div>
    );
  }

  return <StudioApp />;
}
