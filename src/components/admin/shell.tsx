"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  History,
  LayoutDashboard,
  Layers,
  Menu,
  RotateCcw,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { AdminProvider, useAdmin } from "@/components/admin/store";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: "pastdue" | "trial" };

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users, badge: "trial" },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard, badge: "pastdue" },
  { href: "/admin/plans", label: "Plans", icon: Layers },
  { href: "/admin/activity", label: "Activity log", icon: History },
  { href: "/admin/settings", label: "Platform settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ShellInner>{children}</ShellInner>
    </AdminProvider>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { users, settings, toast, reset } = useAdmin();
  useEffect(() => setOpen(false), [pathname]);

  const counts = {
    trial: users.filter((u) => u.status === "trial").length,
    pastdue: users.filter((u) => u.status === "past_due").length,
  };

  const current =
    NAV.find((n) => (n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href))) ?? NAV[0];

  return (
    <div className="bg-muted/30 min-h-screen">
      <aside
        className={cn(
          "bg-background fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-2 px-5">
          <Link href="/admin" aria-label="Admin home" className="flex items-center gap-2">
            <Logo className="text-[22px]" />
          </Link>
          <span className="bg-foreground text-background rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
            Admin
          </span>
          <button className="text-muted-foreground ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto border-t px-3 py-4">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = item === current;
              const badge = item.badge ? counts[item.badge] : 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors",
                      active
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                    )}
                  >
                    {active && <span className="bg-brand absolute top-2 bottom-2 left-0 w-1 rounded-full" />}
                    <Icon className="size-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {badge > 0 && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 text-xs text-white tabular-nums",
                          item.badge === "pastdue" ? "bg-amber-500" : "bg-brand",
                        )}
                        title={item.badge === "pastdue" ? "Past due" : "On trial"}
                      >
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-1 border-t px-3 py-3">
          <button
            onClick={reset}
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm"
          >
            <RotateCcw className="size-4" /> Reset sample data
          </button>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm"
          >
            <ArrowLeft className="size-4" /> Back to owner dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3 border-t p-4">
          <span className="bg-foreground text-background flex size-9 items-center justify-center rounded-full">
            <ShieldCheck className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Super admin</p>
            <p className="text-muted-foreground truncate text-xs">Full access</p>
          </div>
        </div>
      </aside>

      {open && (
        <button aria-label="Close menu" className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="lg:pl-64">
        {settings.maintenance && (
          <div className="flex h-10 items-center justify-center gap-2 bg-amber-500 px-4 text-sm font-medium text-black">
            Maintenance mode is ON. Customers can&apos;t log in.
            <Link href="/admin/settings" className="underline">
              Change
            </Link>
          </div>
        )}
        <header className="bg-background/90 sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur md:px-8">
          <button className="text-muted-foreground lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <p className="font-display truncate text-xl font-semibold tracking-tight md:text-2xl">{current.label}</p>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground hidden rounded-md border border-dashed px-2 py-1 text-xs md:inline">
              Sample data
            </span>
            <span
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                settings.signupsOpen ? "border-emerald-500/40" : "opacity-70",
              )}
            >
              <span className={cn("size-2 rounded-full", settings.signupsOpen ? "bg-emerald-500" : "bg-muted-foreground")} />
              <span className="max-sm:hidden">{settings.signupsOpen ? "Signups open" : "Signups closed"}</span>
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:py-10">{children}</main>
      </div>

      {toast && (
        <div
          role="status"
          className="bg-foreground text-background fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-2.5 text-sm shadow-xl"
        >
          <CheckCircle2 className="size-4 text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
}
