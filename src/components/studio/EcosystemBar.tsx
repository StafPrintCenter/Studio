import { ExternalLink } from "lucide-react";
import { SITE, SITE_LINK } from "@/data/site";
import { stripProtocol } from "@/lib/domain";

const LINKS = [
  {
    href: SITE_LINK.briefUrl,
    label: "Lancez votre brief technique",
    hint: "Briefs clients"
  },
  {
    href: SITE_LINK.toolkitUrl,
    label: "Vérifiez vos résolutions",
    hint: "Outils PAO"
  },
  {
    href: `${SITE_LINK.docsUrl}/docs/studio/parcours-de-qualification`,
    label: "Lire la documentation",
    hint: "Docs et guide technique"
  },
];

export function EcosystemBar() {
  return (
    <div className="flex h-7 shrink-0 items-center gap-3 border-t border-border bg-surface/60 px-3 text-[11px] text-muted-foreground">
      <span className="hidden sm:inline font-bold">Écosystème {SITE.name}</span>
      {LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 transition-colors hover:text-primary"
        >
          {l.label}
          <ExternalLink size={10} />
        </a>
      ))}
      <span className="flex-1" />
      <span className="num hidden md:inline"> {stripProtocol(SITE_LINK.studioUrl)}</span>
    </div>
  );
}
