"use client";

import { useState } from "react";

import { Download, Gift, Info, Megaphone, Plus, Shuffle } from "lucide-react";

import { Field, Modal, inputCls } from "../modal";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, download, type IgAccount } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type Giveaway = {
  id: string;
  name: string;
  phase: "scheduled" | "open" | "ended" | "drawn" | "cancelled";
  entries: number;
  winnersCount: number;
  startsAt: string;
  endsAt: string;
  config: { entryMethod: string; keywords: string[]; mediaIds: string[] };
};
type Draw = { drawnAt: string; entryCount: number; eligibleCount: number; excluded: Record<string, number>; entriesHash: string; picks: number[]; winners: { entryId: string }[]; algorithm: string };
type Notes = { followers: string; legal: string; privateReply: string };

const when = (d: string) => new Date(d).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const TONE = { scheduled: "info", open: "good", ended: "warn", drawn: "brand", cancelled: "neutral" } as const;

export function LiveGiveaways() {
  const { data, error, loading, reload } = useApi<{ giveaways: Giveaway[]; notes: Notes }>("/giveaways");
  const accounts = useApi<{ accounts: IgAccount[] }>("/instagram/accounts").data?.accounts.filter((a) => a.status === "active") ?? [];
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [audit, setAudit] = useState<Record<string, Draw>>({});

  const draw = async (g: Giveaway) => {
    if (!confirm(`Draw ${g.winnersCount} winner(s) for “${g.name}”? This can't be redone.`)) return;
    try {
      const d = await api<Draw>(`/giveaways/${g.id}/draw`, { method: "POST" });
      setAudit((a) => ({ ...a, [g.id]: d }));
      await reload();
    } catch (e) {
      setNotice(errorText(e));
    }
  };
  const announce = async (g: Giveaway) => {
    try {
      const r = await api<{ results: { status: string; reason?: string }[] }>(`/giveaways/${g.id}/announce`, { method: "POST" });
      const sent = r.results.filter((x) => x.status.startsWith("sent")).length;
      setNotice(`${sent} of ${r.results.length} winners messaged.${r.results.length > sent ? " The rest haven't messaged you in 24 hours: contact them yourself." : ""}`);
    } catch (e) {
      setNotice(errorText(e));
    }
  };

  if (loading && !data) return <Loading />;
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  const notes = data!.notes;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-muted-foreground max-w-2xl space-y-1 text-xs">
          <p className="flex gap-1.5">
            <Info className="mt-0.5 size-3.5 shrink-0" /> {notes.followers}
          </p>
          <p className="flex gap-1.5">
            <Info className="mt-0.5 size-3.5 shrink-0" /> {notes.legal}
          </p>
        </div>
        <Button onClick={() => setCreating(true)} disabled={accounts.length === 0}>
          <Plus className="size-4" /> New giveaway
        </Button>
      </div>
      {notice && <div className="mb-4"><ErrorNote text={notice} /></div>}
      {!data!.giveaways.length ? (
        <Empty title="No giveaways yet" text="Run a comment, story-mention or DM-keyword giveaway. Sojao collects one entry per person and picks winners at random." />
      ) : (
        <div className="space-y-4">
          {data!.giveaways.map((g) => (
            <div key={g.id} className="bg-card rounded-2xl border p-5 shadow-xs">
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-brand/12 flex size-12 items-center justify-center rounded-xl">
                  <Gift className="size-6" />
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{g.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {g.config.entryMethod.replaceAll("_", " ")}
                    {g.config.keywords.length ? ` “${g.config.keywords.join(", ")}”` : ""} · {when(g.startsAt)} – {when(g.endsAt)} · {g.winnersCount} winner(s)
                  </p>
                </div>
                <Badge tone={TONE[g.phase]}>{g.phase}</Badge>
                <span className="text-sm">
                  <b className="tabular-nums">{g.entries}</b> entries
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => download(`/giveaways/${g.id}/entries.csv`, `giveaway-${g.id}.csv`).catch((e) => setNotice(errorText(e)))}>
                  <Download className="size-3.5" /> Entries CSV
                </Button>
                {g.phase === "ended" && (
                  <Button size="sm" onClick={() => draw(g)}>
                    <Shuffle className="size-3.5" /> Draw winners
                  </Button>
                )}
                {g.phase === "drawn" && (
                  <Button size="sm" variant="outline" onClick={() => announce(g)}>
                    <Megaphone className="size-3.5" /> Message winners
                  </Button>
                )}
              </div>
              {audit[g.id] && (
                <div className="bg-muted/50 mt-4 rounded-xl border p-3 text-xs">
                  <p className="font-medium">Draw audit (saved, can&apos;t be edited)</p>
                  <p className="text-muted-foreground mt-1">
                    {when(audit[g.id]!.drawnAt)} · {audit[g.id]!.entryCount} entries, {audit[g.id]!.eligibleCount} eligible · excluded:{" "}
                    {Object.entries(audit[g.id]!.excluded)
                      .map(([k, v]) => `${v} ${k}`)
                      .join(", ")}
                  </p>
                  <p className="text-muted-foreground mt-1 break-all">entries sha256: {audit[g.id]!.entriesHash}</p>
                  <p className="text-muted-foreground mt-1">picks: [{audit[g.id]!.picks.join(", ")}] · {audit[g.id]!.algorithm}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {creating && accounts[0] && (
        <GiveawayForm
          accountId={accounts[0].id}
          notes={notes}
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            void reload();
          }}
        />
      )}
    </>
  );
}

function GiveawayForm({ accountId, notes, onClose, onSaved }: { accountId: string; notes: Notes; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [method, setMethod] = useState("comment_keyword");
  const [mediaIds, setMediaIds] = useState("");
  const [keywords, setKeywords] = useState("WIN");
  const [starts, setStarts] = useState("");
  const [ends, setEnds] = useState("");
  const [winners, setWinners] = useState(1);
  const [prize, setPrize] = useState("");
  const [rules, setRules] = useState("");
  const [confirmOn, setConfirmOn] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const template = async () => {
    try {
      const how = method === "comment_keyword" ? `Comment “${keywords}” on the giveaway post` : method === "dm_keyword" ? `Send us a DM with “${keywords}”` : "Mention us in your Instagram story";
      const r = await api<{ rules: string }>("/giveaways/rules-template", {
        method: "POST",
        body: { brandName: name || "Our brand", prize: prize || "the prize", startsAt: starts || "start date", endsAt: ends || "end date", winnersCount: winners, howToEnter: how },
      });
      setRules(r.rules);
    } catch (e) {
      setErr(errorText(e));
    }
  };

  const save = async () => {
    setErr(null);
    try {
      await api("/giveaways", {
        method: "POST",
        body: {
          igAccountId: accountId,
          name,
          startsAt: new Date(starts).toISOString(),
          endsAt: new Date(ends).toISOString(),
          winnersCount: winners,
          rulesText: rules,
          config: {
            entryMethod: method,
            mediaIds: mediaIds.split(",").map((x) => x.trim()).filter(Boolean),
            keywords: method === "story_mention" ? [] : keywords.split(",").map((x) => x.trim()).filter(Boolean),
            confirm: { enabled: confirmOn, text: "You're in! Good luck 🍀" },
          },
        },
      });
      onSaved();
    } catch (e) {
      setErr(errorText(e));
    }
  };

  return (
    <Modal
      title="New giveaway"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!name || !starts || !ends || rules.length < 20}>
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Prize">
            <input className={inputCls} value={prize} onChange={(e) => setPrize(e.target.value)} placeholder="e.g. Full skincare set" />
          </Field>
          <Field label="How people enter">
            <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="comment_keyword">Comment a keyword on a post</option>
              <option value="dm_keyword">DM a keyword</option>
              <option value="story_mention">Mention you in their story</option>
            </select>
          </Field>
          {method !== "story_mention" && (
            <Field label="Keyword">
              <input className={inputCls} value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            </Field>
          )}
          {method === "comment_keyword" && (
            <Field label="Post or reel IDs (comma separated)">
              <input className={inputCls} value={mediaIds} onChange={(e) => setMediaIds(e.target.value)} />
            </Field>
          )}
          <Field label="Winners">
            <input className={inputCls} inputMode="numeric" value={winners} onChange={(e) => setWinners(Math.min(50, Math.max(1, Number(e.target.value) || 1)))} />
          </Field>
          <Field label="Starts">
            <input type="datetime-local" className={inputCls} value={starts} onChange={(e) => setStarts(e.target.value)} />
          </Field>
          <Field label="Ends">
            <input type="datetime-local" className={inputCls} value={ends} onChange={(e) => setEnds(e.target.value)} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={confirmOn} onChange={(e) => setConfirmOn(e.target.checked)} />
          Confirm each entry with a message
        </label>
        {confirmOn && method === "comment_keyword" && <p className="text-xs text-amber-700 dark:text-amber-300">{notes.privateReply}</p>}
        <Field label="Rules">
          <textarea rows={8} className={cn(inputCls, "h-auto py-2 text-xs")} value={rules} onChange={(e) => setRules(e.target.value)} />
        </Field>
        <Button size="sm" variant="outline" onClick={template}>
          Use the rules template
        </Button>
        <p className="text-muted-foreground text-xs">{notes.followers}</p>
        <p className="text-muted-foreground text-xs">{notes.legal}</p>
        {err && (
          <p role="alert" className="text-sm text-rose-600">
            {err}
          </p>
        )}
      </div>
    </Modal>
  );
}
