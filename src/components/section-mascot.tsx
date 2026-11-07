"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const DEFAULT_ACTIONS = [
  "replying to a DM",
  "sending a checkout link",
  "following up",
  "tracking an order",
  "thinking",
];

/**
 * Sojao AI mascot: a morphing gradient blob with blinking eyes and a
 * status pill that cycles through actions. Colors come from the active
 * theme (--brand, --primary, --glow), so it changes with the color picker.
 */
export function SectionMascot({
  actions = DEFAULT_ACTIONS,
  className,
}: {
  actions?: string[];
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % actions.length), 2200);
    return () => clearInterval(id);
  }, [actions.length]);

  return (
    <div
      aria-hidden
      className={cn(
        "relative mx-auto mb-10 flex w-fit flex-col items-center select-none md:mb-14",
        className,
      )}
    >
      {/* blob character */}
      <span className="mascot-float relative block size-20 md:size-24">
        <span className="mascot-blob absolute inset-0 shadow-[0_10px_40px_-8px_var(--brand)]" />
        <span className="absolute inset-0 flex items-center justify-center gap-[18%] pt-[6%]">
          <span className="mascot-eye bg-background block h-[16%] w-[11%] rounded-full" />
          <span className="mascot-eye bg-background block h-[16%] w-[11%] rounded-full" />
        </span>
      </span>

      {/* status pill */}
      <span className="bg-background text-muted-foreground mt-4 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs whitespace-nowrap shadow-sm">
        <span className="mascot-dot bg-brand size-1.5 rounded-full" />
        <span className="mascot-dot bg-primary size-1.5 rounded-full [animation-delay:150ms]" />
        <span className="mascot-dot bg-glow size-1.5 rounded-full [animation-delay:300ms]" />
        <span
          key={i}
          className="animate-in fade-in slide-in-from-bottom-1 ml-0.5 duration-300"
        >
          {actions[i]}
        </span>
      </span>
    </div>
  );
}
