"use client";

import { useAdmin } from "@/components/admin/store";
import { PageHeader, Panel } from "@/components/dashboard/ui";

export function AdminActivity() {
  const { audit } = useAdmin();
  return (
    <>
      <PageHeader title="Activity log" description="Every admin action and important system event, newest first." />
      <Panel bodyClassName="p-0">
        <ol className="divide-y">
          {audit.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 text-sm">
              <span
                className={
                  a.actor === "System"
                    ? "bg-muted-foreground size-2 rounded-full"
                    : "bg-brand size-2 rounded-full"
                }
              />
              <span className="font-medium">{a.actor}</span>
              <span>{a.action}</span>
              {a.target && <span className="text-muted-foreground">· {a.target}</span>}
              <span className="text-muted-foreground ml-auto text-xs tabular-nums">{a.time}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </>
  );
}
