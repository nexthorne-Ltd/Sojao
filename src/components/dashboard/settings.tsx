"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Check, Loader2, Plus, Trash2 } from "lucide-react";

import { ErrorNote, Loading } from "@/components/dashboard/marketing/live/states";
import { useApi } from "@/components/dashboard/marketing/live/use-api";
import { Badge, ChannelIcon, PageHeader, Panel, Tabs, Toggle } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, ApiError, type IgAccount } from "@/lib/marketing-api";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

type Tab = "channels" | "store" | "ai" | "team";
const TABS: { id: Tab; label: string }[] = [
  { id: "channels", label: "Channels" },
  { id: "store", label: "Store" },
  { id: "ai", label: "Train Sojao" },
  { id: "team", label: "Team" },
];
const errText = (e: unknown) => (e instanceof ApiError ? e.readable : "Something went wrong. Try again.");

export function SettingsView({ initialTab }: { initialTab?: string }) {
  const initial = (initialTab as Tab) || "channels";
  const [tab, setTab] = useState<Tab>(TABS.some((t) => t.id === initial) ? initial : "channels");

  return (
    <>
      <PageHeader title="Settings" description="Connect Instagram, teach Sojao your brand voice, and manage your team." />
      <Tabs
        className="mb-6"
        tabs={TABS}
        value={tab}
        onChange={(t) => {
          setTab(t);
          window.history.replaceState(null, "", `/dashboard/settings?tab=${t}`);
        }}
      />
      {tab === "channels" && <Channels />}
      {tab === "store" && <StoreTab />}
      {tab === "ai" && <TrainTab />}
      {tab === "team" && <Team />}
    </>
  );
}

