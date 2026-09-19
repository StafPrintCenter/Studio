import { useRouter, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Zap, RotateCcw, LayoutGrid, Radio, ShieldAlert } from "lucide-react";
import { reportError } from "@/lib/error/reporting";

export function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    reportError(error, { boundary: "spc_arcade_execution_failure" });
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-8 font-sans text-foreground overflow-hidden">

      {/* Surcharge Thermique Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-destructive/20 blur-[130px] pointer-events-none" />

      {/* Main Glass Panel */}
      <div className="relative z-10 w-full max-w-2xl rounded-4xl border border-destructive/30 bg-card/40 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">

        {/* Warning Indicator */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-1.5 text-xs font-bold text-destructive">
            <Zap className="size-3.5 animate-bounce" />
            <span>SURCHARGE DU SYSTÈME</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Radio className="size-3 text-destructive animate-pulse" />
            <span>CRITICAL_FAIL</span>
          </div>
        </div>

        {/* Core Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive shadow-inner">
              <ShieldAlert className="size-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Anomalie lors du défi
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Le moteur de jeu a interrompu la session suite à une erreur critique.
              </p>
            </div>
          </div>

          {/* Minimalist Error Container */}
          <div className="rounded-2xl border border-border/80 bg-background/80 p-5 backdrop-blur-md shadow-inner space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground border-b border-border/50 pb-2">
              <span>MODULE EXCEPTION</span>
              <span className="text-rare font-bold">{error?.name || "RuntimeError"}</span>
            </div>
            <p className="font-mono text-xs text-destructive font-semibold pt-1 leading-relaxed">
              {error?.message || "Une erreur inattendue est survenue pendant l'exécution du composant."}
            </p>
            {error?.stack && (
              <div className="mt-2 pt-2 border-t border-border/40 font-mono text-[10px] text-muted-foreground max-h-28 overflow-y-auto whitespace-pre-wrap">
                {error.stack}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/80 bg-background/80 hover:bg-muted px-6 py-3.5 text-xs font-bold text-foreground transition active:scale-95"
          >
            <LayoutGrid className="size-4 text-muted-foreground" />
            Menu des Défis
          </Link>

          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-destructive px-6 py-3.5 text-xs font-bold text-destructive-foreground shadow-lg shadow-destructive/25 transition hover:opacity-90 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="size-4" />
            Relancer la simulation
          </button>
        </div>

      </div>
    </div>
  );
}