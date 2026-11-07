"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  Cctv,
  Hand,
  Loader2,
  Maximize2,
  Moon,
  Pause,
  Play,
  ShoppingBag,
  X,
} from "lucide-react";

import { Badge, ChannelIcon, channelLabel, money } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import type { Channel, Pillar } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Scripted sample scenarios. Each feed plays one, then loops.          */
/* ------------------------------------------------------------------ */

type Step =
  | { t: "customer"; text: string }
  | { t: "ai"; text: string; checkout?: { product: string; price: number } }
  | { t: "action"; text: string }
  | { t: "result"; text: string; kind: "sale" | "lead" | "solved" | "handover"; amount?: number };

type Script = {
  customers: string[];
  channel: Channel;
  pillar: Pillar;
  steps: Step[];
};

const SCRIPTS: Script[] = [
  {
    customers: ["Maya L.","Grace T.","Ella R.","Zoe K."],
    channel: "instagram",
    pillar: "Sales",
    steps: [
      { t: "customer", text: "Is the linen wrap dress still in stock in small?" },
      { t: "action", text: "Checking stock in Shopify…" },
      { t: "ai", text: "Yes! Size S is in stock in sand and olive. You picked sand last time. Same again?" },
      { t: "customer", text: "Sand please 🙏" },
      { t: "action", text: "Creating checkout link…" },
      { t: "ai", text: "Here you go:", checkout: { product: "Linen Wrap Dress · Sand · S", price: 89 } },
      { t: "result", text: "Paid $89", kind: "sale", amount: 89 },
    ],
  },
  {
    customers: ["Jack T.","Ethan W.","Mia P.","Leo S."],
    channel: "whatsapp",
    pillar: "Support",
    steps: [
      { t: "customer", text: "Hi, where is my order #1041?" },
      { t: "action", text: "Looking up order #1041…" },
      { t: "ai", text: "It shipped yesterday with Royal Mail and arrives tomorrow. Tracking: RM20394857GB" },
      { t: "customer", text: "Perfect, thanks!" },
      { t: "result", text: "Order question solved", kind: "solved" },
    ],
  },
  {
    customers: ["Olivia C.","Chloe E.","Ruby H.","Ava N."],
    channel: "instagram",
    pillar: "Marketing",
    steps: [
      { t: "action", text: "New comment “DROP” on your latest post" },
      { t: "action", text: "Sending a DM…" },
      { t: "ai", text: "Hey {name}! The summer drop goes live Friday. Want early access? Drop your email 💛" },
      { t: "customer", text: "yes! {email}" },
      { t: "action", text: "Saving lead and tagging “Summer drop”…" },
      { t: "ai", text: "You're on the early list! I'll message you first." },
      { t: "result", text: "Lead captured", kind: "lead" },
    ],
  },
  {
    customers: ["Liam D.","Harper M.","Owen J.","Lily F."],
    channel: "messenger",
    pillar: "Support",
    steps: [
      { t: "customer", text: "My necklace arrived broken. Can I get a refund?" },
      { t: "action", text: "Checking your handover rules…" },
      { t: "ai", text: "I'm so sorry, {name}. I've passed this to the team so they can sort your refund." },
      { t: "result", text: "Handed to you", kind: "handover" },
    ],
  },
  {
    customers: ["Noah B.","Isla S.","Lucas G.","Emma V."],
    channel: "whatsapp",
    pillar: "Sales",
    steps: [
      { t: "action", text: "Quiet for 3 hours. Sending a follow-up…" },
      { t: "ai", text: "Hi {name}! The Satin Slip Skirt you asked about is almost sold out. Want me to hold one?" },
      { t: "customer", text: "Oh yes please, size M" },
      { t: "action", text: "Checking size M and creating link…" },
      { t: "ai", text: "Done! Here's your link:", checkout: { product: "Satin Slip Skirt · Black · M", price: 59 } },
      { t: "result", text: "Recovered sale $59", kind: "sale", amount: 59 },
    ],
  },
  {
    customers: ["Sophie M.","Amelia D.","Nora B.","Ivy C."],
    channel: "instagram",
    pillar: "Sales",
    steps: [
      { t: "customer", text: "Is the glow serum ok for sensitive skin?" },
      { t: "action", text: "Reading product details…" },
      { t: "ai", text: "Yes, it's fragrance-free. Most people pair it with our Night Cream. Both for $64?" },
      { t: "customer", text: "Both!" },
      { t: "action", text: "Adding upsell and creating link…" },
      { t: "ai", text: "Lovely! Here you go:", checkout: { product: "Glow Serum + Night Cream", price: 64 } },
      { t: "result", text: "Paid $64 (with upsell)", kind: "sale", amount: 64 },
    ],
  },
];

