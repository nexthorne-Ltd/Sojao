"use client";

import { useState } from "react";

import { Download, Play, RotateCcw, X } from "lucide-react";

import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge, Panel, StatCard, Table, Tabs, Td, Th, Toggle } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, download } from "@/lib/marketing-api";

type Batch = { id: string; status: "draft" | "approved" | "completed" | "cancelled"; counts: Record<string, number>; holdoutPct: number; createdAt: string; approvedAt: string | null };
type Candidate = { c: { id: string; reason: string; group: string; suppressReason: string | null; message: string | null; messageSource: string | null; status: string; statusReason: string | null }; username: string | null; name: string | null };
type Settings = { enabled: boolean; silentDays: number; buyerSilentDays: number };
type Results = { treatment: { people: number; converted: number; rate: number }; holdout: { people: number; converted: number; rate: number }; liftPctPoints: number };

const REASON: Record<string, string> = { product_question: "Asked about a product", quiz_abandoned: "Left a quiz", code_unused: "Didn't use their code", past_buyer: "Past buyer, gone quiet" };
const GROUPS = ["treatment", "holdout", "unreachable", "suppressed"] as const;
const GROUP_LABEL: Record<(typeof GROUPS)[number], string> = { treatment: "Will get a DM", holdout: "Holdout (no DM)", unreachable: "Can't be reached", suppressed: "Skipped" };

/** Service 18: nightly win-back candidates, owner approval before every batch. */
export function LiveWinback() {
  const settings = useApi<Settings>("/winback/settings");
  const batches = useApi<Batch[]>("/winback/batches");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setErr(null);
    try {
      await fn();
      await batches.reload();
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  if (batches.error) return <ErrorNote text={batches.error} onRetry={batches.reload} />;
  const current = batches.data?.find((b) => b.id === open) ?? batches.data?.[0];

  return (
    <div className="space-y-4">
      <Panel
        title="Win-back"
        description="Each night Sojao finds people who showed buying intent and went quiet. You review every batch before anything is sent. Most quiet customers are outside Instagram's 24-hour window and can't be messaged; you can export them for your own ads."
        action={
          <Button size="sm" disabled={busy} onClick={() => void run(async () => setOpen((await api<Batch>("/winback/batches", { method: "POST", body: { holdoutPct: 10 } })).id))}>
            <RotateCcw className="size-4" /> Find candidates now
          </Button>
        }
      >
        {settings.data && (
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Toggle
                defaultOn={settings.data.enabled}
                label="Nightly win-back"
                onChange={async (on) => {
                  settings.setData({ ...settings.data!, enabled: on });
                  await api("/winback/settings", { method: "PATCH", body: { enabled: on } }).catch((e) => setErr(errorText(e)));
                }}
              />
              Build a batch every night
            </div>
            <span className="text-muted-foreground">
              Quiet for {settings.data.silentDays} days (buyers: {settings.data.buyerSilentDays}) · max 1 win-back per person per 30 days · 10% holdout
            </span>
          </div>
        )}
        {err && <div className="mt-3"><ErrorNote text={err} /></div>}
      </Panel>

      {!batches.data ? (
        <Loading />
      ) : !current ? (
        <Empty title="No batches yet" text="Click “Find candidates now” or turn on the nightly batch." />
      ) : (
        <>
          {batches.data.length > 1 && (
            <select aria-label="Batch" className="bg-background h-9 rounded-xl border px-3 text-sm" value={current.id} onChange={(e) => setOpen(e.target.value)}>
              {batches.data.map((b) => (
                <option key={b.id} value={b.id}>
                  {new Date(b.createdAt).toLocaleString()} · {b.status}
                </option>
              ))}
            </select>
          )}
          <BatchView batch={current} busy={busy} run={run} />
        </>
      )}
    </div>
  );
}

function BatchView({ batch, busy, run }: { batch: Batch; busy: boolean; run: (fn: () => Promise<unknown>) => Promise<void> }) {
  const [group, setGroup] = useState<(typeof GROUPS)[number]>("treatment");
  const cands = useApi<Candidate[]>(`/winback/batches/${batch.id}/candidates?group=${group}`);
  const results = useApi<Results>(batch.status === "draft" ? null : `/winback/batches/${batch.id}/results`);
  const n = (k: string) => batch.counts[k] ?? 0;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Candidates" value={String(n("candidates"))} />
        <StatCard label="Can be messaged" value={String(n("treatment") + n("holdout"))} hint={`${n("holdout")} held out to measure lift`} />
        <StatCard label="Can't be reached" value={String(n("unreachable"))} hint="Outside 24h window, no opt-in" />
        <StatCard label="Skipped" value={String(n("suppressed"))} hint="Opted out, recent buyer, recently contacted" />
      </div>
      <Panel
        title={
          <span className="flex items-center gap-2">
            Batch from {new Date(batch.createdAt).toLocaleDateString()} <Badge tone={batch.status === "draft" ? "warn" : batch.status === "cancelled" ? "neutral" : "good"}>{batch.status}</Badge>
          </span>
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => void download(`/winback/batches/${batch.id}/unreachable.csv`, "winback-unreachable.csv")}>
              <Download className="size-4" /> Unreachable CSV
            </Button>
            {batch.status === "draft" && (
              <>
                <Button size="sm" disabled={busy || n("treatment") === 0} onClick={() => void run(() => api(`/winback/batches/${batch.id}/approve`, { method: "POST" }))}>
                  <Play className="size-4" /> Approve and send {n("treatment")}
                </Button>
                <Button size="sm" variant="ghost" disabled={busy} onClick={() => void run(() => api(`/winback/batches/${batch.id}/cancel`, { method: "POST" }))}>
                  <X className="size-4" /> Discard
                </Button>
              </>
            )}
          </div>
        }
      >
        {results.data && (
          <p className="mb-4 text-sm">
            Bought within 30 days: <strong>{Math.round(results.data.treatment.rate * 100)}%</strong> of messaged vs <strong>{Math.round(results.data.holdout.rate * 100)}%</strong> of holdout · lift {results.data.liftPctPoints} points
          </p>
        )}
        <Tabs className="mb-4" tabs={GROUPS.map((g) => ({ id: g, label: GROUP_LABEL[g], count: n(g) }))} value={group} onChange={setGroup} />
        {!cands.data ? (
          <Loading />
        ) : cands.data.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nobody in this group.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Person</Th>
                <Th>Why</Th>
                <Th>{group === "treatment" ? "Message" : "Note"}</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {cands.data.map(({ c, username, name }) => (
                <tr key={c.id}>
                  <Td className="font-medium">{name ?? username ?? "Unknown"}</Td>
                  <Td>{REASON[c.reason] ?? c.reason}</Td>
                  <Td className="max-w-md text-xs">
                    {group === "treatment" ? (
                      <>
                        {c.message} {c.messageSource && <Badge className="ml-1">{c.messageSource.replace("_", " ")}</Badge>}
                      </>
                    ) : (
                      (c.suppressReason ?? c.statusReason ?? "").replaceAll("_", " ")
                    )}
                  </Td>
                  <Td>
                    <Badge tone={c.status === "sent" ? "good" : "neutral"}>{c.status}</Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
    </>
  );
}
