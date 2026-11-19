"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Download, MessageCircle, Search, X } from "lucide-react";

import { ErrorNote, Loading } from "@/components/dashboard/marketing/live/states";
import { useApi } from "@/components/dashboard/marketing/live/use-api";
import { timeAgo } from "@/components/dashboard/notifications";
import { Avatar, Badge, ChannelIcon, PageHeader, Panel, Table, Td, Th } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, ApiError, download } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  optedOut: boolean;
  lastInboundAt: string | null;
  createdAt: string;
  tags: string[];
  orders: number;
  spent: number;
  conversationId: string | null;
};
type Profile = {
  customer: Row & { customFields: Record<string, unknown>; consentAt: string | null };
  orders: { id: string; orderNumber: string | null; total: string; refunded: string; currency: string; status: string; rule: string; orderedAt: string }[];
};

const nameOf = (c: { name: string | null; username: string | null }) => c.name ?? (c.username ? `@${c.username}` : "Customer");
const money = (n: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

export function CustomersView({ initialId }: { initialId: string | null }) {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const [exportErr, setExportErr] = useState<string | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);
  const list = useApi<{ customers: Row[]; total: number }>(`/customer-list?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(tag ? { tag } : {}) })}`);
  const tagCounts = useApi<{ tags: { name: string; count: number }[] }>("/tags/counts");

  const select = (id: string | null) => {
    setSelectedId(id);
    window.history.replaceState(null, "", id ? `/dashboard/customers?c=${id}` : "/dashboard/customers");
  };

  return (
    <>
      <PageHeader
        title="Customers"
        description="Everyone who messaged your Instagram, with what they shared and bought."
        actions={
          <Button variant="outline" onClick={() => void download("/leads/export.csv", "leads.csv").catch(() => setExportErr("Export failed."))}>
            <Download className="size-4" /> Export leads CSV
          </Button>
        }
      />
      {exportErr && <p className="mb-3 text-sm text-rose-600">{exportErr}</p>}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="bg-card flex h-10 min-w-60 flex-1 items-center gap-2 rounded-xl border px-3 text-sm md:max-w-sm">
          <Search className="text-muted-foreground size-4" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, @handle, email or phone" aria-label="Search customers" className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent outline-none" />
        </label>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTag(null)} className={cn("rounded-full border px-3 py-1 text-xs", !tag ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-accent")}>
            All{list.data ? ` · ${list.data.total}` : ""}
          </button>
          {(tagCounts.data?.tags ?? []).map((t) => (
            <button
              key={t.name}
              onClick={() => setTag(tag === t.name ? null : t.name)}
              className={cn("rounded-full border px-3 py-1 text-xs", tag === t.name ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-accent")}
            >
              {t.name} · {t.count}
            </button>
          ))}
        </div>
      </div>

      <Panel>
        {list.error ? (
          <ErrorNote text={list.error} onRetry={list.reload} />
        ) : !list.data ? (
          <Loading />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Contact</Th>
                <Th>Tags</Th>
                <Th className="text-right">Orders</Th>
                <Th className="text-right">Spent</Th>
                <Th>Last message</Th>
              </tr>
            </thead>
            <tbody>
              {list.data.customers.map((c) => (
                <tr key={c.id} onClick={() => select(c.id)} className={cn("hover:bg-accent/30 cursor-pointer", c.id === selectedId && "bg-accent/40")}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={nameOf(c)} />
                      <div>
                        <p className="font-medium">{nameOf(c)}</p>
                        <p className="text-muted-foreground flex items-center gap-1 text-xs">
                          <ChannelIcon channel="instagram" className="size-3" /> {c.username ? `@${c.username}` : "Instagram"}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-muted-foreground text-xs">{c.email ?? c.phone ?? "—"}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                      {c.optedOut && <Badge tone="bad">Opted out</Badge>}
                    </div>
                  </Td>
                  <Td className="text-right tabular-nums">{c.orders}</Td>
                  <Td className="text-right tabular-nums">{money(c.spent)}</Td>
                  <Td className="text-muted-foreground">{c.lastInboundAt ? timeAgo(c.lastInboundAt) : "—"}</Td>
                </tr>
              ))}
              {list.data.customers.length === 0 && (
                <tr>
                  <Td className="text-muted-foreground text-center" colSpan={6}>
                    {query || tag ? "No customers match." : "No customers yet. Everyone who messages your Instagram shows up here."}
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Panel>

      {selectedId && (
        <ProfileDrawer
          id={selectedId}
          onClose={() => select(null)}
          onChanged={() => {
            void list.reload();
            void tagCounts.reload();
          }}
        />
      )}
    </>
  );
}

function ProfileDrawer({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const { data, error, reload } = useApi<Profile>(`/customer-list/${id}`);
  const [newTag, setNewTag] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const act = async (fn: () => Promise<unknown>) => {
    setErr(null);
    try {
      await fn();
      await reload();
      onChanged();
    } catch (e) {
      setErr(e instanceof ApiError ? e.readable : "Something went wrong.");
    }
  };
  const c = data?.customer;
  const fields = Object.entries(c?.customFields ?? {});

  return (
    <>
      <button aria-label="Close" className="fixed inset-0 z-50 bg-black/30" onClick={onClose} />
      <aside className="bg-background fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l p-6 shadow-2xl">
        {error ? (
          <ErrorNote text={error} onRetry={reload} />
        ) : !c ? (
          <Loading />
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={nameOf(c)} className="size-12 text-sm" />
                <div>
                  <p className="font-semibold">{nameOf(c)}</p>
                  <p className="text-muted-foreground text-sm">Customer since {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Mini label="Orders" value={String(data!.orders.filter((o) => o.status === "open").length)} />
              <Mini label="Spent" value={money(data!.orders.filter((o) => o.status === "open").reduce((s, o) => s + Number(o.total) - Number(o.refunded), 0), data!.orders[0]?.currency)} />
              <Mini label="Last message" value={c.lastInboundAt ? timeAgo(c.lastInboundAt) : "—"} />
            </div>
            <Section title="Contact">
              <p className="flex items-center gap-2 text-sm">
                <ChannelIcon channel="instagram" /> {c.username ? `@${c.username}` : "Instagram"}
              </p>
              {c.email && <p className="text-muted-foreground text-sm">{c.email}</p>}
              {c.phone && <p className="text-muted-foreground text-sm">{c.phone}</p>}
              {c.consentAt && <p className="text-muted-foreground text-xs">Agreed to be contacted on {new Date(c.consentAt).toLocaleDateString()}</p>}
            </Section>
            <Section title="Tags">
              <div className="flex flex-wrap items-center gap-1.5">
                {c.tags.map((t) => (
                  <Badge key={t}>
                    {t}
                    <button aria-label={`Remove tag ${t}`} className="opacity-60 hover:opacity-100" onClick={() => void act(() => api(`/customers/${c.id}/tags/${encodeURIComponent(t)}`, { method: "DELETE" }))}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newTag.trim()) return;
                    void act(async () => {
                      await api(`/customers/${c.id}/tags`, { method: "POST", body: { name: newTag.trim() } });
                      setNewTag("");
                    });
                  }}
                >
                  <input value={newTag} onChange={(e) => setNewTag(e.target.value)} maxLength={50} placeholder="+ Add tag" aria-label="Add tag" className="w-24 rounded-full border border-dashed bg-transparent px-2 py-0.5 text-xs outline-none" />
                </form>
              </div>
            </Section>
            {fields.length > 0 && (
              <Section title="Saved answers">
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                  {fields.map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted-foreground">{k.replaceAll("_", " ")}</dt>
                      <dd>{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            )}
            <Section title="Orders">
              {data!.orders.length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders matched to this person yet.</p>
              ) : (
                <ul className="divide-y text-sm">
                  {data!.orders.map((o) => (
                    <li key={o.id} className="flex justify-between gap-2 py-1.5">
                      <span>{o.orderNumber ?? "Order"}</span>
                      <span className="text-muted-foreground">{new Date(o.orderedAt).toLocaleDateString()}</span>
                      <span className={cn("tabular-nums", o.status === "cancelled" && "line-through opacity-60")}>{money(Number(o.total), o.currency)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
            {err && <p className="mt-3 text-sm text-rose-600">{err}</p>}
            <div className="mt-6 flex flex-wrap gap-2">
              {c.conversationId && (
                <Button asChild>
                  <Link href={`/dashboard/inbox?c=${c.conversationId}`}>
                    <MessageCircle className="size-4" /> Open chat
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  if (!window.confirm(`Delete ${nameOf(c)} and all their messages? This can't be undone.`)) return;
                  void act(() => api(`/customers/${c.id}`, { method: "DELETE" })).then(onClose);
                }}
              >
                Delete customer
              </Button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted rounded-xl p-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">{title}</p>
      {children}
    </section>
  );
}
