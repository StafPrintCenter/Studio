import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Box, CheckCircle2, Download, Mail, Ruler, Share2, Sparkles, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Scene3D } from "@/components/studio/scene/Scene3D";
import { ProjectFileImport } from "@/components/studio/ProjectFileImport";
import { Button } from "@/components/ui/button";
import { getModel, resolvePreset, FINISHES, ENVIRONMENTS } from "@/lib/studio/models";
import { downloadBlob, loadShared, projectFile, saveShared, slugify, updateShared, type SharedRecord } from "@/lib/studio/project";
import { SITE } from "@/data/site";

const PAGE_TITLE = `BAT 3D - ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Bon à tirer 3D : inspectez votre support imprimé et validez la production. | ${SITE.name}.`;

export const Route = createFileRoute("/bat/$batId")({
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
  component: BatPage,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1.5 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="num text-right text-foreground">{value}</span>
    </div>
  );
}

function BatPage() {
  const { batId } = Route.useParams();
  const [record, setRecord] = useState<SharedRecord | null | "missing">(null);

  useEffect(() => {
    loadShared("bat", batId).then((r) => setRecord(r ?? "missing"));
  }, [batId]);

  if (record === null) {
    return <Centered>Chargement du BAT…</Centered>;
  }
  if (record === "missing") {
    return (
      <Centered>
        <p className="mb-3">Ce BAT est introuvable sur cet appareil.</p>
        <p className="mb-4 max-w-sm text-xs">
          Importez le fichier .studio3d reçu pour visualiser et valider ce travail.
        </p>
        <div className="mx-auto mb-4 max-w-xs">
          <ProjectFileImport
            onImport={async (project) => {
              setRecord(await saveShared("bat", project));
            }}
          />
        </div>
        <Link to="/" className="text-primary underline">Retour au studio</Link>
      </Centered>
    );
  }

  const p = record.project;
  const model = resolvePreset(getModel(p.model), p.preset);
  const finish = FINISHES.find((f) => f.id === p.finish);
  const env = ENVIRONMENTS.find((e) => e.id === p.environment);
  const approved = record.status === "approved";
  const details = [
    `BAT 3D validé - ${p.name}`,
    `Support : ${model.name}`,
    `Dimensions : ${model.dims.w} × ${model.dims.h}${model.dims.d ? ` × ${model.dims.d}` : ""} cm`,
    `Finition : ${finish?.name ?? "-"}`,
    `Référence : ${record.id}`,
  ].join("\n");
  const whatsappUrl = `https://wa.me/2290160300607?text=${encodeURIComponent(details)}`;
  const mailUrl = `mailto:contact@stafprint.com?subject=${encodeURIComponent(`BAT validé - ${p.name}`)}&body=${encodeURIComponent(`${details}\n\nLe fichier .studio3d a été téléchargé séparément et peut être joint à ce message.`)}`;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-14 items-center gap-3 border-b border-border px-4">
        <div className="from-primary to-primary-deep flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br">
          <Box size={17} className="text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm font-bold">Bon à tirer 3D</div>
          <div className="num text-muted-foreground">{record.id}</div>
        </div>
        <span className="flex-1" />
        <ProjectFileImport
          compact
          onImport={async (project) => {
            setRecord(await saveShared("bat", project));
          }}
        />
        {approved && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
            <BadgeCheck size={14} /> BAT validé
          </span>
        )}
      </header>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[1fr_340px]">
        <div className="relative min-h-[55vh]">
          <Scene3D project={{ ...p, autoRotate: true }} className="!absolute inset-0" />
        </div>

        <aside className="panel-scroll space-y-5 border-t border-border p-4 lg:border-t-0 lg:border-l">
          <div>
            <h1 className="font-display text-lg font-bold">{p.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{model.description}</p>
          </div>

          <section>
            <h2 className="font-display mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase">
              <Ruler size={13} className="text-primary" /> Dimensions
            </h2>
            <Row label="Support" value={model.name} />
            <Row label="Largeur" value={`${model.dims.w} cm`} />
            <Row label="Hauteur" value={`${model.dims.h} cm`} />
            {model.dims.d ? <Row label="Profondeur" value={`${model.dims.d} cm`} /> : null}
          </section>

          <section>
            <h2 className="font-display mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase">
              <Sparkles size={13} className="text-primary" /> Fiche technique
            </h2>
            <Row label="Finition" value={finish?.name ?? "—"} />
            <Row label="Rendu" value={finish?.hint ?? "—"} />
            <Row label="Environnement" value={env?.name ?? "—"} />
            <Row label="Fichier visuel" value={p.artwork?.name ?? "Aucun"} />
            <Row
              label="Définition"
              value={p.artwork ? `${p.artwork.width} × ${p.artwork.height} px` : "—"}
            />
            <Row
              label="Créé le"
              value={new Date(record.createdAt).toLocaleString("fr-FR")}
            />
          </section>

          <div className="space-y-2">
            <Button
              className="w-full"
              disabled={approved}
              onClick={async () => {
                const next: SharedRecord = {
                  ...record,
                  status: "approved",
                  approvedAt: new Date().toISOString(),
                };
                await updateShared("bat", next);
                setRecord(next);
                toast.success("BAT validé — merci !");
              }}
            >
              <CheckCircle2 size={15} />
              {approved ? "BAT déjà validé" : "Valider le bon à tirer"}
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/ar/$sessionCode" params={{ sessionCode: record.id }}>
                <Smartphone size={15} /> Voir en réalité augmentée
              </Link>
            </Button>
          </div>

          {approved && (
            <section className="space-y-2 border-t border-border pt-4">
              <h2 className="font-display flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase">
                <Share2 size={13} className="text-primary" /> Partager le BAT validé
              </h2>
              <p className="text-xs text-muted-foreground">
                Partagez le projet complet ou envoyez ses détails à STAF PRINT CENTER.
              </p>
              <Button
                className="w-full"
                onClick={async () => {
                  const file = projectFile(p);
                  const shareData = { title: `BAT validé — ${p.name}`, text: details, files: [file] };
                  if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
                    try {
                      await navigator.share(shareData);
                      return;
                    } catch (error) {
                      if (error instanceof DOMException && error.name === "AbortError") return;
                    }
                  }
                  downloadBlob(file, file.name);
                  toast.info("Fichier téléchargé — vous pouvez maintenant le joindre au message");
                }}
              >
                <Share2 size={15} /> Partager le fichier .studio3d
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">
                    <Smartphone size={15} /> WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={mailUrl}>
                    <Mail size={15} /> E-mail
                  </a>
                </Button>
              </div>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  const file = projectFile(p);
                  downloadBlob(file, `${slugify(p.name)}.studio3d`);
                }}
              >
                <Download size={15} /> Télécharger seulement
              </Button>
            </section>
          )}

          <p className="text-[11px] text-muted-foreground">
            Rendu 3D indicatif — les couleurs à l'écran peuvent différer de l'impression finale.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-sm text-muted-foreground">
      <div>{children}</div>
    </div>
  );
}
