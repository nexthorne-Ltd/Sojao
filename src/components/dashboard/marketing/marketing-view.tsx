"use client";

import { useEffect, useState } from "react";

import { Plus, ShieldCheck, Sparkles, Target } from "lucide-react";

import { LiveAutomations } from "./live/live-automations";
import { LiveBuilder } from "./live/live-builder";
import { LiveCampaigns } from "./live/live-campaigns";
import { LiveGiveaways } from "./live/live-giveaways";
import { LiveGrowth } from "./live/live-growth";
import { LiveLeads } from "./live/live-leads";
import { LiveResults } from "./live/live-results";
import { LiveSegments } from "./live/live-segments";
import { LiveSequences } from "./live/live-sequences";
import { LiveShop } from "./live/live-shop";
import { LiveWinback } from "./live/live-winback";
import { PublicReplyQueue } from "./live/public-reply-queue";
import { Loading } from "./live/states";
import { useApi } from "./live/use-api";
import { META_RULES } from "./meta-rules";
import { inputCls } from "./modal";

import { PageHeader, Panel, Tabs } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tab =
  | "automations"
  | "leads"
  | "audience"
  | "broadcasts"
  | "sequences"
  | "giveaways"
  | "growth"
  | "rules"
  | "results"
  | "builder"
  | "winback"
  | "shop";

const TAB_IDS: Tab[] = ["automations", "leads", "audience", "broadcasts", "sequences", "giveaways", "growth", "rules", "results", "builder", "winback", "shop"];

export function MarketingView({ initialGoal, initialTab }: { initialGoal: string; initialTab?: string }) {
  const [tab, setTab] = useState<Tab>(TAB_IDS.includes(initialTab as Tab) ? (initialTab as Tab) : initialGoal ? "builder" : "automations");
  const [goal, setGoal] = useState(initialGoal);
  const [builderGoal, setBuilderGoal] = useState(initialGoal);
  // Bumping this opens the automation editor (header button, Home templates via ?new=1).
  const [newSignal, setNewSignal] = useState(0);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("new") === "1") setNewSignal((n) => n + 1);
  }, []);

  const changeTab = (t: Tab) => {
    setTab(t);
    try {
      window.history.replaceState(null, "", `/dashboard/marketing?tab=${t}`);
    } catch {}
  };

  return (
    <>
      <PageHeader
        title="Marketing"
        description="Bring customers in. Comment-to-DM, story replies, lead capture, broadcasts and more on Instagram."
        actions={
          <Button
            onClick={() => {
              changeTab("automations");
              setNewSignal((n) => n + 1);
            }}
          >
            <Plus className="size-4" /> New automation
          </Button>
        }
      />

      <Panel
        className="mb-6"
        title={
          <span className="flex items-center gap-2">
            <Sparkles className="size-4" /> Type a goal
          </span>
        }
        description="Sojao plans the audience and writes the message from your catalog. Nothing is sent until you approve it."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!goal.trim()) return;
            setBuilderGoal(goal.trim());
            changeTab("builder");
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Send a promo for the new collection" aria-label="Marketing goal" className={cn(inputCls, "sm:flex-1")} />
          <Button type="submit" className="h-10">
            <Target className="size-4" /> Plan it
          </Button>
        </form>
      </Panel>

      <Tabs
        className="mb-4 flex-wrap"
        tabs={[
          { id: "automations", label: "Automations" },
          { id: "leads", label: "Leads" },
          { id: "audience", label: "Tags and segments" },
          { id: "broadcasts", label: "Broadcasts" },
          { id: "sequences", label: "Drip sequences" },
          { id: "giveaways", label: "Giveaways" },
          { id: "growth", label: "Growth tools" },
          { id: "rules", label: "Opt-out and rules" },
          { id: "results", label: "Results" },
          { id: "builder", label: "AI builder" },
          { id: "winback", label: "Win-back" },
          { id: "shop", label: "Shop tools" },
        ]}
        value={tab}
        onChange={changeTab}
      />

      {tab === "automations" && (
        <>
          <PublicReplyQueue />
          <LiveAutomations newSignal={newSignal} />
        </>
      )}
      {tab === "leads" && <LiveLeads />}
      {tab === "audience" && <LiveSegments />}
      {tab === "broadcasts" && <LiveCampaigns />}
      {tab === "sequences" && <LiveSequences />}
      {tab === "giveaways" && <LiveGiveaways />}
      {tab === "growth" && <LiveGrowth />}
      {tab === "rules" && <OptOutAndRules />}
      {tab === "results" && <LiveResults />}
      {tab === "builder" && <LiveBuilder initialGoal={builderGoal} onOpenBroadcasts={() => changeTab("broadcasts")} />}
      {tab === "winback" && <LiveWinback />}
      {tab === "shop" && <LiveShop />}
    </>
  );
}

/* ---------------- Opt-out and Meta rules ---------------- */

/** The words the backend treats as an opt-out (services/inbound-router.ts OPT_OUT). */
const STOP_WORDS = ["stop", "unsubscribe", "stop messages", "opt out"];

function OptOutAndRules() {
  const { data } = useApi<{ customers: { id: string; name: string | null; username: string | null }[]; total: number }>("/customer-list?optedOut=1");
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Opt-out" description="If a customer sends one of these words as their whole message, all marketing to them stops.">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {STOP_WORDS.map((w) => (
              <span key={w} className="bg-muted rounded-full px-3 py-1 text-sm">
                {w}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Opted-out customers are skipped by broadcasts, drip sequences, win-back and giveaways. Sojao still answers if they message you first. To stop talking to someone completely, open them in Customers.
          </p>
          <div className="border-t pt-4">
            <p className="text-sm font-medium">Opted out{data ? ` (${data.customers.length})` : ""}</p>
            {!data ? (
              <Loading />
            ) : (
              <p className="text-muted-foreground mt-1 text-sm">{data.customers.length ? data.customers.map((c) => c.name ?? (c.username ? `@${c.username}` : "Customer")).join(", ") : "Nobody yet."}</p>
            )}
          </div>
        </div>
      </Panel>

      <Panel title="Meta messaging rules" description="Sojao follows these automatically.">
        <ul className="space-y-4 text-sm">
          {[
            ["Comment-to-DM", META_RULES.privateReply],
            ["Broadcasts and drips", META_RULES.window24h],
            ["Sending limit", META_RULES.sendLimit],
          ].map(([title, text]) => (
            <li key={title} className="flex gap-3">
              <ShieldCheck className="text-brand mt-0.5 size-5 shrink-0" />
              <span>
                <span className="block font-medium">{title}</span>
                <span className="text-muted-foreground">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
