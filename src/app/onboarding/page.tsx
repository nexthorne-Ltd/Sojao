"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, ArrowRight, Check, Rocket, Store, Upload } from "lucide-react";

import { Badge, ChannelIcon, Toggle } from "@/components/dashboard/ui";
import { Logo } from "@/components/logo";
import { SectionMascot } from "@/components/section-mascot";
import { Button } from "@/components/ui/button";
import type { Channel } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const STEPS = [
  "Your brand",
  "Connect apps",
  "Connect store",
  "Teach Sojao",
  "Pick a plan",
  "Go live",
] as const;

const CATEGORIES = [
  { name: "Fashion brand", live: true },
  { name: "Beauty brand", live: true },
  { name: "Accessories brand", live: true },
  { name: "D2C eCommerce brand", live: true },
  { name: "Instagram seller", live: true },
  { name: "WhatsApp seller", live: false },
  { name: "Local shop", live: false },
  { name: "Clinic", live: false },
  { name: "Real estate", live: false },
  { name: "Creator", live: false },
];

const PLANS = [
  { name: "Starter", price: 29, text: "All 3 pillars, basic version" },
  { name: "Growth", price: 79, text: "Broadcasts, drips, follow-ups, upsells, returns" },
  { name: "Pro", price: 199, text: "Giveaways, growth tools, ads, segments, history" },
];

