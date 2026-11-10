import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { DashedLine } from "../dashed-line";

import {
  MarketingMock,
  SalesMock,
  SupportMock,
} from "@/components/blocks/chat-illustrations";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    title: "Marketing: bring customers in",
    visual: <MarketingMock />,
  },
  {
    title: "Sales: sell to them in the chat",
    visual: <SalesMock />,
  },
  {
    title: "Support: look after them after the sale",
    visual: <SupportMock />,
  },
];

export const Features = () => {
  return (
    <section id="feature-modern-teams" className="scroll-mt-24 pb-28 lg:pb-32">
      <div className="container">
        {/* Top dashed line with text */}
        <div className="relative flex items-center justify-center">
          <DashedLine className="text-muted-foreground" />
          <span className="bg-muted text-muted-foreground absolute px-3 font-mono text-sm font-medium tracking-wide max-md:hidden">
            YOU SLEEP. WE SELL.
          </span>
        </div>

        {/* Content */}
        <div className="mx-auto mt-10 grid max-w-4xl items-center gap-3 md:gap-0 lg:mt-24 lg:grid-cols-2">
          <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
            Three jobs. One AI agent.
          </h2>
          <p className="text-muted-foreground leading-snug">
            Most small brands pay for three tools: one for marketing, a VA for
            sales and a helpdesk for support. Sojao does all three, with one
            memory of every customer.
          </p>
        </div>

        {/* Features Card */}
        <Card className="mt-8 rounded-3xl md:mt-12 lg:mt-20">
          <CardContent className="flex p-0 max-md:flex-col">
            {items.map((item, i) => (
              <div key={i} className="flex flex-1 max-md:flex-col">
                <div className="flex-1 p-4 pe-0! md:p-6">
                  <div className="pe-4 md:pe-6">{item.visual}</div>

                  <Link
                    href="/#resource-allocation"
                    className={
                      "group flex items-center justify-between gap-4 pe-4 pt-4 md:pe-6 md:pt-6"
                    }
                  >
                    <h3 className="font-display max-w-60 text-2xl leading-tight font-bold tracking-tight">
                      {item.title}
                    </h3>
                    <div className="rounded-full border p-2">
                      <ChevronRight className="size-6 transition-transform group-hover:translate-x-1 lg:size-9" />
                    </div>
                  </Link>
                </div>
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
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
