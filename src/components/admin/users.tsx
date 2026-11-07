"use client";

import { useMemo, useState } from "react";

import {
  Ban,
  CalendarPlus,
  CheckCircle2,
  Download,
  KeyRound,
  LogIn,
  Mail,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useAdmin } from "@/components/admin/store";
import {
  Avatar,
  Badge,
  ChannelIcon,
  PageHeader,
  Panel,
  Table,
  Td,
  Th,
  Tabs,
  money,
} from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import {
  type AdminUser,
  type BillingCycle,
  type PlanId,
  STATUS_META,
  type UserStatus,
  fmtDate,
  userMrr,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";

type Filter = "all" | UserStatus;

export function AdminUsers({ initialId }: { initialId: string | null }) {
  const { users, plans } = useAdmin();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [plan, setPlan] = useState<"all" | PlanId>("all");
  const [selected, setSelected] = useState<string | null>(initialId);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return users.filter(
      (u) =>
        (filter === "all" || u.status === filter) &&
        (plan === "all" || u.plan === plan) &&
        (!s || [u.name, u.email, u.brand, u.country].some((v) => v.toLowerCase().includes(s))),
    );
  }, [users, q, filter, plan]);

  const count = (st: UserStatus) => users.filter((u) => u.status === st).length;
  const user = users.find((u) => u.id === selected) ?? null;

  const exportCsv = () => {
    const head = ["Name", "Email", "Brand", "Country", "Plan", "Cycle", "Status", "Signed up", "Total paid"];
    const rows = list.map((u) => [u.name, u.email, u.brand, u.country, u.plan, u.cycle, u.status, u.signedUp, u.totalPaid]);
    const csv = [head, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "sojao-users.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHeader
        title="Users"
        description="Every registered account, their plan and status. Click a user to manage them."
        actions={
          <Button variant="outline" onClick={exportCsv}>
            <Download /> Export CSV
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Tabs<Filter>
          value={filter}
          onChange={setFilter}
          tabs={[
            { id: "all", label: "All", count: users.length },
            { id: "active", label: "Active", count: count("active") },
            { id: "trial", label: "Trial", count: count("trial") },
            { id: "past_due", label: "Past due", count: count("past_due") },
            { id: "suspended", label: "Suspended", count: count("suspended") },
            { id: "cancelled", label: "Cancelled", count: count("cancelled") },
          ]}
        />
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as "all" | PlanId)}
          className="bg-background h-9 rounded-xl border px-3 text-sm"
          aria-label="Filter by plan"
        >
          <option value="all">All plans</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <label className="bg-background flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 text-sm sm:max-w-xs">
          <Search className="text-muted-foreground size-4" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, brand…"
            className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent outline-none"
          />
        </label>
      </div>

      <Panel>
        <Table>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>Plan</Th>
              <Th>Status</Th>
              <Th>Channels</Th>
              <Th className="text-right">MRR</Th>
              <Th>Signed up</Th>
              <Th>Last active</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr
                key={u.id}
                onClick={() => setSelected(u.id)}
                className={cn("hover:bg-accent/50 cursor-pointer", selected === u.id && "bg-accent/60")}
              >
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{u.name}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {u.brand} · {u.email}
                      </p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <span className="font-medium">{plans.find((p) => p.id === u.plan)!.name}</span>
                  <span className="text-muted-foreground block text-xs capitalize">{u.cycle}</span>
                </Td>
                <Td>
                  <Badge tone={STATUS_META[u.status].tone}>{STATUS_META[u.status].label}</Badge>
                  {u.beta && <Badge tone="brand" className="ml-1">Beta</Badge>}
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    {u.channels.map((c) => (
                      <ChannelIcon key={c} channel={c} />
                    ))}
                  </div>
                </Td>
                <Td className="text-right tabular-nums">{money(userMrr(u, plans))}</Td>
                <Td className="text-muted-foreground whitespace-nowrap">{fmtDate(u.signedUp)}</Td>
                <Td className="text-muted-foreground whitespace-nowrap">{u.lastActive}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {list.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">No users match these filters.</p>
        )}
      </Panel>

      {user && <UserDrawer user={user} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ---------------- Drawer with admin controls ---------------- */

function UserDrawer({ user: u, onClose }: { user: AdminUser; onClose: () => void }) {
  const { plans, payments, updateUser, deleteUser } = useAdmin();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notes, setNotes] = useState(u.notes);
  const [key, setKey] = useState(u.id);
  if (key !== u.id) {
    setKey(u.id);
    setNotes(u.notes);
    setConfirmDelete(false);
  }

  const plan = plans.find((p) => p.id === u.plan)!;
  const usage = Math.min(100, Math.round((u.conversations / plan.limits.conversations) * 100));
  const userPayments = payments.filter((p) => p.userId === u.id);

  const addDays = (iso: string, days: number) => {
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  return (
    <>
      <button aria-label="Close" className="fixed inset-0 z-[55] bg-black/30" onClick={onClose} />
      <aside className="bg-background fixed inset-y-0 right-0 z-[56] flex w-full max-w-md flex-col border-l shadow-2xl">
        <header className="flex items-center gap-3 border-b px-5 py-4">
          <Avatar name={u.name} className="size-11 text-sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{u.name}</p>
            <p className="text-muted-foreground truncate text-sm">{u.email}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close panel">
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone={STATUS_META[u.status].tone}>{STATUS_META[u.status].label}</Badge>
            {u.beta && <Badge tone="brand">Beta</Badge>}
            <Badge tone={u.verified ? "good" : "warn"}>{u.verified ? "Email verified" : "Email not verified"}</Badge>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Info label="Brand" value={u.brand} />
            <Info label="Country" value={u.country} />
            <Info label="Signed up" value={fmtDate(u.signedUp)} />
            <Info label="Last active" value={u.lastActive} />
            <Info label={u.status === "trial" ? "Trial ends" : "Renews on"} value={fmtDate(u.renewsOn)} />
            <Info label="Total paid" value={money(u.totalPaid)} />
          </dl>

          {/* Plan */}
          <section className="space-y-3 rounded-2xl border p-4">
            <h3 className="text-sm font-semibold">Plan &amp; billing</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="text-muted-foreground mb-1 block text-xs">Plan</span>
                <select
                  value={u.plan}
                  onChange={(e) => {
                    const p = plans.find((x) => x.id === e.target.value)!;
                    updateUser(u.id, { plan: p.id }, `Changed plan to ${p.name}`);
                  }}
                  className="bg-background h-9 w-full rounded-lg border px-2"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({money(p.monthly)}/mo)
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="text-muted-foreground mb-1 block text-xs">Billing</span>
                <select
                  value={u.cycle}
                  onChange={(e) =>
                    updateUser(u.id, { cycle: e.target.value as BillingCycle }, `Switched billing to ${e.target.value}`)
                  }
                  className="bg-background h-9 w-full rounded-lg border px-2"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Conversations this month</span>
                <span className="tabular-nums">
                  {u.conversations.toLocaleString()} / {plan.limits.conversations.toLocaleString()}
                </span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className={cn("h-full rounded-full", usage >= 90 ? "bg-amber-500" : "bg-brand")}
                  style={{ width: `${usage}%` }}
                />
              </div>
            </div>
            <label className="flex items-center justify-between text-sm">
              Beta pricing (free months)
              <input
                type="checkbox"
                checked={u.beta}
                onChange={(e) => updateUser(u.id, { beta: e.target.checked }, e.target.checked ? "Added to beta" : "Removed from beta")}
                className="accent-[var(--brand)] size-4"
              />
            </label>
          </section>

          {/* Actions */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Admin actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {u.status === "suspended" ? (
                <Action icon={CheckCircle2} onClick={() => updateUser(u.id, { status: "active" }, "Reactivated account")}>
                  Reactivate
                </Action>
              ) : (
                <Action icon={Ban} tone="bad" onClick={() => updateUser(u.id, { status: "suspended" }, "Suspended account")}>
                  Suspend
                </Action>
              )}
              <Action
                icon={CalendarPlus}
                onClick={() =>
                  updateUser(
                    u.id,
                    { renewsOn: addDays(u.renewsOn, 7), status: u.status === "cancelled" ? "trial" : u.status },
                    u.status === "trial" || u.status === "cancelled" ? "Extended trial by 7 days" : "Added 7 free days",
                  )
                }
              >
                +7 days free
              </Action>
              {u.status === "past_due" && (
                <Action icon={CheckCircle2} onClick={() => updateUser(u.id, { status: "active" }, "Marked as paid")}>
                  Mark as paid
                </Action>
              )}
              {u.status !== "cancelled" && (
                <Action icon={X} onClick={() => updateUser(u.id, { status: "cancelled" }, "Cancelled subscription")}>
                  Cancel plan
                </Action>
              )}
              {!u.verified && (
                <Action icon={Mail} onClick={() => updateUser(u.id, { verified: true }, "Verified email manually")}>
                  Verify email
                </Action>
              )}
              <Action icon={KeyRound} onClick={() => updateUser(u.id, {}, "Sent password reset")}>
                Reset password
              </Action>
              <Action icon={LogIn} onClick={() => updateUser(u.id, {}, "Logged in as user")}>
                Log in as user
              </Action>
            </div>
          </section>

          {/* Payments */}
          <section>
            <h3 className="mb-2 text-sm font-semibold">Payments</h3>
            {userPayments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No payments yet.</p>
            ) : (
              <ul className="divide-y rounded-2xl border text-sm">
                {userPayments.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="flex-1">
                      {p.id} <span className="text-muted-foreground">· {fmtDate(p.date)}</span>
                    </span>
                    <span className="tabular-nums">{money(p.amount)}</span>
                    <Badge tone={p.status === "paid" ? "good" : p.status === "failed" ? "bad" : "neutral"}>{p.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Notes */}
          <section>
            <h3 className="mb-2 text-sm font-semibold">Internal notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Only admins can see this."
              className="bg-background w-full rounded-xl border p-3 text-sm outline-none focus:ring-2"
            />
            {notes !== u.notes && (
              <Button size="sm" className="mt-2" onClick={() => updateUser(u.id, { notes }, "Updated notes")}>
                Save note
              </Button>
            )}
          </section>
        </div>

        <footer className="border-t p-4">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <p className="flex-1 text-sm">Delete {u.brand}? This can&apos;t be undone.</p>
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                Keep
              </Button>
              <Button
                size="sm"
                className="bg-rose-600 text-white hover:bg-rose-700"
                onClick={() => {
                  deleteUser(u.id);
                  onClose();
                }}
              >
                Delete
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 text-sm text-rose-600 hover:underline"
            >
              <Trash2 className="size-4" /> Delete account
            </button>
          )}
        </footer>
      </aside>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function Action({
  icon: Icon,
  children,
  onClick,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick: () => void;
  tone?: "bad";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "hover:bg-accent flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium",
        tone === "bad" && "text-rose-600",
      )}
    >
      <Icon className="size-4 shrink-0" /> {children}
    </button>
  );
}
