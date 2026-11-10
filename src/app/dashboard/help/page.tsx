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
  ShoppingBag,
} from "lucide-react";

import { PageHeader, Panel } from "@/components/dashboard/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const GUIDES = [
  { icon: Rocket, title: "Get started in 10 minutes", text: "Connect your apps and store, then go live.", href: "/onboarding" },
  { icon: Plug, title: "Connect Instagram and WhatsApp", text: "Link your accounts in Settings.", href: "/dashboard/settings?tab=channels" },
  { icon: BookOpen, title: "Teach Sojao about your brand", text: "Tone, shipping, returns and common questions.", href: "/dashboard/settings?tab=ai" },
  { icon: Megaphone, title: "Set up comment-to-DM", text: "Turn post comments into leads and sales.", href: "/dashboard/marketing" },
  { icon: ShoppingBag, title: "Send checkout links in chat", text: "How Sojao sells from your store.", href: "/dashboard/sales" },
  { icon: MessageCircleQuestion, title: "When Sojao hands a chat to you", text: "Handover rules and how it learns.", href: "/dashboard/support" },
];

const FAQS = [
  { q: "Will Sojao reply to every message?", a: "Yes, on the apps you connect. If it isn't sure about an answer, it hands the chat to you instead of guessing." },
  { q: "Can I turn Sojao off?", a: "Yes. Use the “Sojao is live” switch at the top of the dashboard to pause auto-replies any time." },
  { q: "Does Sojao change anything in my Shopify store?", a: "No. Sojao reads your products, stock and orders so it can answer questions. It doesn't edit your store." },
  { q: "How does Sojao learn?", a: "From your brand info in Settings and from every reply you send when it hands a chat to you." },
  { q: "How do WhatsApp fees work?", a: "Meta charges for some WhatsApp messages. We pass those fees on at cost. You can see them on the Billing page." },
];

export default function HelpPage() {
  const [q, setQ] = useState("");
  const [sent, setSent] = useState(false);
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
          placeholder="Search help, e.g. “WhatsApp” or “returns”"
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

        <Panel title="Talk to us" description="Questions, bugs or ideas. A real person will reply. [Reply time]">
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
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-3"
            >
              <select className="bg-background h-10 w-full rounded-xl border px-3 text-sm">
                <option>I have a question</option>
                <option>Something isn&apos;t working</option>
                <option>I have an idea</option>
                <option>Billing</option>
              </select>
              <textarea
                required
                rows={5}
                placeholder="Tell us what's up"
                className="bg-background focus-visible:ring-ring/50 w-full resize-none rounded-xl border p-3 text-sm outline-none focus-visible:ring-[3px]"
              />
              <Button type="submit" className="w-full">
                Send message
              </Button>
            </form>
          )}
        </Panel>
      </div>
    </>
  );
}
