"use client";

import { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";

import { errText, type AdminRole, type PlatformSettings, useAdmin } from "@/components/admin/store";
import { useApi } from "@/components/dashboard/marketing/live/use-api";
import { Avatar, Badge, PageHeader, Panel, Toggle } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/marketing-api";

const ROLES: { id: Exclude<AdminRole, "owner">; label: string; hint: string }[] = [
  { id: "admin", label: "Admin", hint: "Everything" },
  { id: "support", label: "Support", hint: "View accounts, extend trials, edit notes" },
  { id: "viewer", label: "Viewer", hint: "Read-only" },
];

type TeamMember = { id: string; name: string; email: string; role: AdminRole; lastLoginAt: string | null; fromEnv: boolean };

export function AdminSettings() {
  const { settings, reloadSettings, can, notify, me } = useAdmin();
  const team = useApi<{ team: TeamMember[] }>("/admin/team");
  const [announcement, setAnnouncement] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<AdminRole, "owner">>("support");
  const [err, setErr] = useState<string | null>(null);
  const write = can("write");
  useEffect(() => {
    if (settings) setAnnouncement(settings.announcement);
  }, [settings]);
  if (!settings) return null;

  const update = async (patch: Partial<PlatformSettings>, msg: string) => {
    setErr(null);
    try {
      await api("/admin/settings", { method: "PATCH", body: patch });
      await reloadSettings();
      notify(msg);
    } catch (e) {
      setErr(errText(e));
    }
  };
  const setTeam = async (targetEmail: string, r: Exclude<AdminRole, "owner"> | null, msg: string) => {
    setErr(null);
    try {
      await api("/admin/team", { method: "PUT", body: { email: targetEmail, role: r } });
      await team.reload();
      notify(msg);
    } catch (e) {
      setErr(errText(e));
    }
  };

  const toggle = (k: keyof PlatformSettings, label: string, confirmOn?: string) => (
    <Toggle
      key={`${k}-${String(settings[k])}`}
      label={label}
      defaultOn={Boolean(settings[k])}
      onChange={(on) => {
        if (!write) return;
        if (on && confirmOn && !window.confirm(confirmOn)) return void reloadSettings();
        void update({ [k]: on }, `${label}: ${on ? "on" : "off"}`);
      }}
    />
  );

  const num = (k: "betaFreeMonths" | "trialDays", label: string, suffix: string) => (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="number"
        min={0}
        max={k === "trialDays" ? 90 : 24}
        disabled={!write}
        defaultValue={settings[k]}
        key={settings[k]}
        onBlur={(e) => {
          const n = Math.max(0, Number(e.target.value) || 0);
          if (n !== settings[k]) void update({ [k]: n }, `${label} set to ${n} ${suffix}`);
        }}
        className="bg-background h-9 w-20 rounded-lg border px-2.5 tabular-nums"
        aria-label={label}
      />
      <span className="text-muted-foreground">{suffix}</span>
    </label>
  );

  return (
    <>
      <PageHeader title="Platform settings" description="Switches that affect every Sojao account at once." />
      {err && <p className="mb-4 text-sm text-rose-600">{err}</p>}
      {!write && <p className="text-muted-foreground mb-4 text-sm">Your admin role can view these settings but not change them.</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Access">
          <ul className="divide-y">
            <Row title="Allow new signups" hint="Turn off to pause registrations. Admins in ADMIN_EMAILS can still sign up.">
              {toggle("signupsOpen", "New signups")}
            </Row>
            <Row title="Maintenance mode" hint="Brand owners see a maintenance message instead of their dashboard. Admins still get in.">
              {toggle("maintenance", "Maintenance mode", "Turn on maintenance mode? Every brand owner loses access to their dashboard until you turn it off.")}
            </Row>
            <Row title="AI and automated replies (all accounts)" hint="Emergency switch: turning it off stops every automated message on every account. Owners can still reply by hand.">
              {toggle("aiAutoReplyGlobal", "Automated replies")}
            </Row>
          </ul>
        </Panel>

        <Panel title="Trials and beta">
          <ul className="divide-y">
            <Row title="Free trial length" hint="For new signups.">
              {num("trialDays", "Trial length", "days")}
            </Row>
            <Row title="Beta free period" hint="New signups are marked beta and their trial lasts this long while it's above 0.">
              {num("betaFreeMonths", "Beta free period", "months")}
            </Row>
          </ul>
        </Panel>

        <Panel title="Announcement bar" description="Shown at the top of every customer's dashboard." className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <input value={announcement} maxLength={200} disabled={!write} onChange={(e) => setAnnouncement(e.target.value)} className="bg-background h-10 min-w-0 flex-1 rounded-xl border px-3 text-sm" aria-label="Announcement text" />
            <Button disabled={!write || announcement === settings.announcement} onClick={() => void update({ announcement }, "Updated announcement")}>
              Save
            </Button>
            <span className="flex items-center gap-2 text-sm">Show {toggle("announcementOn", "Announcement bar")}</span>
          </div>
        </Panel>

        <Panel title="Admin team" description="People who can open this admin panel. They need a Sojao login first." className="lg:col-span-2">
          <ul className="divide-y">
            {(team.data?.team ?? []).map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-3 py-3">
                <Avatar name={m.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {m.name} {m.id === me?.id && <span className="text-muted-foreground font-normal">(you)</span>}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {m.email} · {m.lastLoginAt ? `last login ${new Date(m.lastLoginAt).toLocaleDateString()}` : "never logged in"}
                  </p>
                </div>
                {m.fromEnv || m.role === "owner" ? (
                  <Badge tone="brand">Owner</Badge>
                ) : (
                  <>
                    <select
                      value={m.role}
                      disabled={!write || m.id === me?.id}
                      onChange={(e) => void setTeam(m.email, e.target.value as Exclude<AdminRole, "owner">, `Changed role for ${m.email}`)}
                      className="bg-background h-9 rounded-lg border px-2 text-sm"
                      aria-label={`Role for ${m.name}`}
                    >
                      {ROLES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    {write && m.id !== me?.id && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove admin access for ${m.email}?`)) void setTeam(m.email, null, `Removed ${m.email}`);
                        }}
                        className="text-muted-foreground hover:text-rose-600"
                        aria-label={`Remove ${m.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
          {write && (
            <form
              className="mt-4 flex flex-wrap gap-2 border-t pt-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) return;
                void setTeam(email.trim(), role, `Gave ${role} access to ${email.trim()}`).then(() => setEmail(""));
              }}
            >
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="their-login@email.com" className="bg-background h-9 min-w-0 flex-1 rounded-lg border px-3 text-sm" aria-label="Admin email" />
              <select value={role} onChange={(e) => setRole(e.target.value as Exclude<AdminRole, "owner">)} className="bg-background h-9 rounded-lg border px-2 text-sm" aria-label="Admin role">
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id} title={r.hint}>
                    {r.label}
                  </option>
                ))}
              </select>
              <Button type="submit">Give access</Button>
            </form>
          )}
        </Panel>
      </div>
    </>
  );
}

function Row({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs">{hint}</p>
      </div>
      {children}
    </li>
  );
}
