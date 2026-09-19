import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  decimals?: number;
  onChange: (value: number) => void;
}

/** Slider + click-to-edit numeric readout (Enter / blur commits). */
export function NumericControl({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  decimals = 2,
  onChange,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    const parsed = Number(draft.replace(",", "."));
    if (!Number.isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
    setEditing(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            autoFocus
            inputMode="decimal"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="num w-20 rounded border border-primary/60 bg-background px-1.5 py-0.5 text-right text-foreground outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(value.toFixed(decimals));
              setEditing(true);
            }}
            title="Cliquer pour saisir la valeur"
            className={cn(
              "num w-20 rounded border border-border/70 bg-background/60 px-1.5 py-0.5 text-right text-foreground",
              "transition-colors hover:border-primary/60 hover:text-primary",
            )}
          >
            {value.toFixed(decimals)}
            {unit}
          </button>
        )}
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0] ?? value)}
      />
    </div>
  );
}
