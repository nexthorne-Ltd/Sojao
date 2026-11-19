"use client";

import { useEffect, useMemo, useState } from "react";

import { Pause, Play, Plus, Send, X } from "lucide-react";

import { RuleHint } from "../meta-rules";
import { Field, Modal, inputCls } from "../modal";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import {
  api,
  type Audience,
  type Campaign,
  type CampaignStatus,
  type Compliance,
  type IgAccount,
  type Workspace,
} from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<CampaignStatus, "neutral" | "brand" | "good" | "warn" | "bad" | "info"> = {
  draft: "neutral",
  scheduled: "info",
  sending: "brand",
  paused: "warn",
  completed: "good",
  cancelled: "bad",
};
const REASON: Record<string, string> = {
  opted_out: "opted out",
  outside_window: "outside 24h window",
  no_optin: "outside 24h, no opt-in",
  needs_human: "human took over",
  cancelled: "cancelled",
};

const when = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

export function LiveCampaigns() {
  const { data, error, loading, reload } = useApi<{ campaigns: Campaign[] }>("/campaigns");
  const accounts = useApi<{ accounts: IgAccount[] }>("/instagram/accounts").data?.accounts.filter((a) => a.status === "active") ?? [];
  const [composing, setComposing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Poll while something is sending.
  useEffect(() => {
    if (!data?.campaigns.some((c) => c.status === "sending" || c.status === "scheduled")) return;
    const t = setInterval(() => void reload(), 15_000);
    return () => clearInterval(t);
  }, [data, reload]);

  const control = async (c: Campaign, action: "pause" | "resume" | "cancel") => {
    if (action === "cancel" && !confirm(`Cancel “${c.name}”? People who haven't got it yet won't get it.`)) return;
    setNotice(null);
    try {
      await api(`/campaigns/${c.id}/${action}`, { method: "POST" });
      await reload();
    } catch (e) {
      setNotice(errorText(e));
    }
  };

  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  const list = data?.campaigns ?? [];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RuleHint>Broadcasts only reach people who messaged you in the last 24 hours, unless they opted in. Everyone else is skipped and counted.</RuleHint>
        <Button onClick={() => setComposing(true)} disabled={accounts.length === 0}>
          <Plus className="size-4" /> New broadcast
        </Button>
      </div>
      {accounts.length === 0 && <div className="mb-4"><ErrorNote text="Connect Instagram first to send broadcasts." /></div>}
      {notice && <div className="mb-4"><ErrorNote text={notice} /></div>}

      {list.length === 0 ? (
        <Empty title="No broadcasts yet" text="Send one message to a segment. Sojao paces it under Instagram's hourly limits and skips anyone it isn't allowed to message." />
      ) : (
        <div className="space-y-4">
          {list.map((c) => {
            const s = c.progress.byStatus;
            const total = Object.values(s).reduce((a, b) => a + b, 0);
            const sent = s.sent ?? 0;
            const pct = total ? Math.round((sent / total) * 100) : 0;
            return (
              <div key={c.id} className="bg-card rounded-2xl border p-5 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{c.name}</p>
                      <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-2 max-w-xl text-sm">{c.message.text}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.status === "sending" && (
                      <Button size="sm" variant="outline" onClick={() => control(c, "pause")}>
                        <Pause className="size-3.5" /> Pause
                      </Button>
                    )}
                    {c.status === "paused" && (
                      <Button size="sm" variant="outline" onClick={() => control(c, "resume")}>
                        <Play className="size-3.5" /> Resume
                      </Button>
                    )}
                    {["draft", "scheduled", "sending", "paused"].includes(c.status) && (
                      <Button size="sm" variant="ghost" onClick={() => control(c, "cancel")}>
                        <X className="size-3.5" /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
                {total > 0 && (
                  <div className="mt-4">
                    <div className="bg-muted h-2 overflow-hidden rounded-full" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                      <div className="bg-primary h-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <span>
                        <b className="text-foreground tabular-nums">{sent}</b> sent
                      </span>
                      <span className="tabular-nums">{c.progress.pending} waiting</span>
                      {(s.failed ?? 0) > 0 && <span className="text-rose-600 tabular-nums">{s.failed} failed</span>}
                      {Object.entries(c.progress.skippedReasons).map(([r, n]) => (
                        <span key={r} className="tabular-nums">
                          {n} skipped ({REASON[r] ?? r})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 text-xs">
                  {c.scheduledAt && <span>Starts {when(c.scheduledAt)}</span>}
                  {c.status === "sending" && c.progress.pending > 0 && <span>Est. finish {when(c.progress.estimatedFinishAt)}</span>}
                  {c.finishedAt && <span>Finished {when(c.finishedAt)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {composing && accounts[0] && (
        <Composer
          accounts={accounts}
          onClose={() => setComposing(false)}
          onDone={() => {
            setComposing(false);
            void reload();
          }}
        />
      )}
    </>
  );
}

/* ---------------- Composer ---------------- */

function Composer({ accounts, onClose, onDone }: { accounts: IgAccount[]; onClose: () => void; onDone: () => void }) {
  const tags = useApi<{ tags: { id: string; name: string }[] }>("/tags").data?.tags ?? [];
  const ws = useApi<Workspace>("/workspace").data;
  const [igAccountId, setIgAccountId] = useState(accounts[0]!.id);
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [recentOnly, setRecentOnly] = useState(true);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [btnTitle, setBtnTitle] = useState("");
  const [btnUrl, setBtnUrl] = useState("");
  const [later, setLater] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [testQuery, setTestQuery] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [c, setC] = useState<Compliance | null>(null);

  const audience: Audience = useMemo(
    () => ({ ...(picked.length ? { tags: picked } : {}), ...(recentOnly ? { lastInboundWithinHours: 24 } : {}) }),
    [picked, recentOnly],
  );

  // Live eligibility counts.
  useEffect(() => {
    const t = setTimeout(() => {
      api<Compliance>("/campaigns/compliance", { method: "POST", body: { igAccountId, audience } })
        .then(setC)
        .catch(() => setC(null));
    }, 300);
    return () => clearTimeout(t);
  }, [igAccountId, audience]);

  const message = () => ({
    text,
    ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
    ...(btnTitle.trim() && btnUrl.trim() ? { buttons: [{ type: "web_url" as const, title: btnTitle.trim(), url: btnUrl.trim() }] } : {}),
  });

  const create = async () => api<Campaign>("/campaigns", { method: "POST", body: { igAccountId, name: name.trim() || "Broadcast", audience, message: message() } });

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const camp = await create();
      await api(`/campaigns/${camp.id}/schedule`, { method: "POST", body: later && localTime ? { localTime } : {} });
      onDone();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  const testSend = async () => {
    setTestResult(null);
    setError(null);
    try {
      const found = await api<{ customers: { id: string; username: string | null }[] }>(`/customers?q=${encodeURIComponent(testQuery.replace(/^@/, ""))}`);
      const who = found.customers[0];
      if (!who) return setTestResult("No customer with that username yet. DM your brand account from it first.");
      const camp = await create();
      const r = await api<{ status: string; readable?: string }>(`/campaigns/${camp.id}/test`, { method: "POST", body: { customerId: who.id } });
      await api(`/campaigns/${camp.id}/cancel`, { method: "POST" });
      setTestResult(r.status === "sent" ? `Sent to @${who.username}.` : `Not sent: ${r.readable ?? r.status}`);
    } catch (e) {
      setError(errorText(e));
    }
  };

  return (
    <Modal
      title="New broadcast"
      description="One message to a segment of your customers on Instagram."
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy || !text.trim() || !c?.eligibleNow || (later && !localTime)}>
            <Send className="size-4" /> {later ? "Schedule" : "Send now"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Summer drop" />
          </Field>
          {accounts.length > 1 && (
            <Field label="Instagram account">
              <select className={inputCls} value={igAccountId} onChange={(e) => setIgAccountId(e.target.value)}>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    @{a.username}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Audience</p>
          <div className="flex flex-wrap gap-2">
            {tags.length === 0 && <span className="text-muted-foreground text-sm">No tags yet. Everyone is included.</span>}
            {tags.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={picked.includes(t.name)}
                onClick={() => setPicked((p) => (p.includes(t.name) ? p.filter((x) => x !== t.name) : [...p, t.name]))}
                className={cn("rounded-full border px-3 py-1 text-sm", picked.includes(t.name) ? "border-primary bg-accent" : "hover:bg-accent/50")}
              >
                {t.name}
              </button>
            ))}
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={recentOnly} onChange={(e) => setRecentOnly(e.target.checked)} />
            Only people who messaged in the last 24 hours
          </label>
        </div>

        <div className="bg-muted/50 grid grid-cols-2 gap-3 rounded-xl border p-4 text-sm sm:grid-cols-4" aria-live="polite">
          <Count label="In segment" value={c?.total} />
          <Count label="Can get it now" value={c?.eligibleNow} strong />
          <Count label="Outside 24h / no opt-in" value={c ? c.ineligible.no_optin + c.ineligible.outside_window : undefined} />
          <Count label="Opted out" value={c?.ineligible.opted_out} />
          {c && c.eligibleNow > 0 && (
            <p className="text-muted-foreground col-span-full text-xs">
              Takes about {c.estimatedHours < 1 ? "under an hour" : `${Math.ceil(c.estimatedHours)} hours`} at Instagram-safe pace. People whose 24-hour window closes before their turn are skipped.
            </p>
          )}
        </div>

        <Field label="Message">
          <textarea rows={4} maxLength={640} className={cn(inputCls, "h-auto py-2")} value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <RuleHint>Only mention prices and offers that are real. Sojao sends this text exactly as written.</RuleHint>
        <Field label="Image URL (optional)">
          <input className={inputCls} type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <Field label="Button text">
            <input className={inputCls} maxLength={20} value={btnTitle} onChange={(e) => setBtnTitle(e.target.value)} placeholder="Shop now" />
          </Field>
          <Field label="Button link">
            <input className={inputCls} type="url" value={btnUrl} onChange={(e) => setBtnUrl(e.target.value)} placeholder="https://" />
          </Field>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={later} onChange={(e) => setLater(e.target.checked)} />
            Schedule for later
          </label>
          {later && (
            <Field label={`Send at (${ws?.timezone ?? "workspace time"})`}>
              <input className={inputCls} type="datetime-local" value={localTime} onChange={(e) => setLocalTime(e.target.value)} />
            </Field>
          )}
        </div>

        <details className="rounded-xl border p-4">
          <summary className="cursor-pointer text-sm font-medium">Send a test to yourself</summary>
          <div className="mt-3 flex gap-2">
            <input className={inputCls} value={testQuery} onChange={(e) => setTestQuery(e.target.value)} placeholder="@your_personal_username" aria-label="Test recipient username" />
            <Button variant="outline" className="h-10" onClick={testSend} disabled={!text.trim() || !testQuery.trim()}>
              Test
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">Message your brand account from that profile first, so the 24-hour window is open.</p>
          {testResult && <p className="mt-2 text-sm">{testResult}</p>}
        </details>

        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

function Count({ label, value, strong }: { label: string; value?: number; strong?: boolean }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={cn("tabular-nums", strong ? "text-lg font-semibold" : "font-medium")}>{value ?? "…"}</p>
    </div>
  );
}

