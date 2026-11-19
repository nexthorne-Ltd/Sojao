"use client";

import { useEffect, useState } from "react";

import { Plus, Trash2, Upload, X } from "lucide-react";

import { Field, inputCls } from "../modal";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge, Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type Tag = { id: string; name: string; count: number };
type Cond =
  | { field: "tag"; op: "has" | "not_has"; value: string }
  | { field: "custom"; key: string; op: "eq" | "exists" | "contains"; value?: string }
  | { field: "last_inbound_at" | "created_at"; op: "within_hours" | "older_than_hours"; value: number }
  | { field: "source"; op: "eq"; value: string }
  | { field: "opted_out" | "opted_in" | "flagged"; value: boolean };
type Segment = { id: string; name: string; mode: "dynamic" | "static"; count: number; snapshotAt: string | null; filter: { op: "and" | "or"; conditions: Cond[] } };
type Rule = { id: string; trigger: string; tagName: string; enabled: boolean };

const FIELDS: { value: Cond["field"]; label: string }[] = [
  { value: "tag", label: "Tag" },
  { value: "custom", label: "Custom field" },
  { value: "last_inbound_at", label: "Last message" },
  { value: "created_at", label: "Added" },
  { value: "source", label: "Source" },
  { value: "opted_in", label: "Opted in (marketing)" },
  { value: "opted_out", label: "Opted out" },
  { value: "flagged", label: "Flagged" },
];

const blank = (field: Cond["field"]): Cond => {
  switch (field) {
    case "tag":
      return { field, op: "has", value: "" };
    case "custom":
      return { field, key: "", op: "eq", value: "" };
    case "last_inbound_at":
    case "created_at":
      return { field, op: "within_hours", value: 24 };
    case "source":
      return { field, op: "eq", value: "comment" };
    default:
      return { field, value: true };
  }
};

