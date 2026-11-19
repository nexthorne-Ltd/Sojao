"use client";

import { useState } from "react";

import { CheckCircle2, Plus, ShieldCheck, Trash2 } from "lucide-react";

import { inputCls } from "../modal";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge, ChannelIcon, PageHeader, Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, apiEnabled, type Capabilities, type IgAccount } from "@/lib/marketing-api";

const STATUS: Record<IgAccount["status"], { tone: "good" | "warn" | "bad" | "neutral"; label: string }> = {
  active: { tone: "good", label: "Connected" },
  expired: { tone: "warn", label: "Expired: reconnect" },
  error: { tone: "bad", label: "Error" },
  disconnected: { tone: "neutral", label: "Disconnected" },
};

export function ConnectInstagram({ connected, igError }: { connected?: string; igError?: string }) {
  if (!apiEnabled) {
    return (
      <>
        <PageHeader title="Connect Instagram" description="Link your Instagram professional account so Sojao can answer DMs, comments and story replies." />
        <ErrorNote text="The Sojao API isn't configured. Set NEXT_PUBLIC_SOJAO_API_URL and NEXT_PUBLIC_SOJAO_DEV_API_KEY in .env.local, then restart the dev server." />
      </>
    );
  }
  return <Connected connected={connected} igError={igError} />;
}

function Connected({ connected, igError }: { connected?: string; igError?: string }) {
  const { data, error, loading, reload } = useApi<{ accounts: IgAccount[] }>("/instagram/accounts");
  const caps = useApi<Capabilities>("/capabilities").data;
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const connect = async () => {
    setBusy(true);
    setNotice(null);
    try {
      const { url } = await api<{ url: string }>("/instagram/connect", { method: "POST" });
      window.location.assign(url);
    } catch (e) {
      setNotice(errorText(e));
      setBusy(false);
    }
  };

  const disconnect = async (a: IgAccount) => {
    if (!confirm(`Disconnect @${a.username}? Automations stop until you reconnect.`)) return;
    try {
      await api(`/instagram/accounts/${a.id}`, { method: "DELETE" });
      await reload();
    } catch (e) {
      setNotice(errorText(e));
    }
  };

  const accounts = (data?.accounts ?? []).filter((a) => a.status !== "disconnected");

  return (
    <>
      <PageHeader
        title="Connect Instagram"
        description="Link your Instagram professional account so Sojao can answer DMs, comments and story replies."
        actions={
          <Button onClick={connect} disabled={busy}>
            <Plus className="size-4" /> {accounts.length ? "Connect another" : "Connect Instagram"}
          </Button>
        }
      />
      {connected && (
        <p role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
          <CheckCircle2 className="size-4 text-emerald-600" /> @{connected} is connected.
        </p>
      )}
      {igError && <div className="mb-4"><ErrorNote text={`Instagram didn't connect: ${igError.replaceAll("_", " ")}`} /></div>}
      {notice && <div className="mb-4"><ErrorNote text={notice} /></div>}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Accounts">
          {loading && !data ? (
            <Loading />
          ) : error ? (
            <ErrorNote text={error} onRetry={reload} />
          ) : accounts.length === 0 ? (
            <Empty
              title="No Instagram account yet"
              text="You need an Instagram professional (business or creator) account. You'll log in on Instagram and approve messages and comments access."
              action={
                <Button onClick={connect} disabled={busy}>
                  Connect Instagram
                </Button>
              }
            />
          ) : (
            <ul className="divide-y">
              {accounts.map((a) => (
                <li key={a.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <ChannelIcon channel="instagram" className="size-6" />
                    <div className="flex-1">
                      <p className="font-medium">@{a.username ?? a.igUserId}</p>
                      <p className="text-muted-foreground text-xs">
                        {a.tokenExpiresAt ? `Access renews automatically · next by ${new Date(a.tokenExpiresAt).toLocaleDateString()}` : "Access token stored encrypted"}
                      </p>
                    </div>
                    <Badge tone={STATUS[a.status].tone}>{STATUS[a.status].label}</Badge>
                    {a.status !== "active" && (
                      <Button size="sm" onClick={connect}>
                        Reconnect
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" aria-label={`Disconnect @${a.username}`} onClick={() => disconnect(a)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  {a.status === "active" && caps?.iceBreakers?.available && <IceBreakers account={a} />}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="What Sojao can do on Instagram">
          <ul className="space-y-3 text-sm">
            {[
              ["Comment-to-DM", "One private reply per comment, within 7 days."],
              ["Story replies and mentions", caps?.story_mention?.note ?? "Mentions only arrive from public accounts."],
              ["DM keywords and welcome messages", "Replies within 24 hours of the customer's last message."],
              ["Broadcasts", "Only to people who messaged in the last 24 hours (or opted in)."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <ShieldCheck className="text-brand mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="block font-medium">{t}</span>
                  <span className="text-muted-foreground">{d}</span>
                </span>
              </li>
            ))}
            <li className="flex gap-3 opacity-70">
              <ShieldCheck className="mt-0.5 size-5 shrink-0" />
              <span>
                <span className="block font-medium">New follower messages</span>
                <span className="text-muted-foreground">{caps?.follow?.note ?? "Not available on Instagram."}</span>
              </span>
            </li>
          </ul>
        </Panel>
      </div>
    </>
  );
}

function IceBreakers({ account }: { account: IgAccount }) {
  const { data, reload } = useApi<{ items: { question: string; payload: string }[] }>(`/instagram/accounts/${account.id}/ice-breakers`);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<{ question: string; payload: string }[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const items = rows ?? data?.items ?? [];

  const save = async () => {
    setMsg(null);
    try {
      const clean = items.filter((r) => r.question.trim()).map((r) => ({ question: r.question.trim(), payload: (r.payload || r.question).trim().toUpperCase() }));
      await api(`/instagram/accounts/${account.id}/ice-breakers`, { method: "PUT", body: { items: clean } });
      setRows(null);
      await reload();
      setMsg("Saved. Payloads work like DM keywords.");
    } catch (e) {
      setMsg(errorText(e));
    }
  };

  return (
    <div className="mt-3">
      <button className="text-muted-foreground text-sm underline-offset-4 hover:underline" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Edit"} conversation starters ({data?.items.length ?? 0}/4)
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {items.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputCls}
                maxLength={80}
                value={r.question}
                aria-label={`Question ${i + 1}`}
                onChange={(e) => setRows(items.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))}
              />
              <input
                className={`${inputCls} max-w-40`}
                value={r.payload}
                aria-label={`Keyword ${i + 1}`}
                placeholder="KEYWORD"
                onChange={(e) => setRows(items.map((x, j) => (j === i ? { ...x, payload: e.target.value } : x)))}
              />
              <Button variant="ghost" className="h-10" aria-label="Remove" onClick={() => setRows(items.filter((_, j) => j !== i))}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={items.length >= 4} onClick={() => setRows([...items, { question: "", payload: "" }])}>
              <Plus className="size-3.5" /> Add
            </Button>
            <Button size="sm" onClick={save}>
              Save
            </Button>
          </div>
          {msg && <p className="text-muted-foreground text-xs">{msg}</p>}
        </div>
      )}
    </div>
  );
}
