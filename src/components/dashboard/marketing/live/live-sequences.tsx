"use client";

import { useState } from "react";

import { AlertTriangle, ArrowDown, ArrowUp, Clock, Filter, MessageSquare, Pause, Play, Plus, Trash2 } from "lucide-react";

import { RuleHint } from "../meta-rules";
import { Field, Modal, inputCls } from "../modal";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type OnIneligible = "skip" | "wait_for_reply" | "request_optin";
type Step =
  | { id: string; kind: "message"; text: string; onIneligible: OnIneligible; optInRequest?: { title: string } }
  | { id: string; kind: "delay"; minutes: number }
  | { id: string; kind: "condition"; test: { type: "tag"; tag: string; present: boolean } | { type: "replied"; value: boolean }; onFalse: "exit" | "skip_next" };
type Trigger = { type: "tag_added"; tag: string } | { type: "keyword"; match: { mode: "contains"; keywords: string[] } } | { type: "lead_captured" } | { type: "comment_to_dm_completed" } | { type: "manual" };
type Config = { trigger: Trigger; steps: Step[]; maxMessages: number; onReply: "continue" | "pause" | "stop"; exitOnTagRemoved?: string; quietHours?: { start: string; end: string }; optinTopic: string };
type Warning = { stepId: string; level: string; text: string };
type Sequence = { id: string; name: string; status: "draft" | "active" | "paused"; config: Config; warnings: Warning[]; enrollments: Record<string, number> };

const uid = () => Math.random().toString(36).slice(2, 9);
const ON_INELIGIBLE: Record<OnIneligible, string> = {
  skip: "Skip this step",
  wait_for_reply: "Wait until they message again",
  request_optin: "Ask to opt in to marketing messages",
};

/** Same rule as the API: a message step ≥ 24h after enrollment is outside the window. */
function localWarnings(c: Config): Record<string, string> {
  const inbound = c.trigger.type === "keyword" || c.trigger.type === "lead_captured" || c.trigger.type === "comment_to_dm_completed";
  let min = 0;
  const out: Record<string, string> = {};
  for (const s of c.steps) {
    if (s.kind === "delay") min += s.minutes;
    if (s.kind !== "message") continue;
    const h = Math.round((min / 60) * 10) / 10;
    if (min >= 24 * 60) out[s.id] = `Sent ${h}h after enrollment: outside the 24-hour window unless they replied or opted in.`;
    else if (!inbound) out[s.id] = "This trigger doesn't need a recent message, so the window may already be closed.";
    else if (min >= 20 * 60) out[s.id] = `Sent ${h}h after enrollment: close to the end of the 24-hour window.`;
  }
  return out;
}

export function LiveSequences() {
  const { data, error, loading, reload } = useApi<{ sequences: Sequence[]; optInAvailable: boolean }>("/sequences");
  const [editing, setEditing] = useState<null | { s?: Sequence }>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const act = async (fn: () => Promise<unknown>) => {
    setNotice(null);
    try {
      await fn();
      await reload();
    } catch (e) {
      setNotice(errorText(e));
    }
  };
  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  const list = data?.sequences ?? [];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RuleHint>Step 2 and later often fall outside Instagram&apos;s 24-hour window. Each message step says what to do when it can&apos;t be sent.</RuleHint>
        <Button onClick={() => setEditing({})}>
          <Plus className="size-4" /> New sequence
        </Button>
      </div>
      {notice && <div className="mb-4"><ErrorNote text={notice} /></div>}
      {list.length === 0 ? (
        <Empty title="No drip sequences yet" text="Send a series of messages over time, e.g. a welcome on day 1 and new arrivals on day 3." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((s) => (
            <div key={s.id} className="bg-card rounded-2xl border p-5 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {s.config.steps.filter((x) => x.kind === "message").length} messages · trigger: {s.config.trigger.type.replaceAll("_", " ")}
                  </p>
                </div>
                <Badge tone={s.status === "active" ? "good" : s.status === "paused" ? "warn" : "neutral"}>{s.status}</Badge>
              </div>
              {s.warnings.length > 0 && (
                <p className="mt-3 flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" /> {s.warnings.length} step{s.warnings.length > 1 ? "s" : ""} may fall outside the 24-hour window.
                </p>
              )}
              <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-3 text-xs tabular-nums">
                {Object.entries(s.enrollments).map(([k, n]) => (
                  <span key={k}>
                    {n} {k.replace("_", " ")}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing({ s })}>
                  Edit steps
                </Button>
                {s.status === "active" ? (
                  <Button size="sm" variant="outline" onClick={() => act(() => api(`/sequences/${s.id}/pause`, { method: "POST" }))}>
                    <Pause className="size-3.5" /> Pause
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => act(() => api(`/sequences/${s.id}/activate`, { method: "POST" }))}>
                    <Play className="size-3.5" /> Turn on
                  </Button>
                )}
                <Button size="sm" variant="ghost" aria-label={`Delete ${s.name}`} onClick={() => confirm(`Delete “${s.name}”? Enrolled people stop receiving it.`) && act(() => api(`/sequences/${s.id}`, { method: "DELETE" }))}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <SequenceEditor
          initial={editing.s}
          optInAvailable={!!data?.optInAvailable}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void reload();
          }}
        />
      )}
    </>
  );
}

