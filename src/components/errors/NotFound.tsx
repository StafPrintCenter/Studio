import { Link } from "@tanstack/react-router";
import { RotateCcw, ArrowLeft, Gamepad2 } from "lucide-react";

export function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-4 md:p-8 select-none bg-background text-foreground overflow-hidden">
      {/* Motifs d'arrière-plan */}
      <div className="pointer-events-none absolute inset-0 grid-field opacity-50" />

      {/* Header minimaliste */}
      <header className="relative z-10 mx-auto flex w-full max-w-2xl items-center justify-between font-mono text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          SYSTEM_ERR // CODE_404
        </span>
        <span>CONSOLE_PORTABLE_V1</span>
      </header>

      {/* Contenu principal : La Manette de Jeu */}
      <main className="relative z-10 my-auto mx-auto flex w-full max-w-lg flex-col items-center py-6">

        {/* BOÎTIER DE LA MANETTE */}
        <div className="relative w-full rounded-3xl border-2 border-border bg-card p-6 shadow-2xl backdrop-blur-md sm:p-8">

          {/* LED de statut sur le boîtier */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                POWER
              </span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              SPC-ARCADE
            </div>
          </div>

          {/* ÉCRAN DE LA MANETTE */}
          <div className="relative rounded-2xl border-2 border-slate-800 bg-slate-950 p-5 shadow-inner text-emerald-400 font-mono">
            {/* Effet balayage d'écran / Scanlines */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-size-[100%_4px] opacity-40 rounded-2xl" />

            {/* En-tête de l'écran */}
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2 mb-3 text-[11px] text-emerald-600">
              <span className="flex items-center gap-1">
                <Gamepad2 size={12} className="text-destructive" /> ERROR_404
              </span>
              <span>NO_SIGNAL</span>
            </div>

            {/* Contenu affiché sur l'écran */}
            <div className="space-y-2 text-center py-2">
              <p className="text-xs text-destructive font-bold uppercase tracking-widest">
                [ GAME OVER ]
              </p>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-300 font-display">
                Niveau Introuvable
              </h1>
              <p className="text-xs text-emerald-500/90 leading-relaxed max-w-xs mx-auto">
                La zone demandée n'est pas chargée dans la mémoire de la console.
              </p>
            </div>

            {/* Pied d'écran avec prompt clignotant */}
            <div className="mt-3 pt-2 border-t border-emerald-900/60 flex justify-between items-center text-[10px] text-emerald-600">
              <span>STAGE_MISSING</span>
              <span>&gt; PRESS_START_</span>
            </div>
          </div>

          {/* COMMANDES DE LA MANETTE (Touches & Boutons) */}
          <div className="mt-8 grid grid-cols-2 items-center gap-6">

            {/* Croix directionnelle (D-Pad) */}
            <div className="flex justify-center">
              <div className="relative h-24 w-24">
                {/* Centre fixe */}
                <div className="absolute inset-0 m-auto h-8 w-8 bg-muted-foreground/30 rounded-sm" />
                {/* Haut */}
                <div className="absolute top-0 left-8 h-8 w-8 bg-muted border border-border rounded-t-md shadow-sm" />
                {/* Bas */}
                <div className="absolute bottom-0 left-8 h-8 w-8 bg-muted border border-border rounded-b-md shadow-sm" />
                {/* Gauche */}
                <div className="absolute top-8 left-0 h-8 w-8 bg-muted border border-border rounded-l-md shadow-sm" />
                {/* Droite */}
                <div className="absolute top-8 right-0 h-8 w-8 bg-muted border border-border rounded-r-md shadow-sm" />
              </div>
            </div>

            {/* Boutons d'action (A / B) */}
            <div className="flex items-center justify-center gap-3 rotate-12">
              {/* Bouton B (Retour) */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => window.history.back()}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted shadow-md active:translate-y-0.5 active:shadow-none cursor-pointer transition"
                  title="Retour"
                >
                  <ArrowLeft size={16} className="text-foreground" />
                </button>
                <span className="font-mono text-[10px] font-bold text-muted-foreground">R</span>
              </div>

              {/* Bouton A (Accueil) */}
              <div className="flex flex-col items-center gap-1">
                <Link
                  to="/"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary shadow-md shadow-primary/20 text-primary-foreground active:translate-y-0.5 active:shadow-none cursor-pointer transition"
                  title="Accueil"
                >
                  <RotateCcw size={16} />
                </Link>
                <span className="font-mono text-[10px] font-bold text-muted-foreground">A</span>
              </div>
            </div>

          </div>

          {/* Boutons SELECT / START au centre en bas */}
          <div className="mt-8 flex justify-center items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => window.history.back()}
                className="h-3 w-10 rounded-full bg-muted-foreground/40 border border-border active:opacity-60 cursor-pointer"
              />
              <span className="font-mono text-[9px] font-bold text-muted-foreground">RETOUR</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Link
                to="/"
                className="h-3 w-10 rounded-full bg-primary/70 border border-primary active:opacity-60 cursor-pointer"
              />
              <span className="font-mono text-[9px] font-bold text-muted-foreground">Accueil</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}