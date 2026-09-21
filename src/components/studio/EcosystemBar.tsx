import { ExternalLink } from "lucide-react";
import { SITE, SITE_LINK } from "@/data/site";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon, WhatsAppIcon } from "@/components/studio/icons";

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
    href: `${SITE_LINK.docsUrl}/docs/studio/guide-complet`,
    label: "Lire la documentation",
    hint: "Docs et guide technique"
  },
];

export function EcosystemBar() {
  const socialLinks = [
    { label: "Facebook", href: SITE.socials.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: SITE.socials.instagram, Icon: InstagramIcon },
    { label: "LinkedIn", href: SITE.socials.linkedin, Icon: LinkedinIcon },
    { label: "X", href: SITE.socials.x, Icon: XIcon },
    { label: "WhatsApp", href: SITE.whatsappLink, Icon: WhatsAppIcon },
  ];

  return (
    <div className="flex h-7 shrink-0 items-center gap-3 border-t border-border bg-surface/60 px-3 text-[11px] text-muted-foreground">
      {/* Label Écosystème */}
      <span className="hidden sm:inline font-bold">
        Écosystème {" "}
        <a
          href={SITE_LINK.landingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition-colors hover:text-primary underline"
        >
          {SITE.name}
        </a>
      </span>

      {/* Liens de l'écosystème */}
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

      {/* Espaceur flexible */}
      <span className="flex-1" />

      {/* Tool Name (Visible sur desktop large) */}
      <span className="num hidden md:inline font-bold mr-2">{SITE.tool}</span>

      {/* Séparateur (Visible sur desktop) */}
      <span className="hidden md:inline text-muted-foreground/30">|</span>

      {/* Liens Sociaux */}
      <div className="flex items-center gap-1.5">
        {socialLinks.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="rounded-md p-1 transition-colors hover:bg-accent hover:text-primary"
          >
            <Icon className="size-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
