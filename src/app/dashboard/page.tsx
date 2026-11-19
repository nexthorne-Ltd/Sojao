"use client";

import { useState } from "react";

import Link from "next/link";

import { BarChart, HBarList } from "@/components/dashboard/bar-chart";
import { HomeGreeting, LearnCards, StartHere } from "@/components/dashboard/home-top";
import { ErrorNote, Loading } from "@/components/dashboard/marketing/live/states";
import { useApi } from "@/components/dashboard/marketing/live/use-api";
import { SetupChecklist, type SetupState } from "@/components/dashboard/setup-checklist";
import { Avatar, Panel, StatCard, Tabs } from "@/components/dashboard/ui";

type Home = {
  days: number;
  kpis: { dmsSent: number; leads: number; chats: number; orders: number; revenue: number; currency: string; needsYou: number };
  daily: { day: string; dms: number; leads: number }[];
  sources: { source: string; n: number }[];
  sentBy: { label: string; n: number }[];
  latestLeads: { id: string; name: string | null; username: string | null; email: string | null; phone: string | null; source: string | null; at: string }[];
  setup: SetupState;
};

const SOURCE_LABEL: Record<string, string> = { comment: "Post comments", story: "Story replies", dm: "Direct messages", ad: "Ads", link: "Links and QR codes", import: "Imported", widget: "Website widget" };
const SENT_LABEL: Record<string, string> = {
  comment_to_dm: "Comment-to-DM",
  story_reply: "Story replies",
  story_mention: "Story mentions",
  dm_keyword: "Keyword replies",
  welcome: "Welcome messages",
  follow: "New follower",
  broadcast: "Broadcasts",
};

export default function OverviewPage() {
  const [metric, setMetric] = useState<"dms" | "leads">("dms");
  const { data, error, reload } = useApi<Home>("/home?days=14");
  const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: data?.kpis.currency ?? "USD", maximumFractionDigits: 0 }).format(n);
  const chart = (data?.daily ?? []).map((d) => ({ x: d.day.slice(5), y: metric === "dms" ? d.dms : d.leads }));
  const empty = !!data && data.kpis.dmsSent === 0 && data.kpis.leads === 0 && data.kpis.chats === 0;

  return (
    <>
      <HomeGreeting needsYou={data?.kpis.needsYou ?? 0} />
      <SetupChecklist setup={data?.setup ?? null} />
      <StartHere />

      <h2 className="font-display mb-1 text-2xl font-semibold tracking-tight">Your marketing numbers</h2>
      <p className="text-muted-foreground mb-5 text-sm">Last 14 days.</p>

      {error ? (
        <ErrorNote text={error} onRetry={reload} />
      ) : !data ? (
        <Loading />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Automated DMs sent" value={data.kpis.dmsSent.toLocaleString()} />
            <StatCard label="Leads captured" value={data.kpis.leads.toLocaleString()} hint="Shared email or phone" />
            <StatCard label="People who messaged you" value={data.kpis.chats.toLocaleString()} />
            <StatCard label="Sales from Instagram" value={money(data.kpis.revenue)} hint={`${data.kpis.orders} orders`} />
          </div>
          {empty && (
            <p className="text-muted-foreground mt-4 rounded-xl border border-dashed p-4 text-sm">
              No activity yet. Connect Instagram and turn on an automation; numbers show up here as soon as people message you.
            </p>
          )}

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <Panel
              className="xl:col-span-2"
              title={metric === "dms" ? "Automated DMs per day" : "Leads captured per day"}
              description="Last 14 days"
              action={
                <Tabs
                  tabs={[
                    { id: "dms", label: "DMs" },
                    { id: "leads", label: "Leads" },
                  ]}
                  value={metric}
                  onChange={setMetric}
                />
              }
            >
              {chart.every((c) => c.y === 0) ? (
                <p className="text-muted-foreground py-16 text-center text-sm">Nothing in the last 14 days yet.</p>
              ) : (
                <BarChart label={metric === "dms" ? "DMs" : "leads"} format={(n) => String(Math.round(n))} data={chart} />
              )}
            </Panel>

            <Panel title="Where new people came from" description="Last 14 days">
              {data.sources.length === 0 ? (
                <p className="text-muted-foreground text-sm">No new people yet.</p>
              ) : (
                <HBarList items={data.sources.map((s) => ({ label: SOURCE_LABEL[s.source] ?? s.source, value: s.n, display: `${s.n}` }))} />
              )}
              {data.sentBy.length > 0 && (
                <div className="mt-6 grid gap-3 border-t pt-5">
                  {data.sentBy.map((p) => (
                    <div key={p.label} className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium">{SENT_LABEL[p.label] ?? p.label}</span>
                      <span className="text-muted-foreground tabular-nums">{p.n} DMs</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>

          <Panel
            className="mt-6"
            title="Latest leads"
            description="People who shared their email or phone in a chat."
            action={
              <Link href="/dashboard/marketing?tab=leads" className="text-muted-foreground hover:text-foreground text-sm whitespace-nowrap">
                View all
              </Link>
            }
            bodyClassName="p-0"
          >
            {data.latestLeads.length === 0 ? (
              <p className="text-muted-foreground px-5 py-6 text-sm">No leads yet. Turn on lead capture in a comment or story automation.</p>
            ) : (
              <ul className="divide-y">
                {data.latestLeads.map((l) => {
                  const name = l.name ?? (l.username ? `@${l.username}` : "Customer");
                  return (
                    <li key={l.id} className="flex items-center gap-3 px-5 py-3">
                      <Avatar name={name} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {SOURCE_LABEL[l.source ?? "dm"] ?? l.source} · {l.email ?? l.phone}
                        </p>
                      </div>
                      <span className="text-muted-foreground text-xs whitespace-nowrap">{new Date(l.at).toLocaleDateString()}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </>
      )}

      <LearnCards />
    </>
  );
}
