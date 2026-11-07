"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type MascotMood = "sleep" | "awake" | "think" | "work";
export type MascotAction = string | { label: string; mood: MascotMood };

const DEFAULT_ACTIONS: MascotAction[] = [
  "sleeping",
  "replying to a DM",
  "sending a checkout link",
  "thinking",
  "following up",
  "tracking an order",
];

/** Picks an expression from the action text when no mood is given. */
function moodFor(label: string): MascotMood {
  const t = label.toLowerCase();
  if (/sleep|night|rest|offline/.test(t)) return "sleep";
  if (/think|plan|warming|analy/.test(t)) return "think";
  if (/repl|send|writ|track|link|order|typing|check/.test(t)) return "work";
  return "awake";
}

const fade = (on: boolean) => ({
  opacity: on ? 1 : 0,
  transition: "opacity 450ms ease",
});

/**
 * Sojao AI mascot: the face from the logo's "o" inside a morphing gradient
 * halo. Its expression follows the status pill: asleep (zzz), awake
 * (blinking), thinking (looks up, thought bubble) or working (focused,
 * typing bubble). Halo colors come from the active theme.
 */
export function SectionMascot({
  actions = DEFAULT_ACTIONS,
  className,
}: {
  actions?: MascotAction[];
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % actions.length), 2600);
    return () => clearInterval(id);
  }, [actions.length]);

  const action = actions[i];
  const label = typeof action === "string" ? action : action.label;
  const mood = typeof action === "string" ? moodFor(action) : action.mood;

  return (
    <div
      aria-hidden
      className={cn(
        "relative mx-auto mb-10 flex w-fit flex-col items-center select-none md:mb-14",
        className,
      )}
    >
      <span className="mascot-float relative block size-20 md:size-24">
        {/* animated gradient halo (theme colors) */}
        <span className="mascot-blob absolute -inset-1.5 opacity-90 shadow-[0_10px_40px_-8px_var(--brand)]" />
        <MascotFace mood={mood} />

        {/* sleep: zzz rising */}
        <span
          style={fade(mood === "sleep")}
          className="text-brand pointer-events-none absolute -top-4 -right-2 font-bold md:-right-3"
        >
          <span className="mascot-z absolute top-6 left-0 text-[11px]">z</span>
          <span className="mascot-z absolute top-3 left-2 text-sm [animation-delay:0.8s]">z</span>
          <span className="mascot-z absolute top-0 left-4 text-lg [animation-delay:1.6s]">Z</span>
        </span>

        {/* think: thought bubble */}
        <span
          style={fade(mood === "think")}
          className="pointer-events-none absolute -top-6 -right-6 md:-right-7"
        >
          <span className="bg-background absolute top-8 left-0 size-1.5 rounded-full border" />
          <span className="bg-background absolute top-5 left-1.5 size-2.5 rounded-full border" />
          <span className="bg-background text-brand absolute top-0 left-3 flex h-5 w-7 items-center justify-center rounded-full border text-[11px] font-bold shadow-sm">
            ?
          </span>
        </span>

        {/* work: typing bubble */}
        <span
          style={fade(mood === "work")}
          className="bg-background pointer-events-none absolute -top-3 -right-7 flex items-center gap-0.5 rounded-full rounded-bl-sm border px-1.5 py-1 shadow-sm md:-right-8"
        >
          <span className="mascot-dot bg-brand size-1 rounded-full" />
          <span className="mascot-dot bg-brand size-1 rounded-full [animation-delay:150ms]" />
          <span className="mascot-dot bg-brand size-1 rounded-full [animation-delay:300ms]" />
        </span>

        {/* awake: sparkle */}
        <span
          style={fade(mood === "awake")}
          className="text-brand pointer-events-none absolute -top-2 -right-3 text-base"
        >
          <span className="mascot-twinkle block">✦</span>
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
          {label}
        </span>
      </span>
    </div>
  );
}

const INK = "#14171d";

/** One open eye; pupil offset (dx, dy) sets where it looks. */
function OpenEye({
  cx,
  dx = 0,
  dy = 0,
  ry = 6.5,
}: {
  cx: number;
  dx?: number;
  dy?: number;
  ry?: number;
}) {
  return (
    <g>
      <ellipse cx={cx} cy="62" rx="6" ry={ry} fill="#ffffff" />
      <circle
        cx={cx + dx}
        cy={62 + dy}
        r="3.8"
        fill={INK}
        style={{ transition: "cx 400ms ease, cy 400ms ease" }}
      />
      <circle cx={cx + dx + 1.4} cy={62 + dy - 1.5} r="1.2" fill="#ffffff" />
    </g>
  );
}

