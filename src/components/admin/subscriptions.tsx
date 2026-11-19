"use client";

import { useState } from "react";

import Link from "next/link";

import { fmtDate, type Plan, STATUS_META, useAdmin } from "@/components/admin/store";
import { accountMrr } from "@/components/admin/users";
import { useApi } from "@/components/dashboard/marketing/live/use-api";
import { Badge, PageHeader, Panel, StatCard, Table, Tabs, Td, Th, money } from "@/components/dashboard/ui";

type Tab = "subscriptions" | "payments";

export function AdminSubscriptions() {
  const { accounts } = useAdmin();
  const plans = useApi<{ plans: Plan[] }>("/admin/plans").data?.plans ?? [];
  const [tab, setTab] = useState<Tab>("subscriptions");
  const list = (accounts ?? []).filter((a) => a.sub);
  const mrr = list.reduce((s, a) => s + accountMrr(a, plans), 0);
  const trialsEnding = list.filter((a) => a.sub!.status === "trial" && a.sub!.trialEndsAt && new Date(a.sub!.trialEndsAt).getTime() - Date.now() < 7 * 86_400_000);

  return (
    <>
      <PageHeader title="Subscriptions" description="Who is on which plan, trials ending soon, and payments." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="MRR (from plans)" value={money(mrr)} hint="Active and past-due accounts" />
        <StatCard label="On trial" value={String(list.filter((a) => a.sub!.status === "trial").length)} hint={`${trialsEnding.length} end within 7 days`} />
        <StatCard label="Payments collected" value="—" hint="No payment provider connected yet" />
      </div>
      <Tabs
        className="my-6"
        tabs={[
          { id: "subscriptions", label: "Subscriptions", count: list.length },
          { id: "payments", label: "Payments" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "subscriptions" ? (
        <Panel>
          <Table>
            <thead>
              <tr>
                <Th>Brand</Th>
                <Th>Plan</Th>
                <Th>Status</Th>
                <Th>Trial ends</Th>
                <Th className="text-right">MRR</Th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.workspace.id}>
                  <Td>
                    <Link href={`/admin/users?u=${a.workspace.id}`} className="font-medium hover:underline">
                      {a.workspace.name}
                    </Link>
                    <p className="text-muted-foreground text-xs">{a.owner?.email ?? "—"}</p>
                  </Td>
                  <Td>
                    {plans.find((p) => p.id === a.sub!.planId)?.name ?? a.sub!.planId} · {a.sub!.cycle}
                    {a.sub!.beta && (
                      <Badge tone="brand" className="ml-2">
                        Beta
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    <Badge tone={STATUS_META[a.sub!.status].tone}>{STATUS_META[a.sub!.status].label}</Badge>
                  </Td>
                  <Td className="text-muted-foreground">{a.sub!.status === "trial" ? fmtDate(a.sub!.trialEndsAt) : "—"}</Td>
                  <Td className="text-right tabular-nums">{money(accountMrr(a, plans))}</Td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <Td colSpan={5} className="text-muted-foreground text-center">
                    No subscriptions yet.
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
        </Panel>
      ) : (
        <Panel title="Payments" description="Invoices, failed payments and refunds appear here once a payment provider is connected.">
          <p className="text-muted-foreground text-sm">No payment provider is connected yet. Plans and statuses are set by admins for now.</p>
        </Panel>
      )}
    </>
  );
}
