"use client";

import { useState } from "react";

import { Check, CreditCard, Download, Info } from "lucide-react";

import {
  Badge,
  PageHeader,
  Panel,
  Table,
  Td,
  Th,
  Toggle,
} from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { brand, invoices, metaFees, usage } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    monthly: 29,
    yearly: 290,
    features: ["Comment-to-DM and story replies", "Lead capture", "DM answers and product suggestions", "Checkout links", "Order status and handover"],
  },
  {
    name: "Growth",
    monthly: 79,
    yearly: 790,
    features: ["Everything in Starter", "Broadcasts and drip sequences", "Keyword triggers", "Abandoned DM follow-up and upsells", "Delivery updates and returns"],
  },
  {
    name: "Pro",
    monthly: 199,
    yearly: 1990,
    features: ["Everything in Growth", "Giveaways and growth tools", "Click-to-DM ads", "Segments and customer history", "Review requests"],
  },
];

const usd = (n: number, d = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: d, maximumFractionDigits: d }).format(n);

export default function BillingPage() {
  const [yearly, setYearly] = useState(false);
  const [current, setCurrent] = useState(brand.plan);
  const [confirm, setConfirm] = useState<string | null>(null);
  const plan = PLANS.find((p) => p.name === current)!;
  const feeTotal = metaFees.reduce((s, f) => s + f.cost, 0);

  return (
    <>
      <PageHeader
        title="Billing"
        description="Your plan, usage, invoices and payment details."
      />

      {/* Beta banner */}
      <div className="from-brand/15 via-glow/10 to-card mb-6 flex flex-wrap items-center gap-4 rounded-2xl border bg-linear-to-r p-5">
        <Badge tone="brand">BETA</Badge>
        <p className="flex-1 text-sm">
          You&apos;re a founding brand. Sojao is <b>free until [beta end date]</b>.
          After that you keep a <b>50% founding discount</b>.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Current plan */}
        <Panel title="Current plan" className="xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-display text-3xl">{plan.name}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {usd(plan.monthly)}/month · after the beta you pay{" "}
                <span className="text-foreground font-medium">{usd(plan.monthly / 2, 2)}/month</span>{" "}
                with your founding discount
              </p>
            </div>
            <Badge tone="good">
              <Check className="size-3" /> Active
            </Badge>
          </div>
          <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="text-brand size-4 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-3">
            <Detail label="Billing cycle" value={yearly ? "Yearly" : "Monthly"} />
            <Detail label="Next bill" value="Free during beta" />
            <Detail label="Amount due today" value={usd(0, 2)} />
          </div>
        </Panel>

        {/* Usage */}
        <Panel title="Usage this month" description="Resets on the 1st.">
          <ul className="space-y-5">
            {usage.map((u) => (
              <li key={u.label}>
                <div className="flex justify-between text-sm">
                  <span>{u.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {u.used.toLocaleString("en-US")} / {u.limit}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-5 flex gap-2 text-xs">
            <Info className="size-3.5 shrink-0" /> Plan limits are still being set. [__]
          </p>
        </Panel>
      </div>

      {/* Change plan */}
      <Panel
        className="mt-6"
        title="Change plan"
        description="Move to the plan that fits your brand."
        action={
          <div className="flex items-center gap-2 text-sm">
            <Toggle defaultOn={yearly} label="Bill yearly" onChange={setYearly} />
            <span>Yearly (2 months free)</span>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => {
            const isCurrent = p.name === current;
            return (
              <div
                key={p.name}
                className={cn("rounded-2xl border p-5", isCurrent && "outline-primary outline-2")}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{p.name}</p>
                  {isCurrent && <Badge tone="brand">Current</Badge>}
                </div>
                <p className="font-display mt-3 text-3xl">
                  {usd(yearly ? p.yearly : p.monthly)}
                  <span className="text-muted-foreground text-sm font-normal">
                    {" "}
                    / {yearly ? "year" : "month"}
                  </span>
                </p>
                <ul className="text-muted-foreground mt-4 space-y-1.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                {confirm === p.name ? (
                  <div className="mt-5 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setCurrent(p.name);
                        setConfirm(null);
                      }}
                    >
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setConfirm(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="mt-5 w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent}
                    onClick={() => setConfirm(p.name)}
                  >
                    {isCurrent ? "Your plan" : `Switch to ${p.name}`}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Payment */}
        <Panel title="Payment details">
          <div className="flex items-center gap-4 rounded-xl border p-4">
            <span className="bg-muted flex size-11 items-center justify-center rounded-lg">
              <CreditCard className="size-5" />
            </span>
            <div className="flex-1">
              <p className="font-medium">[Card on file]</p>
              <p className="text-muted-foreground text-xs">No card needed during the beta</p>
            </div>
            <Button size="sm" variant="outline">
              Add card
            </Button>
          </div>
          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <Detail label="Billing email" value="[billing email]" />
            <Detail label="Company" value={brand.name} />
          </div>
        </Panel>

        {/* Meta fees */}
        <Panel
          title="WhatsApp message fees"
          description="Meta charges these per message. We pass them on at cost, with no markup."
        >
          <ul className="divide-y text-sm">
            {metaFees.map((f) => (
              <li key={f.label} className="flex justify-between py-2.5">
                <span>
                  {f.label} <span className="text-muted-foreground">· {f.count} sent</span>
                </span>
                <span className="tabular-nums">{usd(f.cost, 2)}</span>
              </li>
            ))}
            <li className="flex justify-between py-2.5 font-medium">
              <span>This month so far</span>
              <span className="tabular-nums">{usd(feeTotal, 2)}</span>
            </li>
          </ul>
        </Panel>
      </div>

      {/* Invoices */}
      <Panel className="mt-6" title="Invoices">
        <Table>
          <thead>
            <tr>
              <Th>Invoice</Th>
              <Th>Date</Th>
              <Th>Plan</Th>
              <Th>Status</Th>
              <Th className="text-right">Amount</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {invoices.map((i) => (
              <tr key={i.id}>
                <Td className="font-medium">{i.id}</Td>
                <Td className="text-muted-foreground">{i.date}</Td>
                <Td>{i.plan}</Td>
                <Td>
                  <Badge tone="good">{i.status}</Badge>
                </Td>
                <Td className="text-right tabular-nums">{usd(i.amount, 2)}</Td>
                <Td className="text-right">
                  <Button size="sm" variant="ghost">
                    <Download className="size-4" /> PDF
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>

      <div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span>Need to cancel? You can cancel your plan here. [Cancellation terms]</span>
        <Button variant="outline" size="sm">
          Cancel plan
        </Button>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
