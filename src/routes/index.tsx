import { createFileRoute, Link } from "@tanstack/react-router";
import { MonitorSmartphone, MessageCircle } from "lucide-react";
import { StudioApp } from "@/components/studio/StudioApp";
import { SITE, SITE_LINK } from "@/data/site";
import { stripProtocol } from "@/lib/domain";
import { useIsMobile } from "@/hooks/use-mobile";

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
            {SITE.tool} n'est disponible que sur ordinateur
          </h1>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            L'édition et la personnalisation des supports 3D nécessitent un écran plus large. Rendez-vous sur {stripProtocol(SITE_LINK.studioUrl)} depuis votre ordinateur pour créer ou modifier vos projets.
          </p>
        </div>

        <div className="mx-auto max-w-sm rounded-xl border border-border bg-surface/50 p-4 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Les pages de <strong>validation BAT</strong> et de <strong>réalité augmentée (AR)</strong> restent pleinement accessibles sur mobile. Si vous n'avez pas de lien, vous pouvez en demander.
          </p>
        </div>

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
