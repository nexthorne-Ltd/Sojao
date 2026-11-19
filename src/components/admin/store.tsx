"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { api, ApiError } from "@/lib/marketing-api";

/** Admin panel state, loaded from the Sojao API (/api/admin/*). Only platform admins get in. */

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

export type AdminRole = "owner" | "admin" | "support" | "viewer";
export type SubStatus = "trial" | "active" | "past_due" | "suspended" | "cancelled";

export type Account = {
  workspace: { id: string; name: string; createdAt: string };
  owner: { id: string; name: string; email: string; lastLoginAt: string | null; createdAt: string } | null;
  sub: { workspaceId: string; planId: string; cycle: "monthly" | "yearly"; status: SubStatus; beta: boolean; trialEndsAt: string | null; renewsOn: string | null; adminNotes: string } | null;
  conversationsThisMonth: number;
  instagramAccounts: number;
};

export type Plan = {
  id: string;
  name: string;
  monthly: number;
  yearly: number;
  description: string;
  active: boolean;
  limits: { conversations: number; channels: number; seats: number };
  accounts: number;
};

export const STATUS_META: Record<SubStatus, { label: string; tone: "good" | "info" | "warn" | "bad" | "neutral" }> = {
  active: { label: "Active", tone: "good" },
  trial: { label: "Trial", tone: "info" },
  past_due: { label: "Past due", tone: "warn" },
  suspended: { label: "Suspended", tone: "bad" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export const fmtDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—");

type Ctx = {
  me: { id: string; name: string; email: string; role: AdminRole } | null;
  settings: PlatformSettings | null;
  accounts: Account[] | null;
  denied: boolean;
  error: string | null;
  reloadAccounts: () => Promise<void>;
  reloadSettings: () => Promise<void>;
  can: (need: "support" | "write") => boolean;
  toast: string | null;
  notify: (msg: string) => void;
};

const AdminCtx = createContext<Ctx | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Ctx["me"]>(null);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const reloadAccounts = useCallback(async () => {
    const r = await api<{ accounts: Account[] }>("/admin/accounts");
    setAccounts(r.accounts);
  }, []);
  const reloadSettings = useCallback(async () => {
    setSettings(await api<PlatformSettings>("/admin/settings"));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setMe(await api<NonNullable<Ctx["me"]>>("/admin/me"));
        await Promise.all([reloadAccounts(), reloadSettings()]);
      } catch (e) {
        if (e instanceof ApiError && e.status === 403) setDenied(true);
        else setError(e instanceof ApiError ? e.readable : "Can't load the admin panel.");
      }
    })();
  }, [reloadAccounts, reloadSettings]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const can = useCallback(
    (need: "support" | "write") => (me ? (need === "support" ? me.role !== "viewer" : me.role === "owner" || me.role === "admin") : false),
    [me],
  );

  return (
    <AdminCtx.Provider value={{ me, settings, accounts, denied, error, reloadAccounts, reloadSettings, can, toast, notify: setToast }}>{children}</AdminCtx.Provider>
  );
}

export function useAdmin() {
  const c = useContext(AdminCtx);
  if (!c) throw new Error("useAdmin must be used inside <AdminProvider>");
  return c;
}

export const errText = (e: unknown) => (e instanceof ApiError ? e.readable : "Something went wrong. Try again.");
