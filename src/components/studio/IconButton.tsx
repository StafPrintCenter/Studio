import type { ComponentProps, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props extends ComponentProps<"button"> {
  label: string;
  icon: ReactNode;
  active?: boolean;
  side?: "top" | "bottom" | "left" | "right";
}

export function IconButton({
  label,
  icon,
  active,
  side = "bottom",
  className,
  ...rest
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors duration-150",
            "hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            "disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
            active &&
            "border-primary/40 bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary",
            className,
          )}
          {...rest}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
