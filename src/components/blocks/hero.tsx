import { ArrowRight, HeartHandshake, Megaphone, ShoppingBag } from "lucide-react";

import { DashboardPreview } from "@/components/blocks/dashboard-preview";
import { Reveal } from "@/components/reveal";

const pills = [
  {
    title: "Marketing",
    description: "Live in beta",
    icon: Megaphone,
    tint: "var(--brand)",
    live: true,
  },
  {
    title: "Sales",
    description: "Coming soon",
    icon: ShoppingBag,
    tint: "var(--glow)",
    live: false,
  },
  {
    title: "Support",
    description: "Coming soon",
    icon: HeartHandshake,
    tint: "var(--primary)",
    live: false,
  },
];

export const Hero = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-40">
      <div className="container max-w-4xl">
        <div className="text-center">
          <Reveal y={12}>
          <span className="bg-background/80 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium shadow-sm backdrop-blur">
            <span className="relative flex size-2">
              <span className="bg-brand absolute inline-flex size-full animate-ping rounded-full opacity-60" />
              <span className="bg-brand relative inline-flex size-2 rounded-full" />
            </span>
            AI marketing agent · now in beta
          </span>
          </Reveal>

          <Reveal delay={0.08}>
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
          </Reveal>

          <Reveal delay={0.16}>
          <p className="text-muted-foreground mx-auto mt-6 max-w-md text-base text-balance md:text-lg">
            Sojao answers every DM and comment on Instagram and Messenger,
            day and night.
          </p>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.24} className="mt-8 flex justify-center">
            <a
              href="/signup"
              className="bg-background/90 group rounded-full p-1.5 shadow-lg"
            >
              <span className="bg-primary text-primary-foreground flex items-center gap-3 rounded-full px-10 py-4 text-base font-medium transition-transform group-hover:scale-[1.02] md:px-14 md:text-lg">
                Join the beta
                <span className="bg-primary-foreground/20 flex size-7 items-center justify-center rounded-full">
                  <ArrowRight className="size-4" />
                </span>
              </span>
            </a>
          </Reveal>

          {/* module pills */}
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {pills.map((pill) => {
              const Icon = pill.icon;
              return (
                <li
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
                    <span
                      className={
                        pill.live
                          ? "text-brand block text-xs font-medium"
                          : "text-muted-foreground block text-xs"
                      }
                    >
                      {pill.description}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <Reveal y={48} delay={0.2} className="container mt-16 md:mt-20 lg:mt-24">
        <DashboardPreview />
        <p className="text-muted-foreground mt-3 text-center text-xs">
          The Sojao Marketing dashboard, shown with sample data.
        </p>
      </Reveal>
    </section>
  );
};
