import Link from "next/link";

import { ArrowRight, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Shared "Coming soon" screen for modules that are not live yet
 * (Sales, Support, Live, Analytics, Billing, store connection...).
 */
export function ComingSoon({
  title,
  description,
  icon: Icon,
  compact = false,
}: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Smaller card for use inside a tab instead of a full page. */
  compact?: boolean;
}) {
  return (
    <section
      className={
        compact
          ? "bg-card rounded-2xl border p-6 text-center shadow-xs md:p-10"
          : "bg-card mx-auto mt-4 max-w-2xl rounded-3xl border p-8 text-center shadow-xs md:mt-10 md:p-14"
      }
    >
      <h1 className="sr-only">{title}</h1>
      <span className="bg-brand/12 mx-auto flex size-14 items-center justify-center rounded-2xl">
        {Icon ? <Icon className="size-6" /> : <Megaphone className="size-6" />}
      </span>
      <span className="bg-brand mt-5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white uppercase">
        Coming soon
      </span>
      <p className="font-display mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </p>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-base">
        {description}
      </p>
      <p className="text-muted-foreground mx-auto mt-4 max-w-md text-sm">
        Sojao starts with Marketing. It is live in beta today.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/marketing">
          Go to Marketing <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
}