function MascotFace({ mood }: { mood: MascotMood }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="mascot-breathe absolute inset-0 size-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]"
    >
      <defs>
        <radialGradient id="sm-skin" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#fbeee4" />
          <stop offset="60%" stopColor="#f1d6c4" />
          <stop offset="100%" stopColor="#d9b39b" />
        </radialGradient>
        <linearGradient id="sm-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b303a" />
          <stop offset="100%" stopColor="#0e1015" />
        </linearGradient>
      </defs>
      {/* ring (follows theme like the logo) */}
      <circle cx="50" cy="50" r="48" className="fill-logo-text" />
      <circle cx="50" cy="50" r="48" fill="#ffffff" opacity="0.12" />
      {/* face */}
      <circle cx="50" cy="53" r="36" fill="url(#sm-skin)" />
      {/* hair */}
      <path
        d="M14 52 C13 26 30 15 50 15 C70 15 87 26 86 52 C77 48 68 41 64 32 C58 41 46 46 33 46 C26 46 20 48 14 52 Z"
        fill="url(#sm-hair)"
      />
      <path
        d="M30 24 C38 19 50 18 58 21"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.22"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* cheeks (warmer when asleep) */}
      <g opacity={mood === "sleep" ? 0.5 : 0.35} style={{ transition: "opacity 450ms" }}>
        <ellipse cx="29" cy="72" rx="6" ry="3.5" fill="#f08a7a" />
        <ellipse cx="71" cy="72" rx="6" ry="3.5" fill="#f08a7a" />
      </g>

      {/* ---------- SLEEP ---------- */}
      <g style={fade(mood === "sleep")}>
        <g fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
          <path d="M30 62 Q37 68 44 62" />
          <path d="M56 62 Q63 68 70 62" />
          <path d="M32 65 l-2 2.5 M42 65 l2 2.5 M58 65 l-2 2.5 M68 65 l2 2.5" strokeWidth="1.6" />
        </g>
        <ellipse className="mascot-mouth" cx="50" cy="77" rx="3" ry="1.6" fill="#7a3b33" />
      </g>

      {/* ---------- AWAKE ---------- */}
      <g style={fade(mood === "awake")}>
        <g className="mascot-eye">
          <OpenEye cx={37} />
          <OpenEye cx={63} />
        </g>
        <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
          <path d="M30 52 Q37 48 44 51" />
          <path d="M56 51 Q63 48 70 52" />
        </g>
        <path d="M42 74 Q50 82 58 74" fill="#7a3b33" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      </g>

      {/* ---------- THINK ---------- */}
      <g style={fade(mood === "think")}>
        <g className="mascot-eye mascot-eye-slow">
          <OpenEye cx={37} dx={2} dy={-2.5} />
          <OpenEye cx={63} dx={2} dy={-2.5} />
        </g>
        <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
          <path d="M30 52 L44 52" />
          <path d="M56 49 Q63 44 70 48" />
        </g>
        <path d="M45 77 Q50 75 56 76.5" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* ---------- WORK ---------- */}
      <g style={fade(mood === "work")}>
        <g className="mascot-eye mascot-eye-fast">
          <OpenEye cx={37} dx={-1} dy={1.5} ry={5} />
          <OpenEye cx={63} dx={-1} dy={1.5} ry={5} />
        </g>
        {/* focused lids + brows */}
        <g fill="none" stroke={INK} strokeLinecap="round">
          <path d="M30.5 58.5 Q37 56 43.5 58.5" strokeWidth="2.2" />
          <path d="M56.5 58.5 Q63 56 69.5 58.5" strokeWidth="2.2" />
          <path d="M30 51 Q37 49 44 52" strokeWidth="2" />
          <path d="M56 52 Q63 49 70 51" strokeWidth="2" />
        </g>
        <path d="M44 75 Q50 79 56 75" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* face highlight */}
      <ellipse cx="38" cy="52" rx="10" ry="5" fill="#ffffff" opacity="0.15" />
    </svg>
  );
}
