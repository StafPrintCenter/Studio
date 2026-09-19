import { useRef, useState, type ReactNode } from "react";
import {
  Image as ImageIcon,
  Move3d,
  Sparkles,
  Mountain,
  Download,
  Share2,
  QrCode,
  FileCheck2,
  Smartphone,
  RotateCcw,
  Upload,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { NumericControl } from "./NumericControl";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ENVIRONMENTS, FINISHES, type EnvId, type FinishId } from "@/lib/studio/models";
import { ACCEPTED_IMAGE, formatBytes } from "@/lib/studio/project";
import type { ProjectState, UvTransform } from "@/lib/studio/store";
import { cn } from "@/lib/utils";

interface Props {
  project: ProjectState;
  onUv: (patch: Partial<UvTransform>) => void;
  onResetUv: () => void;
  onArtworkFile: (file: File) => void;
  onRemoveArtwork: () => void;
  onMaskFile: (file: File) => void;
  onFinish: (f: FinishId) => void;
  onEnvironment: (e: EnvId) => void;
  onCapture: (transparent: boolean) => void;
  onExportProject: () => void;
  onImportProject: () => void;
  onShare: () => void;
  onQr: () => void;
  onBat: () => void;
  onAr: () => void;
}

function Section({
  icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/70">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-accent/50"
      >
        <span className="text-primary">{icon}</span>
        <span className="font-display flex-1 text-[11px] font-semibold tracking-widest uppercase">
          {title}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            !open && "-rotate-90",
          )}
        />
      </button>
      {open && <div className="space-y-3 px-3 pt-1 pb-3">{children}</div>}
    </div>
  );
}

