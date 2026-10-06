import { useMemo, useState } from "react";
import { Layers, Ruler, Search, SlidersHorizontal, X } from "lucide-react";
import { MODELS, getFormatType, getModel, getSupportType, resolvePreset, type ModelKind } from "@/lib/studio/models";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  current: ModelKind;
  preset: number;
  customDims: { w: number; h: number; d: number } | undefined;
  onSelect: (id: ModelKind) => void;
  onPreset: (index: number) => void;
  onCustomDims: (dims: { w: number; h: number; d: number }) => void;
}

const ALL = "all";

export function CatalogPanel({ current, preset, customDims, onSelect, onPreset, onCustomDims }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [format, setFormat] = useState(ALL);
  const [supportType, setSupportType] = useState(ALL);
  const categories = [...new Set(MODELS.map((m) => m.category))];
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");
  const filtered = useMemo(
    () => MODELS.filter((model) => {
      const haystack = [model.name, model.description, model.material, model.category, ...model.presets.map((item) => item.label)]
        .join(" ")
        .toLocaleLowerCase("fr");
      return (!normalizedQuery || haystack.includes(normalizedQuery))
        && (category === ALL || model.category === category)
        && (format === ALL || getFormatType(model) === format)
        && (supportType === ALL || getSupportType(model) === supportType);
    }),
    [category, format, normalizedQuery, supportType],
  );
  const visibleCategories = categories.filter((item) => filtered.some((model) => model.category === item));
  const filtersActive = Boolean(normalizedQuery || category !== ALL || format !== ALL || supportType !== ALL);
  const currentModel = getModel(current);
  const currentDimensions = customDims ?? resolvePreset(currentModel, preset).dims;

  const resetFilters = () => {
    setQuery("");
    setCategory(ALL);
    setFormat(ALL);
    setSupportType(ALL);
  };

  const updateDimension = (key: "w" | "h" | "d", raw: string) => {
    const value = Number(raw.replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) return;
    onCustomDims({ ...currentDimensions, [key]: Math.min(1000, value) });
  };

  return (
    <div className="p-2">
      <div className="sticky top-0 z-10 mb-3 space-y-2 border-b border-border bg-surface pb-3">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un support…"
            aria-label="Rechercher dans le catalogue"
            className="h-8 pr-8 pl-8 text-xs"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Effacer la recherche"
              onClick={() => setQuery("")}
              className="absolute top-0 right-0 h-8 w-8 text-muted-foreground"
            >
              <X size={13} />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label="Filtrer par catégorie" className="h-8 text-[11px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Toutes les catégories</SelectItem>
              {categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-1.5">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger aria-label="Filtrer par format" className="h-8 text-[11px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous formats</SelectItem>
                {(["Portrait", "Paysage", "Carré", "Volume"] as const).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={supportType} onValueChange={setSupportType}>
              <SelectTrigger aria-label="Filtrer par type de support" className="h-8 text-[11px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous types</SelectItem>
                {(["Souple", "Rigide", "Volume", "Textile"] as const).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{filtered.length} support{filtered.length > 1 ? "s" : ""}</span>
          {filtersActive && <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="h-6 px-2 text-[10px]"><SlidersHorizontal size={11} /> Réinitialiser</Button>}
        </div>
      </div>

      {visibleCategories.map((cat) => (
        <div key={cat} className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            <Layers size={11} />
            {cat}
          </div>
          <div className="space-y-1">
            {filtered.filter((m) => m.category === cat).map((m) => {
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
                    <div className="mt-1 space-y-2 rounded-md border border-border/60 bg-background/35 p-2">
                      <div className="flex flex-wrap gap-1">
                        {m.presets.map((p, i) => (
                          <Button
                            key={p.label}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onPreset(i)}
                            className={cn(
                              "num h-6 whitespace-normal px-1.5 py-0 text-[10px]",
                              !customDims && i === preset && "border-primary/60 bg-primary/15 text-primary",
                            )}
                          >
                            {p.label}
                          </Button>
                        ))}
                      </div>
                      <div className="border-t border-border/60 pt-2">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">Dimensions personnalisées</span>
                          {customDims && <span className="num text-[9px] text-primary">ACTIF</span>}
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {([['w', 'L'], ['h', 'H'], ['d', 'P']] as const).map(([key, label]) => (
                            <label key={key} className="space-y-1 text-[9px] text-muted-foreground">
                              <span>{label} (cm)</span>
                              <Input
                                type="number"
                                inputMode="decimal"
                                min={0.1}
                                max={1000}
                                step={0.1}
                                value={currentDimensions[key]}
                                aria-label={`${label === 'L' ? 'Largeur' : label === 'H' ? 'Hauteur' : 'Profondeur'} en centimètres`}
                                onChange={(event) => updateDimension(key, event.target.value)}
                                className="num h-7 px-1.5 text-[10px]"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
          <Search size={22} className="text-muted-foreground" />
          <div><p className="text-xs font-medium">Aucun support trouvé</p><p className="mt-1 text-[11px] text-muted-foreground">Modifiez la recherche ou les filtres.</p></div>
          <Button type="button" variant="outline" size="sm" onClick={resetFilters}>Réinitialiser</Button>
        </div>
      )}
    </div>
  );
}
