import { Box, Upload, Download, Share2, Rotate3d, Crosshair, Maximize2, FileCheck2, Smartphone, Settings2, Sun, Moon, LayoutTemplate } from "lucide-react";
import { IconButton } from "./IconButton";
import { NumericControl } from "./NumericControl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MODELS, type ModelKind } from "@/lib/studio/models";
import type { LayoutState, ProjectState } from "@/lib/studio/store";

interface Props {
  project: ProjectState;
  layout: LayoutState;
  onModel: (m: ModelKind) => void;
  onToggleRotate: () => void;
  onResetCamera: () => void;
  onFullscreen: () => void;
  onImportProject: () => void;
  onExportProject: () => void;
  onShare: () => void;
  onBat: () => void;
  onAr: () => void;
  onRotateSpeed: (v: number) => void;
  onShadows: (v: boolean) => void;
  onTheme: () => void;
  onResetLayout: () => void;
  onName: (v: string) => void;
}

export function Toolbar(p: Props) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-surface/80 px-2 backdrop-blur">
      <div className="flex items-center gap-2 pr-1">
        <div className="from-primary to-primary-deep flex h-7 w-7 items-center justify-center rounded-md bg-linear-to-br">
          <Box size={16} className="text-primary-foreground" />
        </div>
        <div className="hidden leading-none sm:block">
          <div className="font-display text-[13px] font-bold tracking-tight">
            SPC 3D Studio
          </div>
          <div className="text-[10px] tracking-wide text-muted-foreground">
            STAF PRINT CENTER
          </div>
        </div>
      </div>

      <div className="mx-1 h-6 w-px bg-border" />

      <Select value={p.project.model} onValueChange={(v) => p.onModel(v as ModelKind)}>
        <SelectTrigger className="h-8 w-47.5 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MODELS.map((m) => (
            <SelectItem key={m.id} value={m.id} className="text-xs">
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <input
        value={p.project.name}
        onChange={(e) => p.onName(e.target.value)}
        aria-label="Nom du projet"
        className="hidden h-8 w-44 rounded-md border border-transparent bg-transparent px-2 text-xs transition-colors hover:border-border focus:border-primary/60 focus:outline-none lg:block"
      />

      <div className="mx-1 h-6 w-px bg-border" />

      <IconButton
        label="Importer un projet .studio3d"
        icon={<Download size={15} />}
        onClick={p.onImportProject}
      />
      <IconButton
        label="Exporter le projet"
        icon={<Upload size={15} />}
        onClick={p.onExportProject}
      />
      <IconButton label="Partager" icon={<Share2 size={15} />} onClick={p.onShare} />

      <div className="mx-1 h-6 w-px bg-border" />

      <IconButton
        label="Auto-rotation"
        icon={<Rotate3d size={15} />}
        active={p.project.autoRotate}
        onClick={p.onToggleRotate}
      />
      <IconButton
        label="Recentrer la caméra"
        icon={<Crosshair size={15} />}
        onClick={p.onResetCamera}
      />
      <IconButton
        label="Plein écran"
        icon={<Maximize2 size={15} />}
        onClick={p.onFullscreen}
      />

      <div className="flex-1" />

      <Button size="sm" className="h-8 text-xs" onClick={p.onBat}>
        <FileCheck2 size={14} /> Générer BAT
      </Button>
      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={p.onAr}>
        <Smartphone size={14} /> Mode AR
      </Button>

      <IconButton
        label={p.layout.theme === "light" ? "Thème sombre" : "Thème clair"}
        icon={p.layout.theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
        onClick={p.onTheme}
      />

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Paramètres"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Settings2 size={15} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 space-y-3">
          <p className="font-display text-[11px] font-semibold tracking-widest uppercase">
            Paramètres de la scène
          </p>
          <NumericControl
            label="Vitesse de rotation"
            value={p.project.rotateSpeed}
            min={0.1}
            max={3}
            step={0.1}
            decimals={1}
            onChange={p.onRotateSpeed}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs">Ombres de contact</span>
            <Switch checked={p.project.shadows} onCheckedChange={p.onShadows} />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={p.onResetLayout}
          >
            <LayoutTemplate size={13} /> Réinitialiser la disposition
          </Button>
        </PopoverContent>
      </Popover>
    </header>
  );
}
