"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Bell,
  Cctv,
  Check,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CircleHelp,
  CreditCard,
  HeartHandshake,
  House,
  Inbox,
  LogOut,
  Megaphone,
  Menu,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { NotificationBell } from "@/components/dashboard/notifications";
import { Logo } from "@/components/logo";
import { brand, conversations } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const unread = conversations.filter((c) => c.unread).length;
const needsYou = conversations.filter((c) => c.status === "needs-you").length;

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  live?: boolean;
};

const MAIN: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/dashboard/inbox", label: "Inbox", icon: Inbox, badge: unread },
  { href: "/dashboard/live", label: "Live", icon: Cctv, live: true },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/marketing", label: "Marketing", icon: Megaphone },
  { href: "/dashboard/sales", label: "Sales", icon: ShoppingBag },
  { href: "/dashboard/support", label: "Support", icon: HeartHandshake, badge: needsYou },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];
const MANAGE: NavItem[] = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];
const BOTTOM: NavItem[] = [
  { href: "/dashboard/account", label: "My profile", icon: UserRound },
  { href: "/dashboard/help", label: "Help", icon: CircleHelp },
];
const EXTRA: NavItem[] = [
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];
const ALL = [...MAIN, ...MANAGE, ...BOTTOM, ...EXTRA];

