import Image from "next/image";

import { ArrowRight, Bot, CircleCheck, Infinity as InfinityIcon } from "lucide-react";

import { SectionMascot } from "@/components/section-mascot";

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
    <section className="py-28 lg:py-32 lg:pt-44">
      <SectionMascot />

      <div className="container text-center">
        <h1 className="text-foreground mx-auto max-w-5xl text-4xl leading-[1.1] font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
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
          <span className="text-foreground/90">Your customers don&apos;t.</span>
        </h1>

        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-balance md:text-xl">
          Never miss a sale in your DMs again. Sojao answers every customer like
          your best salesperson, 24/7.
        </p>

        {/* feature pills */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-4 md:mt-12">
          {pills.map((pill) => {
            const Icon = pill.icon;
            return (
              <div
                key={pill.title}
                className="bg-background/80 flex items-center gap-4 rounded-full border py-2.5 pr-7 pl-2.5 text-left shadow-sm backdrop-blur"
              >
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `color-mix(in oklch, ${pill.tint} 22%, transparent)`,
                    color: pill.tint,
                  }}
                >
                  <Icon className="size-6" />
                </span>
                <span>
                  <span className="text-foreground block font-semibold">
                    {pill.title}
                  </span>
                  <span className="text-muted-foreground block text-sm">
                    {pill.description}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center md:mt-12">
          <a
            href="/signup"
            className="bg-background/90 group rounded-full p-1.5 shadow-lg"
          >
            <span className="bg-primary text-primary-foreground flex items-center gap-3 rounded-full px-10 py-4 text-base font-medium transition-transform group-hover:scale-[1.02] md:px-16 md:text-lg">
              Start free
              <span className="bg-primary-foreground/20 flex size-7 items-center justify-center rounded-full">
                <ArrowRight className="size-4" />
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className="mt-16 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
        <div className="relative h-[793px] w-full">
          <Image
            src="/hero.webp"
            alt="Sojao AI dashboard"
            fill
            className="rounded-2xl object-cover object-left-top shadow-lg max-lg:rounded-tr-none"
          />
        </div>
      </div>
    </section>
  );
};
