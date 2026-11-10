"use client";

import { useEffect, useState } from "react";

import { CalendarCheck, Check, CheckCheck, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

/** Each loop tells one tiny story: DM arrives → Sojao types → replies → booking lands. */
const STORIES = [
  {
    name: "Ayesha K.",
    initials: "AK",
    hue: 330,
    msg: "Can I book an appointment?",
    reply: "Sure! Today at 5 PM works for you? 💇‍♀️",
    title: "New Booking",
    sub: "Salon Appointment",
    meta: "Today • 5 PM",
  },
  {
    name: "Bilal R.",
    initials: "BR",
    hue: 200,
    msg: "Is the black hoodie in stock?",
    reply: "Yes! Size M & L left. Here’s your link 🛍️",
    title: "New Order",
    sub: "Black Hoodie · Size M",
    meta: "Paid • Rs 4,500",
  },
  {
    name: "Sara M.",
    initials: "SM",
    hue: 150,
    msg: "Do you deliver to Lahore?",
    reply: "Yes, 2-day delivery. Shall I confirm it? 🚚",
    title: "Order Confirmed",
    sub: "Express Delivery · Lahore",
    meta: "Arrives in 2 days",
  },
];

// phase durations (ms): 0 DM arrives, 1 typing, 2 reply sent, 3 booking + point, 4 hold
const PHASES = [1500, 1700, 1500, 2600, 1400];

const card =
  "rounded-[1.1em] border border-white/60 bg-white/90 text-slate-900 shadow-[0_18px_40px_-12px_rgba(2,12,40,0.55)] backdrop-blur-md";

export function HeroScene({ className }: { className?: string }) {
  const [story, setStory] = useState(0);
  const [phase, setPhase] = useState(0);
  const [handled, setHandled] = useState(1284);

  useEffect(() => {
    const t = setTimeout(() => {
      if (phase === PHASES.length - 1) {
        setPhase(0);
        setStory((s) => (s + 1) % STORIES.length);
      } else {
        if (phase === 2) setHandled((h) => h + 1);
        setPhase(phase + 1);
      }
    }, PHASES[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  const s = STORIES[story];
  const state = phase === 3 ? "point" : "type";

  return (
    <div
      className={cn(
        "relative aspect-[700/470] w-full overflow-hidden rounded-[2rem] [container-type:inline-size]",
        className,
      )}
      style={{
        background:
          "radial-gradient(120% 90% at 30% 25%, #1b6f8f 0%, #0f3f5c 38%, #0a2236 70%, #071726 100%)",
      }}
    >
      {/* ambient light */}
      <div
        aria-hidden
        className="absolute top-[8%] left-[18%] size-[45%] rounded-full opacity-50 blur-3xl"
        style={{ background: "#22d3ee" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <Mascot state={state} typing={phase === 1} />

      {/* ---- live UI overlay ---- */}
      <div className="absolute inset-0 text-[clamp(9px,1.85cqw,15px)]">
        {/* live status */}
        <div className="absolute bottom-[3.5%] left-[3.5%] flex items-center gap-[0.5em] rounded-full border border-white/15 bg-white/10 px-[0.9em] py-[0.4em] font-medium text-white backdrop-blur">
          <span className="relative flex size-[0.6em]">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex size-full rounded-full bg-emerald-400" />
          </span>
          Live · {handled.toLocaleString()} chats handled today
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={story}
            className="absolute top-[5%] right-[3%] w-[40%]"
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            {/* incoming DM */}
            <div className={cn(card, "flex items-start gap-[0.7em] p-[0.8em]")}>
              <span
                className="flex size-[2.6em] shrink-0 items-center justify-center rounded-full text-[0.85em] font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, hsl(${s.hue} 70% 60%), hsl(${s.hue + 40} 70% 45%))`,
                }}
              >
                {s.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold">New Message</span>
                  <span className="flex items-center gap-[0.35em] text-[0.8em] text-slate-500">
                    now
                    <span className="size-[0.55em] rounded-full bg-sky-500" />
                  </span>
                </span>
                <span className="block truncate text-[0.92em] text-slate-600">
                  {s.msg}
                </span>
              </span>
            </div>

            {/* AI reply */}
            <AnimatePresence mode="wait">
              {phase === 1 && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-[0.5em] ml-auto flex w-fit items-center gap-[0.5em] rounded-full bg-sky-500 px-[0.9em] py-[0.55em] text-[0.85em] font-medium text-white shadow-lg"
                >
                  <span className="flex gap-[0.25em]">
                    <span className="mascot-dot size-[0.45em] rounded-full bg-white" />
                    <span className="mascot-dot size-[0.45em] rounded-full bg-white [animation-delay:150ms]" />
                    <span className="mascot-dot size-[0.45em] rounded-full bg-white [animation-delay:300ms]" />
                  </span>
                  Sojao is typing
                </motion.div>
              )}
              {phase >= 2 && (
                <motion.div
                  key="reply"
                  initial={{ opacity: 0, y: -6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="mt-[0.5em] ml-auto w-fit max-w-[92%] rounded-[1em] rounded-tr-[0.3em] bg-sky-500 px-[0.9em] py-[0.55em] text-[0.88em] text-white shadow-lg"
                >
                  {s.reply}
                  <CheckCheck className="ml-[0.35em] inline size-[1.1em] align-[-0.2em] opacity-90" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* booking lands */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              key={`b-${story}`}
              className={cn(
                card,
                "absolute top-[44%] right-[6%] flex w-[36%] items-center gap-[0.8em] p-[0.85em]",
              )}
              initial={{ opacity: 0, y: 24, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
            >
              <span className="flex size-[2.8em] shrink-0 items-center justify-center rounded-[0.7em] bg-blue-500 text-white">
                <CalendarCheck className="size-[1.5em]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{s.title}</span>
                <span className="block truncate text-[0.9em] text-slate-600">
                  {s.sub}
                </span>
                <span className="block text-[0.85em] text-slate-500">
                  {s.meta}
                </span>
              </span>
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 400 }}
                className="flex size-[1.6em] shrink-0 items-center justify-center self-start rounded-full bg-emerald-500 text-white"
              >
                <Check className="size-[1em]" strokeWidth={3} />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* engagement */}
        <div className="absolute right-[4%] bottom-[7%] w-[22%] rounded-[1.1em] border border-white/15 bg-white/10 p-[0.8em] text-center text-white backdrop-blur-md">
          <div className="mx-auto flex h-[2.6em] items-end justify-center gap-[0.3em]">
            {[0.35, 0.5, 0.45, 0.7, 0.62, 0.9, 1].map((h, i) => (
              <motion.span
                key={i}
                className="w-[0.55em] rounded-t-[0.2em] bg-emerald-400"
                animate={{ height: `${h * (phase >= 3 ? 100 : 78)}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: i * 0.04 }}
              />
            ))}
            <TrendingUp className="mb-[0.6em] ml-[0.2em] size-[1.2em] text-emerald-300" />
          </div>
          <div className="mt-[0.4em] text-[1.35em] leading-none font-bold">
            +250%
          </div>
          <div className="mt-[0.25em] text-[0.8em] text-white/75">
            More Engagement
          </div>
        </div>
      </div>
    </div>
  );
}

/** Vector Sojao mascot at a desk. `state` drives typing vs. pointing at the cards. */
function Mascot({ state, typing }: { state: "type" | "point"; typing: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="60 20 700 470"
      preserveAspectRatio="xMidYMid slice"
      data-state={state}
      data-typing={typing || undefined}
      className="hs absolute inset-0 size-full"
    >
      <defs>
        <radialGradient id="hs-skin" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#a9b8f0" />
          <stop offset="55%" stopColor="#7b8fd6" />
          <stop offset="100%" stopColor="#5466b0" />
        </radialGradient>
        <radialGradient id="hs-iris" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="60%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#075985" />
        </radialGradient>
        <linearGradient id="hs-lid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c3cad6" />
          <stop offset="100%" stopColor="#6b7486" />
        </linearGradient>
        <linearGradient id="hs-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b3a52" />
          <stop offset="100%" stopColor="#16202f" />
        </linearGradient>
        <radialGradient id="hs-ball" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e0f7ff" />
          <stop offset="45%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
        <filter id="hs-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* plant */}
      <g className="hs-plant">
        <path d="M95 372 C70 330 60 300 78 280 C92 310 98 340 100 372Z" fill="#2f8f4e" />
        <path d="M100 372 C95 320 105 285 128 270 C130 310 118 345 106 372Z" fill="#3fae5f" />
        <path d="M98 372 C80 345 50 340 40 318 C70 318 92 340 104 372Z" fill="#267a42" />
        <path d="M104 372 C120 340 150 330 160 312 C135 312 112 335 100 372Z" fill="#34a057" />
      </g>
      <path d="M74 370 H128 L122 414 H80 Z" fill="#e7ebf1" />
      <rect x="70" y="364" width="62" height="12" rx="4" fill="#f5f7fa" />

      {/* mug + steam */}
      <path className="hs-steam" d="M162 345 C152 330 172 320 162 304" />
      <path className="hs-steam [animation-delay:1.2s]" d="M180 345 C170 330 190 320 180 304" />
      <path d="M208 372 h10 a16 16 0 0 1 0 32 h-10" fill="none" stroke="#e7ebf1" strokeWidth="7" />
      <path d="M146 356 H212 V402 Q212 414 200 414 H158 Q146 414 146 402 Z" fill="#f5f7fa" />
      <text x="179" y="391" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827" fontFamily="inherit">
        sojao ai
      </text>

      {/* character */}
      <g className="hs-char">
        {/* left arm (typing) */}
        <path d="M232 322 Q250 378 318 398" className="hs-sleeve" />
        {/* right arm (typing) — behind laptop */}
        <path d="M368 322 Q432 346 452 396" className="hs-sleeve hs-arm-type" />

        {/* hoodie */}
        <path d="M205 425 C198 345 230 298 300 292 C370 298 402 345 395 425 Z" fill="#121826" />
        <ellipse cx="300" cy="294" rx="64" ry="16" fill="#0a0f1a" />
        <path d="M286 302 L283 336 M314 302 L317 336" stroke="#d6dde8" strokeWidth="3" strokeLinecap="round" />
        <rect x="280" y="334" width="6" height="9" rx="2" fill="#4ade80" />
        <rect x="314" y="334" width="6" height="9" rx="2" fill="#4ade80" />
        <text x="256" y="372" textAnchor="middle" fontSize="19" fontWeight="800" fill="#fff" fontFamily="inherit">
          sojao ai
        </text>

        {/* head */}
        <g className="hs-head">
          {/* antennas */}
          <g className="hs-ant hs-ant-l">
            <path d="M270 120 Q262 92 250 64" stroke="#1f2937" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="249" cy="58" r="16" fill="#38bdf8" filter="url(#hs-glow)" opacity="0.7" />
            <circle cx="249" cy="58" r="12" fill="url(#hs-ball)" />
          </g>
          <g className="hs-ant hs-ant-r">
            <path d="M330 120 Q338 92 350 64" stroke="#1f2937" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="351" cy="58" r="16" fill="#38bdf8" filter="url(#hs-glow)" opacity="0.7" />
            <circle cx="351" cy="58" r="12" fill="url(#hs-ball)" />
          </g>

          <ellipse cx="300" cy="208" rx="90" ry="82" fill="url(#hs-skin)" />

          {/* cap */}
          <path d="M212 198 C210 138 250 110 300 110 C350 110 390 138 388 198 Z" fill="#121826" />
          <path d="M230 186 C260 172 340 172 370 186" stroke="#4ade80" strokeWidth="2.5" fill="none" opacity="0.8" />
          <path d="M206 198 C250 180 350 180 394 198 L400 210 C350 192 250 192 200 210 Z" fill="#0a0f1a" />

          {/* headset */}
          <path d="M206 206 C200 112 400 112 394 206" stroke="#1f2937" strokeWidth="9" fill="none" />
          <rect x="190" y="190" width="30" height="60" rx="14" fill="#1f2937" />
          <rect x="196" y="200" width="18" height="40" rx="9" className="hs-led" />
          <rect x="380" y="190" width="30" height="60" rx="14" fill="#1f2937" />
          <rect x="386" y="200" width="18" height="40" rx="9" className="hs-led" />
          <path d="M392 242 C394 266 372 274 346 270" stroke="#1f2937" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="342" cy="270" r="7" className="hs-led" />

          {/* cheeks */}
          <ellipse cx="242" cy="244" rx="15" ry="9" fill="#f472b6" opacity="0.4" />
          <ellipse cx="358" cy="244" rx="15" ry="9" fill="#f472b6" opacity="0.4" />

          {/* brows */}
          <path d="M248 182 Q264 174 280 180" stroke="#2b3770" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M320 180 Q336 174 352 182" stroke="#2b3770" strokeWidth="4" fill="none" strokeLinecap="round" className="hs-brow-r" />

          {/* eyes */}
          <g className="hs-eye hs-eye-l">
            <ellipse cx="265" cy="214" rx="20" ry="24" fill="#0f1b3d" />
            <ellipse cx="266" cy="218" rx="15" ry="18" fill="url(#hs-iris)" />
            <circle cx="266" cy="219" r="7" fill="#0b1020" />
            <circle cx="259" cy="209" r="5" fill="#fff" />
            <circle cx="272" cy="226" r="2.5" fill="#fff" />
          </g>
          <g className="hs-eye hs-eye-r">
            <ellipse cx="335" cy="214" rx="20" ry="24" fill="#0f1b3d" />
            <ellipse cx="336" cy="218" rx="15" ry="18" fill="url(#hs-iris)" />
            <circle cx="336" cy="219" r="7" fill="#0b1020" />
            <circle cx="329" cy="209" r="5" fill="#fff" />
            <circle cx="342" cy="226" r="2.5" fill="#fff" />
          </g>
          <path d="M316 218 Q335 202 354 218" className="hs-wink" />

          {/* mouth */}
          <path d="M280 250 Q300 278 320 250 Q300 258 280 250 Z" fill="#4a1630" />
          <path d="M290 262 Q300 270 310 262 Q300 258 290 262 Z" fill="#f472b6" />
        </g>
      </g>

      {/* laptop (lid faces us) */}
      <path d="M322 302 H448 Q456 302 456 310 L460 404 H310 L314 310 Q314 302 322 302 Z" fill="url(#hs-lid)" />
      <path d="M322 302 H448 Q456 302 456 310 L457 330 L314 330 L314 310 Q314 302 322 302 Z" fill="#fff" opacity="0.12" />
      <text x="385" y="368" textAnchor="middle" fontSize="40" fontWeight="900" fontStyle="italic" fill="#5b6475" opacity="0.75" fontFamily="inherit">
        S
      </text>
      <rect x="298" y="402" width="174" height="10" rx="4" fill="#4b5363" />
      {/* screen glow on face when typing */}
      <ellipse cx="385" cy="300" rx="70" ry="10" fill="#7dd3fc" opacity="0.35" filter="url(#hs-glow)" className="hs-screen" />

      {/* typing hands (in front of laptop edges) */}
      <ellipse cx="318" cy="402" rx="18" ry="13" fill="url(#hs-skin)" className="hs-hand hs-hand-l" />
      <ellipse cx="454" cy="402" rx="18" ry="13" fill="url(#hs-skin)" className="hs-hand hs-hand-r hs-arm-type" />

      {/* pointing arm (in front) */}
      <g className="hs-arm-point">
        <path d="M368 322 Q420 312 452 268" className="hs-sleeve" />
        <circle cx="458" cy="258" r="17" fill="url(#hs-skin)" />
        <path d="M462 250 L482 226" stroke="#8a9ce0" strokeWidth="11" strokeLinecap="round" />
        <path d="M448 262 Q444 252 452 248" stroke="#5466b0" strokeWidth="2" fill="none" opacity="0.6" />
      </g>

      {/* desk */}
      <rect x="0" y="412" width="860" height="16" rx="6" fill="url(#hs-desk)" />
      <rect x="0" y="426" width="860" height="120" fill="#0b1422" />
      <rect x="0" y="412" width="860" height="2" fill="#5eead4" opacity="0.25" />
    </svg>
  );
}
