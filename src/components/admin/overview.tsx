"use client";

import Link from "next/link";

import { AlertTriangle, ArrowRight } from "lucide-react";

import { useAdmin } from "@/components/admin/store";
import { BarChart } from "@/components/dashboard/bar-chart";
import { Avatar, Badge, PageHeader, Panel, StatCard, money } from "@/components/dashboard/ui";
import { SIGNUPS_BY_WEEK, STATUS_META, fmtDate, userMrr } from "@/lib/admin-data";

export function AdminOverview() {
  const { users, plans, payments } = useAdmin();

  const paying = users.filter((u) => u.status === "active" || u.status === "past_due");
  const mrr = users.reduce((s, u) => s + userMrr(u, plans), 0);
  const trials = users.filter((u) => u.status === "trial");
  const pastDue = users.filter((u) => u.status === "past_due");
  const cancelled = users.filter((u) => u.status === "cancelled").length;
  const churn = users.length ? Math.round((cancelled / users.length) * 100) : 0;
  const failed = payments.filter((p) => p.status === "failed");

  const byPlan = plans.map((p) => {
    const list = users.filter((u) => u.plan === p.id && u.status !== "cancelled");
    return { plan: p, count: list.length, mrr: list.reduce((s, u) => s + userMrr(u, plans), 0) };
  });
  const maxCount = Math.max(1, ...byPlan.map((b) => b.count));

  const recent = [...users].sort((a, b) => b.signedUp.localeCompare(a.signedUp)).slice(0, 6);

  return (
    <>
      <PageHeader title="Overview" description="Everything happening across every Sojao account, at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registered users" value={String(users.length)} change={`+${SIGNUPS_BY_WEEK.at(-1)!.y} this week`} />
        <StatCard label="Paying customers" value={String(paying.length)} hint={`${trials.length} on trial`} />
        <StatCard label="MRR" value={money(mrr)} hint={`ARR ${money(mrr * 12)}`} />
        <StatCard label="Churn" value={`${churn}%`} hint={`${cancelled} cancelled`} />
      </div>

      {(pastDue.length > 0 || failed.length > 0) && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm">
          <AlertTriangle className="size-5 text-amber-600" />
          <p className="flex-1">
            <span className="font-medium">{pastDue.length} accounts are past due</span> and {failed.length} payments
            failed. Follow up before they churn.
          </p>
          <Link href="/admin/subscriptions" className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline">
            Review <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel title="New signups" description="Per week, last 8 weeks" className="lg:col-span-3">
          <BarChart data={SIGNUPS_BY_WEEK} format={(n) => String(n)} label="Signups" />
        </Panel>

        <Panel title="Users by plan" description="Excluding cancelled" className="lg:col-span-2">
          <ul className="space-y-5">
            {byPlan.map(({ plan, count, mrr }) => (
              <li key={plan.id}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="font-medium">{plan.name}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {count} users · {money(mrr)}/mo
                  </span>
                </div>
                <div className="bg-muted h-2.5 overflow-hidden rounded-full">
                  <div className="bg-brand h-full rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
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
        <ul className="divide-y">
          {recent.map((u) => (
            <li key={u.id}>
              <Link href={`/admin/users?u=${u.id}`} className="hover:bg-accent/50 flex items-center gap-3 px-5 py-3">
                <Avatar name={u.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {u.name} <span className="text-muted-foreground font-normal">· {u.brand}</span>
                  </p>
                  <p className="text-muted-foreground truncate text-xs">{u.email}</p>
                </div>
                <Badge tone="brand" className="max-sm:hidden">
                  {plans.find((p) => p.id === u.plan)!.name}
                </Badge>
                <Badge tone={STATUS_META[u.status].tone}>{STATUS_META[u.status].label}</Badge>
                <span className="text-muted-foreground w-24 text-right text-xs max-md:hidden">{fmtDate(u.signedUp)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
