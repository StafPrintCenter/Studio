import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SITE, SITE_LINK } from "@/data/site";
import { stripProtocol } from "@/lib/domain";

const PAGE_TITLE = `Conditions générales d'utilisation - ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Conditions générales d'utilisation du studio 3D et des modules BAT et réalité augmentée de ${SITE.name}.`;

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CguPage,
});

const BRIEF_URL = stripProtocol(SITE_LINK.briefUrl);
const TOOLKIT_URL = stripProtocol(SITE_LINK.toolkitUrl);
const DOCS_URL = stripProtocol(SITE_LINK.docsUrl);

const SECTIONS: { title: string; body: (string | React.ReactNode)[] }[] = [
  {
    title: "1. Objet",
    body: [
      `Les présentes conditions générales d'utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de l'application ${SITE.tool} (${stripProtocol(SITE_LINK.studioUrl)}), éditée par ${SITE.name}.`,
      "L'application permet de prévisualiser des supports imprimés en 3D, de générer des bons à tirer (BAT) partageables et de visualiser les supports en réalité augmentée à l'échelle 1:1.",
    ],
  },
  {
    title: "2. Accès au service",
    body: [
      "Le studio d'édition 3D est optimisé pour une utilisation sur ordinateur. Les pages de validation BAT et de réalité augmentée restent accessibles sur mobile.",
      `Le service est accessible sans création de compte. ${SITE.name} se réserve le droit de modifier, suspendre ou interrompre tout ou partie du service, notamment pour maintenance.`,
    ],
  },
  {
    title: "3. Données et projets",
    body: [
      "Les projets, visuels importés, BAT et sessions AR sont stockés localement sur l'appareil de l'utilisateur (navigateur). Aucune donnée n'est transmise à un serveur tiers par l'application.",
      "L'utilisateur est responsable de la conservation de ses fichiers .studio3d. La suppression des données du navigateur entraîne la perte définitive des projets et liens partagés localement.",
    ],
  },
  {
    title: "4. Propriété intellectuelle",
    body: [
      "L'utilisateur garantit détenir les droits nécessaires sur les visuels qu'il importe dans le studio et s'engage à ne pas utiliser de contenus contrefaits, illicites ou portant atteinte aux droits de tiers.",
      `L'application, ses interfaces, ses modèles 3D et sa charte graphique demeurent la propriété exclusive de ${SITE.name}. Toute reproduction non autorisée est interdite.`,
    ],
  },
  {
    title: "5. Validation des BAT",
    body: [
      "La validation d'un BAT par le client via la page dédiée vaut accord de principe sur la maquette 3D présentée. Elle ne se substitue pas au bon à tirer contractuel défini dans le cadre de la commande d'impression.",
      "Les rendus 3D et AR sont des simulations : de légères variations de couleurs, de finitions ou de proportions peuvent exister entre la simulation et le produit imprimé final.",
    ],
  },
  {
    title: "6. Responsabilité",
    body: [
      `${SITE.name} ne saurait être tenu responsable des pertes de données locales, des indisponibilités temporaires du service ou des dommages indirects liés à l'utilisation de l'application.`,
      "La visualisation en réalité augmentée dépend des capacités de l'appareil de l'utilisateur ; sa disponibilité n'est pas garantie sur tous les terminaux.",
    ],
  },
  {
    title: "7. Liens externes et écosystème",
    body: [
      <>
        L'application peut contenir des liens vers d'autres services de l'écosystème {SITE.name} (
        <a href={SITE_LINK.briefUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          {BRIEF_URL}
        </a>,{" "}
        <a href={SITE_LINK.toolkitUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          {TOOLKIT_URL}
        </a>,{" "}
        <a href={SITE_LINK.docsUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          {DOCS_URL}
        </a>
        ) ou vers des applications tierces (WhatsApp, messagerie). Bien que ces plateformes soient éditées par {SITE.name}, chacune dispose de ses propres conditions d'utilisation, politiques de confidentialité et modalités spécifiques régissant leurs services respectifs.
      </>,
    ],
  },
  {
    title: "8. Modification des CGU",
    body: [
      "Les présentes CGU peuvent être modifiées à tout moment. La version en vigueur est celle publiée sur cette page à la date de consultation.",
    ],
  },
  {
    title: "9. Contact",
    body: [
      <>
        Pour toute question relative au service ou aux présentes conditions, vous pouvez nous contacter par email à{" "}
        <a href={`mailto:${SITE.email}`} className="underline hover:text-primary">
          {SITE.email}
        </a>{" "}
        ou par WhatsApp au{" "}
        <a href={SITE.whatsappLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          {SITE.whatsapp}
        </a>.
      </>
    ],
  },
];

function CguPage() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={13} /> Retour au studio
        </Link>

        <h1 className="font-display mt-6 text-3xl font-bold">
          Conditions générales d'utilisation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {SITE.tool} - {SITE.name} · Dernière mise à jour : 02 octobre 2026
        </p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-lg font-semibold text-foreground">{s.title}</h2>
              <div className="mt-2 space-y-2">
                {s.body.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CguPage;