function SequenceEditor({ initial, optInAvailable, onClose, onSaved }: { initial?: Sequence; optInAvailable: boolean; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [c, setC] = useState<Config>(
    initial?.config ?? {
      trigger: { type: "lead_captured" },
      steps: [
        { id: uid(), kind: "message", text: "", onIneligible: "skip" },
        { id: uid(), kind: "delay", minutes: 24 * 60 * 2 },
        { id: uid(), kind: "message", text: "", onIneligible: "wait_for_reply" },
      ],
      maxMessages: 10,
      onReply: "stop",
      optinTopic: "updates",
    },
  );
  const [err, setErr] = useState<string | null>(null);
  const warnings = localWarnings(c);
  const firstMsg = c.steps.findIndex((s) => s.kind === "message");
  const setStep = (i: number, s: Step) => setC({ ...c, steps: c.steps.map((x, j) => (j === i ? s : x)) });
  const move = (i: number, d: -1 | 1) => {
    const steps = c.steps.slice();
    const [s] = steps.splice(i, 1);
    steps.splice(i + d, 0, s!);
    setC({ ...c, steps });
  };

  const save = async () => {
    setErr(null);
    try {
      const body = { name: name.trim() || "Sequence", config: c };
      if (initial) await api(`/sequences/${initial.id}`, { method: "PATCH", body });
      else await api("/sequences", { method: "POST", body });
      onSaved();
    } catch (e) {
      setErr(errorText(e));
    }
  };

  return (
    <Modal
      title={initial ? "Edit sequence" : "New sequence"}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Start when">
            <select
              className={inputCls}
              value={c.trigger.type}
              onChange={(e) => {
                const t = e.target.value;
                setC({ ...c, trigger: t === "tag_added" ? { type: t, tag: "" } : t === "keyword" ? { type: t, match: { mode: "contains", keywords: [] } } : ({ type: t } as Trigger) });
              }}
            >
              <option value="lead_captured">A lead is captured</option>
              <option value="keyword">Someone DMs a keyword</option>
              <option value="comment_to_dm_completed">Comment-to-DM completed</option>
              <option value="tag_added">A tag is added</option>
              <option value="manual">I add people manually</option>
            </select>
          </Field>
        </div>
        {c.trigger.type === "tag_added" && (
          <Field label="Tag">
            <input className={inputCls} value={c.trigger.tag} onChange={(e) => setC({ ...c, trigger: { type: "tag_added", tag: e.target.value } })} />
          </Field>
        )}
        {c.trigger.type === "keyword" && (
          <Field label="Keywords (comma separated)">
            <input
              className={inputCls}
              value={c.trigger.match.keywords.join(", ")}
              onChange={(e) => setC({ ...c, trigger: { type: "keyword", match: { mode: "contains", keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) } } })}
            />
          </Field>
        )}

        <ol className="space-y-3">
          {c.steps.map((s, i) => (
            <li key={s.id} className={cn("rounded-xl border p-4", warnings[s.id] && "border-amber-500/50")}>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                {s.kind === "message" ? <MessageSquare className="size-4" /> : s.kind === "delay" ? <Clock className="size-4" /> : <Filter className="size-4" />}
                Step {i + 1}: {s.kind === "message" ? "Message" : s.kind === "delay" ? "Wait" : "Condition"}
                <span className="ml-auto flex gap-1">
                  <Button size="sm" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" aria-label="Move down" disabled={i === c.steps.length - 1} onClick={() => move(i, 1)}>
                    <ArrowDown className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" aria-label="Remove step" disabled={c.steps.length === 1} onClick={() => setC({ ...c, steps: c.steps.filter((_, j) => j !== i) })}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </span>
              </div>
              {s.kind === "message" && (
                <div className="space-y-3">
                  <textarea rows={3} maxLength={640} className={cn(inputCls, "h-auto py-2")} value={s.text} onChange={(e) => setStep(i, { ...s, text: e.target.value })} aria-label={`Message for step ${i + 1}`} />
                  <Field label="If Instagram doesn't allow it right now">
                    <select className={inputCls} value={s.onIneligible} onChange={(e) => setStep(i, { ...s, onIneligible: e.target.value as OnIneligible })}>
                      {Object.entries(ON_INELIGIBLE).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                          {k === "request_optin" && !optInAvailable ? " (not available: waits for a reply)" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {i === firstMsg && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        disabled={!optInAvailable}
                        checked={!!s.optInRequest}
                        onChange={(e) => setStep(i, { ...s, optInRequest: e.target.checked ? { title: "Updates and offers" } : undefined })}
                      />
                      Also ask to opt in to marketing messages{!optInAvailable && " (not available for this app)"}
                    </label>
                  )}
                </div>
              )}
              {s.kind === "delay" && (
                <div className="flex items-center gap-2 text-sm">
                  Wait
                  <input
                    className={cn(inputCls, "w-24")}
                    inputMode="numeric"
                    value={Math.round(s.minutes / 60)}
                    onChange={(e) => setStep(i, { ...s, minutes: Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1) * 60 })}
                    aria-label="Hours to wait"
                  />
                  hours
                </div>
              )}
              {s.kind === "condition" && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  Continue only if
                  <select
                    className={cn(inputCls, "w-auto")}
                    value={s.test.type}
                    onChange={(e) => setStep(i, { ...s, test: e.target.value === "tag" ? { type: "tag", tag: "", present: true } : { type: "replied", value: true } })}
                    aria-label="Condition type"
                  >
                    <option value="replied">they replied</option>
                    <option value="tag">they have a tag</option>
                  </select>
                  {s.test.type === "tag" && (
                    <input className={cn(inputCls, "w-36")} value={s.test.tag} onChange={(e) => setStep(i, { ...s, test: { type: "tag", tag: e.target.value, present: true } })} placeholder="Tag" aria-label="Tag" />
                  )}
                  , otherwise
                  <select className={cn(inputCls, "w-auto")} value={s.onFalse} onChange={(e) => setStep(i, { ...s, onFalse: e.target.value as "exit" })} aria-label="Otherwise">
                    <option value="exit">stop the sequence</option>
                    <option value="skip_next">skip the next step</option>
                  </select>
                </div>
              )}
              {warnings[s.id] && (
                <p className="mt-3 flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300" role="note">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  {warnings[s.id]}
                </p>
              )}
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setC({ ...c, steps: [...c.steps, { id: uid(), kind: "message", text: "", onIneligible: "skip" }] })}>
            <Plus className="size-3.5" /> Message
          </Button>
          <Button size="sm" variant="outline" onClick={() => setC({ ...c, steps: [...c.steps, { id: uid(), kind: "delay", minutes: 24 * 60 }] })}>
            <Plus className="size-3.5" /> Wait
          </Button>
          <Button size="sm" variant="outline" onClick={() => setC({ ...c, steps: [...c.steps, { id: uid(), kind: "condition", test: { type: "replied", value: true }, onFalse: "exit" }] })}>
            <Plus className="size-3.5" /> Condition
          </Button>
        </div>

        <details className="rounded-xl border p-4">
          <summary className="cursor-pointer text-sm font-medium">Exits and limits</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="When they reply">
              <select className={inputCls} value={c.onReply} onChange={(e) => setC({ ...c, onReply: e.target.value as Config["onReply"] })}>
                <option value="stop">Stop the sequence</option>
                <option value="pause">Pause it</option>
                <option value="continue">Keep going</option>
              </select>
            </Field>
            <Field label="Stop if this tag is removed">
              <input className={inputCls} value={c.exitOnTagRemoved ?? ""} onChange={(e) => setC({ ...c, exitOnTagRemoved: e.target.value || undefined })} />
            </Field>
            <Field label="Max messages per person">
              <input className={inputCls} inputMode="numeric" value={c.maxMessages} onChange={(e) => setC({ ...c, maxMessages: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })} />
            </Field>
            <Field label="Quiet hours (your timezone)">
              <div className="flex items-center gap-2">
                <input type="time" className={inputCls} value={c.quietHours?.start ?? ""} onChange={(e) => setC({ ...c, quietHours: e.target.value ? { start: e.target.value, end: c.quietHours?.end ?? "09:00" } : undefined })} aria-label="Quiet hours start" />
                to
                <input type="time" className={inputCls} value={c.quietHours?.end ?? ""} onChange={(e) => c.quietHours && setC({ ...c, quietHours: { ...c.quietHours, end: e.target.value } })} aria-label="Quiet hours end" />
              </div>
            </Field>
          </div>
          <p className="text-muted-foreground mt-3 text-xs">Replying STOP always ends every sequence for that person.</p>
        </details>
        {err && (
          <p role="alert" className="text-sm text-rose-600">
            {err}
          </p>
        )}
      </div>
    </Modal>
  );
}
