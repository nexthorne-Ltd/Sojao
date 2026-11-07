"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Cctv,
  Check,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  Moon,
  Plus,
  RotateCcw,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";

import { ChannelIcon } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import type { Channel } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

/* ---------- Greeting ---------- */
export function HomeGreeting() {
  const [hello, setHello] = useState("Hello!");
  useEffect(() => {
    const h = new Date().getHours();
    setHello(h < 5 ? "Night owl? 🌙" : h < 12 ? "Good morning!" : h < 18 ? "Good afternoon!" : "Good evening!");
  }, []);

  return (
    <div className="mb-8">
      <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{hello}</h1>
      <p className="text-muted-foreground mt-2 text-base">
        Here&apos;s what Sojao did for your brand. Sample data shown until you connect your accounts.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
        <Link href="/dashboard/settings?tab=channels" className="text-foreground inline-flex items-center gap-1.5 hover:underline">
          <Plus className="size-4" /> Connect channels
        </Link>
        <Link href="/dashboard/inbox" className="text-foreground inline-flex items-center gap-1.5 hover:underline">
          Open inbox <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/* ---------- Promo card ---------- */
export function PromoCard() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    try {
      setHidden(window.localStorage.getItem("sojao-promo-live") === "hidden");
    } catch {}
  }, []);
  if (hidden) return null;

  return (
    <div className="relative mb-8 flex flex-wrap items-center gap-4 overflow-hidden rounded-2xl bg-[#0b0d12] p-5 text-white md:p-6">
      <div className="bg-brand/30 pointer-events-none absolute -top-16 -left-10 size-48 rounded-full blur-3xl" />
      <span className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
        <Cctv className="size-6" />
      </span>
      <div className="relative min-w-0 flex-1">
        <p className="text-lg font-semibold">New: Sojao Live</p>
        <p className="text-sm text-white/70">Watch Sojao work in real time, like checking your shop cameras.</p>
      </div>
      <Link
        href="/dashboard/live"
        className="bg-brand relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Take a look <ArrowRight className="size-4" />
      </Link>
      <button
        onClick={() => {
          setHidden(true);
          try {
            window.localStorage.setItem("sojao-promo-live", "hidden");
          } catch {}
        }}
        className="absolute top-3 right-3 text-white/60 hover:text-white"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/* ---------- Start here templates ---------- */
const TEMPLATES: {
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  pillar: string;
  channels: Channel[];
  on: boolean;
}[] = [
  { title: "Comment-to-DM for your next post", text: "People comment a word, Sojao DMs them the link and captures the lead.", icon: MessageCircle, pillar: "Marketing", channels: ["instagram"], on: true },
  { title: "Answer questions from your store", text: "Price, size, stock and shipping, answered with your real data.", icon: ShoppingBag, pillar: "Sales", channels: ["instagram", "messenger", "whatsapp"], on: true },
  { title: "Recover quiet DMs", text: "Someone asked, then went quiet? Sojao checks back in once.", icon: RotateCcw, pillar: "Sales", channels: ["instagram", "whatsapp"], on: false },
  { title: "Order and delivery updates", text: "Confirmed, shipped, out for delivery. Sent automatically.", icon: Truck, pillar: "Support", channels: ["whatsapp", "messenger"], on: false },
];

export function StartHere() {
  const [on, setOn] = useState(TEMPLATES.map((t) => t.on));
  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Start here</h2>
      <p className="text-muted-foreground mt-1 mb-5 text-sm">
        Turn on a ready-made template. No flows to build.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TEMPLATES.map((t, i) => {
          const Icon = t.icon;
          return (
            <div key={t.title} className="bg-card flex flex-col rounded-2xl border p-5 shadow-xs transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="bg-brand/12 flex size-11 items-center justify-center rounded-xl">
                  <Icon className="size-5" />
                </span>
                <span className="text-muted-foreground text-xs">{t.pillar}</span>
              </div>
              <p className="mt-4 font-semibold leading-snug">{t.title}</p>
              <p className="text-muted-foreground mt-1.5 flex-1 text-sm">{t.text}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="flex gap-1.5">
                  {t.channels.map((c) => (
                    <ChannelIcon key={c} channel={c} className="size-3.5" />
                  ))}
                </span>
                <Button
                  size="sm"
                  variant={on[i] ? "outline" : "default"}
                  onClick={() => setOn(on.map((v, j) => (j === i ? !v : v)))}
                >
                  {on[i] ? (
                    <>
                      <Check className="size-4" /> On
                    </>
                  ) : (
                    "Use template"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Learn cards ---------- */
const LEARN = [
  { title: "Teach Sojao your brand voice", text: "5 minutes that make every reply sound like you.", icon: BookOpen, href: "/dashboard/settings?tab=ai", tint: "from-brand/25" },
  { title: "Ideas for your next drop", text: "Comment words, early access lists and giveaways.", icon: Lightbulb, href: "/dashboard/marketing", tint: "from-glow/25" },
  { title: "When Sojao asks for help", text: "How handover works and how it learns from you.", icon: HeartHandshake, href: "/dashboard/help", tint: "from-primary/30" },
];

export function LearnCards() {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Learn and get ideas</h2>
      <p className="text-muted-foreground mt-1 mb-5 text-sm">Short guides to get more from Sojao.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {LEARN.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.title}
              href={l.href}
              className={cn(
                "group to-card flex min-h-44 flex-col justify-between rounded-2xl border bg-linear-to-br p-5 shadow-xs transition-shadow hover:shadow-md",
                l.tint,
              )}
            >
              <span className="bg-background flex size-11 items-center justify-center rounded-xl border">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{l.title}</p>
                <p className="text-muted-foreground mt-1 text-sm">{l.text}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                  Read <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function NightShiftCard({ text }: { text: string }) {
  return (
    <div className="from-brand/15 via-glow/10 to-card mb-6 flex flex-wrap items-center gap-4 rounded-2xl border bg-linear-to-r p-5">
      <span className="bg-background flex size-11 items-center justify-center rounded-full border">
        <Moon className="size-5" />
      </span>
      <div className="flex-1">
        <p className="font-semibold">While you slept</p>
        <p className="text-muted-foreground text-sm">{text}</p>
      </div>
    </div>
  );
}
