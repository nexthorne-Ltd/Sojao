import { ArrowRight, Check, Link2, MessageCircle, Power, Send, Sparkles } from "lucide-react";
import { FaFacebookMessenger, FaInstagram } from "react-icons/fa";

import { DashedLine } from "../dashed-line";

import { cn } from "@/lib/utils";

/* ---------- small product-style visuals, one per step ---------- */

const Toggle = ({ on = true }: { on?: boolean }) => (
  <span
    className={cn(
      "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors",
      on ? "bg-brand" : "bg-muted-foreground/30",
    )}
  >
    <span
      className={cn(
        "absolute top-0.5 size-4 rounded-full bg-white shadow transition-all",
        on ? "left-[18px]" : "left-0.5",
      )}
    />
  </span>
);

const ConnectVisual = () => (
  <div className="space-y-2">
    {[
      {
        name: "Instagram",
        handle: "@yourbrand",
        icon: FaInstagram,
        tint: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
      },
      {
        name: "Messenger",
        handle: "Your Brand",
        icon: FaFacebookMessenger,
        tint: "linear-gradient(45deg, #0099FF 0%, #A033FF 60%, #FF5280 90%, #FF7061 100%)",
      },
    ].map(({ name, handle, icon: Icon, tint }) => {
      const soon = name === "Messenger"; // not live in the product yet
      return (
      <div key={name} className="bg-background flex items-center gap-3 rounded-2xl border p-2.5">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: tint }}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm leading-tight font-medium">{name}</p>
          <p className="text-muted-foreground truncate text-xs">{handle}</p>
        </div>
        {soon ? (
          <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-[11px] font-semibold">Coming soon</span>
        ) : (
          <span className="bg-brand/12 text-brand flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold">
            <Check className="size-3" /> Connected
          </span>
        )}
      </div>
      );
    })}
  </div>
);

const BrandVisual = () => (
  <div className="bg-background space-y-3 rounded-2xl border p-3 text-left">
    <div>
      <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
        Tone of voice
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {["Friendly", "Playful", "Formal"].map((t, i) => (
          <span
            key={t}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs",
              i < 2 ? "border-brand bg-brand/12 text-brand font-semibold" : "text-muted-foreground",
            )}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
    <div>
      <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
        Links and products
      </p>
      <div className="mt-1.5 space-y-1.5">
        {["yourbrand.shop/new-drop", "Summer collection · 24 items"].map((l) => (
          <div key={l} className="bg-muted/60 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs">
            <Link2 className="text-muted-foreground size-3.5 shrink-0" />
            <span className="truncate">{l}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AutomationVisual = () => (
  <div className="bg-background space-y-3 rounded-2xl border p-3 text-left">
    <div className="flex items-center justify-between gap-2">
      <p className="text-sm font-semibold">Comment-to-DM</p>
      <Toggle />
    </div>
    <div className="flex items-center gap-1.5 text-xs">
      <span className="bg-muted flex flex-1 items-center gap-1.5 rounded-lg px-2 py-1.5">
        <MessageCircle className="size-3.5 shrink-0" /> “DROP”
      </span>
      <ArrowRight className="text-muted-foreground size-3.5 shrink-0" />
      <span className="bg-brand/12 text-brand flex flex-1 items-center gap-1.5 rounded-lg px-2 py-1.5 font-medium">
        <Send className="size-3.5 shrink-0" /> Send link
      </span>
    </div>
    <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <span className="relative flex size-2">
        <span className="bg-brand absolute inline-flex size-full animate-ping rounded-full opacity-60" />
        <span className="bg-brand relative inline-flex size-2 rounded-full" />
      </span>
      Live · running all night
    </p>
  </div>
);

const steps = [
  {
    n: "01",
    title: "Connect your accounts",
    description:
      "Log in with Instagram or Messenger through Meta. No code, no app to install.",
    icon: Link2,
    visual: ConnectVisual,
  },
  {
    n: "02",
    title: "Teach it your brand",
    description:
      "Add your links, products and tone of voice so every reply sounds like you.",
    icon: Sparkles,
    visual: BrandVisual,
  },
  {
    n: "03",
    title: "Turn on an automation",
    description:
      "Pick a ready-made flow like Comment-to-DM, switch it on, and go to sleep.",
    icon: Power,
    visual: AutomationVisual,
  },
];

export const HowItWorks = ({ className }: { className?: string }) => {
  return (
    <section id="how-it-works" className={cn("pb-28 lg:pb-32", className)}>
      <div className="container max-w-5xl">
        <div className="text-center">
          <p className="text-brand font-mono text-sm font-medium tracking-wide">
            HOW IT WORKS
          </p>
          <h2 className="mt-3 text-3xl tracking-tight text-balance md:text-4xl lg:text-5xl">
            Live in three steps.
          </h2>
        </div>

        <ol className="relative mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
          <DashedLine className="absolute top-6 right-[16%] left-[16%] w-auto max-md:hidden" />
          {steps.map(({ n, title, description, icon: Icon, visual: Visual }) => (
            <li key={n} className="relative flex flex-col items-center text-center">
              <span className="bg-primary text-primary-foreground relative z-10 flex size-12 items-center justify-center rounded-full shadow-md">
                <Icon className="size-5" />
              </span>
              <div className="bg-background/70 mt-5 flex w-full flex-1 flex-col overflow-hidden rounded-3xl border backdrop-blur">
                {/* visual */}
                <div
                  className="from-brand/10 relative flex min-h-[200px] items-center bg-linear-to-b to-transparent p-4"
                  aria-hidden
                >
                  <div className="w-full">
                    <Visual />
                  </div>
                </div>
                <div className="flex-1 px-6 pt-2 pb-6">
                  <span className="text-muted-foreground font-mono text-xs">{n}</span>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-balance">
                    {description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
