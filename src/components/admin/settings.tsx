"use client";

import { useState } from "react";

import { Trash2 } from "lucide-react";

import { type PlatformSettings, useAdmin } from "@/components/admin/store";
import { Avatar, Badge, PageHeader, Panel, Toggle } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/admin-data";

const ROLES: { id: Role; label: string; hint: string }[] = [
  { id: "admin", label: "Admin", hint: "Everything except billing & team" },
  { id: "support", label: "Support", hint: "View users, extend trials, reset passwords" },
  { id: "viewer", label: "Viewer", hint: "Read-only" },
];

export function AdminSettings() {
  const { settings, updateSettings, team, addTeam, updateTeam, removeTeam } = useAdmin();
  const [announcement, setAnnouncement] = useState(settings.announcement);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("support");

  const toggle = (k: keyof PlatformSettings, label: string) => (
    <Toggle
      key={`${k}-${String(settings[k])}`}
      label={label}
      defaultOn={Boolean(settings[k])}
      onChange={(on) => updateSettings({ [k]: on }, `${label}: ${on ? "on" : "off"}`)}
    />
  );

  const num = (k: "betaFreeMonths" | "trialDays", label: string, suffix: string) => (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="number"
        min={0}
        defaultValue={settings[k]}
        key={settings[k]}
        onBlur={(e) => {
          const n = Math.max(0, Number(e.target.value) || 0);
          if (n !== settings[k]) updateSettings({ [k]: n }, `${label} set to ${n} ${suffix}`);
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Access">
          <ul className="divide-y">
            <Row title="Allow new signups" hint="Turn off to pause registrations.">
              {toggle("signupsOpen", "New signups")}
            </Row>
            <Row title="Require email verification" hint="Users must confirm their email before connecting channels.">
              {toggle("requireEmailVerify", "Email verification")}
            </Row>
            <Row title="Maintenance mode" hint="Logs everyone out and shows a maintenance page.">
              {toggle("maintenance", "Maintenance mode")}
            </Row>
            <Row title="AI auto-replies (global)" hint="Emergency kill switch for all AI replies on every account.">
              {toggle("aiAutoReplyGlobal", "Global AI auto-replies")}
            </Row>
          </ul>
        </Panel>

        <Panel title="Trials & beta">
          <ul className="divide-y">
            <Row title="Free trial length" hint="For new non-beta signups.">
              {num("trialDays", "Trial length", "days")}
            </Row>
            <Row title="Beta free period" hint="Free months for beta users before billing starts.">
              {num("betaFreeMonths", "Beta free period", "months")}
            </Row>
          </ul>
        </Panel>

        <Panel title="Announcement bar" description="Shown at the top of every customer's dashboard." className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="bg-background h-10 min-w-0 flex-1 rounded-xl border px-3 text-sm"
              aria-label="Announcement text"
            />
            <Button
              disabled={announcement === settings.announcement}
              onClick={() => updateSettings({ announcement }, "Updated announcement")}
            >
              Save
            </Button>
            <span className="flex items-center gap-2 text-sm">
              Show {toggle("announcementOn", "Announcement bar")}
            </span>
          </div>
        </Panel>

        <Panel title="Admin team" description="People who can open this admin panel." className="lg:col-span-2">
          <ul className="divide-y">
            {team.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-3 py-3">
                <Avatar name={m.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {m.email} · {m.lastActive}
                  </p>
                </div>
                {m.role === "owner" ? (
                  <Badge tone="brand">Owner</Badge>
                ) : (
                  <>
                    <select
                      value={m.role}
                      onChange={(e) => updateTeam(m.id, { role: e.target.value as Role })}
                      className="bg-background h-9 rounded-lg border px-2 text-sm"
                      aria-label={`Role for ${m.name}`}
                    >
                      {ROLES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeTeam(m.id)}
                      className="text-muted-foreground hover:text-rose-600"
                      aria-label={`Remove ${m.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex flex-wrap gap-2 border-t pt-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes("@")) return;
              addTeam({ name: email.split("@")[0], email, role });
              setEmail("");
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="bg-background h-9 min-w-0 flex-1 rounded-lg border px-3 text-sm"
              aria-label="Invite email"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="bg-background h-9 rounded-lg border px-2 text-sm"
              aria-label="Invite role"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id} title={r.hint}>
                  {r.label}
                </option>
              ))}
            </select>
            <Button type="submit">Invite</Button>
          </form>
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
