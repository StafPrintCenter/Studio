import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "./IconButton";
import { cn } from "@/lib/utils";

interface Props {
  side: "left" | "right";
  title: string;
  width: number;
  collapsed: boolean;
  onWidth: (w: number) => void;
  onCollapsed: (c: boolean) => void;
  children: ReactNode;
}

const MIN = 220;
const MAX = 520;

export function SidePanel({
  side,
  title,
  width,
  collapsed,
  onWidth,
  onCollapsed,
  children,
}: Props) {
  const dragging = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const w = side === "left" ? e.clientX : window.innerWidth - e.clientX;
      onWidth(Math.min(MAX, Math.max(MIN, Math.round(w))));
    };
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [side, onWidth]);

  if (collapsed) {
    return (
      <div
        className={cn(
          "flex w-9 shrink-0 flex-col items-center gap-2 border-border bg-sidebar py-2",
          side === "left" ? "border-r" : "border-l",
        )}
      >
        <IconButton
          label={`Ouvrir ${title}`}
          side={side === "left" ? "right" : "left"}
          icon={side === "left" ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          onClick={() => onCollapsed(false)}
        />
        <span
          className="mt-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          {title}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 flex-col border-border bg-sidebar",
        side === "left" ? "border-r" : "border-l",
      )}
      style={{ width }}
    >
      <div className="flex h-9 items-center justify-between border-b border-border px-2">
        <span className="font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </span>
        <IconButton
          label="Réduire le panneau"
          side={side === "left" ? "right" : "left"}
          icon={side === "left" ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          onClick={() => onCollapsed(true)}
        />
      </div>
      <div className="panel-scroll min-h-0 flex-1 overflow-y-auto">{children}</div>
      <div
        role="separator"
        aria-orientation="vertical"
        onPointerDown={onPointerDown}
        onDoubleClick={() => onWidth(side === "left" ? 276 : 340)}
        className={cn(
          "absolute top-0 z-20 h-full w-1.5 cursor-col-resize transition-colors hover:bg-primary/50",
          side === "left" ? "-right-0.5" : "-left-0.5",
        )}
      />
    </div>
  );
}
