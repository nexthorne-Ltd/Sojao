"use client";

import { useState } from "react";

import Link from "next/link";

import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Connect Instagram", done: true, href: "/dashboard/settings?tab=channels" },
  { label: "Connect your store", done: true, href: "/dashboard/settings?tab=store" },
  { label: "Turn on your first automation", done: true, href: "/dashboard/marketing" },
  { label: "Connect WhatsApp", done: false, href: "/dashboard/settings?tab=channels" },
  { label: "Add your common questions", done: false, href: "/dashboard/settings?tab=ai" },
];

/** "Finish setting up" card for the Overview page. */
export function SetupChecklist() {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  const done = STEPS.filter((s) => s.done).length;

  return (
    <section className="bg-card mb-6 rounded-2xl border p-5 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Finish setting up</h2>
          <p className="text-muted-foreground text-sm">
            {done} of {STEPS.length} done. A few more steps and Sojao can do
            even more for you.
          </p>
        </div>
        <button
          onClick={() => setHidden(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Hide setup checklist"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="bg-muted mt-4 h-2 overflow-hidden rounded-full">
        <div
          className="bg-brand h-full rounded-full"
          style={{ width: `${(done / STEPS.length) * 100}%` }}
        />
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {STEPS.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                s.done ? "text-muted-foreground" : "hover:bg-accent font-medium",
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  s.done && "bg-brand border-transparent text-white",
                )}
              >
                {s.done && <Check className="size-3" />}
              </span>
              <span className={cn(s.done && "line-through")}>{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Button asChild size="sm" variant="outline" className="mt-4">
        <Link href="/onboarding">Open setup guide</Link>
      </Button>
    </section>
  );
}
