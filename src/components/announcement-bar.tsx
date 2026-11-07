import Link from "next/link";

import { ArrowRight } from "lucide-react";

/** Fixed strip pinned above the navbar. Tinted with the active theme's --brand. */
export function AnnouncementBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-10 items-center justify-center bg-[color-mix(in_oklch,var(--brand)_22%,#07090f)] px-4 text-white">
      <Link
        href="/signup"
        className="group flex min-w-0 items-center gap-3 text-xs md:text-sm"
      >
        <span className="bg-brand shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white shadow-[0_0_0_2px_color-mix(in_oklch,var(--brand)_45%,transparent)]">
          NEW
        </span>
        <span className="truncate">
          <span className="font-semibold">Join the beta</span>
          <span className="text-white/70 max-sm:hidden">
            {" "}
            – first 3 months free, then 50% off for founding brands
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
