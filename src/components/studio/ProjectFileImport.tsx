import { useEffect, useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { readProjectFile } from "@/lib/studio/project";
import type { ProjectState } from "@/lib/studio/store";

export function ProjectFileImport({
  onImport,
  compact = false,
}: {
  onImport: (project: ProjectState) => void | Promise<void>;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);
  const [reading, setReading] = useState(false);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".studio3d,application/json"
        hidden
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setReading(true);
          try {
            await onImport(await readProjectFile(file));
            toast.success("Projet .studio3d chargé");
          } catch {
            toast.error("Fichier .studio3d illisible");
          } finally {
            if (mountedRef.current) setReading(false);
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        className={compact ? "shrink-0" : "w-full"}
        disabled={reading}
        onClick={() => inputRef.current?.click()}
      >
        <FileUp size={15} />
        {reading ? "Ouverture…" : "Importer un projet"}
      </Button>
    </>
  );
}