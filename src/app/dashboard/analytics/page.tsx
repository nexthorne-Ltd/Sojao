"use client";

import { useState } from "react";

import { Download, Moon } from "lucide-react";

import { BarChart, HBarList } from "@/components/dashboard/bar-chart";
import {
  Badge,
  PageHeader,
  Panel,
  StatCard,
  Table,
  Tabs,
  Td,
  Th,
  money,
} from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import {
  automations,
  chatsByHour,
  dailyChats,
  funnel,
  overviewStats,
  topQuestions,
} from "@/lib/dashboard-data";

type Range = "7" | "14";
type Metric = "chats" | "sales";

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("14");
  const [metric, setMetric] = useState<Metric>("sales");
  const days = dailyChats.slice(-Number(range));
  const hourLabel = (h: number) =>
    h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="See what Sojao brings in, sells and solves. Sample data shown."
        actions={
          <>
            <Tabs
              tabs={[
                { id: "7", label: "7 days" },
                { id: "14", label: "14 days" },
              ]}
              value={range}
              onChange={setRange}
            />
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((s) => (
          <StatCard key={s.label} {...s} hint={`Last ${range} days`} />
        ))}
      </div>

      <Panel
        className="mt-6"
        title={metric === "sales" ? "Sales from DMs" : "Chats"}
        description={`Per day · last ${range} days`}
        action={
          <Tabs
            tabs={[
              { id: "sales", label: "Sales" },
              { id: "chats", label: "Chats" },
            ]}
            value={metric}
            onChange={setMetric}
          />
        }
      >
        <BarChart
          label={metric === "sales" ? "in sales" : "chats"}
          data={days.map((d) => ({ x: d.day, y: metric === "sales" ? d.sales : d.chats }))}
          format={(n) => (metric === "sales" ? money(n) : String(n))}
        />
      </Panel>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="From chat to sale" description="How many people move to the next step.">
          <HBarList
            items={funnel.map((f, i) => ({
              label: <span>{f.step}</span>,
              value: f.value,
              display:
                i === 0
                  ? f.value.toLocaleString("en-US")
                  : `${f.value.toLocaleString("en-US")} · ${Math.round((f.value / funnel[i - 1].value) * 100)}%`,
            }))}
          />
        </Panel>

        <Panel
          title={
            <span className="flex items-center gap-2">
              <Moon className="size-4" /> When customers message you
            </span>
          }
          description="Chats by hour of the day. The night is when Sojao earns its name."
        >
          <BarChart
            label="chats"
            data={chatsByHour.map((v, h) => ({ x: hourLabel(h), y: v }))}
            format={(n) => String(n)}
          />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Top questions" description="What customers ask most. Sojao answers these by itself." bodyClassName="p-0">
          <ul className="divide-y">
            {topQuestions.map((q) => (
              <li key={q.q} className="flex items-center gap-3 px-5 py-3 text-sm">
                <span className="flex-1">{q.q}</span>
                <Badge>{q.pillar}</Badge>
                <span className="text-muted-foreground w-12 text-right tabular-nums">{q.count}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Best automations">
          <Table>
            <thead>
              <tr>
                <Th>Automation</Th>
                <Th className="text-right">Runs</Th>
                <Th className="text-right">Leads</Th>
                <Th className="text-right">Lead rate</Th>
              </tr>
            </thead>
            <tbody>
              {[...automations]
                .filter((a) => a.runs > 0)
                .sort((a, b) => b.leads - a.leads)
                .map((a) => (
                  <tr key={a.id}>
                    <Td>
                      <p className="font-medium">{a.name}</p>
                      <p className="text-muted-foreground text-xs">{a.kind}</p>
                    </Td>
                    <Td className="text-right tabular-nums">{a.runs}</Td>
                    <Td className="text-right tabular-nums">{a.leads}</Td>
                    <Td className="text-right tabular-nums">
                      {Math.round((a.leads / a.runs) * 100)}%
                    </Td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Panel>
      </div>
    </>
  );
}
