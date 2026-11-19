"use client";

import { useMemo, useState } from "react";

import { Download, RefreshCw } from "lucide-react";

import { inputCls } from "../modal";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { BarChart } from "@/components/dashboard/bar-chart";
import { Badge, Panel, StatCard, Table, Tabs, Td, Th } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, download } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type DimType = "all" | "campaign" | "automation" | "sequence" | "giveaway" | "link";
type Dimensions = Record<Exclude<DimType, "all">, { id: string; name: string }[]>;
type Funnel = { steps: { metric: string; value: number; rateOfSent: number; definition: string }[]; delivered: null; revenue: number };
type Failure = { reason: string; value: number; definition: string };
type ReportRow = { kind: string; refId: string; label: string; type: "direct" | "assisted" | null; currency: string; orders: number; revenue: string };
type Reconciliation = {
  byRule: { rule: string; status: string; currency: string; orders: number; revenue: string }[];
  attributedOrders: number;
  unattributedOrders: number;
  cancelledOrders: number;
  unattributed: { id: string; orderNumber: string | null; total: string; currency: string; orderedAt: string; email: string | null }[];
};

const METRIC_LABEL: Record<string, string> = { sent: "Sent", seen: "Seen", replied: "Replied", clicked: "Clicked", converted: "Orders", revenue: "Revenue" };
const KIND_LABEL: Record<string, string> = { comment: "Post / reel comment", keyword: "DM keyword", story: "Story", link: "Short link", ad: "Ad", campaign: "Broadcast", checkout_link: "Checkout link", code: "Discount code" };
const RULE_LABEL: Record<string, string> = { code: "Discount code", checkout_link: "Checkout link", click: "Short-link click", contact: "Email/phone from lead capture", last_touch: "Last touch in window", unattributed: "Not matched" };

const day = (d: Date) => d.toISOString().slice(0, 10);
const fmtMoney = (n: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

export function LiveResults() {
  const [view, setView] = useState<"overview" | "sales" | "reconcile">("overview");
  const [from, setFrom] = useState(() => day(new Date(Date.now() - 13 * 86_400_000)));
  const [to, setTo] = useState(() => day(new Date()));
  const [dim, setDim] = useState<{ type: DimType; id: string }>({ type: "all", id: "" });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Tabs
          tabs={[
            { id: "overview", label: "Messages" },
            { id: "sales", label: "Sales from Instagram" },
            { id: "reconcile", label: "Reconciliation" },
          ]}
          value={view}
          onChange={setView}
        />
        <label className="text-xs">
          <span className="text-muted-foreground mb-1 block">From</span>
          <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className={cn(inputCls, "h-9 w-40")} />
        </label>
        <label className="text-xs">
          <span className="text-muted-foreground mb-1 block">To</span>
          <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} className={cn(inputCls, "h-9 w-40")} />
        </label>
        {view === "overview" && <DimensionPicker value={dim} onChange={setDim} />}
      </div>
      {view === "overview" && <Overview from={from} to={to} dim={dim} />}
      {view === "sales" && <Sales from={from} to={to} />}
      {view === "reconcile" && <Reconcile from={from} to={to} />}
    </div>
  );
}

function DimensionPicker({ value, onChange }: { value: { type: DimType; id: string }; onChange: (v: { type: DimType; id: string }) => void }) {
  const { data } = useApi<Dimensions>("/analytics/dimensions");
  const groups: [Exclude<DimType, "all">, string][] = [
    ["campaign", "Broadcasts"],
    ["automation", "Automations"],
    ["sequence", "Drip sequences"],
    ["giveaway", "Giveaways"],
    ["link", "Links"],
  ];
  return (
    <label className="text-xs">
      <span className="text-muted-foreground mb-1 block">Show</span>
      <select
        className={cn(inputCls, "h-9 w-64")}
        value={value.type === "all" ? "all" : `${value.type}:${value.id}`}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "all") return onChange({ type: "all", id: "" });
          const i = v.indexOf(":");
          onChange({ type: v.slice(0, i) as DimType, id: v.slice(i + 1) });
        }}
      >
        <option value="all">Everything</option>
        {data &&
          groups.map(([k, label]) =>
            data[k]?.length ? (
              <optgroup key={k} label={label}>
                {data[k].map((d) => (
                  <option key={d.id} value={`${k}:${d.id}`}>
                    {d.name}
                  </option>
                ))}
              </optgroup>
            ) : null,
          )}
      </select>
    </label>
  );
}

