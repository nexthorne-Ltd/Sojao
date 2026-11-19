import Link from "next/link";

import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Icon = React.ComponentType<{ className?: string }>;

/** Top of a product / solution page: eyebrow, big title, text, buttons. */
export function PageHero({
  eyebrow,
  title,
  description,
  badge,
  primary = { label: "Join the beta", href: "/signup" },
  secondary,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  badge?: string;
  primary?: { label: string; href: string } | null;
  secondary?: { label: string; href: string };
  children?: React.ReactNode;
}) {
  return (
    <section className="container max-w-5xl pt-32 pb-16 text-center lg:pt-48 lg:pb-24">
      <Reveal y={12}>
        {eyebrow && (
          <p className="text-brand inline-flex items-center gap-2 font-mono text-sm font-medium tracking-wide uppercase">
            {eyebrow}
            {badge && (
              <span className="bg-muted text-muted-foreground rounded-full border px-2 py-0.5 font-sans text-[11px] normal-case">
                {badge}
              </span>
            )}
          </p>
        )}
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="mx-auto mt-4 max-w-4xl text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-6xl">
          {title}
        </h1>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-balance">{description}</p>
        </Reveal>
      )}
      {(primary || secondary) && (
        <Reveal delay={0.24} className="mt-8 flex flex-wrap justify-center gap-3">
          {primary && (
            <Button size="lg" className="group rounded-full" asChild>
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          )}
          {secondary && (
            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          )}
        </Reveal>
      )}
      {children && (
        <Reveal delay={0.3} y={40} className="mt-14">
          {children}
        </Reveal>
      )}
    </section>
  );
}

/** Section heading used inside pages. */
export function SectionTitle({ eyebrow, title, text, className }: { eyebrow?: string; title: React.ReactNode; text?: React.ReactNode; className?: string }) {
  return (
    <Reveal className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && <p className="text-brand font-mono text-sm font-medium tracking-wide uppercase">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl tracking-tight text-balance md:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="text-muted-foreground mt-4 text-balance">{text}</p>}
    </Reveal>
  );
}

/** Grid of feature cards that stagger in. */
export function FeatureGrid({ items, cols = 3 }: { items: { icon: Icon; title: string; text: string; badge?: string }[]; cols?: 2 | 3 | 4 }) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2", cols === 3 && "lg:grid-cols-3", cols === 4 && "lg:grid-cols-4")}>
      {items.map(({ icon: Icon, title, text, badge }, i) => (
        <Reveal as="li" key={title} delay={(i % 3) * 0.08}>
          <div className="group bg-background/70 hover:border-brand/40 h-full rounded-3xl border p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="bg-brand/12 text-brand group-hover:bg-brand flex size-10 items-center justify-center rounded-xl transition-colors group-hover:text-white">
                <Icon className="size-5" />
              </span>
              {badge && <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-[11px] font-semibold">{badge}</span>}
            </div>
            <h3 className="mt-5 font-semibold">{title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{text}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

/** Text on one side, visual on the other. */
export function SplitRow({
  eyebrow,
  title,
  text,
  points,
  visual,
  reverse,
  id,
  cta,
}: {
  eyebrow?: string;
  title: string;
  text: string;
  points?: string[];
  visual: React.ReactNode;
  reverse?: boolean;
  id?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section id={id} className="container max-w-6xl scroll-mt-32 py-14 lg:py-20">
      <div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", reverse && "lg:[&>*:first-child]:order-2")}>
        <Reveal>
          {eyebrow && <p className="text-brand font-mono text-sm font-medium tracking-wide uppercase">{eyebrow}</p>}
          <h2 className="mt-3 text-3xl tracking-tight text-balance md:text-4xl">{title}</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">{text}</p>
          {points && (
            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex gap-3 text-sm">
                  <span className="bg-brand/12 text-brand mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                    <Check className="size-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          )}
          {cta && (
            <Link href={cta.href} className="text-brand group mt-6 inline-flex items-center gap-1 text-sm font-semibold">
              {cta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </Reveal>
        <Reveal delay={0.12} y={32}>
          {visual}
        </Reveal>
      </div>
    </section>
  );
}

/** Small illustrative chat. Always labelled as an example by the caller. */
export function MiniChat({
  header,
  messages,
  note = "Example conversation.",
}: {
  header: React.ReactNode;
  messages: { from: "bot" | "user"; text: string }[];
  note?: string;
}) {
  return (
    <VisualFrame>
      <div className="flex items-center justify-between border-b pb-3 text-sm font-semibold">{header}</div>
      <div className="space-y-2 pt-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
            <p
              className={cn(
                "max-w-[82%] rounded-2xl px-3.5 py-2 text-left text-sm leading-snug",
                m.from === "user" ? "bg-brand rounded-br-md text-white" : "bg-muted rounded-bl-md",
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground mt-4 text-center text-xs">{note}</p>
    </VisualFrame>
  );
}

/** A soft framed panel used to hold small product-style visuals. */
export function VisualFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="bg-brand/15 pointer-events-none absolute -inset-4 rounded-[2.5rem] blur-3xl" />
      <div className="bg-card relative rounded-[2rem] border p-5 shadow-xl md:p-6">{children}</div>
    </div>
  );
}
