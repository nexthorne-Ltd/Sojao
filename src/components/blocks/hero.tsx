import {
  ArrowRight,
  Bot,
  CircleCheck,
  Infinity as InfinityIcon,
} from "lucide-react";

import { HeroScene } from "@/components/hero-scene";

const pills = [
  {
    title: "Marketing",
    description: "Bring customers in",
    icon: CircleCheck,
    tint: "var(--brand)",
  },
  {
    title: "Sales",
    description: "Sell right in the chat",
    icon: Bot,
    tint: "var(--glow)",
  },
  {
    title: "Support",
    description: "Look after them after the sale",
    icon: InfinityIcon,
    tint: "var(--primary)",
  },
];

export const Hero = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-40">
      <div className="container grid items-center gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <span className="bg-background/80 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium shadow-sm backdrop-blur">
            <span className="relative flex size-2">
              <span className="bg-brand absolute inline-flex size-full animate-ping rounded-full opacity-60" />
              <span className="bg-brand relative inline-flex size-2 rounded-full" />
            </span>
            Now in beta · AI sales assistant, 24/7
          </span>

          <h1 className="text-foreground text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-6xl xl:text-7xl">
            Your business{" "}
            <span className="relative inline-block whitespace-nowrap">
              sleeps.
              {/* brush underline */}
              <svg
                aria-hidden
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
                className="text-brand absolute -bottom-[0.12em] left-[-2%] h-[0.22em] w-[104%]"
              >
                <path
                  d="M3 11 C 70 1, 160 0, 297 5 L 296 15 C 180 10, 90 13, 6 19 Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <br />
            <span className="text-brand">
              Your customers don&apos;t.
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg text-balance md:text-xl lg:mx-0">
            Never miss a sale in your DMs again. Sojao answers every customer
            and helps close orders like your best salesperson, 24/7.
          </p>

          {/* CTA */}
          <div className="mt-8 flex justify-center lg:justify-start">
            <a
              href="/signup"
              className="bg-background/90 group rounded-full p-1.5 shadow-lg"
            >
              <span className="bg-primary text-primary-foreground flex items-center gap-3 rounded-full px-10 py-4 text-base font-medium transition-transform group-hover:scale-[1.02] md:px-14 md:text-lg">
                Start free
                <span className="bg-primary-foreground/20 flex size-7 items-center justify-center rounded-full">
                  <ArrowRight className="size-4" />
                </span>
              </span>
            </a>
          </div>

          {/* feature pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
            {pills.map((pill) => {
              const Icon = pill.icon;
              return (
                <div
                  key={pill.title}
                  className="bg-background/80 flex items-center gap-3 rounded-full border py-1.5 pr-5 pl-1.5 text-left shadow-sm backdrop-blur"
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `color-mix(in oklch, ${pill.tint} 22%, transparent)`,
                      color: pill.tint,
                    }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="text-foreground block text-sm font-semibold">
                      {pill.title}
                    </span>
                    <span className="text-muted-foreground block text-xs">
                      {pill.description}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <HeroScene className="shadow-2xl ring-1 ring-white/10" />
      </div>
    </section>
  );
};
