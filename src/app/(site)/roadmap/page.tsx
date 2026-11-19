import Link from "next/link";

import { HeartHandshake, Megaphone, MessagesSquare, ShoppingBag } from "lucide-react";

import { Background } from "@/components/background";
import { PageHeader } from "@/components/blocks/page-header";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Roadmap",
  description:
    "What Sojao does today and what's coming next. Marketing is live in beta. Sales, Support and WhatsApp are coming soon.",
  path: "/roadmap",
});

// No dates on purpose: we only promise what is shipped.
const stages = [
  {
    label: "Live now",
    tone: "live",
    items: [
      {
        icon: Megaphone,
        title: "Marketing",
        text: "Comment-to-DM, story replies, mentions, keywords, lead capture, broadcasts, drip sequences and giveaways on Instagram and Messenger.",
      },
    ],
  },
  {
    label: "Next",
    tone: "next",
    items: [
      {
        icon: ShoppingBag,
        title: "Sales",
        text: "Answer product questions from your catalogue, share checkout links in the chat and follow up on DMs that went quiet.",
      },
    ],
  },
  {
    label: "Later",
    tone: "later",
    items: [
      {
        icon: HeartHandshake,
        title: "Support",
        text: "Handle order, delivery and returns questions, and hand the chat over to you when a person is needed.",
      },
      {
        icon: MessagesSquare,
        title: "WhatsApp",
        text: "The same automations on WhatsApp, alongside Instagram and Messenger.",
      },
    ],
  },
] as const;

export default function RoadmapPage() {
  return (
    <Background>
      <div className="pt-28 pb-28 lg:pt-44 lg:pb-32">
        <PageHeader
          eyebrow="Roadmap"
          title="What's live, and what's next."
          description="We only call something live once beta brands are using it. Plans can change based on what you tell us."
        />

        <ol className="container max-w-3xl">
          {stages.map((stage, si) => (
            <li key={stage.label} className="relative pb-12 pl-10 last:pb-0">
              {si < stages.length - 1 && (
                <span className="bg-border absolute top-6 bottom-0 left-[11px] w-px" />
              )}
              <span
                className={cn(
                  "absolute top-1 left-0 flex size-6 items-center justify-center rounded-full border-2",
                  stage.tone === "live" ? "border-brand bg-brand" : "bg-background",
                )}
              >
                {stage.tone === "live" && (
                  <span className="size-2 animate-pulse rounded-full bg-white" />
                )}
              </span>
              <p
                className={cn(
                  "font-mono text-sm font-medium tracking-wide uppercase",
                  stage.tone === "live" ? "text-brand" : "text-muted-foreground",
                )}
              >
                {stage.label}
              </p>
              <div className="mt-4 space-y-4">
                {stage.items.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className={cn(
                      "bg-background/70 flex gap-4 rounded-3xl border p-6 backdrop-blur",
                      stage.tone !== "live" && "opacity-85",
                    )}
                  >
                    <span className="bg-brand/12 text-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold">{title}</h2>
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className="container mt-20 max-w-3xl text-center">
          <h2 className="text-2xl tracking-tight md:text-3xl">Want something on this list?</h2>
          <p className="text-muted-foreground mt-3">
            Beta brands shape what we build next. Tell us what you need.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/signup">Join the beta</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Send us an idea</Link>
            </Button>
          </div>
        </div>
      </div>
    </Background>
  );
}
