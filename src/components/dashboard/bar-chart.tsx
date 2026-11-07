"use client";

import { cn } from "@/lib/utils";

/**
 * Single-series column chart. One hue (theme --brand), 4px rounded tops
 * anchored to the baseline, 2px gaps, recessive grid, hover tooltip per bar,
 * and a screen-reader table.
 */
export function BarChart({
  data,
  format,
  label,
  className,
}: {
  data: { x: string; y: number }[];
  format: (n: number) => string;
  label: string;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.y));
  const step = niceStep(max / 3);
  const top = Math.ceil(max / step) * step;
  const ticks = [top, top - step, top - step * 2, 0].filter((t, i, a) => t >= 0 && a.indexOf(t) === i);

  return (
    <figure className={cn("w-full", className)}>
      <div className="flex h-56 gap-3">
        {/* y axis */}
        <div className="text-muted-foreground flex flex-col justify-between pb-6 text-right text-[11px] tabular-nums">
          {ticks.map((t) => (
            <span key={t} className="leading-none">
              {format(t)}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* grid */}
          <div className="pointer-events-none absolute inset-0 bottom-6 flex flex-col justify-between">
            {ticks.map((t) => (
              <span
                key={t}
                className={cn(
                  "border-t",
                  t === 0 ? "border-foreground/25" : "border-dashed opacity-60",
                )}
              />
            ))}
          </div>

          {/* bars */}
          <div className="absolute inset-0 bottom-6 flex items-end gap-[2px]">
            {data.map((d) => (
              <div
                key={d.x}
                className="group relative flex h-full flex-1 items-end"
                tabIndex={0}
                aria-label={`${d.x}: ${format(d.y)}`}
              >
                <div
                  className="bg-brand group-hover:bg-brand/80 group-focus:bg-brand/80 w-full rounded-t-[4px] transition-colors"
                  style={{ height: `${(d.y / top) * 100}%` }}
                />
                <div className="bg-popover text-popover-foreground pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg border px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md group-hover:block group-focus:block">
                  <div className="text-muted-foreground">{d.x}</div>
                  <div className="font-semibold tabular-nums">
                    {format(d.y)} {label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* x labels */}
          <div className="text-muted-foreground absolute inset-x-0 bottom-0 flex gap-[2px] text-[11px]">
            {data.map((d, i) => (
              <span key={d.x} className="flex-1 truncate text-center">
                {i % 3 === 0 ? d.x : ""}
              </span>
            ))}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>{label} per day</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.x}>
              <th>{d.x}</th>
              <td>{format(d.y)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(raw || 1));
  const n = raw / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return nice * pow;
}

/** Horizontal bars with labels on the left; single hue, values in text ink. */
export function HBarList({
  items,
}: {
  items: { label: React.ReactNode; value: number; display: string }[];
}) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            {item.label}
            <span className="text-muted-foreground tabular-nums">
              {item.display}
            </span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-brand h-full rounded-full"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
