"use client";

import { useState } from "react";

import Link from "next/link";

import { Lock, Truck } from "lucide-react";

import {
  Avatar,
  Badge,
  ChannelIcon,
  PageHeader,
  Panel,
  StatCard,
  Table,
  Tabs,
  Td,
  Th,
  Toggle,
  money,
} from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import {
  type OrderStatus,
  brand,
  conversations,
  customerById,
  orders,
  returns as seedReturns,
  supportStats,
} from "@/lib/dashboard-data";

const orderTone: Record<OrderStatus, "info" | "brand" | "good" | "warn"> = {
  Processing: "info",
  Shipped: "brand",
  Delivered: "good",
  "Return requested": "warn",
};

const updates = [
  { name: "Order confirmed", text: "Sent right after checkout", on: true, pro: false },
  { name: "Shipped", text: "With the tracking link", on: true, pro: false },
  { name: "Out for delivery", text: "On the day it arrives", on: true, pro: false },
  { name: "Delivered", text: "Plus a care tip", on: false, pro: false },
  { name: "Review request", text: "7 days after delivery", on: false, pro: true },
];

export default function SupportPage() {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [returns, setReturns] = useState(seedReturns);
  const handovers = conversations.filter((c) => c.status === "needs-you");
  const isPro = brand.plan === "Pro";

  const shown = orders.filter((o) => filter === "all" || o.status === filter);

  return (
    <>
      <PageHeader
        title="Support"
        description="Look after them. Order updates, “where is my order?” answers, returns, and a handover to you when Sojao isn't sure."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {supportStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Handovers */}
      <Panel
        className="mt-6"
        title="Handed to you"
        description="Sojao passes these on and learns from how you reply."
        bodyClassName="p-0"
      >
        {handovers.length === 0 ? (
          <p className="text-muted-foreground p-5 text-sm">All clear. Sleep tight. 🌙</p>
        ) : (
          <ul className="divide-y">
            {handovers.map((h) => {
              const c = customerById(h.customerId);
              return (
                <li key={h.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <Avatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      {c.name} <ChannelIcon channel={h.channel} className="size-3.5" />
                    </p>
                    <p className="text-muted-foreground truncate text-xs">{h.preview}</p>
                  </div>
                  <Badge>{h.pillar}</Badge>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/inbox?c=${h.id}`}>Reply</Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      {/* Orders */}
      <Panel
        className="mt-6"
        title="Orders"
        description="Live from Shopify. Sojao uses this to answer order questions."
        action={
          <Tabs
            tabs={[
              { id: "all", label: "All" },
              { id: "Processing", label: "Processing" },
              { id: "Shipped", label: "Shipped" },
              { id: "Delivered", label: "Delivered" },
              { id: "Return requested", label: "Returns" },
            ]}
            value={filter}
            onChange={setFilter}
            className="max-md:hidden"
          />
        }
      >
        <Table>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Items</Th>
              <Th>Status</Th>
              <Th>Tracking</Th>
              <Th className="text-right">Updates sent</Th>
              <Th className="text-right">Total</Th>
            </tr>
          </thead>
          <tbody>
            {shown.map((o) => {
              const c = customerById(o.customerId);
              return (
                <tr key={o.id} className="hover:bg-accent/30">
                  <Td>
                    <p className="font-medium">{o.id}</p>
                    <p className="text-muted-foreground text-xs">{o.date}</p>
                  </Td>
                  <Td>{c.name}</Td>
                  <Td className="text-muted-foreground">{o.items}</Td>
                  <Td>
                    <Badge tone={orderTone[o.status]}>{o.status}</Badge>
                  </Td>
                  <Td className="text-muted-foreground font-mono text-xs">
                    {o.tracking ?? "—"}
                  </Td>
                  <Td className="text-right tabular-nums">{o.updatesSent}</Td>
                  <Td className="text-right tabular-nums">{money(o.total)}</Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Panel>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Returns */}
        <Panel title="Returns and issues" bodyClassName="p-0">
          <ul className="divide-y">
            {returns.map((r) => {
              const c = customerById(r.customerId);
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {r.order} · {c.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {r.reason} · wants {r.wants}
                    </p>
                  </div>
                  {r.status === "Needs you" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          setReturns((prev) =>
                            prev.map((x) =>
                              x.id === r.id ? { ...x, status: "Approved" as const } : x,
                            ),
                          )
                        }
                      >
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/dashboard/inbox?c=v4">Reply</Link>
                      </Button>
                    </div>
                  ) : (
                    <Badge tone={r.status === "Approved" ? "info" : "good"}>
                      {r.status}
                    </Badge>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* Delivery updates */}
        <Panel
          title={
            <span className="flex items-center gap-2">
              <Truck className="size-4" /> Automatic updates
            </span>
          }
          description="Messages Sojao sends after the sale, on the app the customer used."
          bodyClassName="p-0"
        >
          <ul className="divide-y">
            {updates.map((u) => (
              <li key={u.name} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-muted-foreground text-xs">{u.text}</p>
                </div>
                {u.pro && !isPro ? (
                  <Badge>
                    <Lock className="size-3" /> Pro
                  </Badge>
                ) : (
                  <Toggle defaultOn={u.on} label={`${u.name} message`} />
                )}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
