"use client";

import { useEffect, useState } from "react";

import { Bot, Check, CircleAlert, Loader2, Send, ShieldCheck, Sparkles, X } from "lucide-react";

import { inputCls } from "../modal";
import { Empty, ErrorNote } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge, Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type Variant = { text: string; ok: boolean; issues: string[] };
type Proposal = {
  understanding: { objective: string; urgency: string };
  audience: { label: string; lowReach: boolean; compliance: { total: number; eligibleNow: number; estimatedFinishAt: string; notes: string[] } };
  alternatives: string[];
  variants: Variant[];
  schedule: { localTime: string; timezone: string; estimatedFinishAt: string; reason: string };
  offers: string[];
  approvalError?: string;
  question?: string;
};
type Run = {
  id: string;
  status: "running" | "awaiting_approval" | "needs_input" | "approved" | "rejected" | "refused" | "failed" | "completed";
  input: { goal: string; offers: string[] };
  steps: { at: string; node: string; message: string }[];
  proposal: Proposal | null;
  result: { campaignId?: string; message?: string } | null;
  error: string | null;
  tokensUsed: number;
  createdAt: string;
};

const NODE_LABEL: Record<string, string> = {
  understandGoal: "Understanding the goal",
  proposeAudience: "Picking the audience",
  draftMessages: "Writing drafts",
  policyCheck: "Checking prices, claims and rules",
  proposeSchedule: "Choosing a send time",
  approval: "Your decision",
  createCampaign: "Creating the broadcast",
};

