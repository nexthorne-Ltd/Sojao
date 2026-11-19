"use client";

import Link from "next/link";

import { AlertTriangle, ArrowRight } from "lucide-react";

import { fmtDate, STATUS_META, type SubStatus } from "@/components/admin/store";
import { BarChart } from "@/components/dashboard/bar-chart";
import { ErrorNote, Loading } from "@/components/dashboard/marketing/live/states";
import { useApi } from "@/components/dashboard/marketing/live/use-api";
import { Avatar, Badge, PageHeader, Panel, StatCard, money } from "@/components/dashboard/ui";

type Overview = {
  accounts: number;
  users: number;
  mrr: number;
  byStatus: Record<string, number>;
  connectedInstagram: number;
  messagesSent30d: number;
  signupsByWeek: { week: string; n: number }[];
  newest: { id: string; brand: string; owner: string | null; email: string | null; createdAt: string; status: SubStatus | null }[];
  payments: { connected: boolean };
};

export function AdminOverview() {
  const { data, error, reload } = useApi<Overview>("/admin/overview");
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;
  const n = (s: string) => data.byStatus[s] ?? 0;
  const paying = n("active") + n("past_due");

  return (
    <>
      <PageHeader title="Overview" description="Everything happening across every Sojao account, at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Brands (accounts)" value={String(data.accounts)} hint={`${data.users} people with a login`} />
        <StatCard label="Paying" value={String(paying)} hint={`${n("trial")} on trial`} />
        <StatCard label="MRR" value={money(data.mrr)} hint={data.payments.connected ? `ARR ${money(data.mrr * 12)}` : "From plans set in admin (no payments yet)"} />
        <StatCard label="Instagram connected" value={String(data.connectedInstagram)} hint={`${data.messagesSent30d.toLocaleString()} DMs sent in 30 days`} />
      </div>

      {n("past_due") > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm">
          <AlertTriangle className="size-5 text-amber-600" />
          <p className="flex-1">
            <span className="font-medium">{n("past_due")} accounts are past due.</span> Follow up before they churn.
          </p>
          <Link href="/admin/subscriptions" className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline">
            Review <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel title="New signups" description="Per week, last 12 weeks" className="lg:col-span-3">
          {data.signupsByWeek.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center text-sm">No signups yet.</p>
          ) : (
            <BarChart data={data.signupsByWeek.map((w) => ({ x: w.week.slice(5), y: w.n }))} format={(v) => String(Math.round(v))} label="Signups" />
          )}
        </Panel>

        <Panel title="Accounts by status" className="lg:col-span-2">
          <ul className="space-y-4">
            {(Object.keys(STATUS_META) as SubStatus[]).map((s) => (
              <li key={s}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="font-medium">{STATUS_META[s].label}</span>
                  <span className="text-muted-foreground tabular-nums">{n(s)}</span>
                </div>
                <div className="bg-muted h-2.5 overflow-hidden rounded-full">
                  <div className="bg-brand h-full rounded-full" style={{ width: `${data.accounts ? (n(s) / data.accounts) * 100 : 0}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Latest signups"
        className="mt-6"
        bodyClassName="p-0"
        action={
          <Link href="/admin/users" className="text-sm font-medium underline-offset-4 hover:underline">
            All users
          </Link>
        }
      >
        {data.newest.length === 0 ? (
          <p className="text-muted-foreground px-5 py-6 text-sm">No accounts yet.</p>
        ) : (
          <ul className="divide-y">
            {data.newest.map((u) => (
              <li key={u.id}>
                <Link href={`/admin/users?u=${u.id}`} className="hover:bg-accent/50 flex items-center gap-3 px-5 py-3">
                  <Avatar name={u.owner ?? u.brand} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {u.owner ?? "No owner"} <span className="text-muted-foreground font-normal">· {u.brand}</span>
                    </p>
                    <p className="text-muted-foreground truncate text-xs">{u.email ?? "—"}</p>
                  </div>
                  {u.status && <Badge tone={STATUS_META[u.status].tone}>{STATUS_META[u.status].label}</Badge>}
                  <span className="text-muted-foreground w-24 text-right text-xs max-md:hidden">{fmtDate(u.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
