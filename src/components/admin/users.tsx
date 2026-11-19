"use client";

import { useEffect, useMemo, useState } from "react";

import { Download, Search, X } from "lucide-react";

import { type Account, errText, fmtDate, type Plan, STATUS_META, type SubStatus, useAdmin } from "@/components/admin/store";
import { useApi } from "@/components/dashboard/marketing/live/use-api";
import { Avatar, Badge, PageHeader, Panel, Table, Tabs, Td, Th, money } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type Filter = "all" | SubStatus;
const inputCls = "bg-background focus-visible:ring-ring/50 h-9 w-full rounded-xl border px-3 text-sm outline-none focus-visible:ring-[3px]";

export const accountMrr = (a: Account, plans: Plan[]) => {
  if (!a.sub || (a.sub.status !== "active" && a.sub.status !== "past_due")) return 0;
  const p = plans.find((x) => x.id === a.sub!.planId);
  return p ? (a.sub.cycle === "yearly" ? p.yearly / 12 : p.monthly) : 0;
};

const csvCell = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) || /^[=+\-@]/.test(s) ? `"${s.replace(/^([=+\-@])/, "'$1").replace(/"/g, '""')}"` : s;
};

export function AdminUsers({ initialId }: { initialId: string | null }) {
  const { accounts } = useAdmin();
  const plans = useApi<{ plans: Plan[] }>("/admin/plans").data?.plans ?? [];
  const [filter, setFilter] = useState<Filter>("all");
  const [plan, setPlan] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(initialId);
  const list = useMemo(() => accounts ?? [], [accounts]);
  const count = (s: SubStatus) => list.filter((a) => a.sub?.status === s).length;

  const shown = useMemo(
    () =>
      list.filter(
        (a) =>
          (filter === "all" || a.sub?.status === filter) &&
          (plan === "all" || a.sub?.planId === plan) &&
          (!q || `${a.workspace.name} ${a.owner?.name ?? ""} ${a.owner?.email ?? ""}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [list, filter, plan, q],
  );

  const exportCsv = () => {
    const rows = [["brand", "owner", "email", "plan", "cycle", "status", "beta", "signed_up", "last_login", "instagram_accounts", "messages_this_month"]];
    for (const a of shown)
      rows.push([a.workspace.name, a.owner?.name ?? "", a.owner?.email ?? "", a.sub?.planId ?? "", a.sub?.cycle ?? "", a.sub?.status ?? "", String(a.sub?.beta ?? ""), a.workspace.createdAt, a.owner?.lastLoginAt ?? "", String(a.instagramAccounts), String(a.conversationsThisMonth)]);
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.map(csvCell).join(",")).join("\r\n")], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "sojao-accounts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const select = (id: string | null) => {
    setSelected(id);
    window.history.replaceState(null, "", id ? `/admin/users?u=${id}` : "/admin/users");
  };
  const current = list.find((a) => a.workspace.id === selected);

  return (
    <>
      <PageHeader
        title="Users"
        description="Every brand on Sojao, its owner, plan and status."
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={!shown.length}>
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Tabs
          className="flex-wrap"
          tabs={[
            { id: "all", label: "All", count: list.length },
            { id: "active", label: "Active", count: count("active") },
            { id: "trial", label: "Trial", count: count("trial") },
            { id: "past_due", label: "Past due", count: count("past_due") },
            { id: "suspended", label: "Suspended", count: count("suspended") },
            { id: "cancelled", label: "Cancelled", count: count("cancelled") },
          ]}
          value={filter}
          onChange={setFilter}
        />
        <select aria-label="Filter by plan" value={plan} onChange={(e) => setPlan(e.target.value)} className={cn(inputCls, "w-36")}>
          <option value="all">All plans</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <label className="bg-background flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 text-sm sm:max-w-xs">
          <Search className="text-muted-foreground size-4" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brand, name or email" aria-label="Search accounts" className="min-w-0 flex-1 bg-transparent outline-none" />
        </label>
      </div>

      <Panel>
        <Table>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>Plan</Th>
              <Th>Status</Th>
              <Th>Instagram</Th>
              <Th className="text-right">MRR</Th>
              <Th>Signed up</Th>
              <Th>Last login</Th>
            </tr>
          </thead>
          <tbody>
            {shown.map((a) => (
              <tr key={a.workspace.id} onClick={() => select(a.workspace.id)} className={cn("hover:bg-accent/30 cursor-pointer", a.workspace.id === selected && "bg-accent/40")}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={a.owner?.name ?? a.workspace.name} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{a.workspace.name}</p>
                      <p className="text-muted-foreground truncate text-xs">{a.owner ? `${a.owner.name} · ${a.owner.email}` : "No owner"}</p>
                    </div>
                  </div>
                </Td>
                <Td>{plans.find((p) => p.id === a.sub?.planId)?.name ?? a.sub?.planId ?? "—"}</Td>
                <Td>{a.sub ? <Badge tone={STATUS_META[a.sub.status].tone}>{STATUS_META[a.sub.status].label}</Badge> : "—"}</Td>
                <Td>{a.instagramAccounts ? <Badge tone="good">Connected</Badge> : <span className="text-muted-foreground">—</span>}</Td>
                <Td className="text-right tabular-nums">{money(accountMrr(a, plans))}</Td>
                <Td className="text-muted-foreground">{fmtDate(a.workspace.createdAt)}</Td>
                <Td className="text-muted-foreground">{fmtDate(a.owner?.lastLoginAt)}</Td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <Td colSpan={7} className="text-muted-foreground text-center">
                  {accounts === null ? "Loading…" : "No accounts match."}
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Panel>

      {current && <AccountDrawer a={current} plans={plans} onClose={() => select(null)} />}
    </>
  );
}

function AccountDrawer({ a, plans, onClose }: { a: Account; plans: Plan[]; onClose: () => void }) {
  const { can, reloadAccounts, notify } = useAdmin();
  const [notes, setNotes] = useState(a.sub?.adminNotes ?? "");
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => setNotes(a.sub?.adminNotes ?? ""), [a.sub?.adminNotes]);

  const patch = async (body: Record<string, unknown>, msg: string) => {
    setErr(null);
    try {
      await api(`/admin/accounts/${a.workspace.id}`, { method: "PATCH", body });
      await reloadAccounts();
      notify(`${msg}: ${a.workspace.name}`);
    } catch (e) {
      setErr(errText(e));
    }
  };
  const write = can("write");

  return (
    <>
      <button aria-label="Close" className="fixed inset-0 z-50 bg-black/30" onClick={onClose} />
      <aside className="bg-background fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={a.owner?.name ?? a.workspace.name} className="size-12 text-sm" />
            <div>
              <p className="font-semibold">{a.workspace.name}</p>
              <p className="text-muted-foreground text-sm">{a.owner ? `${a.owner.name} · ${a.owner.email}` : "No owner"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <Info label="Signed up" value={fmtDate(a.workspace.createdAt)} />
          <Info label="Last login" value={fmtDate(a.owner?.lastLoginAt)} />
          <Info label="Instagram" value={a.instagramAccounts ? "Connected" : "Not connected"} />
          <Info label="Messages this month" value={a.conversationsThisMonth.toLocaleString()} />
          <Info label="Trial ends" value={fmtDate(a.sub?.trialEndsAt)} />
          <Info label="Beta" value={a.sub?.beta ? "Yes" : "No"} />
        </dl>

        <section className="mt-6 space-y-3">
          <p className="text-muted-foreground text-xs font-medium uppercase">Plan and status</p>
          <div className="grid grid-cols-2 gap-2">
            <select aria-label="Plan" disabled={!write} value={a.sub?.planId ?? ""} onChange={(e) => void patch({ planId: e.target.value }, "Changed plan")} className={inputCls}>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select aria-label="Billing cycle" disabled={!write} value={a.sub?.cycle ?? "monthly"} onChange={(e) => void patch({ cycle: e.target.value }, "Changed billing")} className={inputCls}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select
              aria-label="Status"
              disabled={!write}
              value={a.sub?.status ?? "trial"}
              onChange={(e) => {
                const s = e.target.value as SubStatus;
                if ((s === "suspended" || s === "cancelled") && !window.confirm(`${STATUS_META[s].label} ${a.workspace.name}? Everyone on this brand is signed out and can't use Sojao until you change it back.`)) return;
                void patch({ status: s }, `Status → ${STATUS_META[s].label}`);
              }}
              className={inputCls}
            >
              {(Object.keys(STATUS_META) as SubStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" disabled={!write} className="h-9" onClick={() => void patch({ beta: !a.sub?.beta }, a.sub?.beta ? "Beta off" : "Beta on")}>
              {a.sub?.beta ? "Remove beta" : "Mark as beta"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[7, 14, 30].map((d) => (
              <Button key={d} variant="outline" size="sm" disabled={!can("support")} onClick={() => void patch({ extendTrialDays: d }, `Trial +${d} days`)}>
                Extend trial +{d} days
              </Button>
            ))}
          </div>
        </section>

        <section className="mt-6 space-y-2">
          <p className="text-muted-foreground text-xs font-medium uppercase">Internal notes</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} maxLength={2000} disabled={!can("support")} className={cn(inputCls, "h-auto py-2")} placeholder="Only Sojao admins see this." />
          <Button size="sm" disabled={!can("support") || notes === (a.sub?.adminNotes ?? "")} onClick={() => void patch({ adminNotes: notes }, "Saved notes")}>
            Save notes
          </Button>
        </section>

        <section className="mt-6">
          <p className="text-muted-foreground text-xs font-medium uppercase">Payments</p>
          <p className="text-muted-foreground mt-1 text-sm">No payment provider is connected yet, so there are no invoices.</p>
        </section>
        {!write && <p className="text-muted-foreground mt-4 text-xs">Your admin role can view this account{can("support") ? ", extend trials and edit notes" : ""}.</p>}
        {err && <p className="mt-3 text-sm text-rose-600">{err}</p>}
      </aside>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted rounded-xl p-3">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
