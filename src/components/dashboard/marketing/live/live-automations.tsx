"use client";

import { useEffect, useState } from "react";

import { FlaskConical, Pencil, Plus, Trash2 } from "lucide-react";

import { META_RULES, RuleHint } from "../meta-rules";
import { AutomationForm, TYPE_META } from "./automation-form";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge, Toggle } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, type Automation, type Capabilities, type IgAccount } from "@/lib/marketing-api";

/** Sample webhook so the owner can see what an automation would do (dry run, nothing is sent). */
function sampleWebhook(a: Automation, igUserId: string) {
  const c = a.config as { match?: { keywords?: string[] } };
  const word = c.match?.keywords?.[0] ?? "hello";
  const now = Date.now();
  const sender = `test_${now}`;
  if (a.type === "comment_to_dm") {
    return {
      object: "instagram",
      entry: [{ id: igUserId, time: now, changes: [{ field: "comments", value: { id: `test_c_${now}`, from: { id: sender, username: "test_user" }, text: word, media: { id: "test_media" } } }] }],
    };
  }
  const message: Record<string, unknown> = { mid: `test_m_${now}`, text: word };
  if (a.type === "story_reply") message.reply_to = { story: { id: "test_story", url: "https://example.com/s.jpg" } };
  if (a.type === "story_mention") {
    delete message.text;
    message.attachments = [{ type: "story_mention", payload: { url: "https://example.com/m.jpg" } }];
  }
  return { object: "instagram", entry: [{ id: igUserId, time: now, messaging: [{ sender: { id: sender }, recipient: { id: igUserId }, timestamp: now, message }] }] };
}

export function LiveAutomations({ newSignal }: { newSignal: number }) {
  const { data, error, loading, reload } = useApi<{ automations: Automation[] }>("/automations");
  const caps = useApi<Capabilities>("/capabilities").data;
  const accounts = useApi<{ accounts: IgAccount[] }>("/instagram/accounts").data;
  const [editing, setEditing] = useState<null | { a?: Automation }>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [test, setTest] = useState<null | { name: string; outcomes: string[]; wouldSend: unknown[] }>(null);

  useEffect(() => {
    if (newSignal > 0) setEditing({});
  }, [newSignal]);

  const act = async (fn: () => Promise<unknown>) => {
    setNotice(null);
    try {
      await fn();
      await reload();
    } catch (e) {
      setNotice(errorText(e));
    }
  };

  const runTest = async (a: Automation) => {
    const igUserId = accounts?.accounts.find((x) => x.status === "active")?.igUserId;
    if (!igUserId) return setNotice("Connect Instagram first to test automations.");
    try {
      const r = await api<{ outcomes: string[]; wouldSend: unknown[] }>("/automations/test", { method: "POST", body: { webhook: sampleWebhook(a, igUserId) } });
      setTest({ name: a.name, ...r });
      void reload(); // the dry run still records match/sent stats
    } catch (e) {
      setNotice(errorText(e));
    }
  };

  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  const autos = data?.automations ?? [];

  return (
    <>
      <RuleHint className="mb-4">{META_RULES.privateReply} Sending is paced to stay under Instagram&apos;s hourly limits.</RuleHint>
      {notice && <div className="mb-4"><ErrorNote text={notice} /></div>}
      {test && (
        <div className="bg-muted/50 mb-4 rounded-xl border p-4 text-sm" role="status">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium">Test of “{test.name}”: {test.outcomes.join(", ") || "no result"}</p>
            <Button size="sm" variant="ghost" onClick={() => setTest(null)}>
              Close
            </Button>
          </div>
          <p className="text-muted-foreground mt-1">Dry run. Nothing was sent to Instagram.</p>
          {test.wouldSend.length > 0 && (
            <pre className="bg-background mt-3 max-h-48 overflow-auto rounded-lg border p-3 text-xs">{JSON.stringify(test.wouldSend, null, 2)}</pre>
          )}
        </div>
      )}

      {autos.length === 0 ? (
        <Empty
          title="No automations yet"
          text="Start with Comment-to-DM: when someone comments a word on your post, Sojao sends them a private reply."
          action={
            <Button onClick={() => setEditing({})}>
              <Plus className="size-4" /> New automation
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {autos.map((a) => {
            const meta = TYPE_META[a.type];
            const Icon = meta.icon;
            const kw = (a.config as { match?: { mode: string; keywords?: string[] } }).match;
            return (
              <div key={a.id} className="bg-card flex flex-col rounded-2xl border p-5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <span className="bg-brand/12 flex size-10 items-center justify-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                  <Toggle
                    key={`${a.id}-${a.status}`}
                    defaultOn={a.status === "enabled"}
                    label={`Turn ${a.name} on or off`}
                    onChange={(on) => act(() => api(`/automations/${a.id}/${on ? "enable" : "disable"}`, { method: "POST" }))}
                  />
                </div>
                <p className="mt-4 font-semibold">{a.name}</p>
                <p className="text-muted-foreground mt-1 flex-1 text-sm">
                  {kw ? (kw.mode === "any" ? "Any comment" : `${kw.mode === "exact" ? "Exactly" : "Contains"} ${kw.keywords?.map((k) => `“${k.toUpperCase()}”`).join(", ")}`) : meta.text}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge>{meta.label}</Badge>
                  {"collectFields" in a.config && <Badge tone="brand">Captures lead</Badge>}
                  {a.status === "disabled" && <Badge tone="warn">Off</Badge>}
                </div>
                <div className="mt-4 grid grid-cols-3 items-end gap-3 border-t pt-4 text-sm">
                  <Stat label="Matched" value={a.stats.matched} />
                  <Stat label="Sent" value={a.stats.sent} />
                  <Stat label="Clicks" value={a.stats.clicks} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing({ a })}>
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => runTest(a)}>
                    <FlaskConical className="size-3.5" /> Test
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Delete ${a.name}`}
                    onClick={() => confirm(`Delete “${a.name}”?`) && act(() => api(`/automations/${a.id}`, { method: "DELETE" }))}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
          <button
            onClick={() => setEditing({})}
            className="text-muted-foreground hover:bg-accent/50 flex min-h-56 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-5 text-sm"
          >
            <Plus className="size-5" />
            New automation
            <span className="text-xs">Comment, story reply, mention, keyword or welcome</span>
          </button>
        </div>
      )}

      {editing && (
        <AutomationForm
          initial={editing.a}
          caps={caps}
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  );
}
