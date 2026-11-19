"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Check, X } from "lucide-react";

import { api } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

export type SetupState = { instagramConnected: boolean; automationsOn: number; storeConnected: boolean; hasLeads: boolean };

/** "Finish setting up" card for Home. Each step is checked from real account state. */
export function SetupChecklist({ setup }: { setup: SetupState | null }) {
  const [hidden, setHidden] = useState(false);
  const [voice, setVoice] = useState<{ tone: boolean; faqs: boolean } | null>(null);
  useEffect(() => {
    try {
      setHidden(window.localStorage.getItem("sojao-setup-hidden") === "1");
    } catch {}
    void api<{ tone?: string | null; faqs?: unknown[] }>("/brand-profile")
      .then((b) => setVoice({ tone: !!b.tone?.trim(), faqs: (b.faqs?.length ?? 0) > 0 }))
      .catch(() => setVoice({ tone: false, faqs: false }));
  }, []);
  if (!setup || !voice) return null;

  const steps = [
    { label: "Connect Instagram", done: setup.instagramConnected, href: "/dashboard/settings?tab=channels" },
    { label: "Turn on your first automation", done: setup.automationsOn > 0, href: "/dashboard/marketing?tab=automations&new=1" },
    { label: "Teach Sojao your brand voice", done: voice.tone, href: "/dashboard/settings?tab=ai" },
    { label: "Add your common questions", done: voice.faqs, href: "/dashboard/settings?tab=ai" },
    { label: "Connect your store (optional)", done: setup.storeConnected, href: "/dashboard/marketing?tab=shop" },
  ];
  const done = steps.filter((s) => s.done).length;
  if (hidden || done === steps.length) return null;

  return (
    <section className="bg-card mb-6 rounded-2xl border p-5 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Finish setting up</h2>
          <p className="text-muted-foreground text-sm">
            {done} of {steps.length} done. A few more steps and your marketing replies will sound just like you.
          </p>
        </div>
        <button
          onClick={() => {
            setHidden(true);
            try {
              window.localStorage.setItem("sojao-setup-hidden", "1");
            } catch {}
          }}
          className="text-muted-foreground hover:text-foreground -m-2 p-2"
          aria-label="Hide setup checklist"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="bg-muted mt-4 h-2 overflow-hidden rounded-full">
        <div className="bg-brand h-full rounded-full" style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {steps.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className={cn("flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors", s.done ? "text-muted-foreground" : "hover:bg-accent font-medium")}
            >
              <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border", s.done && "bg-brand border-transparent text-white")}>
                {s.done && <Check className="size-3" />}
              </span>
              <span className={cn(s.done && "line-through")}>{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
