import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Ruler, ArrowLeft } from "lucide-react";
import { ArViewer } from "@/components/studio/ArViewer";
import { ProjectFileImport } from "@/components/studio/ProjectFileImport";
import { getModel, resolvePreset } from "@/lib/studio/models";
import { loadShared, type SharedRecord } from "@/lib/studio/project";
import type { ProjectState } from "@/lib/studio/store";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Réalité augmentée - ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `"Visualisez votre support imprimé en réalité augmentée, à l'échelle 1:1, directement depuis votre mobile. | ${SITE.name}.`;

export const Route = createFileRoute("/ar/$sessionCode")({
  ssr: false,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      {
        name: "description", content: PAGE_DESC
      },
      { property: "og:title", content: PAGE_TITLE },
      {
        property: "og:description", content: PAGE_DESC
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArPage,
});

function ArPage() {
  const { sessionCode } = Route.useParams();
  const [record, setRecord] = useState<SharedRecord | null | "missing">(null);
  const [importedProject, setImportedProject] = useState<ProjectState | null>(null);

  useEffect(() => {
    const kind = sessionCode.startsWith("BAT") ? "bat" : "ar";
    loadShared(kind, sessionCode).then((r) => setRecord(r ?? "missing"));
  }, [sessionCode]);

  if (!importedProject && (record === null || record === "missing")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-sm text-muted-foreground">
        <div>
          {record === null ? (
            "Chargement de la session AR…"
          ) : (
            <>
              <p className="mb-3">Session AR introuvable sur cet appareil.</p>
              <p className="mb-4 max-w-sm text-xs">
                Importez le fichier .studio3d reçu pour afficher ce travail sur cet appareil.
              </p>
              <div className="mx-auto mb-4 max-w-xs">
                <ProjectFileImport onImport={setImportedProject} />
              </div>
              <Link to="/" className="text-primary underline">Retour au studio</Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const p = importedProject ?? (record !== "missing" && record ? record.project : null);
  if (!p) return null;
  const model = resolvePreset(getModel(p.model), p.preset);

  return (
    <div className="flex h-dvh min-h-128 flex-col bg-background text-foreground">
      <header className="flex h-14 items-center gap-3 border-b border-border px-4">
        <Link
          to="/"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Retour au studio"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="from-primary to-primary-deep flex h-8 w-8 items-center justify-center rounded-md bg-linear-to-br">
          <Box size={17} className="text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm font-bold">Mode réalité augmentée</div>
          <div className="num text-muted-foreground">
            {importedProject ? "Projet importé" : record !== "missing" && record ? record.id : ""}
          </div>
        </div>
        <span className="flex-1" />
        <ProjectFileImport onImport={setImportedProject} compact />
      </header>

      <main className="relative min-h-72 flex-1">
        <ArViewer project={p} />
      </main>

      <footer className="space-y-1 border-t border-border px-4 py-3">
        <div className="font-display text-sm font-semibold">{model.name}</div>
        <div className="num flex items-center gap-1.5 text-muted-foreground">
          <Ruler size={12} className="text-primary" />
          {model.dims.w} × {model.dims.h}
          {model.dims.d ? ` × ${model.dims.d}` : ""} cm - échelle 1:1
        </div>
        <p className="text-[11px] text-muted-foreground">
          Sur mobile, touchez l'icône AR pour placer le support dans votre espace réel
          (Android / iOS récents).
        </p>
      </footer>
    </div>
  );
}
