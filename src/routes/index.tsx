import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/studio/StudioApp";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "SPC 3D Studio & AR - Simulateur 3D STAF PRINT CENTER" },
      {
        name: "description", content:
          PAGE_DESC
      },
      { property: "og:title", content: "SPC 3D Studio & AR - STAF PRINT CENTER" },
      {
        property: "og:description",
        content:
          "Simulateur 3D professionnel pour supports imprimés : finitions, environnements, BAT client et visualisation AR à l'échelle 1:1.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioApp,
});
