"use client";

import { useEffect, useState } from "react";

import { Check, Loader2 } from "lucide-react";

import { Avatar, PageHeader, Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/marketing-api";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const inputCls = "bg-background focus-visible:ring-ring/50 h-10 w-full rounded-xl border px-3 text-sm outline-none focus-visible:ring-[3px]";
const errText = (e: unknown) => (e instanceof ApiError ? e.readable : "Something went wrong. Try again.");

export default function AccountPage() {
  const { session, reload } = useSession();
  const [name, setName] = useState("");
  const [state, setState] = useState<{ key: string; status: "busy" | "done" | "error"; text?: string } | null>(null);
  const [pw, setPw] = useState({ current: "", next: "" });
  const [del, setDel] = useState({ confirm: "", password: "" });

  useEffect(() => {
    if (session) setName(session.user.name);
  }, [session]);

  const run = (key: string, fn: () => Promise<unknown>) => async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ key, status: "busy" });
    try {
      await fn();
      setState({ key, status: "done" });
      setTimeout(() => setState((s) => (s?.key === key && s.status === "done" ? null : s)), 2500);
    } catch (x) {
      setState({ key, status: "error", text: errText(x) });
    }
  };
  const status = (key: string) => (state?.key === key ? state : null);

  return (
    <>
      <PageHeader title="Account" description="Your profile and sign-in." />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Profile">
          <form
            onSubmit={run("profile", async () => {
              await api("/me", { method: "PATCH", body: { name } });
              await reload();
            })}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <Avatar name={name || "?"} className="size-14 text-base" />
              <div className="text-sm">
                <p className="font-medium">{session?.user.name}</p>
                <p className="text-muted-foreground">Member since {session ? new Date(session.user.createdAt).toLocaleDateString() : "…"}</p>
              </div>
            </div>
            <Field label="Your name">
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required className={inputCls} />
            </Field>
            <Field label="Email" hint="You log in with this email. To change it, contact support.">
              <input type="email" value={session?.user.email ?? ""} readOnly className={cn(inputCls, "bg-muted")} />
            </Field>
            <SaveRow s={status("profile")} />
          </form>
        </Panel>

        <Panel title="Password" description="Changing it signs you out on every other device.">
          <form
            onSubmit={run("password", async () => {
              if (pw.next.length < 8) throw new ApiError(400, { error: "Use at least 8 characters for the new password." });
              await api("/me/password", { method: "POST", body: pw });
              setPw({ current: "", next: "" });
            })}
            className="space-y-4"
          >
            <Field label="Current password">
              <input type="password" autoComplete="current-password" required value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className={inputCls} />
            </Field>
            <Field label="New password" hint="At least 8 characters.">
              <input type="password" autoComplete="new-password" required minLength={8} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputCls} />
            </Field>
            <SaveRow s={status("password")} label="Update password" />
          </form>
        </Panel>
      </div>

      <Panel className="border-destructive/40 mt-6" title="Delete account" description="This deletes your login and any brand you alone own, with all its customers, chats and settings. It can't be undone.">
        <form
          onSubmit={run("delete", async () => {
            await api("/me", { method: "DELETE", body: { password: del.password } });
            window.location.href = "/";
          })}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input value={del.confirm} onChange={(e) => setDel({ ...del, confirm: e.target.value })} placeholder="Type DELETE to confirm" aria-label="Type DELETE to confirm" className={cn(inputCls, "sm:max-w-xs")} />
          <input type="password" autoComplete="current-password" value={del.password} onChange={(e) => setDel({ ...del, password: e.target.value })} placeholder="Your password" aria-label="Your password" className={cn(inputCls, "sm:max-w-xs")} />
          <Button type="submit" variant="destructive" disabled={del.confirm !== "DELETE" || !del.password || status("delete")?.status === "busy"}>
            Delete my account
          </Button>
        </form>
        {status("delete")?.status === "error" && <p className="mt-2 text-sm text-rose-600">{status("delete")?.text}</p>}
      </Panel>
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-muted-foreground block text-xs">{hint}</span>}
    </label>
  );
}

function SaveRow({ s, label = "Save changes" }: { s: { status: "busy" | "done" | "error"; text?: string } | null; label?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="submit" disabled={s?.status === "busy"}>
        {s?.status === "busy" ? <Loader2 className="size-4 animate-spin" /> : s?.status === "done" ? <Check className="size-4" /> : null}
        {s?.status === "done" ? "Saved" : label}
      </Button>
      {s?.status === "error" && <span className="text-sm text-rose-600">{s.text}</span>}
    </div>
  );
}
