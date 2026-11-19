"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  AtSign,
  KeyRound,
  Lightbulb,
  MessageCircle,
  Moon,
  Plus,
  Reply,
  ShieldCheck,
} from "lucide-react";

import { ChannelIcon, type Channel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

/* ---------- Greeting ---------- */
export function HomeGreeting({ needsYou = 0 }: { needsYou?: number }) {
  const { session } = useSession();
  const [hello, setHello] = useState("Hello!");
  const first = session?.user.name.split(/\s+/)[0];
  useEffect(() => {
    const h = new Date().getHours();
    setHello(h < 5 ? "Night owl? 🌙" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  return (
    <div className="mb-8">
      <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
        {hello}
        {first && !hello.endsWith("🌙") ? `, ${first}!` : hello.endsWith("🌙") ? "" : "!"}
      </h1>
      <p className="text-muted-foreground mt-2 text-base">
        Here&apos;s what Sojao&apos;s marketing automations did for {session?.workspace?.name ?? "your brand"}.
        {needsYou > 0 && (
          <>
            {" "}
            <Link href="/dashboard/inbox?filter=needs_you" className="text-foreground font-medium underline underline-offset-4">
              {needsYou} {needsYou === 1 ? "chat needs" : "chats need"} you.
            </Link>
          </>
        )}
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

/* ---------- Start here templates ---------- */
const TEMPLATES: {
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  pillar: string;
  channels: Channel[];
}[] = [
  { title: "Comment-to-DM for your next post", text: "People comment a word, Sojao DMs them the link and captures the lead.", icon: MessageCircle, pillar: "Marketing", channels: ["instagram"] },
  { title: "Reply to story replies", text: "Someone replies to your story? Sojao sends the product link and asks for their email.", icon: Reply, pillar: "Marketing", channels: ["instagram"] },
  { title: "Thank people who mention you", text: "When a customer mentions your brand in their story, Sojao says thanks in a DM.", icon: AtSign, pillar: "Marketing", channels: ["instagram"] },
  { title: "Keyword auto-reply", text: "A DM with a word like “PRICE” or “SIZE” gets your saved answer, any time.", icon: KeyRound, pillar: "Marketing", channels: ["instagram"] },
];

export function StartHere() {
  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Start here</h2>
      <p className="text-muted-foreground mt-1 mb-5 text-sm">
        Turn on a ready-made marketing template.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TEMPLATES.map((t) => {
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
                <Button size="sm" asChild>
                  <Link href="/dashboard/marketing?tab=automations&new=1">Use template</Link>
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
  { title: "Stay within Meta's messaging rules", text: "The 24-hour window, private replies and sending limits, in plain words.", icon: ShieldCheck, href: "/dashboard/marketing?tab=rules", tint: "from-primary/30" },
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
