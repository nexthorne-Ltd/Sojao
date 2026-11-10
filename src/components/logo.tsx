import { cn } from "@/lib/utils";

/**
 * Sojao AI wordmark. Built from text + SVG (not an image) so it follows
 * the active color theme:
 *  - "sojao" + face ring use --logo-text
 *  - "ai" + the zzz use --brand
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-label="Sojao AI"
      role="img"
      className={cn(
        "font-logo inline-flex items-baseline leading-none font-semibold tracking-tight whitespace-nowrap select-none",
        className,
      )}
    >
      <Glyph text="s" className="text-logo-text" />
      <SleepyFace />
      <Glyph text="jao" className="text-logo-text" />
      <Glyph text="ai" className="text-brand ml-[0.22em]" />
      <span className="sr-only">Sojao AI</span>
    </span>
  );
}

/**
 * Visible letters are drawn with CSS `content` (not real text), so copy/paste,
 * search engines and screen readers get "Sojao AI" instead of "sjaoai" (the
 * sleepy face stands in for the first "o").
 */
function Glyph({ text, className }: { text: string; className: string }) {
  return (
    <span
      aria-hidden
      data-glyph={text}
      className={cn("before:content-[attr(data-glyph)]", className)}
    />
  );
}

function SleepyFace() {
  return (
    <span
      aria-hidden
      className="relative mx-[0.02em] inline-block size-[0.6em] translate-y-[0.03em]"
    >
      {/* zzz */}
      <svg
        viewBox="0 0 60 50"
        className="text-brand absolute -top-[0.62em] left-[0.12em] w-[0.5em] overflow-visible"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 28h12L4 42h12" strokeWidth="5" />
          <path d="M22 36h7l-7 8h7" strokeWidth="3.5" />
          <path d="M38 4h18L38 24h18" strokeWidth="6" />
        </g>
      </svg>
      {/* ring + face */}
      <svg viewBox="0 0 100 100" className="block size-full">
        <circle cx="50" cy="50" r="50" className="fill-logo-text" />
        <circle cx="50" cy="53" r="35" fill="#e4e9ee" />
        {/* hair */}
        <path
          d="M15 50 C15 26 31 16 50 16 C69 16 85 26 85 50 C76 47 68 40 64 32 C58 41 46 46 33 46 C27 46 21 48 15 50 Z"
          fill="#14171d"
        />
        {/* closed eyes */}
        <g
          fill="none"
          stroke="#14171d"
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          <path d="M30 62 Q37 68 44 62" />
          <path d="M56 62 Q63 68 70 62" />
        </g>
        {/* mouth */}
        <path
          d="M46 76 Q50 78 54 76"
          fill="none"
          stroke="#14171d"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
