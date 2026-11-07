"use client";

import { useState } from "react";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    monthlyPrice: "$29",
    yearlyPrice: "$290",
    description: "All 3 pillars, basic version",
    features: [
      "Comment-to-DM and story replies",
      "Lead capture (email and phone)",
      "Answers every DM from your store data",
      "Product suggestions",
      "Checkout links in the chat",
      "Order status answers",
      "Human handover",
    ],
  },
  {
    name: "Growth",
    monthlyPrice: "$79",
    yearlyPrice: "$790",
    description: "For brands ready to grow",
    features: [
      "Everything in Starter, plus...",
      "Broadcasts and drip sequences",
      "Keyword triggers",
      "Abandoned DM follow-up",
      "Upsells",
      "Delivery updates",
      "Returns handling",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: "$199",
    yearlyPrice: "$1,990",
    description: "Every tool Sojao has",
    features: [
      "Everything in Growth, plus...",
      "Giveaways and contests",
      "Growth tools (ref links, QR codes, website widget)",
      "Click-to-DM ads",
      "Tags and segments",
      "Customer history",
      "Review requests",
    ],
  },
];

export const Pricing = ({ className }: { className?: string }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container max-w-5xl">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
            Simple pricing. Nothing to build.
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
            Every plan includes marketing, sales and support. Pay yearly and
            get 2 months free.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-5 text-start md:mt-12 md:grid-cols-3 lg:mt-20">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`${
                plan.name === "Growth"
                  ? "outline-primary origin-top outline-4"
                  : ""
              }`}
            >
              <CardContent className="flex flex-col gap-7 px-6 py-5">
                <div className="space-y-2">
                  <h3 className="text-foreground font-semibold">{plan.name}</h3>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-lg font-medium">
                      {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}{" "}
                      <span className="text-muted-foreground">
                        per {isAnnual ? "year" : "month"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={isAnnual}
                    onCheckedChange={() => setIsAnnual(!isAnnual)}
                    aria-label="Toggle annual billing"
                  />
                  <span className="text-sm font-medium">
                    Billed yearly (2 months free)
                  </span>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="text-muted-foreground flex items-center gap-1.5"
                    >
                      <Check className="size-5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-fit"
                  variant={plan.name === "Growth" ? "default" : "outline"}
                  asChild
                >
                  <a href="/signup">Start free</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-center text-sm text-balance">
          Beta: early brands get the first 3 months free, then a 50% founding
          discount. WhatsApp marketing message fees from Meta are billed at
          cost.
        </p>
      </div>
    </section>
  );
};