const store = {
  get: (k: string) => {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      window.localStorage.setItem(k, v);
    } catch {}
  },
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [banner, setBanner] = useState(true);
  const [live, setLive] = useState(true);

  useEffect(() => {
    setCollapsed(store.get("sojao-sidebar") === "collapsed");
    setBanner(store.get("sojao-banner") !== "hidden");
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const current =
    ALL.find((n) =>
      n.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(n.href),
    ) ?? MAIN[0];
  const fullBleed = pathname.startsWith("/dashboard/inbox");

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      store.set("sojao-sidebar", c ? "open" : "collapsed");
      return !c;
    });
  };

  // On mobile the drawer always shows labels
  const mini = collapsed && !open;

  return (
    <div
      className="bg-muted/30 min-h-screen"
      style={{ "--banner-h": banner ? "44px" : "0px" } as React.CSSProperties}
    >
      {/* ---------------- Sidebar ---------------- */}
      <aside
        className={cn(
          "bg-background fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r transition-all duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-[76px]" : "lg:w-64",
        )}
      >
        {/* Logo */}
        <div className={cn("flex h-16 shrink-0 items-center px-5", mini && "lg:justify-center lg:px-0")}>
          <Link href="/dashboard" aria-label="Sojao AI home">
            {mini ? (
              <span className="mascot-blob hidden size-8 lg:block" />
            ) : null}
            <Logo className={cn("text-[24px]", mini && "lg:hidden")} />
          </Link>
          <button
            className="text-muted-foreground ml-auto lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Brand switcher */}
        <BrandSwitcher mini={mini} />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {MAIN.map((item) => (
              <NavLink key={item.href} item={item} active={item === current} mini={mini} />
            ))}
          </ul>
          <div className="my-4 border-t" />
          <ul className="space-y-1">
            {MANAGE.map((item) => (
              <NavLink key={item.href} item={item} active={item === current} mini={mini} />
            ))}
          </ul>
        </nav>

        {/* Collapse */}
        <div className="hidden border-t px-3 py-2 lg:block">
          <button
            onClick={toggleCollapsed}
            className={cn(
              "text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
              mini && "justify-center px-0",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="size-5" /> : <ChevronsLeft className="size-5" />}
            {!mini && <span>Collapse</span>}
          </button>
        </div>

        {/* Profile + help */}
        <ul className="space-y-1 border-t px-3 py-3">
          {BOTTOM.map((item) => (
            <NavLink key={item.href} item={item} active={item === current} mini={mini} />
          ))}
        </ul>

        {/* Plan */}
        <div className={cn("border-t p-4", mini && "lg:px-2")}>
          {mini ? (
            <Link
              href="/dashboard/billing"
              className="bg-primary text-primary-foreground hidden size-11 items-center justify-center rounded-xl lg:mx-auto lg:flex"
              title="Upgrade"
              aria-label="Upgrade plan"
            >
              <Sparkles className="size-5" />
            </Link>
          ) : null}
          <div className={cn(mini && "lg:hidden")}>
            <div className="flex items-center gap-3">
              <span className="bg-brand/15 flex size-10 shrink-0 items-center justify-center rounded-full">
                <Sparkles className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {brand.plan} plan{" "}
                  {brand.beta && (
                    <span className="bg-brand ml-1 rounded px-1 py-0.5 align-middle text-[10px] font-semibold text-white">
                      BETA
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground text-xs">Free for your first 3 months</p>
              </div>
            </div>
            <Link
              href="/dashboard/billing"
              className="bg-primary text-primary-foreground mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            >
              <Sparkles className="size-4" /> Upgrade to Pro
            </Link>
          </div>
        </div>
      </aside>

      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ---------------- Main column ---------------- */}
      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        {banner && (
          <div className="bg-foreground text-background flex h-11 items-center gap-3 px-4 text-sm md:px-6">
            <span className="bg-brand flex size-6 shrink-0 items-center justify-center rounded-full text-white">
              <Sparkles className="size-3.5" />
            </span>
            <p className="min-w-0 flex-1 truncate">
              <span className="font-medium">You&apos;re in the beta.</span>
              <span className="opacity-75 max-sm:hidden"> Sojao is free for your first 3 months, then 50% off.</span>
            </p>
            <Link
              href="/dashboard/billing"
              className="bg-brand shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              See plans
            </Link>
            <button
              onClick={() => {
                setBanner(false);
                store.set("sojao-banner", "hidden");
              }}
              className="shrink-0 opacity-70 hover:opacity-100"
              aria-label="Dismiss banner"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <header className="bg-background/90 sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur md:px-8">
          <button
            className="text-muted-foreground lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <p className="font-display truncate text-xl font-semibold tracking-tight md:text-2xl">
            {current.label}
          </p>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <label className="bg-muted text-muted-foreground hidden w-56 items-center gap-2 rounded-xl px-3 py-2 text-sm xl:flex">
              <Search className="size-4" />
              <input
                placeholder="Search…"
                className="placeholder:text-muted-foreground text-foreground min-w-0 flex-1 bg-transparent outline-none"
              />
            </label>
            <span className="text-muted-foreground hidden rounded-md border border-dashed px-2 py-1 text-xs md:inline">
              Sample data
            </span>
            <button
              onClick={() => setLive(!live)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                live ? "border-brand/40" : "opacity-70",
              )}
              aria-pressed={live}
              title="Turn Sojao's auto-replies on or off"
            >
              <span className="relative flex size-2">
                {live && (
                  <span className="bg-brand absolute inline-flex size-full animate-ping rounded-full opacity-60" />
                )}
                <span className={cn("relative inline-flex size-2 rounded-full", live ? "bg-brand" : "bg-muted-foreground")} />
              </span>
              <span className="max-sm:hidden">{live ? "Sojao is live" : "Sojao is paused"}</span>
            </button>
            <NotificationBell />
          </div>
        </header>

        <main
          className={cn(
            fullBleed ? "" : "mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:py-10 md:pb-24",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

/* ---------------- pieces ---------------- */

function NavLink({ item, active, mini }: { item: NavItem; active: boolean; mini: boolean }) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        title={mini ? item.label : undefined}
        className={cn(
          "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors",
          active
            ? "bg-accent text-foreground font-medium"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          mini && "lg:justify-center lg:px-0",
        )}
      >
        {active && <span className="bg-brand absolute top-2 bottom-2 left-0 w-1 rounded-full" />}
        <Icon className="size-5 shrink-0" />
        <span className={cn("flex-1", mini && "lg:sr-only")}>{item.label}</span>
        {item.live && (
          <span className={cn("flex items-center gap-1 text-[10px] font-semibold tracking-wide", mini && "lg:absolute lg:top-1.5 lg:right-2")}>
            <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
            <span className={cn(mini && "lg:hidden")}>LIVE</span>
          </span>
        )}
        {!!item.badge &&
          (mini ? (
            <span className="bg-brand absolute top-1.5 right-3 hidden size-2 rounded-full lg:block" />
          ) : null)}
        {!!item.badge && (
          <span className={cn("bg-brand rounded-full px-1.5 text-xs text-white tabular-nums", mini && "lg:hidden")}>
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
}

function BrandSwitcher({ mini }: { mini: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative border-y px-3 py-3">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "hover:bg-accent flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left",
          mini && "lg:justify-center lg:px-0",
        )}
        aria-expanded={open}
        aria-label="Switch brand"
      >
        <span className="relative shrink-0">
          <span className="bg-brand/15 flex size-9 items-center justify-center rounded-full text-xs font-semibold">
            YB
          </span>
          <span className="bg-brand absolute -right-1.5 -bottom-1 rounded px-1 text-[9px] font-bold text-white uppercase">
            {brand.beta ? "Beta" : brand.plan}
          </span>
        </span>
        <span className={cn("min-w-0 flex-1", mini && "lg:hidden")}>
          <span className="block truncate text-sm font-medium">{brand.name}</span>
          <span className="text-muted-foreground block truncate text-xs">{brand.owner}</span>
        </span>
        <ChevronDown className={cn("text-muted-foreground size-4", mini && "lg:hidden")} />
      </button>

      {open && (
        <div className="bg-popover text-popover-foreground absolute top-full left-3 z-50 mt-1 w-60 rounded-xl border p-1.5 shadow-xl">
          <p className="text-muted-foreground px-2.5 py-1.5 text-xs">Your brands</p>
          <button className="hover:bg-accent flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm">
            <span className="flex-1 truncate text-left">{brand.name}</span>
            <Check className="size-4" />
          </button>
          <button className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm">
            <Plus className="size-4" /> Add another brand
          </button>
          <div className="my-1 border-t" />
          <Link
            href="/login"
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm"
          >
            <LogOut className="size-4" /> Log out
          </Link>
        </div>
      )}
    </div>
  );
}

