import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { makeQr, shareUrl } from "@/lib/studio/project";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  url: string;
}

export function ShareDialog({ open, onOpenChange, title, description, url }: Props) {
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !url) return;
    let alive = true;
    makeQr(url).then((d) => { if (alive) setQr(d) });

    return () => {
      alive = false;
    };
  }, [open, url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Lien copié");

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          {qr && (
            <img
              src={qr}
              alt="QR Code du lien de partage"
              className="h-auto w-full max-w-44 rounded-lg border border-border bg-white p-2"
            />
          )}

          <div className="flex w-full items-center gap-2 rounded border border-border bg-muted px-2 py-1.5">
            <code className="num min-w-0 flex-1 truncate text-center text-sm">
              {url}
            </code>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0"
              onClick={handleCopy}
              aria-label={copied ? "Lien copié" : "Copier le lien"}
              title={copied ? "Lien copié" : "Copier le lien"}
            >
              {copied ? (
                <Check size={15} className="text-green-600" />
              ) : (
                <Copy size={15} />
              )}
            </Button>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 min-[380px]:grid-cols-2">
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const r = await shareUrl(title, url);

                if (r === "copied") {
                  toast.success("Lien copié");
                }
              }}
            >
              <Share2 size={13} />
              Partager
            </Button>

            <Button
              size="sm"
              onClick={() => window.open(url, "_blank")}
            >
              <ExternalLink size={13} />
              Ouvrir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
