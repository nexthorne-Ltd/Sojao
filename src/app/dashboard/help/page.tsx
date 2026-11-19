"use client";

import { useState } from "react";

import Link from "next/link";

import {
  BookOpen,
  Check,
  Megaphone,
  MessageCircleQuestion,
  Plug,
  Rocket,
  Search,
  Users,
} from "lucide-react";

import { PageHeader, Panel } from "@/components/dashboard/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/marketing-api";

const GUIDES = [
  { icon: Rocket, title: "Get started", text: "Connect your apps, teach Sojao, then go live.", href: "/onboarding" },
  { icon: Plug, title: "Connect Instagram and Messenger", text: "Link your accounts in Settings.", href: "/dashboard/settings?tab=channels" },
  { icon: BookOpen, title: "Teach Sojao about your brand", text: "Tone of voice and common questions.", href: "/dashboard/settings?tab=ai" },
  { icon: Megaphone, title: "Set up Comment-to-DM", text: "Turn post comments into leads.", href: "/dashboard/marketing" },
  { icon: Users, title: "Tags, segments and leads", text: "Group customers and export leads.", href: "/dashboard/marketing?tab=audience" },
  { icon: MessageCircleQuestion, title: "Meta messaging rules", text: "24-hour window, private replies, limits and opt-out.", href: "/dashboard/marketing?tab=rules" },
];

const FAQS = [
  { q: "Will Sojao reply to every message?", a: "Yes, on the apps you connect. If it isn't sure about an answer, it hands the chat to you instead of guessing." },
  { q: "Can I turn Sojao off?", a: "Yes. Use the “Sojao is live” switch at the top of the dashboard to pause auto-replies any time." },
  { q: "Why were some people skipped by my broadcast?", a: "Meta only allows promo messages to people who messaged you in the last 24 hours. Everyone else, and anyone who wrote “stop”, is skipped." },
  { q: "How does Sojao learn?", a: "From your brand info in Settings and from every reply you send when it hands a chat to you." },
  { q: "Is Sojao free?", a: "Yes, during the beta nothing is charged. Sales, Support and WhatsApp are coming soon." },
];

export default function HelpPage() {
  const [q, setQ] = useState("");
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState("I have a question");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const guides = GUIDES.filter((g) => `${g.title} ${g.text}`.toLowerCase().includes(q.toLowerCase()));
  const faqs = FAQS.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="Help" description="Guides, answers and a way to reach a real person." />

      <label className="bg-card mb-6 flex h-12 items-center gap-3 rounded-2xl border px-4 shadow-xs">
        <Search className="text-muted-foreground size-5" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search help, e.g. “broadcast” or “opt-out”"
          className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent outline-none"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <Link key={g.title} href={g.href} className="bg-card hover:bg-accent/40 rounded-2xl border p-5 shadow-xs transition-colors">
              <span className="bg-brand/12 flex size-10 items-center justify-center rounded-xl">
                <Icon className="size-5" />
              </span>
              <p className="mt-4 font-semibold">{g.title}</p>
              <p className="text-muted-foreground mt-1 text-sm">{g.text}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Common questions">
          {faqs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No matches. Try another word or send us a message.</p>
          ) : (
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={String(i)}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Panel>

        <Panel title="Talk to us" description="Questions, bugs or ideas. A real person will reply.">
          {sent ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <span className="bg-brand/15 flex size-12 items-center justify-center rounded-full">
                <Check className="size-6" />
              </span>
              <p className="font-medium">Message sent</p>
              <p className="text-muted-foreground text-sm">We&apos;ll reply by email.</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setSent(false)}>
                Send another
              </Button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setErr(null);
                try {
                  await api("/help-messages", { method: "POST", body: { topic, message } });
                  setMessage("");
                  setSent(true);
                } catch {
                  setErr("Couldn't send it. Try again, or email us.");
                } finally {
                  setBusy(false);
                }
              }}
              className="space-y-3"
            >
              <select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic" className="bg-background h-10 w-full rounded-xl border px-3 text-sm">
                <option>I have a question</option>
                <option>Something isn&apos;t working</option>
                <option>I have an idea</option>
                <option>Billing</option>
              </select>
              <textarea
                required
                rows={5}
                maxLength={4000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-label="Message"
                placeholder="Tell us what's up"
                className="bg-background focus-visible:ring-ring/50 w-full resize-none rounded-xl border p-3 text-sm outline-none focus-visible:ring-[3px]"
              />
              {err && <p role="alert" className="text-sm text-rose-600">{err}</p>}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </Panel>
      </div>
    </>
  );
}
