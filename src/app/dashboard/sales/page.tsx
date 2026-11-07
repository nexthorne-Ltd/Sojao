"use client";

import { useState } from "react";

import Link from "next/link";

import { Check, Copy, Lock, RefreshCw, Sparkles } from "lucide-react";

import {
  Avatar,
  Badge,
  PageHeader,
  Panel,
  StatCard,
  Table,
  Td,
  Th,
  Toggle,
  money,
} from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import {
  brand,
  customerById,
  followUps,
  products,
  salesStats,
} from "@/lib/dashboard-data";

const stockBadge = (stock: number) =>
  stock === 0 ? (
    <Badge tone="bad">Out of stock</Badge>
  ) : stock <= 5 ? (
    <Badge tone="warn">Low · {stock}</Badge>
  ) : (
    <Badge tone="good">In stock · {stock}</Badge>
  );

const followTone = {
  "Follow-up sent": "info",
  Waiting: "neutral",
  Recovered: "good",
  Lost: "bad",
} as const;

const upsells = [
  { when: "Glow Serum", suggest: "Night Cream", on: true },
  { when: "Linen Wrap Dress", suggest: "Pearl Drop Earrings", on: true },
  { when: "Satin Slip Skirt", suggest: "Gold Cuff Bracelet", on: false },
];

export default function SalesPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const isPro = brand.plan === "Pro";

  return (
    <>
      <PageHeader
        title="Sales"
        description="Sell to them. Sojao answers from your store data, sends checkout links in the chat and follows up when people go quiet."
        actions={
          <Button variant="outline">
            <RefreshCw className="size-4" /> Sync products
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {salesStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Panel
        className="mt-6"
        title="Products Sojao sells"
        description="Synced from your store. Sojao only answers with what's really in stock."
      >
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Stock</Th>
              <Th className="text-right">Price</Th>
              <Th className="text-right">Asked about</Th>
              <Th className="text-right">Links sent</Th>
              <Th className="text-right">Sold in chat</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-accent/30">
                <Td>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-muted-foreground text-xs">{p.variants}</p>
                </Td>
                <Td>{stockBadge(p.stock)}</Td>
                <Td className="text-right tabular-nums">{money(p.price)}</Td>
                <Td className="text-right tabular-nums">{p.asked}</Td>
                <Td className="text-right tabular-nums">{p.links}</Td>
                <Td className="text-right tabular-nums">{p.sold}</Td>
                <Td className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={p.stock === 0}
                    onClick={() => {
                      setCopied(p.id);
                      setTimeout(() => setCopied(null), 1500);
                    }}
                  >
                    {copied === p.id ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied === p.id ? "Copied" : "Checkout link"}
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel
          title="Abandoned DM follow-ups"
          description="People who asked, then went quiet. Sojao checks back in once, kindly."
          bodyClassName="p-0"
        >
          <ul className="divide-y">
            {followUps.map((f) => {
              const c = customerById(f.customerId);
              return (
                <li key={f.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {f.product} · {money(f.value)} · last message {f.lastMessage}
                    </p>
                  </div>
                  <Badge tone={followTone[f.status]}>{f.status}</Badge>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center justify-between gap-4 border-t px-5 py-4 text-sm">
            <span>Send one follow-up after</span>
            <select className="bg-background rounded-lg border px-2 py-1 text-sm">
              <option>3 hours</option>
              <option>12 hours</option>
              <option>24 hours</option>
            </select>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="size-4" /> Upsells
              </span>
            }
            description="Sojao suggests a matching item before checkout."
            bodyClassName="p-0"
          >
            <ul className="divide-y">
              {upsells.map((u) => (
                <li key={u.when} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="flex-1">
                    When someone buys <span className="font-medium">{u.when}</span>,
                    suggest <span className="font-medium">{u.suggest}</span>
                  </span>
                  <Toggle defaultOn={u.on} label={`Upsell ${u.suggest}`} />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Customer history" description="Sojao remembers returning customers: sizes, past orders and favorites.">
            {isPro ? (
              <Link href="/dashboard/customers" className="text-sm underline underline-offset-4">
                View customers
              </Link>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Lock className="size-4" />
                <span className="flex-1">Full customer history is on the Pro plan.</span>
                <Button size="sm" asChild>
                  <Link href="/dashboard/billing">Upgrade</Link>
                </Button>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
