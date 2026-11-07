"use client";

import { useState } from "react";

import { useAdmin } from "@/components/admin/store";
import { Badge, PageHeader, Toggle, money } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { type Plan, userMrr } from "@/lib/admin-data";

export function AdminPlans() {
  const { plans } = useAdmin();
  return (
    <>
      <PageHeader
        title="Plans"
        description="Edit prices and limits for each plan. Turning a plan off hides it from the pricing page for new signups; existing users keep it."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <PlanCard key={`${p.id}-${p.monthly}-${p.yearly}-${p.limits.conversations}`} plan={p} />
        ))}
      </div>
    </>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const { users, plans, updatePlan } = useAdmin();
  const [draft, setDraft] = useState(plan);
  const dirty = JSON.stringify(draft) !== JSON.stringify(plan);

  const subs = users.filter((u) => u.plan === plan.id && u.status !== "cancelled");
  const mrr = subs.reduce((s, u) => s + userMrr(u, plans), 0);

  const num = (v: string) => Math.max(0, Number(v) || 0);
  const field = (label: string, value: number, onChange: (n: number) => void, prefix?: string) => (
    <label className="text-sm">
      <span className="text-muted-foreground mb-1 block text-xs">{label}</span>
      <span className="bg-background flex h-9 items-center rounded-lg border px-2.5">
        {prefix && <span className="text-muted-foreground mr-1">{prefix}</span>}
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(num(e.target.value))}
          className="w-full min-w-0 bg-transparent tabular-nums outline-none"
        />
      </span>
    </label>
  );

  return (
    <section className="bg-card flex flex-col rounded-2xl border p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl tracking-tight">{plan.name}</h2>
          <p className="text-muted-foreground text-sm">{plan.description}</p>
        </div>
        <Toggle
          label={`${plan.name} available for new signups`}
          defaultOn={plan.active}
          onChange={(on) => updatePlan(plan.id, { active: on }, `${on ? "Enabled" : "Disabled"} ${plan.name} plan`)}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Badge tone="brand">{subs.length} subscribers</Badge>
        <Badge>{money(mrr)}/mo</Badge>
        {!plan.active && <Badge tone="warn">Hidden</Badge>}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {field("Monthly price", draft.monthly, (n) => setDraft({ ...draft, monthly: n }), "$")}
        {field("Yearly price", draft.yearly, (n) => setDraft({ ...draft, yearly: n }), "$")}
        {field("Conversations / mo", draft.limits.conversations, (n) =>
          setDraft({ ...draft, limits: { ...draft.limits, conversations: n } }),
        )}
        {field("Team seats", draft.limits.seats, (n) => setDraft({ ...draft, limits: { ...draft.limits, seats: n } }))}
        {field("Channels", draft.limits.channels, (n) =>
          setDraft({ ...draft, limits: { ...draft.limits, channels: n } }),
        )}
      </div>

      <div className="mt-auto flex gap-2 pt-5">
        <Button
          disabled={!dirty}
          onClick={() => updatePlan(plan.id, draft, `Updated ${plan.name} plan (${money(draft.monthly)}/mo)`)}
        >
          Save changes
        </Button>
        {dirty && (
          <Button variant="ghost" onClick={() => setDraft(plan)}>
            Discard
          </Button>
        )}
      </div>
    </section>
  );
}
