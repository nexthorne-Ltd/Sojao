import {
  AtSign,
  CreditCard,
  House,
  Inbox,
  KeyRound,
  Megaphone,
  MessageCircle,
  Reply,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

import { automations, marketingStats } from "@/components/_later/sample-data";
import { Badge, ChannelIcon, StatCard } from "@/components/dashboard/ui";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", icon: House },
  { label: "Inbox", icon: Inbox },
  { label: "Customers", icon: Users },
  { label: "Marketing", icon: Megaphone, active: true },
  { label: "Sales", icon: ShoppingBag, soon: true },
  { label: "Settings", icon: Settings },
  { label: "Billing", icon: CreditCard, soon: true },
];

const KIND_ICON = {
  "Comment-to-DM": MessageCircle,
  "Story reply": Reply,
  Mention: AtSign,
  Keyword: KeyRound,
  Follow: Users,
} as const;

/**
 * Static, non-interactive picture of the real Sojao Marketing dashboard,
 * built from the same UI pieces and sample data. Used on the landing page.
 */
export function DashboardPreview({ className }: { className?: string }) {
  return (
    <div
      aria-label="Preview of the Sojao Marketing dashboard with sample data"
      role="img"
      className={cn(
        "bg-muted/40 text-foreground pointer-events-none overflow-hidden rounded-2xl border shadow-lg select-none",
        className,
      )}
    >
      <div className="flex">
        {/* sidebar */}
        <aside aria-hidden className="bg-background hidden w-52 shrink-0 border-r md:block">
          <div className="flex h-14 items-center px-5">
            <Logo className="text-[20px]" />
          </div>
          <ul className="space-y-1 border-t px-3 py-4">
            {NAV.map(({ label, icon: Icon, active, soon }) => (
              <li
                key={label}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm",
                  active ? "bg-accent font-medium" : "text-muted-foreground",
                )}
              >
                {active && <span className="bg-brand absolute top-2 bottom-2 left-0 w-1 rounded-full" />}
                <Icon className="size-4" />
                <span className="flex-1">{label}</span>
                {soon && (
                  <span className="bg-muted rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase">
                    Soon
                  </span>
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* main */}
        <div aria-hidden className="min-w-0 flex-1">
          <div className="bg-background/90 flex h-14 items-center gap-3 border-b px-5">
            <p className="font-display text-lg font-semibold">Marketing</p>
            <span className="text-muted-foreground ml-auto rounded-md border border-dashed px-2 py-0.5 text-xs">
              Sample data
            </span>
          </div>
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {marketingStats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
            <div className="bg-muted inline-flex gap-1 rounded-xl p-1 text-sm">
              {["Automations", "Leads", "Tags and segments", "Broadcasts"].map((t, i) => (
                <span
                  key={t}
                  className={cn(
                    "rounded-lg px-3 py-1.5 font-medium whitespace-nowrap",
                    i === 0 ? "bg-background shadow-xs" : "text-muted-foreground max-sm:hidden",
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {automations.slice(0, 3).map((a) => {
                const Icon = KIND_ICON[a.kind];
                return (
                  <div key={a.id} className="bg-card rounded-2xl border p-4 shadow-xs">
                    <span className="bg-brand/12 flex size-9 items-center justify-center rounded-xl">
                      <Icon className="size-4" />
                    </span>
                    <p className="mt-3 text-sm font-semibold">{a.name}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">{a.trigger}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge>{a.kind}</Badge>
                      <ChannelIcon channel="instagram" className="size-3.5" />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3 text-xs">
                      <span>
                        <span className="text-muted-foreground block">Runs</span>
                        <span className="font-semibold tabular-nums">{a.runs}</span>
                      </span>
                      <span>
                        <span className="text-muted-foreground block">Leads</span>
                        <span className="font-semibold tabular-nums">{a.leads}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
