import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/studio/StudioApp";
import { SITE, SITE_LINK } from "@/data/site";

const PAGE_TITLE = `${SITE.tool} - Outils de modélisation 3D et de réalité augmentée | ${SITE.name}`;
const PAGE_DESC = `Studio 3D professionnel pour prévisualiser vos supports imprimés, générer un BAT et les voir en réalité augmentée ${SITE.name}.`;


export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      {
        name: "description", content:
          PAGE_DESC
      },
      { property: "og:title", content: PAGE_TITLE },
      {
        property: "og:description", content:
          PAGE_DESC
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioApp,
});
