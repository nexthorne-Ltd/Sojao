"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowUp, X } from "lucide-react";

/**
 * "Type a goal" helper for the dashboard only.
 * Collapsed to a small corner button by default so it never covers page
 * content, the footer or form fields. Click it to open the goal box; the
 * goal is handed to the Marketing planner.
 * Colors follow the active theme (--brand / --primary / --glow).
 */
export function AskBar() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/dashboard/marketing?goal=${encodeURIComponent(value.trim())}`);
    setValue("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Type a marketing goal for Sojao"
        title="Type a goal"
        className="fixed right-4 bottom-20 z-[90] rounded-full bg-[linear-gradient(110deg,var(--brand),var(--glow),var(--primary))] p-[1.5px] shadow-[0_12px_40px_-12px_var(--brand)] transition-transform hover:scale-105 md:right-6 md:bottom-24"
      >
        <span className="bg-background/95 flex size-12 items-center justify-center rounded-full backdrop-blur-md">
          <Mascot />
        </span>
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="fixed right-4 bottom-20 left-4 z-[90] md:right-6 md:bottom-24 md:left-auto md:w-[min(520px,calc(100%-3rem))]"
    >
      {/* gradient border */}
      <div className="rounded-full bg-[linear-gradient(110deg,var(--brand),var(--glow),var(--primary))] p-[1.5px] shadow-[0_12px_40px_-12px_var(--brand)]">
        <div className="bg-background/95 flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-3 backdrop-blur-md">
          <Mascot />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type a goal · e.g. promo for the new collection"
            aria-label="Type a marketing goal for Sojao"
            className="placeholder:text-muted-foreground text-foreground min-w-0 flex-1 bg-transparent text-sm outline-none md:text-base"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close goal box"
            className="text-muted-foreground hover:text-foreground flex size-10 shrink-0 items-center justify-center rounded-full"
          >
            <X className="size-4" />
          </button>
          <button
            type="submit"
            aria-label="Plan it"
            className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowUp className="size-5" />
          </button>
        </div>
      </div>
    </form>
  );
}

function Mascot() {
  return (
    <span aria-hidden className="relative flex size-8 shrink-0 items-center justify-center">
      <span className="mascot-blob absolute inset-1" />
      <span className="relative flex gap-1 pt-0.5">
        <span className="mascot-eye bg-background block h-1.5 w-1 rounded-full" />
        <span className="mascot-eye bg-background block h-1.5 w-1 rounded-full" />
      </span>
    </span>
  );
}
