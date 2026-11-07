"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowUp } from "lucide-react";

/**
 * Floating "ask" input pinned to the bottom of the screen.
 * Colors follow the active theme (--brand / --primary / --glow).
 */
export function AskBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    router.push("/contact");
    setValue("");
  };

  return (
    <form
      onSubmit={submit}
      className="fixed bottom-4 left-4 right-20 z-[90] md:bottom-6 md:left-1/2 md:right-auto md:w-[min(620px,calc(100%-10rem))] md:-translate-x-1/2"
    >
      {/* gradient border */}
      <div className="rounded-full bg-[linear-gradient(110deg,var(--brand),var(--glow),var(--primary))] p-[1.5px] shadow-[0_12px_40px_-12px_var(--brand)]">
        <div className="bg-background/95 flex items-center gap-3 rounded-full py-1.5 pr-1.5 pl-3 backdrop-blur-md">
          {/* mini mascot */}
          <span aria-hidden className="relative flex size-8 shrink-0 items-center justify-center">
            <span className="mascot-blob absolute inset-1" />
            <span className="relative flex gap-1 pt-0.5">
              <span className="mascot-eye bg-background block h-1.5 w-1 rounded-full" />
              <span className="mascot-eye bg-background block h-1.5 w-1 rounded-full" />
            </span>
          </span>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type a goal · e.g. send a promo for the new collection"
            aria-label="Type a goal for Sojao"
            className="placeholder:text-muted-foreground text-foreground min-w-0 flex-1 bg-transparent text-sm outline-none md:text-base"
          />

          <button
            type="submit"
            aria-label="Send"
            className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 md:size-11"
          >
            <ArrowUp className="size-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
