import Link from "next/link";

import { ArrowRight, AtSign, BookOpen, Gift, KeyRound, MessageCircle, RefreshCcw, Reply, Rocket, Sparkles } from "lucide-react";

import { Background } from "@/components/background";
import { PageHero } from "@/components/blocks/kit";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Templates",
  description:
    "Ready-made Instagram automations: lead magnets, product drops, giveaways, story replies, FAQs and win-back. Switch one on and edit the words.",
  path: "/templates",
});

/** Starting points built from Sojao's real automation types. */
const templates = [
  {
    id: "lead-magnet",
    icon: BookOpen,
    category: "Leads",
    name: "Lead magnet",
    trigger: "Comment “GUIDE” on a post",
    steps: ["Private reply with your free guide", "Ask for email, with consent", "Tag: Guide lead"],
  },
  {
    id: "drop",
    icon: Rocket,
    category: "Sales",
    name: "Product drop",
    trigger: "Comment “DROP” on a reel",
    steps: ["Ask if they want the link", "Send the link when they answer", "Tag: Early access"],
  },
  {
    id: "giveaway",
    icon: Gift,
    category: "Growth",
    name: "Giveaway",
    trigger: "Comment or DM “WIN”",
    steps: ["Confirm the entry", "Save the entrant", "Message everyone when it ends"],
  },
  {
    id: "story",
    icon: Reply,
    category: "Engagement",
    name: "Story reply answers",
    trigger: "Someone replies to your story",
    steps: ["AI reply from your brand profile", "Hands over if unsure", "Tag: Story reply"],
  },
  {
    id: "mention",
    icon: AtSign,
    category: "Engagement",
    name: "Mention thank-you",
    trigger: "Someone mentions you in their story",
    steps: ["Thank them by name", "Optional offer you write", "Tag: Mentioned us"],
  },
  {
    id: "faq",
    icon: KeyRound,
    category: "Support",
    name: "Shipping FAQ",
    trigger: "DM contains “shipping” or “delivery”",
    steps: ["Send your shipping policy", "Offer to send the store link", "Hand over on “refund”"],
  },
  {
    id: "welcome",
    icon: Sparkles,
    category: "Engagement",
    name: "First-message welcome",
    trigger: "Someone DMs you for the first time",
    steps: ["Say hi in your tone of voice", "Share your best-sellers link", "Ask what they're looking for"],
  },
  {
    id: "winback",
    icon: RefreshCcw,
    category: "Retention",
    name: "Win-back",
    trigger: "A customer showed buying intent, then went quiet",
    steps: ["Draft a message for you to approve", "Send only to people Instagram allows", "Stop when they reply"],
  },
  {
    id: "live",
    icon: MessageCircle,
    category: "Sales",
    name: "Live shopping link",
    trigger: "Comment “LINK” during an Instagram Live",
    steps: ["Private reply with the product link", "Only while you're live", "Tag: Live viewer"],
  },
];

export default function TemplatesPage() {
  return (
    <Background>
      <PageHero
        eyebrow="Templates"
        title="Start from a ready-made flow."
        description="Pick a template, change the words to sound like you, and switch it on. Every template follows Instagram's messaging rules."
        primary={{ label: "Join the beta to use them", href: "/signup" }}
      />
      <ul className="container grid max-w-6xl gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map(({ id, icon: Icon, category, name, trigger, steps }, i) => (
          <Reveal as="li" key={id} delay={(i % 3) * 0.08}>
            <article id={id} className="group bg-background/70 hover:border-brand/40 flex h-full scroll-mt-32 flex-col rounded-3xl border p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="bg-brand/12 text-brand group-hover:bg-brand flex size-10 items-center justify-center rounded-xl transition-colors group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-[11px] font-semibold">{category}</span>
              </div>
              <h2 className="mt-5 text-lg font-semibold">{name}</h2>
              <p className="bg-muted/70 mt-3 rounded-lg px-3 py-2 text-xs">
                <span className="text-muted-foreground">When: </span>
                <span className="font-medium">{trigger}</span>
              </p>
              <ol className="mt-4 flex-1 space-y-2">
                {steps.map((s, n) => (
                  <li key={s} className="flex gap-2.5 text-sm">
                    <span className="text-muted-foreground font-mono text-xs leading-5">{n + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <Link href="/signup" className="text-brand mt-5 inline-flex items-center gap-1 text-sm font-semibold">
                Use template <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          </Reveal>
        ))}
      </ul>
    </Background>
  );
}
