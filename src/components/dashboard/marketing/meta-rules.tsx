import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

/** Meta platform rules shown as helper text in the Marketing UI. */
export const META_RULES = {
  privateReply:
    "Meta allows one private reply per comment, sent within 7 days of the comment.",
  window24h:
    "Promo messages can only go to people who messaged you in the last 24 hours. Everyone else is skipped.",
  sendLimit: "Sojao sends at most 190 automated DMs per hour per Instagram account to stay well inside Meta's limits.",
} as const;

export function RuleHint({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-muted-foreground flex items-start gap-1.5 text-xs leading-snug",
        className,
      )}
    >
      <Info className="mt-px size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