export function InspectorPanel(p: Props) {
  const artInput = useRef<HTMLInputElement>(null);
  const maskInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [transparent, setTransparent] = useState(false);
  const art = p.project.artwork;

  return (
    <div>
      <input
        ref={artInput}
        type="file"
        accept={ACCEPTED_IMAGE}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) p.onArtworkFile(f);
          e.target.value = "";
        }}
      />
      <input
        ref={maskInput}
        type="file"
        accept={ACCEPTED_IMAGE}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) p.onMaskFile(f);
          e.target.value = "";
        }}
      />

      <Section icon={<ImageIcon size={14} />} title="Visuel à plaquer">
        {art ? (
          <div className="space-y-2">
            <div className="flex gap-2.5 rounded-md border border-border/70 bg-surface/50 p-2">
              <img
                src={art.dataUrl}
                alt={art.name}
                className="h-14 w-14 rounded border border-border object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{art.name}</p>
                <p className="num mt-1 text-muted-foreground">
                  {art.width} × {art.height} px
                </p>
                <p className="num text-muted-foreground">{formatBytes(art.size)}</p>
              </div>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <Button
                size="sm"
                variant="outline"
                className="min-w-0"
                onClick={() => artInput.current?.click()}
              >
                <Upload size={13} /> Remplacer
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={p.onRemoveArtwork}
                aria-label="Retirer le visuel"
                title="Retirer le visuel"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => artInput.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) p.onArtworkFile(f);
            }}
            className={cn(
              "flex w-full flex-col items-center gap-1.5 rounded-md border border-dashed px-3 py-6 text-center transition-colors",
              dragOver
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/60 hover:bg-accent/40",
            )}
          >
            <Upload size={18} className="text-primary" />
            <span className="text-xs font-medium">Déposer une image</span>
            <span className="text-[11px] text-muted-foreground">
              PNG, JPG, WebP ou SVG — ou cliquer
            </span>
          </button>
        )}
      </Section>

      <Section icon={<Move3d size={14} />} title="Transformation UV">
        <NumericControl
          label="Échelle"
          value={p.project.uv.scale}
          min={0.1}
          max={4}
          step={0.01}
          onChange={(v) => p.onUv({ scale: v })}
        />
        <NumericControl
          label="Position X"
          value={p.project.uv.offsetX}
          min={-1}
          max={1}
          step={0.005}
          onChange={(v) => p.onUv({ offsetX: v })}
        />
        <NumericControl
          label="Position Y"
          value={p.project.uv.offsetY}
          min={-1}
          max={1}
          step={0.005}
          onChange={(v) => p.onUv({ offsetY: v })}
        />
        <NumericControl
          label="Rotation"
          value={p.project.uv.rotation}
          min={-180}
          max={180}
          step={1}
          decimals={0}
          unit="°"
          onChange={(v) => p.onUv({ rotation: v })}
        />
        <div className="grid grid-cols-2 gap-3">
          <NumericControl
            label="Tile X"
            value={p.project.uv.tileX}
            min={1}
            max={12}
            step={1}
            decimals={0}
            onChange={(v) => p.onUv({ tileX: v })}
          />
          <NumericControl
            label="Tile Y"
            value={p.project.uv.tileY}
            min={1}
            max={12}
            step={1}
            decimals={0}
            onChange={(v) => p.onUv({ tileY: v })}
          />
        </div>
        <Button size="sm" variant="ghost" className="w-full" onClick={p.onResetUv}>
          <RotateCcw size={13} /> Réinitialiser UV
        </Button>
      </Section>

      <Section icon={<Sparkles size={14} />} title="Finitions & matériaux">
        <div className="grid grid-cols-2 gap-1.5">
          {FINISHES.map((f) => (
            <button
              key={f.id}
              type="button"
              title={f.hint}
              onClick={() => p.onFinish(f.id)}
              className={cn(
                "rounded-md border px-2 py-2 text-left transition-colors",
                p.project.finish === f.id
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border/60 hover:border-border hover:bg-accent/50",
              )}
            >
              <span className="text-xs font-medium">{f.name}</span>
              <span className="mt-0.5 block text-[10px] leading-tight text-muted-foreground">
                {f.hint}
              </span>
            </button>
          ))}
        </div>
        {p.project.finish === "spot" && (
          <div className="rounded-md border border-border/70 bg-surface/50 p-2">
            <p className="mb-2 text-[11px] text-muted-foreground">
              Masque du vernis (blanc = vernis, noir = aucun)
            </p>
            <div className="flex items-center gap-2">
              {p.project.spotMask && (
                <img
                  src={p.project.spotMask.dataUrl}
                  alt="Masque de vernis"
                  className="h-10 w-10 rounded border border-border object-cover"
                />
              )}
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => maskInput.current?.click()}
              >
                <Upload size={13} />
                {p.project.spotMask ? "Remplacer le masque" : "Importer un masque N&B"}
              </Button>
            </div>
          </div>
        )}
      </Section>

      <Section icon={<Mountain size={14} />} title="Environnement 3D">
        <div className="grid grid-cols-2 gap-1.5">
          {ENVIRONMENTS.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => p.onEnvironment(e.id)}
              className={cn(
                "rounded-md border px-2 py-2 text-left transition-colors",
                p.project.environment === e.id
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border/60 hover:border-border hover:bg-accent/50",
              )}
            >
              <span className="text-xs font-medium">{e.name}</span>
              <span className="mt-0.5 block text-[10px] leading-tight text-muted-foreground">
                {e.hint}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <Section icon={<Download size={14} />} title="Export du rendu">
        <div className="flex items-center justify-between rounded-md border border-border/60 px-2.5 py-2">
          <span className="text-xs">Fond transparent</span>
          <Switch checked={transparent} onCheckedChange={setTransparent} />
        </div>
        <Button size="sm" className="w-full" onClick={() => p.onCapture(transparent)}>
          <Download size={13} /> Capture PNG haute résolution
        </Button>
      </Section>

      <Section icon={<Share2 size={14} />} title="Partager & exporter" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant="outline" onClick={p.onExportProject}>
            <Download size={13} /> .studio3d
          </Button>
          <Button size="sm" variant="outline" onClick={p.onImportProject}>
            <Upload size={13} /> Importer
          </Button>
          <Button size="sm" variant="outline" onClick={p.onShare}>
            <Share2 size={13} /> Partager
          </Button>
          <Button size="sm" variant="outline" onClick={p.onQr}>
            <QrCode size={13} /> QR Code
          </Button>
        </div>
      </Section>

      <Section icon={<FileCheck2 size={14} />} title="BAT & réalité augmentée">
        <Button size="sm" className="w-full" onClick={p.onBat}>
          <FileCheck2 size={13} /> Générer un BAT 3D
        </Button>
        <Button size="sm" variant="outline" className="w-full" onClick={p.onAr}>
          <Smartphone size={13} /> Ouvrir en réalité augmentée
        </Button>
      </Section>
    </div>
  );
}
