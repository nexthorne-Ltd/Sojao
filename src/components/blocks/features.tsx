import Link from "next/link";

import { ChevronRight, HeartHandshake, Megaphone, ShoppingBag } from "lucide-react";

import { DashedLine } from "../dashed-line";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * The three modules. Rendered as plain markup (no images, no scroll or lazy
 * animation) so the card is never empty.
 */
const items = [
  {
    title: "Marketing: bring customers in",
    status: "Live in beta",
    live: true,
    icon: Megaphone,
    points: [
      "Comment-to-DM and story replies",
      "Lead capture inside every automation",
      "Broadcasts to tags and segments",
      "Drip sequences and giveaways",
    ],
    href: "/signup",
  },
  {
    title: "Sales: sell to them in the chat",
    status: "Coming soon",
    live: false,
    icon: ShoppingBag,
    points: ["Answers from your product list", "Checkout links in the chat", "Follow-ups on quiet DMs"],
    href: "/roadmap",
  },
  {
    title: "Support: look after them after the sale",
    status: "Coming soon",
    live: false,
    icon: HeartHandshake,
    points: ["Order and delivery questions", "Returns help", "Handover to you when needed"],
    href: "/roadmap",
  },
];

export const Features = () => {
  return (
    <section id="feature-modern-teams" className="pb-28 lg:pb-32">
      <div className="container">
        {/* Top dashed line with text */}
        <div className="relative flex items-center justify-center">
          <DashedLine className="text-muted-foreground" />
          <span className="bg-muted text-muted-foreground absolute px-3 font-mono text-sm font-medium tracking-wide max-md:hidden">
            YOU SLEEP. SOJAO WORKS.
          </span>
        </div>

        {/* Content */}
        <div className="mx-auto mt-10 grid max-w-4xl items-center gap-3 md:gap-0 lg:mt-24 lg:grid-cols-2">
          <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
            Three jobs. One AI agent.
          </h2>
          <p className="text-muted-foreground leading-snug">
            Sojao is being built to bring customers in, sell to them and look
            after them, with one memory of every customer. Marketing is live in
            beta today. Sales and Support are coming soon.
          </p>
        </div>

        {/* Features Card */}
        <Card className="mt-8 rounded-3xl md:mt-12 lg:mt-20">
          <CardContent className="flex p-0 max-md:flex-col">
            {items.map((item, i) => {
              const Icon = item.icon;
              const body = (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="bg-brand/12 flex size-12 items-center justify-center rounded-2xl">
                      <Icon className="size-6" />
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        item.live ? "bg-brand text-white" : "bg-muted text-muted-foreground border",
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                    {item.points.map((p) => (
                      <li
                        key={p}
                        className={cn(
                          "flex items-start gap-2",
                          !item.live && "text-muted-foreground",
                        )}
                      >
                        <span className="bg-brand mt-1.5 size-1.5 shrink-0 rounded-full" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between gap-4 pt-6">
                    <h3 className="font-display max-w-60 text-2xl leading-tight font-bold tracking-tight">
                      {item.title}
                    </h3>
                    {item.href && (
                      <span className="rounded-full border p-2">
                        <ChevronRight className="size-6 transition-transform group-hover:translate-x-1 lg:size-9" />
                      </span>
                    )}
                  </div>
                </>
              );
              return (
                <div key={item.title} className="flex flex-1 max-md:flex-col">
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-label={item.live ? `${item.title}: join the beta` : `${item.title}: see the roadmap`}
                      className="group flex flex-1 flex-col p-5 md:p-6"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="flex flex-1 flex-col p-5 md:p-6">{body}</div>
                  )}
                  {i < items.length - 1 && (
                    <div className="relative hidden md:block">
                      <DashedLine orientation="vertical" />
                    </div>
                  )}
                  {i < items.length - 1 && (
                    <div className="relative block md:hidden">
                      <DashedLine orientation="horizontal" />
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
