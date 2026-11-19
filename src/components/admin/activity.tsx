"use client";

import { ErrorNote, Loading } from "@/components/dashboard/marketing/live/states";
import { useApi } from "@/components/dashboard/marketing/live/use-api";
import { PageHeader, Panel } from "@/components/dashboard/ui";

type Entry = { id: string; actor: string; action: string; target: string | null; time: string };

export function AdminActivity() {
  const { data, error, reload } = useApi<{ entries: Entry[] }>("/admin/activity");
  return (
    <>
      <PageHeader title="Activity log" description="Every admin action and new signup, newest first." />
      <Panel bodyClassName="p-0">
        {error ? (
          <div className="p-5">
            <ErrorNote text={error} onRetry={reload} />
          </div>
        ) : !data ? (
          <Loading />
        ) : data.entries.length === 0 ? (
          <p className="text-muted-foreground p-6 text-center text-sm">Nothing yet.</p>
        ) : (
          <ol className="divide-y">
            {data.entries.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 text-sm">
                <span className={a.actor === "System" ? "bg-muted-foreground size-2 rounded-full" : "bg-brand size-2 rounded-full"} />
                <span className="font-medium">{a.actor}</span>
                <span>{a.action}</span>
                {a.target && <span className="text-muted-foreground">· {a.target}</span>}
                <span className="text-muted-foreground ml-auto text-xs tabular-nums">{new Date(a.time).toLocaleString()}</span>
              </li>
            ))}
          </ol>
        )}
      </Panel>
    </>
  );
}