/* ---------------- Channels ---------------- */
function Channels() {
  const { data, error, reload } = useApi<{ accounts: IgAccount[] }>("/instagram/accounts");
  const ig = data?.accounts.find((a) => a.status === "active") ?? data?.accounts[0];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="bg-card flex flex-col rounded-2xl border p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <ChannelIcon channel="instagram" withLabel className="size-6" />
          {!data ? null : ig?.status === "active" ? <Badge tone="good">Connected</Badge> : ig ? <Badge tone="warn">Needs attention</Badge> : <Badge>Not connected</Badge>}
        </div>
        <p className="text-muted-foreground mt-3 flex-1 text-sm">DMs, comments, story replies and mentions.</p>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        {ig?.username && <p className="mt-3 text-sm font-medium">@{ig.username}</p>}
        <Button className="mt-4" asChild variant={ig ? "outline" : "default"} onClick={() => void reload()}>
          <Link href="/dashboard/settings/instagram">{ig ? "Manage Instagram connection" : "Connect Instagram"}</Link>
        </Button>
      </div>
      {(["messenger", "whatsapp"] as const).map((ch) => (
        <div key={ch} className="bg-card flex flex-col rounded-2xl border p-5 opacity-80 shadow-xs">
          <div className="flex items-center justify-between">
            <ChannelIcon channel={ch} withLabel className="size-6" />
            <Badge>Coming soon</Badge>
          </div>
          <p className="text-muted-foreground mt-3 flex-1 text-sm">{ch === "messenger" ? "Messenger" : "WhatsApp"} is not available yet. We&apos;ll let you know when it is.</p>
          <Button className="mt-4" variant="outline" disabled>
            Coming soon
          </Button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Store ---------------- */
function StoreTab() {
  return (
    <Panel title="Your store" description="Connect Shopify or import a product list so Sojao can answer price and stock questions, send back-in-stock alerts and match sales to Instagram.">
      <Button asChild>
        <Link href="/dashboard/marketing?tab=shop">Open store settings</Link>
      </Button>
    </Panel>
  );
}

/* ---------------- Train Sojao ---------------- */
type BrandProfile = {
  brandName: string | null;
  tone: string | null;
  policies: string | null;
  faqs: { q: string; a: string }[];
  handoverWords: string[];
  /** AI agent answers DMs that no automation matched. Off by default on the API. */
  agentFallback?: boolean;
};
const TONES = ["Friendly", "Calm and premium", "Playful", "Short and simple"];
const TIMEZONES = (() => {
  try {
    return (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.("timeZone") ?? [];
  } catch {
    return [];
  }
})();

function TrainTab() {
  const { session, reload: reloadSession } = useSession();
  const { data, error, reload } = useApi<BrandProfile>("/brand-profile");
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [tone, setTone] = useState("Friendly");
  const [policies, setPolicies] = useState("");
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [words, setWords] = useState("");
  const [agentFallback, setAgentFallback] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setName(data.brandName ?? session?.workspace?.name ?? "");
    setTone(data.tone ?? "Friendly");
    setPolicies(data.policies ?? "");
    setFaqs(data.faqs ?? []);
    setWords((data.handoverWords ?? []).join(", "));
    setAgentFallback(!!data.agentFallback);
  }, [data, session?.workspace?.name]);
  useEffect(() => {
    if (session?.workspace) setTimezone(session.workspace.timezone);
  }, [session?.workspace]);

  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("busy");
    setErr(null);
    try {
      await api("/brand-profile", {
        method: "PUT",
        body: {
          brandName: name.trim() || null,
          tone,
          policies: policies.trim() || null,
          faqs: faqs.filter((f) => f.q.trim() && f.a.trim()).map((f) => ({ q: f.q.trim(), a: f.a.trim() })),
          handoverWords: words.split(",").map((w) => w.trim()).filter(Boolean).slice(0, 20),
          agentFallback,
        },
      });
      await api("/workspace", { method: "PATCH", body: { ...(name.trim() ? { name: name.trim() } : {}), timezone } });
      await Promise.all([reload(), reloadSession()]);
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch (x) {
      setErr(errText(x));
      setState("idle");
    }
  };

  return (
    <form onSubmit={save} className="grid gap-6 xl:grid-cols-2">
      <Panel title="Your brand" description="Sojao uses this so replies sound like you. It only states facts written here.">
        <div className="space-y-4">
          <Field label="Brand name">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required className={inputCls} />
          </Field>
          <Field label="Time zone" hint="Used for scheduling and reports.">
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputCls}>
              {(TIMEZONES.length ? TIMEZONES : [timezone]).map((tz) => (
                <option key={tz}>{tz}</option>
              ))}
            </select>
          </Field>
          <Field label="Tone of voice">
            <select value={TONES.includes(tone) ? tone : "custom"} onChange={(e) => setTone(e.target.value === "custom" ? "" : e.target.value)} className={inputCls}>
              {TONES.map((t) => (
                <option key={t}>{t}</option>
              ))}
              <option value="custom">Describe my own…</option>
            </select>
            {!TONES.includes(tone) && <input value={tone} onChange={(e) => setTone(e.target.value)} maxLength={300} placeholder="e.g. warm, short, a little playful" className={cn(inputCls, "mt-2")} />}
          </Field>
          <Field label="Shipping, returns and other policies" hint="Write the real rules. Sojao won't promise anything that isn't here.">
            <textarea rows={6} value={policies} onChange={(e) => setPolicies(e.target.value)} maxLength={4000} placeholder={"Free shipping over $75. 2–4 business days in the US.\nFree returns within 30 days, unworn with tags."} className={cn(inputCls, "h-auto py-2")} />
          </Field>
        </div>
      </Panel>

      <div className="space-y-6">
        <Panel
          title="Common questions"
          description="Answers Sojao can use in replies, e.g. after a Comment-to-DM."
          action={
            <Button type="button" size="sm" variant="outline" onClick={() => setFaqs([...faqs, { q: "", a: "" }])} disabled={faqs.length >= 50}>
              <Plus className="size-4" /> Add
            </Button>
          }
        >
          {faqs.length === 0 && <p className="text-muted-foreground text-sm">No questions yet. Add the ones customers ask most.</p>}
          <ul className="space-y-3">
            {faqs.map((f, i) => (
              <li key={i} className="space-y-2 rounded-xl border p-3">
                <div className="flex gap-2">
                  <input value={f.q} maxLength={300} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} placeholder="Question" aria-label={`Question ${i + 1}`} className={cn(inputCls, "font-medium")} />
                  <button type="button" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-foreground" aria-label="Remove question">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <textarea value={f.a} maxLength={1000} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} placeholder="Answer" aria-label={`Answer ${i + 1}`} rows={2} className={cn(inputCls, "h-auto py-2")} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="AI replies to other DMs"
          description="When a DM doesn't match any automation, Sojao writes a reply from your brand profile. If it isn't sure, or the answer isn't written here, the chat goes to “Needs you” instead."
        >
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Answer other DMs with AI</span>
            {/* data is loaded before this renders, so defaultOn is the saved value */}
            <Toggle defaultOn={!!data.agentFallback} label="Answer other DMs with AI" onChange={setAgentFallback} />
          </div>
        </Panel>

        <Panel title="When to hand over to you" description="If a customer writes one of these words, Sojao stops and the chat shows up under “Needs you” in the Inbox.">
          <Field label="Hand-over words" hint="Comma separated, e.g. human, agent, refund, complaint">
            <input value={words} onChange={(e) => setWords(e.target.value)} className={inputCls} />
          </Field>
        </Panel>

        {err && <ErrorNote text={err} />}
        <div className="flex justify-end">
          <Button type="submit" disabled={state === "busy"}>
            {state === "busy" ? <Loader2 className="size-4 animate-spin" /> : state === "done" ? <Check className="size-4" /> : null}
            {state === "done" ? "Saved" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

/* ---------------- Team ---------------- */
type Member = { userId: string; name: string; email: string; role: "owner" | "admin" | "member"; lastLoginAt: string | null };

function Team() {
  const { data, error, reload } = useApi<{ members: Member[]; myRole: string | null }>("/team");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [err, setErr] = useState<string | null>(null);
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;
  const canManage = data.myRole === "owner" || data.myRole === "admin";
  return (
    <Panel title="Team" description="People who can log in to this brand and reply to chats.">
      <ul className="divide-y rounded-xl border">
        {data.members.map((m) => (
          <li key={m.userId} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span className="min-w-0">
              <span className="block truncate font-medium">{m.name}</span>
              <span className="text-muted-foreground block truncate text-xs">{m.email}</span>
            </span>
            <span className="flex items-center gap-2">
              <Badge tone={m.role === "owner" ? "brand" : "neutral"}>{m.role}</Badge>
              {canManage && m.role !== "owner" && (
                <button
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${m.email}`}
                  onClick={async () => {
                    if (!window.confirm(`Remove ${m.email} from this brand?`)) return;
                    await api(`/team/${m.userId}`, { method: "DELETE" }).catch((e) => setErr(errText(e)));
                    await reload();
                  }}
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </span>
          </li>
        ))}
      </ul>
      {canManage && (
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            try {
              await api("/team", { method: "POST", body: { email, role } });
              setEmail("");
              await reload();
            } catch (x) {
              setErr(errText(x));
            }
          }}
        >
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@yourbrand.com" aria-label="Teammate email" className={cn(inputCls, "sm:flex-1")} />
          <select value={role} onChange={(e) => setRole(e.target.value as "member" | "admin")} aria-label="Role" className={cn(inputCls, "sm:w-32")}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <Button type="submit">Add to team</Button>
        </form>
      )}
      <p className="text-muted-foreground mt-2 text-xs">They need a Sojao login first: ask them to sign up, then add their email here.</p>
      {err && <p className="mt-2 text-sm text-rose-600">{err}</p>}
    </Panel>
  );
}

/* ---------------- helpers ---------------- */
const inputCls = "bg-background focus-visible:ring-ring/50 h-10 w-full rounded-xl border px-3 text-sm outline-none focus-visible:ring-[3px]";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-muted-foreground block text-xs">{hint}</span>}
    </label>
  );
}