/** Service 9: tags, manual tagging, auto-tag rules, saved segments with live counts, CSV import. */
export function LiveSegments() {
  const tags = useApi<{ tags: Tag[] }>("/tags/counts");
  const segs = useApi<{ segments: Segment[] }>("/segments");
  const rules = useApi<{ rules: Rule[] }>("/auto-tag-rules");
  const [notice, setNotice] = useState<string | null>(null);
  const act = async (fn: () => Promise<unknown>, after: () => unknown) => {
    setNotice(null);
    try {
      await fn();
      await after();
    } catch (e) {
      setNotice(errorText(e));
    }
  };

  return (
    <div className="space-y-6">
      {notice && <ErrorNote text={notice} />}
      <div className="grid gap-6 xl:grid-cols-2">
        <TagsPanel tags={tags.data?.tags} loading={tags.loading} reload={tags.reload} act={act} />
        <ManualTagging tags={tags.data?.tags ?? []} onChange={tags.reload} />
      </div>
      <SegmentBuilder tags={tags.data?.tags ?? []} onSaved={segs.reload} />
      <Panel title="Saved segments" description="Dynamic segments recompute every time they're used. Static ones are a frozen snapshot.">
        {segs.loading && !segs.data ? (
          <Loading />
        ) : !segs.data?.segments.length ? (
          <Empty title="No saved segments" text="Build one above and save it." />
        ) : (
          <ul className="divide-y">
            {segs.data.segments.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="flex-1 font-medium">{s.name}</span>
                <Badge tone={s.mode === "static" ? "info" : "brand"}>{s.mode}</Badge>
                <span className="text-sm tabular-nums">{s.count} people</span>
                {s.mode === "static" && (
                  <Button size="sm" variant="outline" onClick={() => act(() => api(`/segments/${s.id}/snapshot`, { method: "POST" }), segs.reload)}>
                    Refresh snapshot
                  </Button>
                )}
                <Button size="sm" variant="ghost" aria-label={`Delete ${s.name}`} onClick={() => confirm(`Delete “${s.name}”?`) && act(() => api(`/segments/${s.id}`, { method: "DELETE" }), segs.reload)}>
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <div className="grid gap-6 xl:grid-cols-2">
        <AutoRules rules={rules.data?.rules ?? []} reload={rules.reload} act={act} />
        <ImportCsv onDone={() => void tags.reload()} />
      </div>
    </div>
  );
}

function TagsPanel({
  tags,
  loading,
  reload,
  act,
}: {
  tags?: Tag[];
  loading: boolean;
  reload: () => Promise<void>;
  act: (fn: () => Promise<unknown>, after: () => unknown) => Promise<void>;
}) {
  const [name, setName] = useState("");
  return (
    <Panel title="Tags">
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) void act(() => api("/tags", { method: "POST", body: { name } }), () => (setName(""), reload()));
        }}
      >
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="New tag" aria-label="New tag name" maxLength={50} />
        <Button type="submit" variant="outline" className="h-10">
          <Plus className="size-4" /> Add
        </Button>
      </form>
      {loading && !tags ? (
        <Loading />
      ) : (
        <div className="flex flex-wrap gap-2">
          {(tags ?? []).map((t) => (
            <span key={t.id} className="bg-muted inline-flex items-center gap-2 rounded-full py-1 pr-1 pl-3 text-sm">
              <button
                className="hover:underline"
                title="Rename"
                onClick={() => {
                  const n = prompt("Rename tag", t.name);
                  if (n && n !== t.name) void act(() => api(`/tags/${t.id}`, { method: "PATCH", body: { name: n } }), reload);
                }}
              >
                {t.name}
              </button>
              <span className="text-muted-foreground text-xs tabular-nums">{t.count}</span>
              <button
                aria-label={`Delete tag ${t.name}`}
                className="hover:bg-background rounded-full p-1"
                onClick={() => confirm(`Delete tag “${t.name}” from everyone?`) && act(() => api(`/tags/${t.id}`, { method: "DELETE" }), reload)}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          {tags?.length === 0 && <p className="text-muted-foreground text-sm">No tags yet.</p>}
        </div>
      )}
    </Panel>
  );
}

function ManualTagging({ tags, onChange }: { tags: Tag[]; onChange: () => void }) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<{ id: string; username: string | null; name: string | null }[]>([]);
  const [picked, setPicked] = useState<{ id: string; label: string } | null>(null);
  const [tag, setTag] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      api<{ customers: typeof rows }>(`/customers?q=${encodeURIComponent(q)}`)
        .then((r) => setRows(r.customers))
        .catch(() => setRows([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);
  const run = async (method: "POST" | "DELETE") => {
    if (!picked || !tag.trim()) return;
    try {
      if (method === "POST") await api(`/customers/${picked.id}/tags`, { method, body: { name: tag.trim() } });
      else await api(`/customers/${picked.id}/tags/${encodeURIComponent(tag.trim())}`, { method });
      setMsg(`${method === "POST" ? "Added" : "Removed"} “${tag.trim()}” ${method === "POST" ? "to" : "from"} ${picked.label}.`);
      onChange();
    } catch (e) {
      setMsg(errorText(e));
    }
  };
  return (
    <Panel title="Tag a customer" description="Adding a tag can start a drip sequence or trigger other rules.">
      <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by username or name" aria-label="Search customers" />
      <ul className="mt-2 max-h-40 overflow-y-auto rounded-xl border text-sm">
        {rows.map((r) => (
          <li key={r.id}>
            <button
              className={cn("w-full px-3 py-2 text-left hover:bg-accent/50", picked?.id === r.id && "bg-accent")}
              onClick={() => setPicked({ id: r.id, label: r.username ? `@${r.username}` : (r.name ?? "customer") })}
            >
              {r.username ? `@${r.username}` : "—"} <span className="text-muted-foreground">{r.name}</span>
            </button>
          </li>
        ))}
        {rows.length === 0 && <li className="text-muted-foreground px-3 py-2">No matches.</li>}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        <input className={cn(inputCls, "flex-1")} list="tag-names" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag" aria-label="Tag to add or remove" />
        <datalist id="tag-names">
          {tags.map((t) => (
            <option key={t.id} value={t.name} />
          ))}
        </datalist>
        <Button className="h-10" disabled={!picked || !tag.trim()} onClick={() => run("POST")}>
          Add tag
        </Button>
        <Button className="h-10" variant="outline" disabled={!picked || !tag.trim()} onClick={() => run("DELETE")}>
          Remove
        </Button>
      </div>
      {msg && <p className="text-muted-foreground mt-2 text-sm">{msg}</p>}
    </Panel>
  );
}

function SegmentBuilder({ tags, onSaved }: { tags: Tag[]; onSaved: () => void }) {
  const [op, setOp] = useState<"and" | "or">("and");
  const [conds, setConds] = useState<Cond[]>([{ field: "tag", op: "has", value: "" }]);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"dynamic" | "static">("dynamic");
  const [preview, setPreview] = useState<{ count: number; sample: { id: string; username: string | null }[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const ready = conds.filter((c) => !(c.field === "tag" && !c.value) && !(c.field === "custom" && !c.key));
  const filter = { op, conditions: ready };

  useEffect(() => {
    const t = setTimeout(() => {
      api<typeof preview>("/segments/preview", { method: "POST", body: { filter } })
        .then((p) => {
          setPreview(p);
          setErr(null);
        })
        .catch((e) => setErr(errorText(e)));
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filter)]);

  const set = (i: number, c: Cond) => setConds(conds.map((x, j) => (j === i ? c : x)));

  return (
    <Panel title="Build a segment" description="Combine conditions. The count updates live.">
      <div className="mb-3 flex items-center gap-2 text-sm">
        Match
        <select className={cn(inputCls, "w-auto")} value={op} onChange={(e) => setOp(e.target.value as "and" | "or")} aria-label="Match all or any">
          <option value="and">all of these</option>
          <option value="or">any of these</option>
        </select>
      </div>
      <div className="space-y-2">
        {conds.map((c, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <select className={cn(inputCls, "w-44")} value={c.field} onChange={(e) => set(i, blank(e.target.value as Cond["field"]))} aria-label="Field">
              {FIELDS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <CondEditor c={c} tags={tags} onChange={(n) => set(i, n)} />
            <Button variant="ghost" className="h-10" aria-label="Remove condition" onClick={() => setConds(conds.filter((_, j) => j !== i))}>
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button size="sm" variant="outline" className="mt-3" onClick={() => setConds([...conds, blank("tag")])}>
        <Plus className="size-3.5" /> Condition
      </Button>
      <div className="bg-muted/50 mt-4 rounded-xl border p-4 text-sm" aria-live="polite">
        {err ? (
          <span className="text-rose-600">{err}</span>
        ) : (
          <>
            <b className="text-lg tabular-nums">{preview?.count ?? "…"}</b> people match
            {!!preview?.sample.length && <span className="text-muted-foreground"> · e.g. {preview.sample.map((s) => (s.username ? `@${s.username}` : "—")).join(", ")}</span>}
          </>
        )}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Segment name" aria-label="Segment name" />
        <select className={inputCls} value={mode} onChange={(e) => setMode(e.target.value as "dynamic" | "static")} aria-label="Segment mode">
          <option value="dynamic">Dynamic</option>
          <option value="static">Static snapshot</option>
        </select>
        <Button
          className="h-10"
          disabled={!name.trim() || !!err}
          onClick={async () => {
            try {
              await api("/segments", { method: "POST", body: { name, mode, filter } });
              setName("");
              onSaved();
            } catch (e) {
              setErr(errorText(e));
            }
          }}
        >
          Save segment
        </Button>
      </div>
    </Panel>
  );
}

function CondEditor({ c, tags, onChange }: { c: Cond; tags: Tag[]; onChange: (c: Cond) => void }) {
  if (c.field === "tag")
    return (
      <>
        <select className={cn(inputCls, "w-36")} value={c.op} onChange={(e) => onChange({ ...c, op: e.target.value as "has" | "not_has" })} aria-label="Has or not">
          <option value="has">has</option>
          <option value="not_has">doesn&apos;t have</option>
        </select>
        <select className={cn(inputCls, "w-44")} value={c.value} onChange={(e) => onChange({ ...c, value: e.target.value })} aria-label="Tag">
          <option value="">Pick a tag</option>
          {tags.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </>
    );
  if (c.field === "custom")
    return (
      <>
        <input className={cn(inputCls, "w-36")} value={c.key} onChange={(e) => onChange({ ...c, key: e.target.value.replace(/[^A-Za-z0-9_]/g, "") })} placeholder="field_name" aria-label="Custom field key" />
        <select className={cn(inputCls, "w-32")} value={c.op} onChange={(e) => onChange({ ...c, op: e.target.value as "eq" })} aria-label="Operator">
          <option value="eq">equals</option>
          <option value="contains">contains</option>
          <option value="exists">is set</option>
        </select>
        {c.op !== "exists" && <input className={cn(inputCls, "w-40")} value={c.value ?? ""} onChange={(e) => onChange({ ...c, value: e.target.value })} aria-label="Value" />}
      </>
    );
  if (c.field === "last_inbound_at" || c.field === "created_at")
    return (
      <>
        <select className={cn(inputCls, "w-40")} value={c.op} onChange={(e) => onChange({ ...c, op: e.target.value as "within_hours" })} aria-label="Within or older">
          <option value="within_hours">within the last</option>
          <option value="older_than_hours">more than</option>
        </select>
        <input className={cn(inputCls, "w-24")} inputMode="numeric" value={c.value} onChange={(e) => onChange({ ...c, value: Number(e.target.value.replace(/\D/g, "")) || 1 })} aria-label="Hours" />
        <span className="text-sm">hours{c.op === "older_than_hours" ? " ago" : ""}</span>
      </>
    );
  if (c.field === "source")
    return (
      <select className={cn(inputCls, "w-44")} value={c.value} onChange={(e) => onChange({ ...c, value: e.target.value })} aria-label="Source">
        {["comment", "dm", "story_reply", "story_mention", "referral", "import"].map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
    );
  return (
    <select className={cn(inputCls, "w-28")} value={String(c.value)} onChange={(e) => onChange({ ...c, value: e.target.value === "true" } as Cond)} aria-label="Yes or no">
      <option value="true">yes</option>
      <option value="false">no</option>
    </select>
  );
}

function AutoRules({ rules, reload, act }: { rules: Rule[]; reload: () => Promise<void>; act: (fn: () => Promise<unknown>, after: () => unknown) => Promise<void> }) {
  const [trigger, setTrigger] = useState("lead_captured");
  const [tagName, setTagName] = useState("");
  const LABEL: Record<string, string> = {
    automation_triggered: "An automation fires",
    lead_captured: "A lead is captured",
    giveaway_entry: "Someone enters a giveaway",
    link_source: "Someone comes from a tracked link",
  };
  return (
    <Panel title="Auto-tag rules" description="Tag people automatically when something happens.">
      <ul className="mb-4 space-y-2 text-sm">
        {rules.map((r) => (
          <li key={r.id} className="flex items-center gap-2">
            <span className="flex-1">
              {LABEL[r.trigger] ?? r.trigger} → <Badge tone="brand">{r.tagName}</Badge>
            </span>
            <Button size="sm" variant="ghost" aria-label="Delete rule" onClick={() => act(() => api(`/auto-tag-rules/${r.id}`, { method: "DELETE" }), reload)}>
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
        {rules.length === 0 && <li className="text-muted-foreground">No rules yet.</li>}
      </ul>
      <div className="flex flex-wrap gap-2">
        <select className={cn(inputCls, "w-auto flex-1")} value={trigger} onChange={(e) => setTrigger(e.target.value)} aria-label="When">
          {Object.entries(LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <input className={cn(inputCls, "w-40")} value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="Tag" aria-label="Tag to add" />
        <Button className="h-10" disabled={!tagName.trim()} onClick={() => act(() => api("/auto-tag-rules", { method: "POST", body: { trigger, tagName } }), () => (setTagName(""), reload()))}>
          Add rule
        </Button>
      </div>
    </Panel>
  );
}

function ImportCsv({ onDone }: { onDone: () => void }) {
  const [csv, setCsv] = useState("");
  const [res, setRes] = useState<string | null>(null);
  return (
    <Panel title="Import customers (CSV)" description="Columns: username, name, email, phone, tags (separate tags with ;). Matches existing people by email or phone.">
      <Field label="CSV file">
        <input
          type="file"
          accept=".csv,text/csv"
          className="text-sm"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) setCsv(await f.text());
          }}
        />
      </Field>
      <textarea rows={4} className={cn(inputCls, "mt-3 h-auto py-2 font-mono text-xs")} value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={"username,name,email,tags\nana,Ana,ana@example.com,VIP;Skincare"} aria-label="CSV content" />
      <Button
        className="mt-3"
        disabled={!csv.trim()}
        onClick={async () => {
          try {
            const r = await api<{ created: number; updated: number; errors: { row: number; error: string }[] }>("/customers/import", { method: "POST", body: { csv } });
            setRes(`${r.created} added, ${r.updated} updated${r.errors.length ? `, ${r.errors.length} rows with problems (e.g. row ${r.errors[0]!.row}: ${r.errors[0]!.error})` : ""}.`);
            onDone();
          } catch (e) {
            setRes(errorText(e));
          }
        }}
      >
        <Upload className="size-4" /> Import
      </Button>
      {res && <p className="text-muted-foreground mt-2 text-sm">{res}</p>}
      <p className="text-muted-foreground mt-3 text-xs">Imported people can&apos;t be messaged until they DM you on Instagram first.</p>
    </Panel>
  );
}
