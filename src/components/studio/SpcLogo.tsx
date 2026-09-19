import logos from "@/assets/logos.json";
import { useStudio } from "@/lib/studio/store";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/site";

export function SpcMobLogo({ className }: { className?: string }) {
  const theme = useStudio((s) => s.layout.theme);
  const dark = theme !== "light";

  return (
    <img
      src={dark ? logos.mw : logos.mc}
      alt={`Logo ${SITE.tool}`}
      className={cn("object-contain", className)}
      loading="eager"
      decoding="async"
    />
  );
}

export function SpcDeskLogo({ className }: { className?: string }) {
  const theme = useStudio((s) => s.layout.theme);
  const dark = theme !== "light";

  return (
    <img
      src={dark ? logos.dw : logos.dc}
      alt={`Logo ${SITE.tool}`}
      className={cn("object-contain", className)}
      loading="eager"
      decoding="async"
    />
  );
}