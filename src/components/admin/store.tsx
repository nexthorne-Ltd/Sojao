"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  AUDIT,
  type AdminUser,
  type AuditEntry,
  PAYMENTS,
  PLANS,
  type Payment,
  type Plan,
  TEAM,
  type TeamMember,
  USERS,
} from "@/lib/admin-data";

/**
 * Client-side admin state for the demo. Every action here is where a real
 * API call (PATCH /api/admin/users/:id, etc.) would go. State is mirrored to
 * localStorage so changes survive a reload while you click around.
 */

export type PlatformSettings = {
  signupsOpen: boolean;
  maintenance: boolean;
  betaFreeMonths: number;
  trialDays: number;
  announcement: string;
  announcementOn: boolean;
  requireEmailVerify: boolean;
  aiAutoReplyGlobal: boolean;
};

const DEFAULT_SETTINGS: PlatformSettings = {
  signupsOpen: true,
  maintenance: false,
  betaFreeMonths: 3,
  trialDays: 14,
  announcement: "Sojao is free for your first 3 months, then 50% off.",
  announcementOn: true,
  requireEmailVerify: true,
  aiAutoReplyGlobal: true,
};

type State = {
  users: AdminUser[];
  plans: Plan[];
  payments: Payment[];
  audit: AuditEntry[];
  team: TeamMember[];
  settings: PlatformSettings;
};

const initial: State = {
  users: USERS,
  plans: PLANS,
  payments: PAYMENTS,
  audit: AUDIT,
  team: TEAM,
  settings: DEFAULT_SETTINGS,
};

type Ctx = State & {
  updateUser: (id: string, patch: Partial<AdminUser>, log: string) => void;
  deleteUser: (id: string) => void;
  updatePlan: (id: Plan["id"], patch: Partial<Plan>, log: string) => void;
  updateSettings: (patch: Partial<PlatformSettings>, log: string) => void;
  refund: (paymentId: string) => void;
  addTeam: (m: Omit<TeamMember, "id" | "lastActive">) => void;
  updateTeam: (id: string, patch: Partial<TeamMember>) => void;
  removeTeam: (id: string) => void;
  reset: () => void;
  toast: string | null;
};

const AdminCtx = createContext<Ctx | null>(null);
const KEY = "sojao-admin-state-v1";

const now = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, loaded]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const log = useCallback((action: string, target?: string) => {
    setToast(target ? `${action}: ${target}` : action);
    return { id: `a${Date.now()}`, actor: "You", action, target, time: now() } as AuditEntry;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      toast,
      updateUser: (id, patch, action) =>
        setState((s) => {
          const u = s.users.find((x) => x.id === id);
          return {
            ...s,
            users: s.users.map((x) => (x.id === id ? { ...x, ...patch } : x)),
            audit: [log(action, u?.brand), ...s.audit],
          };
        }),
      deleteUser: (id) =>
        setState((s) => {
          const u = s.users.find((x) => x.id === id);
          return {
            ...s,
            users: s.users.filter((x) => x.id !== id),
            audit: [log("Deleted account", u?.brand), ...s.audit],
          };
        }),
      updatePlan: (id, patch, action) =>
        setState((s) => ({
          ...s,
          plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          audit: [log(action), ...s.audit],
        })),
      updateSettings: (patch, action) =>
        setState((s) => ({
          ...s,
          settings: { ...s.settings, ...patch },
          audit: [log(action), ...s.audit],
        })),
      refund: (paymentId) =>
        setState((s) => {
          const p = s.payments.find((x) => x.id === paymentId);
          const u = s.users.find((x) => x.id === p?.userId);
          return {
            ...s,
            payments: s.payments.map((x) => (x.id === paymentId ? { ...x, status: "refunded" } : x)),
            audit: [log(`Refunded ${paymentId}`, u?.brand), ...s.audit],
          };
        }),
      addTeam: (m) =>
        setState((s) => ({
          ...s,
          team: [...s.team, { ...m, id: `t${Date.now()}`, lastActive: "Invited" }],
          audit: [log(`Invited ${m.role}`, m.email), ...s.audit],
        })),
      updateTeam: (id, patch) =>
        setState((s) => {
          const m = s.team.find((x) => x.id === id);
          return {
            ...s,
            team: s.team.map((x) => (x.id === id ? { ...x, ...patch } : x)),
            audit: [log(`Changed role to ${patch.role}`, m?.email), ...s.audit],
          };
        }),
      removeTeam: (id) =>
        setState((s) => {
          const m = s.team.find((x) => x.id === id);
          return {
            ...s,
            team: s.team.filter((x) => x.id !== id),
            audit: [log("Removed team member", m?.email), ...s.audit],
          };
        }),
      reset: () => {
        setState(initial);
        setToast("Sample data reset");
      },
    }),
    [state, toast, log],
  );

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}

export function useAdmin() {
  const c = useContext(AdminCtx);
  if (!c) throw new Error("useAdmin must be used inside <AdminProvider>");
  return c;
}