function Overview({ from, to, dim }: { from: string; to: string; dim: { type: DimType; id: string } }) {
  const [metric, setMetric] = useState("sent");
  const q = `from=${from}&to=${to}&dimType=${dim.type}${dim.id ? `&dimId=${dim.id}` : ""}`;
  const funnel = useApi<Funnel>(`/analytics/funnel?${q}`);
  const failures = useApi<Failure[]>(`/analytics/failures?${q}`);
  const series = useApi<Record<string, number | string>[]>(`/analytics/timeseries?${q}&grain=day&metrics=${metric}`);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const chart = useMemo(() => (series.data ?? []).map((r) => ({ x: String(r.bucket).slice(5), y: Number(r[metric] ?? 0) })), [series.data, metric]);
  if (funnel.error) return <ErrorNote text={funnel.error} onRetry={funnel.reload} />;
  if (!funnel.data) return <Loading />;
  const sent = funnel.data.steps[0]?.value ?? 0;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {funnel.data.steps.map((s) => (
          <div key={s.metric} title={s.definition}>
            <StatCard label={METRIC_LABEL[s.metric] ?? s.metric} value={s.value.toLocaleString()} change={s.metric === "sent" ? undefined : `${s.rateOfSent}% of sent`} />
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        &ldquo;Delivered&rdquo; isn&apos;t shown: Instagram sends no delivery event, only &ldquo;seen&rdquo;. Revenue in this range: <strong className="text-foreground">{fmtMoney(funnel.data.revenue)}</strong> (net of refunds, shop currency).
      </p>

      <Panel
        title="Over time"
        description="Daily, in your workspace time zone."
        action={
          <div className="flex flex-wrap gap-2">
            <select aria-label="Metric" className={cn(inputCls, "h-9 w-36")} value={metric} onChange={(e) => setMetric(e.target.value)}>
              {Object.entries(METRIC_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <Button size="sm" variant="outline" onClick={() => void download(`/analytics/export.csv?${q}&grain=day`, "analytics.csv").catch(() => setNote("Export failed."))}>
              <Download className="size-4" /> CSV
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              title="Recompute the numbers for this date range from the raw data"
              onClick={async () => {
                setBusy(true);
                try {
                  await api("/analytics/backfill", { method: "POST", body: { from, to } });
                  setNote("Recomputing. Refresh in a minute.");
                } catch (e) {
                  setNote(errorText(e));
                } finally {
                  setBusy(false);
                }
              }}
            >
              <RefreshCw className="size-4" /> Recompute
            </Button>
          </div>
        }
      >
        {note && <p className="text-muted-foreground mb-3 text-xs">{note}</p>}
        {series.error ? (
          <ErrorNote text={series.error} onRetry={series.reload} />
        ) : !series.data ? (
          <Loading />
        ) : chart.every((c) => c.y === 0) ? (
          <Empty title="Nothing yet" text="No activity in this range. Numbers update every hour." />
        ) : (
          <BarChart data={chart} label={METRIC_LABEL[metric] ?? metric} format={(n) => (metric === "revenue" ? fmtMoney(n) : Math.round(n).toLocaleString())} />
        )}
      </Panel>

      <Panel title="Why messages didn't go out" description="Messages Sojao held back, and why.">
        {!failures.data ? (
          <Loading />
        ) : (
          <ul className="space-y-3">
            {failures.data.map((f) => {
              const total = failures.data!.reduce((s, x) => s + x.value, 0) || 1;
              return (
                <li key={f.reason} title={f.definition}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{failureLabel(f.reason)}</span>
                    <span className="tabular-nums">{f.value}</span>
                  </div>
                  <div className="bg-muted h-2 rounded-full">
                    <div className="bg-brand h-2 rounded-full" style={{ width: `${(f.value / total) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {sent > 0 && <p className="text-muted-foreground mt-4 text-xs">Hover a row to see exactly what it counts.</p>}
      </Panel>
    </>
  );
}

const failureLabel = (r: string) =>
  ({ window_closed: "24-hour window closed / no opt-in", opted_out: "Person opted out", rate_limited: "Waiting (hourly limit)", meta_error: "Instagram error", other: "Other (needs a human, missing variable…)" })[r] ?? r;

function Sales({ from, to }: { from: string; to: string }) {
  const { data, error, reload } = useApi<ReportRow[]>(`/attribution/report?from=${from}&to=${to}`);
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;
  const sum = (t: "direct" | "assisted") => data.filter((r) => r.type === t).reduce((s, r) => s + Number(r.revenue), 0);
  const orders = data.reduce((s, r) => s + r.orders, 0);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Orders from Instagram" value={orders.toLocaleString()} />
        <StatCard label="Direct revenue" value={fmtMoney(sum("direct"))} hint="Code, checkout link or tracked click" />
        <StatCard label="Assisted revenue" value={fmtMoney(sum("assisted"))} hint="Matched by email/phone or recent touch" />
      </div>
      <Panel title="By source" description="Net of refunds; cancelled orders excluded. Shop currency.">
        {data.length === 0 ? (
          <Empty title="No attributed orders yet" text="Connect Shopify. Orders are matched by discount code, checkout link, tracked link click, then email/phone." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Source</Th>
                <Th>Type</Th>
                <Th>Attribution</Th>
                <Th className="text-right">Orders</Th>
                <Th className="text-right">Revenue</Th>
              </tr>
            </thead>
            <tbody>
              {data
                .slice()
                .sort((a, b) => Number(b.revenue) - Number(a.revenue))
                .map((r) => (
                  <tr key={`${r.kind}-${r.refId}-${r.type}-${r.currency}`}>
                    <Td className="font-medium">{r.label}</Td>
                    <Td>{KIND_LABEL[r.kind] ?? r.kind}</Td>
                    <Td>
                      <Badge tone={r.type === "direct" ? "good" : "info"}>{r.type}</Badge>
                    </Td>
                    <Td className="text-right tabular-nums">{r.orders}</Td>
                    <Td className="text-right tabular-nums">{fmtMoney(Number(r.revenue), r.currency)}</Td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Panel>
    </>
  );
}

function Reconcile({ from, to }: { from: string; to: string }) {
  const { data, error, reload } = useApi<Reconciliation>(`/attribution/reconciliation?from=${from}&to=${to}`);
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Matched orders" value={String(data.attributedOrders)} />
        <StatCard label="Not matched" value={String(data.unattributedOrders)} />
        <StatCard label="Cancelled" value={String(data.cancelledOrders)} hint="Never counted as revenue" />
      </div>
      <Panel title="How each order was matched" description="Rules are tried in this order: discount code / checkout link, tracked click, lead-capture email/phone, last touch in the window.">
        <Table>
          <thead>
            <tr>
              <Th>Rule</Th>
              <Th>Status</Th>
              <Th className="text-right">Orders</Th>
              <Th className="text-right">Net revenue</Th>
            </tr>
          </thead>
          <tbody>
            {data.byRule.map((r) => (
              <tr key={`${r.rule}-${r.status}-${r.currency}`}>
                <Td>{RULE_LABEL[r.rule] ?? r.rule}</Td>
                <Td>
                  <Badge tone={r.status === "open" ? "neutral" : "bad"}>{r.status}</Badge>
                </Td>
                <Td className="text-right tabular-nums">{r.orders}</Td>
                <Td className="text-right tabular-nums">{fmtMoney(Number(r.revenue), r.currency)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
      <Panel title="Orders we couldn't match" description="Check these against your Shopify admin.">
        {data.unattributed.length === 0 ? (
          <Empty title="All matched" text="Every order in this range was matched to Instagram activity." />
        ) : (
          <ul className="divide-y text-sm">
            {data.unattributed.map((o) => (
              <li key={o.id} className="flex flex-wrap justify-between gap-2 py-2">
                <span className="font-medium">{o.orderNumber ?? o.id.slice(0, 8)}</span>
                <span className="text-muted-foreground">{o.email ?? "no email"}</span>
                <span className="text-muted-foreground">{new Date(o.orderedAt).toLocaleDateString()}</span>
                <span className="tabular-nums">{fmtMoney(Number(o.total), o.currency)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
