"use client";

import { useState } from "react";

import { errText, type Plan, useAdmin } from "@/components/admin/store";
import { ErrorNote, Loading } from "@/components/dashboard/marketing/live/states";
import { useApi } from "@/components/dashboard/marketing/live/use-api";
import { Badge, PageHeader, Toggle, money } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/marketing-api";

export function AdminPlans() {
  const { data, error, reload } = useApi<{ plans: Plan[] }>("/admin/plans");
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;
  return (
    <>
      <PageHeader title="Plans" description="Edit prices and limits. A plan that's turned off can't be given to more accounts; accounts already on it keep it." />
      <div className="grid gap-6 lg:grid-cols-3">
        {data.plans.map((p) => (
          <PlanCard key={`${p.id}-${p.monthly}-${p.yearly}-${p.limits.conversations}-${p.active}`} plan={p} onSaved={reload} />
        ))}
      </div>
    </>
  );
}

function PlanCard({ plan, onSaved }: { plan: Plan; onSaved: () => Promise<void> }) {
  const { can, notify } = useAdmin();
  const [draft, setDraft] = useState(plan);
  const [err, setErr] = useState<string | null>(null);
  const write = can("write");
  const dirty = JSON.stringify({ ...draft, accounts: 0 }) !== JSON.stringify({ ...plan, accounts: 0 });

  const save = async (body: Partial<Plan>, msg: string) => {
    setErr(null);
    try {
      await api(`/admin/plans/${plan.id}`, { method: "PATCH", body });
      await onSaved();
      notify(msg);
    } catch (e) {
      setErr(errText(e));
    }
  };

  const field = (label: string, value: number, onChange: (n: number) => void, prefix?: string) => (
    <label className="text-sm">
      <span className="text-muted-foreground mb-1 block text-xs">{label}</span>
      <span className="bg-background flex h-9 items-center gap-1 rounded-xl border px-3">
        {prefix && <span className="text-muted-foreground">{prefix}</span>}
        <input type="number" min={0} disabled={!write} value={value} onChange={(e) => onChange(Number(e.target.value))} className="min-w-0 flex-1 bg-transparent outline-none" />
      </span>
    </label>
  );

  return (
    <div className="bg-card flex flex-col rounded-2xl border p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <p className="font-display text-xl font-semibold">{plan.name}</p>
        <Toggle defaultOn={plan.active} label={`${plan.name} available`} onChange={(on) => (write ? void save({ active: on }, `${on ? "Enabled" : "Disabled"} ${plan.name}`) : undefined)} />
      </div>
      <p className="text-muted-foreground mt-1 text-sm">{plan.description}</p>
      <div className="mt-2 flex gap-2">
        <Badge>{plan.accounts} accounts</Badge>
        {!plan.active && <Badge tone="warn">Off</Badge>}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {field("Monthly", draft.monthly, (n) => setDraft({ ...draft, monthly: n }), "$")}
        {field("Yearly", draft.yearly, (n) => setDraft({ ...draft, yearly: n }), "$")}
        {field("Conversations / mo", draft.limits.conversations, (n) => setDraft({ ...draft, limits: { ...draft.limits, conversations: n } }))}
        {field("Team seats", draft.limits.seats, (n) => setDraft({ ...draft, limits: { ...draft.limits, seats: n } }))}
        {field("Channels", draft.limits.channels, (n) => setDraft({ ...draft, limits: { ...draft.limits, channels: n } }))}
      </div>
      {err && <p className="mt-3 text-sm text-rose-600">{err}</p>}
      <Button className="mt-5" disabled={!write || !dirty} onClick={() => void save({ monthly: draft.monthly, yearly: draft.yearly, limits: draft.limits }, `Updated ${plan.name} (${money(draft.monthly)}/mo)`)}>
        Save {plan.name}
      </Button>
    </div>
  );
}
