"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { api, request } from "@/lib/marketing-api";

export type SessionUser = { id: string; email: string; name: string; isPlatformAdmin: boolean; createdAt: string };
export type SessionWorkspace = { id: string; name: string; timezone: string; role: "owner" | "admin" | "member" };
export type SessionPlan = { id: string; name: string; status: "trial" | "active" | "past_due" | "suspended" | "cancelled"; beta: boolean; trialEndsAt: string | null } | null;

type Session = {
  user: SessionUser;
  workspace: SessionWorkspace | null;
  workspaces: SessionWorkspace[];
  plan: SessionPlan;
  announcement: string | null;
};

type Ctx = { session: Session | null; loading: boolean; error: string | null; reload: () => Promise<void>; logout: () => Promise<void> };

const SessionContext = createContext<Ctx>({ session: null, loading: true, error: null, reload: async () => {}, logout: async () => {} });

/** Loads the logged-in user + brand once for the dashboard / admin shells. */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const me = await api<{ user: SessionUser; workspaces: SessionWorkspace[]; currentWorkspaceId: string }>("/me");
      const plan = await api<{ plan: SessionPlan; announcement: string | null }>("/workspace/plan").catch(() => ({ plan: null, announcement: null }));
      setSession({
        user: me.user,
        workspaces: me.workspaces,
        workspace: me.workspaces.find((w) => w.id === me.currentWorkspaceId) ?? me.workspaces[0] ?? null,
        plan: plan.plan,
        announcement: plan.announcement,
      });
      setError(null);
    } catch (e) {
      // 401 already redirected to /login.
      setError(e instanceof Error ? e.message : "Can't load your account.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const logout = useCallback(async () => {
    await request("/auth/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/login";
  }, []);

  return <SessionContext.Provider value={{ session, loading, error, reload, logout }}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("") || "?";
