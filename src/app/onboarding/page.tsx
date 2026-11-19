"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, ArrowRight, Check, Rocket, Store } from "lucide-react";

import { Badge, ChannelIcon, Toggle } from "@/components/dashboard/ui";
import { Logo } from "@/components/logo";
import { SectionMascot } from "@/components/section-mascot";
import { Button } from "@/components/ui/button";
import { api, ApiError, type IgAccount } from "@/lib/marketing-api";
import { SessionProvider, useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const STEPS = ["Your brand", "Connect Instagram", "Your store", "Teach Sojao", "Your plan", "Go live"] as const;

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

const inputCls =
  "bg-background focus-visible:ring-ring/50 h-11 w-full rounded-xl border px-3 text-sm outline-none focus-visible:ring-[3px]";

export default function OnboardingPage() {
  return (
    <SessionProvider>
      <Onboarding />
    </SessionProvider>
  );
}

function Onboarding() {
  const router = useRouter();
  const { session } = useSession();
  const [step, setStep] = useState(0);
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [ig, setIg] = useState<IgAccount | null | undefined>(undefined);
  const [tone, setTone] = useState("Friendly");
  const [shipping, setShipping] = useState("");
  const [returns, setReturns] = useState("");
  const [handOverRefunds, setHandOverRefunds] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (session?.workspace && !brandName) setBrandName(session.workspace.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.workspace]);
  useEffect(() => {
    void api<{ accounts: IgAccount[] }>("/instagram/accounts")
      .then((r) => setIg(r.accounts.find((a) => a.status === "active") ?? null))
      .catch(() => setIg(null));
    // Back from Instagram's connect screen: jump to the connect step.
    if (new URLSearchParams(window.location.search).get("step") === "connect") setStep(1);
  }, []);

  const canNext = [brandName.trim().length > 0 && !!category, true, true, true, true, true][step];

  /** Saves what this step collected, then moves on. */
  const next = async () => {
    setErr(null);
    setBusy(true);
    try {
      if (step === 0) await api("/workspace", { method: "PATCH", body: { name: brandName.trim() } });
      if (step === 3) {
        const policies = [shipping.trim() && `Shipping: ${shipping.trim()}`, returns.trim() && `Returns: ${returns.trim()}`].filter(Boolean).join("\n");
        const current = await api<{ handoverWords?: string[] }>("/brand-profile");
        const words = new Set([...(current.handoverWords ?? ["human", "agent"]), ...(handOverRefunds ? ["refund", "custom order"] : [])]);
        await api("/brand-profile", { method: "PUT", body: { brandName: brandName.trim(), tone, ...(policies ? { policies } : {}), handoverWords: [...words].slice(0, 20) } });
      }
      if (step < STEPS.length - 1) setStep(step + 1);
      else router.push("/dashboard");
    } catch (e) {
      setErr(e instanceof ApiError ? e.readable : "Couldn't save. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const connectInstagram = async () => {
    setErr(null);
    try {
      const { url } = await api<{ url: string }>("/instagram/connect", { method: "POST" });
      window.location.assign(url);
    } catch (e) {
      setErr(e instanceof ApiError ? e.readable : "Couldn't start the Instagram connection.");
    }
  };

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
            <Step title="Connect Instagram" text="Sojao runs your marketing in your Instagram DMs. You can also do this later in Settings.">
              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border p-4">
                  <ChannelIcon channel="instagram" className="size-7" />
                  <div className="flex-1">
                    <p className="font-medium">Instagram</p>
                    <p className="text-muted-foreground text-sm">{ig ? `Connected as @${ig.username}` : "DMs, comments, story replies and mentions"}</p>
                  </div>
                  {ig ? (
                    <Badge tone="good">
                      <Check className="size-3" /> Connected
                    </Badge>
                  ) : (
                    <Button onClick={() => void connectInstagram()} disabled={ig === undefined}>
                      Connect
                    </Button>
                  )}
                </div>
                {(["messenger", "whatsapp"] as const).map((ch) => (
                  <div key={ch} className="flex items-center gap-4 rounded-2xl border p-4 opacity-70">
                    <ChannelIcon channel={ch} className="size-7" />
                    <div className="flex-1">
                      <p className="font-medium capitalize">{ch}</p>
                      <p className="text-muted-foreground text-sm">Not available yet</p>
                    </div>
                    <Badge>Soon</Badge>
                  </div>
                ))}
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step title="Your store" text="Optional. Marketing automations work without it.">
              <div className="bg-muted/40 flex items-start gap-4 rounded-2xl border p-5">
                <span className="bg-brand/12 flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <Store className="size-5" />
                </span>
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    Shopify or a product list
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Connect Shopify or import a CSV later in Marketing → Shop tools, so Sojao can answer price and stock questions and match sales to Instagram. Press Continue for now.
                  </p>
                </div>
              </div>
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
                  <textarea rows={2} value={shipping} onChange={(e) => setShipping(e.target.value)} maxLength={1000} placeholder="e.g. Free shipping over $75. 2–4 business days." className={cn(inputCls, "h-auto py-2.5")} />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Returns</span>
                  <textarea rows={2} value={returns} onChange={(e) => setReturns(e.target.value)} maxLength={1000} placeholder="e.g. Free returns within 30 days." className={cn(inputCls, "h-auto py-2.5")} />
                </label>
                <div className="flex items-center justify-between rounded-xl border p-3 text-sm">
                  <span>Hand refunds and custom orders to me</span>
                  <Toggle defaultOn={handOverRefunds} onChange={setHandOverRefunds} label="Hand refunds and custom orders to me" />
                </div>
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step title="Your plan" text="No card needed.">
              <div className="bg-muted/40 flex items-start gap-4 rounded-2xl border p-5">
                <span className="bg-brand/12 flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <Check className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">
                    {session?.plan ? `${session.plan.name}${session.plan.beta ? " · Beta" : ""}` : "Free trial"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {session?.plan?.trialEndsAt ? `Free until ${new Date(session.plan.trialEndsAt).toLocaleDateString()}. ` : ""}Nothing is charged and no card is needed.
                  </p>
                </div>
              </div>
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
                  "Your marketing automations run day and night",
                  "Anything it isn't sure about comes to you",
                  `It talks in a ${tone.toLowerCase()} tone`,
                  ig ? `Connected to @${ig.username}` : "Connect Instagram in Settings to start",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="text-brand size-4 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {err && <p role="alert" className="mt-6 text-sm text-rose-600">{err}</p>}
          {/* Nav */}
          <div className="mt-10 flex items-center justify-between gap-3 border-t pt-6">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            <span className="text-muted-foreground text-xs">
              Step {step + 1} of {STEPS.length}
            </span>
            <Button onClick={() => void next()} disabled={!canNext || busy}>
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
