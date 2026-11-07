"use client";

import { useState } from "react";

import Link from "next/link";

import { useAdmin } from "@/components/admin/store";
import { Badge, PageHeader, Panel, StatCard, Table, Tabs, Td, Th, money } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { STATUS_META, fmtDate, userMrr } from "@/lib/admin-data";

type Tab = "subscriptions" | "payments";

export function AdminSubscriptions() {
  const { users, plans, payments, refund, updateUser } = useAdmin();
  const [tab, setTab] = useState<Tab>("subscriptions");
  const [confirm, setConfirm] = useState<string | null>(null);

  const subs = users
    .filter((u) => u.status !== "cancelled")
    .sort((a, b) => a.renewsOn.localeCompare(b.renewsOn));
  const mrr = users.reduce((s, u) => s + userMrr(u, plans), 0);
  const yearly = users.filter((u) => u.cycle === "yearly" && u.status === "active").length;
  const pastDue = users.filter((u) => u.status === "past_due");
  const collected = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const brandOf = (id: string) => users.find((u) => u.id === id);

  return (
    <>
      <PageHeader title="Subscriptions" description="Who is paying for what, upcoming renewals and every payment." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="MRR" value={money(mrr)} />
        <StatCard label="Collected (all time)" value={money(collected)} />
        <StatCard label="On yearly billing" value={String(yearly)} />
        <StatCard label="Past due" value={String(pastDue.length)} hint="need follow-up" />
      </div>

      <Tabs<Tab>
        className="mt-8 mb-4"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "subscriptions", label: "Subscriptions", count: subs.length },
          { id: "payments", label: "Payments", count: payments.length },
        ]}
      />

      {tab === "subscriptions" ? (
        <Panel>
          <Table>
            <thead>
              <tr>
                <Th>Account</Th>
                <Th>Plan</Th>
                <Th>Status</Th>
                <Th className="text-right">Price</Th>
                <Th>Renews / ends</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {subs.map((u) => {
                const p = plans.find((x) => x.id === u.plan)!;
                return (
                  <tr key={u.id}>
                    <Td>
                      <Link href={`/admin/users?u=${u.id}`} className="font-medium hover:underline">
                        {u.brand}
                      </Link>
                      <span className="text-muted-foreground block text-xs">{u.email}</span>
                    </Td>
                    <Td>
                      {p.name} <span className="text-muted-foreground text-xs capitalize">· {u.cycle}</span>
                    </Td>
                    <Td>
                      <Badge tone={STATUS_META[u.status].tone}>{STATUS_META[u.status].label}</Badge>
                    </Td>
                    <Td className="text-right tabular-nums">
                      {money(u.cycle === "yearly" ? p.yearly : p.monthly)}
                      <span className="text-muted-foreground text-xs">/{u.cycle === "yearly" ? "yr" : "mo"}</span>
                    </Td>
                    <Td className="whitespace-nowrap">{fmtDate(u.renewsOn)}</Td>
                    <Td className="text-right">
                      {u.status === "past_due" && (
                        <Button size="sm" variant="outline" onClick={() => updateUser(u.id, { status: "active" }, "Retried payment, marked paid")}>
                          Retry charge
                        </Button>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Panel>
      ) : (
        <Panel>
          <Table>
            <thead>
              <tr>
                <Th>Invoice</Th>
                <Th>Account</Th>
                <Th>Date</Th>
                <Th>Method</Th>
                <Th className="text-right">Amount</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <Td className="font-medium">{p.id}</Td>
                  <Td>{brandOf(p.userId)?.brand ?? "Deleted user"}</Td>
                  <Td className="whitespace-nowrap">{fmtDate(p.date)}</Td>
                  <Td className="text-muted-foreground">{p.method}</Td>
                  <Td className="text-right tabular-nums">{money(p.amount)}</Td>
                  <Td>
                    <Badge tone={p.status === "paid" ? "good" : p.status === "failed" ? "bad" : "neutral"}>{p.status}</Badge>
                  </Td>
                  <Td className="text-right whitespace-nowrap">
                    {p.status === "paid" &&
                      (confirm === p.id ? (
                        <span className="inline-flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setConfirm(null)}>
                            No
                          </Button>
                          <Button
                            size="sm"
                            className="bg-rose-600 text-white hover:bg-rose-700"
                            onClick={() => {
                              refund(p.id);
                              setConfirm(null);
                            }}
                          >
                            Refund {money(p.amount)}
                          </Button>
                        </span>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => setConfirm(p.id)}>
                          Refund
                        </Button>
                      ))}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel>
      )}
    </>
  );
}
