import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <p className="text-muted-foreground flex items-center gap-2 py-10 text-sm" role="status">
      <Loader2 className="size-4 animate-spin" /> {label}
    </p>
  );
}

export function ErrorNote({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm">
      <AlertCircle className="size-4 shrink-0 text-rose-600" />
      <span className="flex-1">{text}</span>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

export function Empty({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-2xl border border-dashed p-10 text-center text-sm">
      <p className="text-foreground font-medium">{title}</p>
      <p className="max-w-md">{text}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