/* ------------------------------------------------------------------ */

type Msg = { from: "customer" | "ai"; text: string; checkout?: { product: string; price: number } };

type Feed = {
  cam: number;
  script: number;
  step: number;
  messages: Msg[];
  action: string | null;
  typing: boolean;
  result: Extract<Step, { t: "result" }> | null;
  hold: number; // ticks to wait after a result before looping
  round: number; // which customer of the script is playing
};

const who = (f: Feed) => {
  const list = SCRIPTS[f.script].customers;
  return list[f.round % list.length];
};
const fill = (text: string, name: string) =>
  text
    .replace("{name}", name.split(" ")[0])
    .replace("{email}", `${name.split(" ")[0].toLowerCase()}@example.com`);

type LogItem = { id: number; time: string; cam: number; text: string; kind: string };

const clock = () =>
  new Date().toLocaleTimeString("en-US", { hour12: false });

const initialFeeds = (): Feed[] =>
  SCRIPTS.map((_, i) => ({
    cam: i + 1,
    script: i,
    step: 0,
    messages: [],
    action: null,
    typing: false,
    result: null,
    hold: 0,
    round: 0,
  }));

export default function LivePage() {
  const [feeds, setFeeds] = useState<Feed[]>(initialFeeds);
  const [log, setLog] = useState<LogItem[]>([]);
  const [paused, setPaused] = useState(false);
  const [night, setNight] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);
  const [now, setNow] = useState("--:--:--");
  const [totals, setTotals] = useState({ tasks: 312, sales: 1184, leads: 46, handovers: 3 });
  const logId = useRef(0);
  const feedsRef = useRef<Feed[] | null>(null);

  // clock
  useEffect(() => {
    setNow(clock());
    const id = setInterval(() => setNow(clock()), 1000);
    return () => clearInterval(id);
  }, []);

  // simulation tick: advance 1–2 random feeds
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const picks = new Set([Math.floor(Math.random() * SCRIPTS.length), Math.floor(Math.random() * SCRIPTS.length)]);
      const newLogs: LogItem[] = [];
      const add = { tasks: 0, sales: 0, leads: 0, handovers: 0 };

      const prev = feedsRef.current ?? initialFeeds();
      const nextFeeds = prev.map((f, i) => {
          if (!picks.has(i)) return f;
          const script = SCRIPTS[f.script];

          // after a result, hold a bit then start the next customer
          if (f.result) {
            if (f.hold > 0) return { ...f, hold: f.hold - 1 };
            return {
              ...f,
              round: f.round + 1,
              step: 0,
              messages: [],
              action: null,
              typing: false,
              result: null,
            };
          }

          const step = script.steps[f.step];
          if (!step) return f;

          if (step.t === "ai" && !f.typing) {
            return { ...f, typing: true, action: null };
          }

          const name = who(f);
          const next = { ...f, step: f.step + 1, typing: false };
          const stamp = clock();
          if (step.t === "customer") {
            next.messages = [...f.messages, { from: "customer", text: fill(step.text, name) }];
            next.action = null;
          } else if (step.t === "ai") {
            next.messages = [...f.messages, { from: "ai", text: fill(step.text, name), checkout: step.checkout }];
            add.tasks += 1;
          } else if (step.t === "action") {
            next.action = step.text;
            newLogs.push({ id: ++logId.current, time: stamp, cam: f.cam, text: `${name}: ${step.text.replace(/…$/, "")}`, kind: "action" });
          } else if (step.t === "result") {
            next.result = step;
            next.action = null;
            next.hold = 2;
            newLogs.push({ id: ++logId.current, time: stamp, cam: f.cam, text: `${name}: ${step.text}`, kind: step.kind });
            if (step.kind === "sale") add.sales += step.amount ?? 0;
            if (step.kind === "lead") add.leads += 1;
            if (step.kind === "handover") add.handovers += 1;
          }
          return next;
        });
      feedsRef.current = nextFeeds;
      setFeeds(nextFeeds);

      if (newLogs.length) setLog((l) => [...newLogs.reverse(), ...l].slice(0, 40));
      if (add.tasks || add.sales || add.leads || add.handovers)
        setTotals((t) => ({
          tasks: t.tasks + add.tasks,
          sales: t.sales + add.sales,
          leads: t.leads + add.leads,
          handovers: t.handovers + add.handovers,
        }));
    }, 1100);
    return () => clearInterval(id);
  }, [paused]);

  const focused = feeds.find((f) => f.cam === focus);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="sr-only">Sojao Live</h1>
          <p className="text-muted-foreground flex items-center gap-2 text-base">
            <Cctv className="size-5 shrink-0" />
            Watch Sojao work in real time, like checking the shop cameras. Sample
            simulation shown.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setNight(!night)} aria-pressed={night}>
            <Moon className="size-4" /> Night vision {night ? "on" : "off"}
          </Button>
          <Button onClick={() => setPaused(!paused)}>
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            {paused ? "Resume" : "Pause"}
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Live chats" value={String(feeds.filter((f) => !f.result).length)} live={!paused} />
        <Stat label="Replies sent today" value={totals.tasks.toLocaleString("en-US")} />
        <Stat label="Sales today" value={money(totals.sales)} />
        <Stat label="Leads today" value={String(totals.leads)} />
        <Stat label="Handed to you" value={String(totals.handovers)} />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1fr_340px]">
        {/* Camera wall */}
        <div
          className={cn(
            "grid gap-4 transition-[filter] md:grid-cols-2 xl:grid-cols-3",
            night && "[filter:grayscale(1)_sepia(1)_hue-rotate(65deg)_saturate(2.6)_brightness(0.95)]",
          )}
        >
          {feeds.map((f) => (
            <Camera key={f.cam} feed={f} now={now} paused={paused} onExpand={() => setFocus(f.cam)} />
          ))}
        </div>

        {/* Activity log */}
        <section className="bg-card flex max-h-[720px] flex-col rounded-2xl border shadow-xs">
          <header className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="font-semibold">Activity log</h2>
            <span className="flex items-center gap-1.5 text-xs">
              <span className={cn("size-2 rounded-full", paused ? "bg-muted-foreground" : "animate-pulse bg-red-500")} />
              {paused ? "Paused" : "Recording"}
            </span>
          </header>
          <ol className="flex-1 divide-y overflow-y-auto font-mono text-xs">
            {log.length === 0 && (
              <li className="text-muted-foreground p-4">Waiting for activity…</li>
            )}
            {log.map((l) => (
              <li key={l.id} className="animate-in fade-in slide-in-from-top-1 flex gap-2 px-4 py-2.5">
                <span className="text-muted-foreground shrink-0 tabular-nums">{l.time}</span>
                <span className="text-muted-foreground shrink-0">CAM{String(l.cam).padStart(2, "0")}</span>
                <span
                  className={cn(
                    "min-w-0",
                    l.kind === "sale" && "font-semibold text-emerald-600 dark:text-emerald-400",
                    l.kind === "lead" && "font-semibold text-sky-600 dark:text-sky-400",
                    l.kind === "handover" && "font-semibold text-amber-600 dark:text-amber-400",
                  )}
                >
                  {l.text}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Focused camera */}
      {focused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setFocus(null)}>
          <div
            className={cn("w-full max-w-2xl", night && "[filter:grayscale(1)_sepia(1)_hue-rotate(65deg)_saturate(2.6)]")}
            onClick={(e) => e.stopPropagation()}
          >
            <Camera feed={focused} now={now} paused={paused} large onClose={() => setFocus(null)} />
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

function Stat({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <div className="bg-card rounded-2xl border p-4 shadow-xs">
      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
        {live && <span className="size-1.5 animate-pulse rounded-full bg-red-500" />}
        {label}
      </p>
      <p className="font-display mt-1 text-2xl tabular-nums">{value}</p>
    </div>
  );
}

function Camera({
  feed,
  now,
  paused,
  large,
  onExpand,
  onClose,
}: {
  feed: Feed;
  now: string;
  paused: boolean;
  large?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
}) {
  const script = SCRIPTS[feed.script];
  const customer = who(feed);
  const shown = feed.messages.slice(large ? -8 : -3);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [feed.messages.length, feed.typing]);

  const state = feed.result
    ? feed.result.kind === "handover"
      ? { label: "Needs you", tone: "warn" as const }
      : { label: "Done", tone: "good" as const }
    : { label: script.pillar, tone: "brand" as const };

  return (
    <article className="relative overflow-hidden rounded-2xl border bg-[#0b0d12] text-white shadow-md">
      {/* scanlines + vignette */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.035)_0px,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_3px)]" />
      <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]" />

      {/* HUD top */}
      <header className="relative z-20 flex items-center gap-2 px-3 pt-3 font-mono text-[11px] tracking-wide">
        <span className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", paused ? "bg-white/40" : "animate-pulse bg-red-500")} />
          {paused ? "PAUSED" : "REC"}
        </span>
        <span className="text-white/60">CAM {String(feed.cam).padStart(2, "0")}</span>
        <span className="text-white/60">· {channelLabel(script.channel).toUpperCase()}</span>
        <span className="ml-auto text-white/60 tabular-nums">{now}</span>
        {onExpand && (
          <button onClick={onExpand} className="text-white/60 hover:text-white" aria-label={`Expand camera ${feed.cam}`}>
            <Maximize2 className="size-3.5" />
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white" aria-label="Close">
            <X className="size-4" />
          </button>
        )}
      </header>

      {/* Customer line */}
      <div className="relative z-20 flex items-center gap-2 px-3 pt-2">
        <ChannelIcon channel={script.channel} className="size-3.5" />
        <span className="text-sm font-medium">{customer}</span>
        <Badge tone={state.tone} className="ml-auto text-white">
          {state.label}
        </Badge>
      </div>

      {/* Chat */}
      <div
        ref={bodyRef}
        className={cn("relative z-0 space-y-2 overflow-hidden px-3 py-3", large ? "h-96" : "h-44")}
      >
        {shown.map((m, i) => (
          <div key={`${feed.round}-${feed.messages.length - shown.length + i}`} className={cn("animate-in fade-in slide-in-from-bottom-1 flex", m.from === "ai" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-1.5 text-xs leading-snug",
                m.from === "ai" ? "bg-brand text-white" : "bg-white/10",
              )}
            >
              {m.text}
              {m.checkout && (
                <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-black/25 px-2 py-1.5">
                  <ShoppingBag className="size-3.5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{m.checkout.product}</span>
                  <span className="font-semibold">{money(m.checkout.price)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {feed.typing && (
          <div className="flex justify-end">
            <div className="bg-brand/70 flex gap-1 rounded-xl px-3 py-2">
              {[0, 150, 300].map((d) => (
                <span key={d} className="mascot-dot size-1.5 rounded-full bg-white" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        {feed.messages.length === 0 && !feed.action && !feed.typing && (
          <p className="pt-10 text-center font-mono text-[11px] text-white/40">Waiting for a customer…</p>
        )}
      </div>

      {/* Status bar */}
      <footer className="relative z-20 flex min-h-11 items-center gap-2 border-t border-white/10 bg-black/30 px-3 py-2 text-xs">
        {feed.result ? (
          feed.result.kind === "handover" ? (
            <>
              <Hand className="size-3.5 text-amber-400" />
              <span className="flex-1 text-amber-300">{feed.result.text}</span>
              <Link href="/dashboard/inbox?c=v4" className="rounded-full bg-white/15 px-2.5 py-1 font-medium hover:bg-white/25">
                Reply
              </Link>
            </>
          ) : (
            <span className="font-medium text-emerald-300">✓ {feed.result.text}</span>
          )
        ) : feed.action ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span className="flex-1 text-white/80">{feed.action}</span>
          </>
        ) : feed.typing ? (
          <span className="text-white/70">Sojao is typing…</span>
        ) : (
          <span className="text-white/50">Listening…</span>
        )}
        {!feed.result && (
          <Link href="/dashboard/inbox" className="ml-auto shrink-0 text-[11px] text-white/50 underline-offset-2 hover:text-white hover:underline">
            Take over
          </Link>
        )}
      </footer>
    </article>
  );
}
