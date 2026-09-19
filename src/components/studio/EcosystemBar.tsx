import { ExternalLink } from "lucide-react";

const LINKS = [
  { href: "https://brief.stafprint.com", label: "brief.stafprint.com", hint: "Briefs clients" },
  { href: "https://tools.stafprint.com", label: "tools.stafprint.com", hint: "Outils PAO" },
];

export function EcosystemBar() {
  return (
    <div className="flex h-7 shrink-0 items-center gap-3 border-t border-border bg-surface/60 px-3 text-[11px] text-muted-foreground">
      <span className="hidden sm:inline">Écosystème STAF PRINT</span>
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
      <span className="num hidden md:inline">studio.stafprint.com</span>
    </div>
  );
}
