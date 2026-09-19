import { Layers, Ruler } from "lucide-react";
import { MODELS, type ModelKind } from "@/lib/studio/models";
import { cn } from "@/lib/utils";

interface Props {
  current: ModelKind;
  preset: number;
  onSelect: (id: ModelKind) => void;
  onPreset: (index: number) => void;
}

export function CatalogPanel({ current, preset, onSelect, onPreset }: Props) {
  const categories = [...new Set(MODELS.map((m) => m.category))];

  return (
    <div className="p-2">
      {categories.map((cat) => (
        <div key={cat} className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            <Layers size={11} />
            {cat}
          </div>
          <div className="space-y-1">
            {MODELS.filter((m) => m.category === cat).map((m) => {
              const active = m.id === current;
              return (
                <div key={m.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(m.id)}
                    className={cn(
                      "w-full rounded-md border px-2.5 py-2 text-left transition-colors duration-150",
                      active
                        ? "border-primary/50 bg-primary/10"
                        : "border-border/60 bg-surface/40 hover:border-border hover:bg-accent/60",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "font-display text-[13px] font-semibold",
                          active ? "text-primary" : "text-foreground",
                        )}
                      >
                        {m.name}
                      </span>
                      <span className="num text-muted-foreground">
                        {m.dims.w}×{m.dims.h}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                      {m.description}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Ruler size={10} />
                      {m.material}
                    </div>
                  </button>
                  {active && (
                    <div className="mt-1 flex flex-wrap gap-1 pl-1">
                      {m.presets.map((p, i) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => onPreset(i)}
                          className={cn(
                            "num rounded border px-1.5 py-0.5 transition-colors",
                            i === preset
                              ? "border-primary/60 bg-primary/15 text-primary"
                              : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