/** Service 17: goal -> plan -> drafts -> YOUR approval -> scheduled broadcast. Never sends by itself. */
export function LiveBuilder({ initialGoal = "", onOpenBroadcasts }: { initialGoal?: string; onOpenBroadcasts?: () => void }) {
  const [goal, setGoal] = useState(initialGoal);
  const [offer, setOffer] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const runs = useApi<Run[]>("/builder/runs");

  useEffect(() => setGoal(initialGoal), [initialGoal]);

  const start = async () => {
    setStarting(true);
    setErr(null);
    try {
      const r = await api<Run>("/builder/runs", { method: "POST", body: { goal: goal.trim(), offers: offer.trim() ? [offer.trim()] : [] } });
      setRunId(r.id);
      void runs.reload();
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <Panel
          title={
            <span className="flex items-center gap-2">
              <Sparkles className="size-4" /> AI campaign builder
            </span>
          }
          description="Describe what you want. Sojao plans the audience, writes drafts from your catalog only, and waits for your approval. Nothing is sent until you approve."
        >
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (goal.trim().length >= 5) void start();
            }}
          >
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={2}
              maxLength={500}
              aria-label="Campaign goal"
              placeholder="e.g. Let people who chatted with us know the Glow Serum is back"
              className={cn(inputCls, "h-auto py-2")}
            />
            <input
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              maxLength={200}
              aria-label="Offer (optional)"
              placeholder="Offer, if any (e.g. 15% off with code GLOW15). Sojao never makes one up."
              className={inputCls}
            />
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={starting || goal.trim().length < 5}>
                {starting ? <Loader2 className="size-4 animate-spin" /> : <Bot className="size-4" />} Plan it
              </Button>
              <span className="text-muted-foreground text-xs">Up to 20 plans a day.</span>
            </div>
            {err && <ErrorNote text={err} />}
          </form>
        </Panel>
        {runId ? <RunView key={runId} id={runId} onChange={() => void runs.reload()} onOpenBroadcasts={onOpenBroadcasts} /> : <Empty title="No plan open" text="Type a goal above, or open a past plan." />}
      </div>

      <Panel title="Past plans" bodyClassName="p-2">
        {!runs.data?.length ? (
          <p className="text-muted-foreground p-3 text-sm">None yet.</p>
        ) : (
          <ul>
            {runs.data.map((r) => (
              <li key={r.id}>
                <button onClick={() => setRunId(r.id)} className={cn("hover:bg-muted w-full rounded-lg p-2 text-left text-sm", runId === r.id && "bg-muted")}>
                  <span className="line-clamp-2">{r.input.goal}</span>
                  <StatusBadge status={r.status} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function StatusBadge({ status }: { status: Run["status"] }) {
  const map: Record<Run["status"], [string, "neutral" | "good" | "warn" | "bad" | "info" | "brand"]> = {
    running: ["Working…", "info"],
    awaiting_approval: ["Needs your approval", "warn"],
    needs_input: ["Has a question", "warn"],
    approved: ["Approved", "good"],
    completed: ["Scheduled", "good"],
    rejected: ["Rejected", "neutral"],
    refused: ["Refused", "bad"],
    failed: ["Stopped", "bad"],
  };
  const [label, tone] = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}

function RunView({ id, onChange, onOpenBroadcasts }: { id: string; onChange: () => void; onOpenBroadcasts?: () => void }) {
  const { data: run, error, reload, setData } = useApi<Run>(`/builder/runs/${id}`);
  const [texts, setTexts] = useState<string[]>([]);
  const [chosen, setChosen] = useState(0);
  const [time, setTime] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Progress: poll while the graph is working. (The API also streams SSE at /events, but browsers can't send our API key header on EventSource.)
  useEffect(() => {
    if (run?.status !== "running") return;
    const t = setInterval(() => void reload(), 1000);
    return () => clearInterval(t);
  }, [run?.status, reload]);

  useEffect(() => {
    if (run?.status === "awaiting_approval" && run.proposal) {
      setTexts(run.proposal.variants.map((v) => v.text));
      const firstOk = run.proposal.variants.findIndex((v) => v.ok);
      setChosen(firstOk >= 0 ? firstOk : 0);
      setTime(run.proposal.schedule.localTime);
    }
    if (run && run.status !== "running") onChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run?.status, run?.proposal]);

  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!run) return null;

  const act = async (path: string, body: unknown) => {
    setBusy(true);
    setErr(null);
    try {
      await api(`/builder/runs/${id}/${path}`, { method: "POST", body });
      setData({ ...run, status: "running" });
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  const p = run.proposal;
  const edited = p && texts[chosen] !== undefined && texts[chosen] !== p.variants[chosen]?.text;

  return (
    <Panel title={run.input.goal} action={<StatusBadge status={run.status} />}>
      <ol className="mb-5 space-y-2 text-sm" aria-label="Progress">
        {run.steps.map((s, i) => (
          <li key={i} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <span>
              <span className="font-medium">{NODE_LABEL[s.node] ?? s.node}:</span> <span className="text-muted-foreground">{s.message}</span>
            </span>
          </li>
        ))}
        {run.status === "running" && (
          <li className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Working…
          </li>
        )}
      </ol>

      {run.status === "refused" && <ErrorNote text={run.result?.message ?? "Sojao can't help with this goal."} />}
      {run.status === "failed" && <ErrorNote text={run.error ?? "The plan stopped."} />}
      {run.status === "rejected" && <p className="text-muted-foreground text-sm">You rejected this plan. Nothing was created or sent.</p>}
      {run.status === "completed" && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span className="flex-1">Broadcast created and scheduled. It sends through the normal broadcast engine, with the 24-hour rule and hourly limits checked for every person.</span>
          {onOpenBroadcasts && (
            <Button size="sm" variant="outline" onClick={onOpenBroadcasts}>
              Open broadcasts
            </Button>
          )}
        </div>
      )}

      {run.status === "needs_input" && p?.question && (
        <form
          className="bg-muted/50 space-y-3 rounded-xl border p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (answer.trim()) void act("answer", { answer: answer.trim() });
          }}
        >
          <p className="flex gap-2 text-sm">
            <Bot className="mt-0.5 size-4 shrink-0" /> {p.question}
          </p>
          <div className="flex gap-2">
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} maxLength={200} aria-label="Your answer" placeholder="20% off with code SPRING20, or: no discount" className={inputCls} />
            <Button type="submit" disabled={busy || !answer.trim()}>
              <Send className="size-4" /> Reply
            </Button>
          </div>
        </form>
      )}

      {run.status === "awaiting_approval" && p && (
        <div className="space-y-5">
          <section className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs uppercase">Audience</p>
              <p className="font-medium">{p.audience.label}</p>
              <p className="text-muted-foreground">
                {p.audience.compliance.eligibleNow} of {p.audience.compliance.total} can get a DM now
              </p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-muted-foreground text-xs uppercase">When</p>
              <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Send time" className={cn(inputCls, "mt-1 h-9")} />
              <p className="text-muted-foreground mt-1 text-xs">
                {p.schedule.timezone} · {p.schedule.reason}
              </p>
            </div>
          </section>
          {p.audience.lowReach && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
              {p.alternatives.map((a, i) => (
                <p key={i} className={i === 0 ? "font-medium" : "text-muted-foreground mt-1"}>
                  {i > 0 && "• "}
                  {a}
                </p>
              ))}
            </div>
          )}

          <fieldset className="space-y-3">
            <legend className="text-muted-foreground mb-2 text-xs uppercase">Pick and edit a message</legend>
            {p.variants.map((v, i) => (
              <label key={i} className={cn("block rounded-xl border p-3", chosen === i && "border-brand ring-brand/30 ring-2", !v.ok && "opacity-80")}>
                <span className="mb-2 flex items-center gap-2 text-sm">
                  <input type="radio" name="variant" checked={chosen === i} onChange={() => setChosen(i)} disabled={!v.ok} />
                  Option {i + 1}
                  {v.ok ? <Badge tone="good">Passed checks</Badge> : <Badge tone="bad">Blocked</Badge>}
                </span>
                <textarea
                  value={texts[i] ?? ""}
                  onChange={(e) => setTexts(texts.map((t, j) => (j === i ? e.target.value : t)))}
                  rows={3}
                  maxLength={640}
                  disabled={!v.ok}
                  aria-label={`Message option ${i + 1}`}
                  className={cn(inputCls, "h-auto py-2")}
                />
                {!v.ok && (
                  <span className="mt-2 flex gap-1.5 text-xs text-rose-700 dark:text-rose-300">
                    <CircleAlert className="size-3.5 shrink-0" /> {v.issues.join(" · ")}
                  </span>
                )}
              </label>
            ))}
          </fieldset>
          {edited && <p className="text-muted-foreground text-xs">Your edit is checked again (prices, numbers, codes and claims) when you approve.</p>}
          {p.approvalError && <ErrorNote text={p.approvalError} />}
          {err && <ErrorNote text={err} />}
          <div className="flex flex-wrap gap-2">
            <Button disabled={busy || !p.variants[chosen]?.ok} onClick={() => void act("decision", { approved: true, variantIndex: chosen, text: texts[chosen], localTime: time.slice(0, 16) })}>
              <Check className="size-4" /> Approve and schedule
            </Button>
            <Button variant="outline" disabled={busy} onClick={() => void act("decision", { approved: false })}>
              <X className="size-4" /> Reject
            </Button>
          </div>
        </div>
      )}
      <p className="text-muted-foreground mt-4 text-xs">Tokens used: {run.tokensUsed.toLocaleString()} of 30,000.</p>
    </Panel>
  );
}