const inputCls =
  "bg-background focus-visible:ring-ring/50 h-11 w-full rounded-xl border px-3 text-sm outline-none focus-visible:ring-[3px]";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [channels, setChannels] = useState<Record<Channel, boolean>>({
    instagram: false,
    messenger: false,
    whatsapp: false,
  });
  const [store, setStore] = useState<"shopify" | "csv" | "none" | null>(null);
  const [tone, setTone] = useState("Friendly");
  const [plan, setPlan] = useState("Growth");

  const canNext = [
    brandName.trim().length > 0 && !!category,
    Object.values(channels).some(Boolean),
    store !== null,
    true,
    true,
    true,
  ][step];

  const next = () => (step < STEPS.length - 1 ? setStep(step + 1) : router.push("/dashboard"));

  return (
    <div className="bg-muted/40 min-h-screen">
      <header className="bg-background flex h-16 items-center justify-between border-b px-4 md:px-8">
        <Logo className="text-[24px]" />
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground text-sm">
          Skip for now
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        {/* Progress */}
        <ol className="mb-10 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col gap-2">
              <span
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  i <= step ? "bg-brand" : "bg-border",
                )}
              />
              <span
                className={cn(
                  "hidden text-xs md:block",
                  i === step ? "text-foreground font-medium" : "text-muted-foreground",
                )}
              >
                {i + 1}. {s}
              </span>
            </li>
          ))}
        </ol>

        <div className="bg-card rounded-3xl border p-6 shadow-sm md:p-10">
          {step === 0 && (
            <Step title="Tell us about your brand" text="This helps Sojao talk like you from day one.">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Brand name</span>
                <input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Linen & Co."
                  className={inputCls}
                />
              </label>
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium">What do you sell?</p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      disabled={!c.live}
                      onClick={() => setCategory(c.name)}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                        category === c.name && "border-primary bg-primary/10",
                        c.live ? "hover:bg-accent" : "cursor-not-allowed opacity-60",
                      )}
                    >
                      {c.name}
                      {!c.live && <Badge>Soon</Badge>}
                      {category === c.name && <Check className="size-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step title="Connect your apps" text="Sojao answers DMs where your customers already are. Connect at least one.">
              <div className="space-y-3">
                {(
                  [
                    ["instagram", "DMs, comments, story replies and mentions"],
                    ["messenger", "Messages to your Facebook Page"],
                    ["whatsapp", "Chats, order updates and broadcasts"],
                  ] as [Channel, string][]
                ).map(([ch, text]) => (
                  <div key={ch} className="flex items-center gap-4 rounded-2xl border p-4">
                    <ChannelIcon channel={ch} className="size-7" />
                    <div className="flex-1">
                      <p className="font-medium capitalize">{ch === "whatsapp" ? "WhatsApp" : ch}</p>
                      <p className="text-muted-foreground text-sm">{text}</p>
                    </div>
                    <Button
                      variant={channels[ch] ? "outline" : "default"}
                      onClick={() => setChannels({ ...channels, [ch]: !channels[ch] })}
                    >
                      {channels[ch] ? (
                        <>
                          <Check className="size-4" /> Connected
                        </>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step title="Connect your store" text="Sojao answers price, size, stock and order questions from your real store.">
              <div className="grid gap-3 md:grid-cols-3">
                <Choice
                  active={store === "shopify"}
                  onClick={() => setStore("shopify")}
                  icon={<Store className="size-5" />}
                  title="Shopify"
                  text="Products, stock and live orders"
                />
                <Choice
                  active={store === "csv"}
                  onClick={() => setStore("csv")}
                  icon={<Upload className="size-5" />}
                  title="Upload a list"
                  text="CSV with name, price, sizes and stock"
                />
                <Choice
                  active={store === "none"}
                  onClick={() => setStore("none")}
                  icon={<ArrowRight className="size-5" />}
                  title="Do it later"
                  text="Sojao can still answer general questions"
                />
              </div>
              {store === "shopify" && (
                <label className="mt-5 block space-y-1.5">
                  <span className="text-sm font-medium">Your Shopify store address</span>
                  <input placeholder="yourbrand.myshopify.com" className={inputCls} />
                </label>
              )}
            </Step>
          )}

          {step === 3 && (
            <Step title="Teach Sojao the basics" text="You can change all of this later in Settings.">
              <div className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Tone of voice</span>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className={inputCls}>
                    <option>Friendly</option>
                    <option>Calm and premium</option>
                    <option>Playful</option>
                    <option>Short and simple</option>
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Shipping</span>
                  <textarea rows={2} placeholder="e.g. Free shipping over $75. 2–4 business days." className={cn(inputCls, "h-auto py-2.5")} />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Returns</span>
                  <textarea rows={2} placeholder="e.g. Free returns within 30 days." className={cn(inputCls, "h-auto py-2.5")} />
                </label>
                <div className="flex items-center justify-between rounded-xl border p-3 text-sm">
                  <span>Hand refunds and custom orders to me</span>
                  <Toggle defaultOn label="Hand refunds and custom orders to me" />
                </div>
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step title="Pick a plan" text="You're joining the beta: your first 3 months are free, then 50% off as a founding brand.">
              <div className="grid gap-3 md:grid-cols-3">
                {PLANS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setPlan(p.name)}
                    className={cn(
                      "rounded-2xl border p-5 text-left transition-colors",
                      plan === p.name ? "border-primary bg-primary/10" : "hover:bg-accent",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{p.name}</span>
                      {plan === p.name && <Check className="size-4" />}
                    </div>
                    <p className="font-display mt-2 text-2xl">
                      ${p.price}
                      <span className="text-muted-foreground text-sm font-normal"> / month</span>
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">{p.text}</p>
                  </button>
                ))}
              </div>
              <p className="text-muted-foreground mt-4 text-xs">
                No card needed during the beta. WhatsApp marketing message fees from Meta are billed at cost.
              </p>
            </Step>
          )}

          {step === 5 && (
            <div className="text-center">
              <SectionMascot className="mb-6 md:mb-8" actions={["ready", "warming up", "ready"]} />
              <h1 className="font-display text-3xl tracking-tight">You&apos;re all set{brandName ? `, ${brandName}` : ""}!</h1>
              <p className="text-muted-foreground mx-auto mt-3 max-w-md">
                Sleep tight. Sojao&apos;s got the night shift. Here&apos;s what happens when you go live:
              </p>
              <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm">
                {[
                  "Sojao answers every new DM, day and night",
                  "Anything it isn't sure about comes to you",
                  `It talks in a ${tone.toLowerCase()} tone`,
                  `You're on ${plan}, free for 3 months`,
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="text-brand size-4 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nav */}
          <div className="mt-10 flex items-center justify-between gap-3 border-t pt-6">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            <span className="text-muted-foreground text-xs">
              Step {step + 1} of {STEPS.length}
            </span>
            <Button onClick={next} disabled={!canNext}>
              {step === STEPS.length - 1 ? (
                <>
                  <Rocket className="size-4" /> Go live
                </>
              ) : (
                <>
                  Continue <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-2xl tracking-tight md:text-3xl">{title}</h1>
      <p className="text-muted-foreground mt-2 mb-8">{text}</p>
      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  icon,
  title,
  text,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-5 text-left transition-colors",
        active ? "border-primary bg-primary/10" : "hover:bg-accent",
      )}
    >
      <span className="bg-brand/12 flex size-10 items-center justify-center rounded-xl">{icon}</span>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm">{text}</p>
    </button>
  );
}
