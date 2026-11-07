"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowUp, Sparkles } from "lucide-react";

import { BarChart, HBarList } from "@/components/dashboard/bar-chart";
import {
  HomeGreeting,
  LearnCards,
  NightShiftCard,
  PromoCard,
  StartHere,
} from "@/components/dashboard/home-top";
import { SetupChecklist } from "@/components/dashboard/setup-checklist";
import {
  Avatar,
  Badge,
  ChannelIcon,
  Panel,
  StatCard,
  Tabs,
  channelLabel,
  money,
} from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import {
  channelSplit,
  conversations,
  customerById,
  dailyChats,
  overviewStats,
  pillarSplit,
} from "@/lib/dashboard-data";

export default function OverviewPage() {
  const [metric, setMetric] = useState<"chats" | "sales">("chats");
  const [goal, setGoal] = useState("");
  const router = useRouter();
  const needsYou = conversations.filter((c) => c.status === "needs-you");

  return (
    <>
      <HomeGreeting />
      <PromoCard />
      <SetupChecklist />
      <StartHere />

      <h2 className="font-display mb-1 text-2xl font-semibold tracking-tight">Your numbers</h2>
      <p className="text-muted-foreground mb-5 text-sm">Last 14 days.</p>
      <NightShiftCard
        text={`Sojao answered 47 chats, sent 18 checkout links and closed 9 sales (${money(612)}) between 10 PM and 8 AM.`}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title={metric === "chats" ? "Chats per day" : "Sales from DMs per day"}
          description="Last 14 days"
          action={
            <Tabs
              tabs={[
                { id: "chats", label: "Chats" },
                { id: "sales", label: "Sales" },
              ]}
              value={metric}
              onChange={setMetric}
            />
          }
        >
          <BarChart
            label={metric === "chats" ? "chats" : "in sales"}
            data={dailyChats.map((d) => ({
              x: d.day,
              y: metric === "chats" ? d.chats : d.sales,
            }))}
            format={(n) => (metric === "chats" ? String(n) : money(n))}
          />
        </Panel>

        <Panel title="Where chats come from" description="Last 14 days">
          <HBarList
            items={channelSplit.map((c) => ({
              label: <ChannelIcon channel={c.channel} withLabel />,
              value: c.chats,
              display: `${c.chats} chats`,
            }))}
          />
          <div className="mt-6 grid gap-3 border-t pt-5">
            {pillarSplit.map((p) => (
              <div key={p.pillar} className="flex items-center justify-between text-sm">
                <span className="font-medium">{p.pillar}</span>
                <span className="text-muted-foreground">
                  {p.chats} chats · {p.detail}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Goal box */}
        <Panel
          title={
            <span className="flex items-center gap-2">
              <Sparkles className="size-4" /> Give Sojao a goal
            </span>
          }
          description="Type what you want. Sojao picks the audience, writes the message and closes the sale when people reply."
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(
                `/dashboard/marketing?goal=${encodeURIComponent(goal || "Send a promo for the new collection")}`,
              );
            }}
            className="space-y-3"
          >
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              placeholder="e.g. Send a promo for the new collection"
              className="bg-background focus-visible:ring-ring/50 w-full resize-none rounded-xl border p-3 text-sm outline-none focus-visible:ring-[3px]"
            />
            <div className="flex flex-wrap gap-2">
              {[
                "Send a promo for the new collection",
                "Win back customers from last month",
                "Run a giveaway for 1k followers",
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setGoal(s)}
                  className="hover:bg-accent rounded-full border px-3 py-1 text-xs"
                >
                  {s}
                </button>
              ))}
            </div>
            <Button type="submit" className="w-full">
              Plan it <ArrowUp className="size-4" />
            </Button>
          </form>
        </Panel>

        {/* Needs you */}
        <Panel
          title="Needs you"
          description="Sojao wasn't sure, so it handed these over."
          bodyClassName="p-0"
        >
          <ul className="divide-y">
            {needsYou.map((c) => {
              const cust = customerById(c.customerId);
              return (
                <li key={c.id}>
                  <Link
                    href={`/dashboard/inbox?c=${c.id}`}
                    className="hover:bg-accent/50 flex items-center gap-3 px-5 py-3"
                  >
                    <Avatar name={cust.name} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        {cust.name} <ChannelIcon channel={c.channel} className="size-3.5" />
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {c.preview}
                      </p>
                    </div>
                    <Badge tone="warn">Reply</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* Recent */}
        <Panel
          title="Latest chats"
          action={
            <Link
              href="/dashboard/inbox"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              View all
            </Link>
          }
          bodyClassName="p-0"
        >
          <ul className="divide-y">
            {conversations.slice(0, 5).map((c) => {
              const cust = customerById(c.customerId);
              return (
                <li key={c.id}>
                  <Link
                    href={`/dashboard/inbox?c=${c.id}`}
                    className="hover:bg-accent/50 flex items-center gap-3 px-5 py-3"
                  >
                    <Avatar name={cust.name} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{cust.name}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {channelLabel(c.channel)} · {c.preview}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {c.time}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <LearnCards />
    </>
  );
}
