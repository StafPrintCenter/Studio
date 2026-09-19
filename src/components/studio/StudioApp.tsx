import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CatalogPanel, EcosystemBar, InspectorPanel, ShareDialog, SidePanel, Toolbar } from "./";
import { Scene3D, type SceneApi } from "./scene/Scene3D";
import { useStudio } from "@/lib/studio/store";
import { getModel, resolvePreset } from "@/lib/studio/models";
import { ACCEPTED_IMAGE, downloadDataUrl, exportProjectFile, isImageFile, readArtwork, readProjectFile, saveShared, slugify } from "@/lib/studio/project";

export function StudioApp() {
  const { project, layout, set, setUv, resetUv, loadProject, setLayout, resetLayout } =
    useStudio();
  const sceneApi = useRef<SceneApi | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const projectInput = useRef<HTMLInputElement>(null);
  const [dropping, setDropping] = useState(false);
  const [share, setShare] = useState<{
    open: boolean;
    title: string;
    description: string;
    url: string;
  }>({ open: false, title: "", description: "", url: "" });

  const model = resolvePreset(getModel(project.model), project.preset);

  const handleImage = useCallback(
    async (file: File, target: "artwork" | "spotMask") => {
      if (!isImageFile(file)) {
        toast.error("Format non pris en charge (PNG, JPG, WebP, SVG)");
        return;
      }
      const art = await readArtwork(file);
      set(target, art);
      toast.success(
        target === "artwork" ? "Visuel appliqué sur le support" : "Masque de vernis importé",
      );
    },
    [set],
  );

  const capture = (transparent: boolean) => {
    const url = sceneApi.current?.capture({ transparent, scale: 3 });
    if (!url) {
      toast.error("Rendu indisponible");
      return;
    }
    downloadDataUrl(url, `${slugify(project.name)}-${project.model}.png`);
    toast.success("Rendu PNG exporté");
  };

  const openShared = async (kind: "bat" | "ar") => {
    const record = await saveShared(kind, project);
    const url = `${window.location.origin}/${kind}/${record.id}`;
    setShare({
      open: true,
      title: kind === "bat" ? "BAT 3D généré" : "Session AR créée",
      description:
        kind === "bat"
          ? "Partagez ce lien au client pour validation du bon à tirer."
          : "Scannez le QR code avec un mobile pour voir le support à l'échelle 1:1.",
      url,
    });
  };

  const toggleFullscreen = () => {
    const el = shellRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen();
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div ref={shellRef} className="flex h-screen w-full flex-col overflow-hidden bg-background">
        <input
          ref={projectInput}
          type="file"
          accept=".studio3d,application/json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            try {
              loadProject(await readProjectFile(f));
              toast.success("Projet restauré");
            } catch {
              toast.error("Fichier .studio3d illisible");
            }
          }}
        />

        <Toolbar
          project={project}
          layout={layout}
          onModel={(m) => {
            set("model", m);
            set("preset", 0);
          }}
          onName={(v) => set("name", v)}
          onToggleRotate={() => set("autoRotate", !project.autoRotate)}
          onResetCamera={() => sceneApi.current?.resetCamera()}
          onFullscreen={toggleFullscreen}
          onImportProject={() => projectInput.current?.click()}
          onExportProject={() => {
            exportProjectFile(project);
            toast.success("Projet exporté (.studio3d)");
          }}
          onShare={() => void openShared("bat")}
          onBat={() => void openShared("bat")}
          onAr={() => void openShared("ar")}
          onRotateSpeed={(v) => set("rotateSpeed", v)}
          onShadows={(v) => set("shadows", v)}
          onTheme={() =>
            setLayout({ theme: layout.theme === "light" ? "dark" : "light" })
          }
          onResetLayout={() => {
            resetLayout();
            toast.success("Disposition réinitialisée");
          }}
        />

        <div className="flex min-h-0 flex-1">
          <SidePanel
            side="left"
            title="Catalogue"
            width={layout.leftWidth}
            collapsed={layout.leftCollapsed}
            onWidth={(w) => setLayout({ leftWidth: w })}
            onCollapsed={(c) => setLayout({ leftCollapsed: c })}
          >
            <CatalogPanel
              current={project.model}
              preset={project.preset}
              onSelect={(id) => {
                set("model", id);
                set("preset", 0);
              }}
              onPreset={(i) => set("preset", i)}
            />
          </SidePanel>

          <div
            className="relative min-w-0 flex-1"
            onDragOver={(e) => {
              e.preventDefault();
              setDropping(true);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget === e.target) setDropping(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDropping(false);
              const f = e.dataTransfer.files?.[0];
              if (f) void handleImage(f, "artwork");
            }}
          >
            <Scene3D project={{ ...project }} apiRef={sceneApi} className="absolute inset-0" />

            <div className="pointer-events-none absolute top-2 left-2 rounded-md border border-border/60 bg-surface/70 px-2 py-1 backdrop-blur">
              <div className="font-display text-[11px] font-semibold">{model.name}</div>
              <div className="num text-muted-foreground">
                {model.dims.w} × {model.dims.h}
                {model.dims.d ? ` × ${model.dims.d}` : ""} cm
              </div>
            </div>

            {!project.artwork && (
              <div className="pointer-events-none absolute right-0 bottom-3 left-0 flex justify-center">
                <span className="rounded-full border border-border/60 bg-surface/80 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur">
                  Glissez une image ({ACCEPTED_IMAGE.replace(/image\//g, "").replace(/,/g, ", ")})
                  directement sur la scène
                </span>
              </div>
            )}

            {dropping && (
              <div className="pointer-events-none absolute inset-3 z-10 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-primary/10 backdrop-blur-[2px]">
                <ImagePlus size={28} className="text-primary" />
                <span className="font-display text-sm font-semibold text-primary">
                  Déposer pour plaquer le visuel
                </span>
              </div>
            )}
          </div>

          <SidePanel
            side="right"
            title="Inspecteur"
            width={layout.rightWidth}
            collapsed={layout.rightCollapsed}
            onWidth={(w) => setLayout({ rightWidth: w })}
            onCollapsed={(c) => setLayout({ rightCollapsed: c })}
          >
            <InspectorPanel
              project={project}
              onUv={setUv}
              onResetUv={resetUv}
              onArtworkFile={(f) => void handleImage(f, "artwork")}
              onRemoveArtwork={() => {
                set("artwork", null);
                toast.success("Visuel retiré");
              }}
              onMaskFile={(f) => void handleImage(f, "spotMask")}
              onFinish={(f) => set("finish", f)}
              onEnvironment={(e) => set("environment", e)}
              onCapture={capture}
              onExportProject={() => {
                exportProjectFile(project);
                toast.success("Projet exporté (.studio3d)");
              }}
              onImportProject={() => projectInput.current?.click()}
              onShare={() => void openShared("bat")}
              onQr={() => void openShared("bat")}
              onBat={() => void openShared("bat")}
              onAr={() => void openShared("ar")}
            />
          </SidePanel>
        </div>

        <EcosystemBar />
      </div>

      <ShareDialog
        open={share.open}
        onOpenChange={(o) => setShare((s) => ({ ...s, open: o }))}
        title={share.title}
        description={share.description}
        url={share.url}
      />
    </TooltipProvider>
  );
}
