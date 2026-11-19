"use client";

import { useState } from "react";

import { BarChart3, Download, Pause, Pencil, Play, Plus, Trash2, Upload } from "lucide-react";

import { inputCls, Modal } from "../modal";
import { Empty, ErrorNote, Loading } from "./states";
import { errorText, useApi } from "./use-api";

import { Badge, Panel, StatCard, Table, Td, Th } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { api, download } from "@/lib/marketing-api";
import { cn } from "@/lib/utils";

type Row<C> = { id: string; name: string; status: string; config: C; createdAt?: string };
const csvList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const slug = (s: string, i: number) => (s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 16) || "q") + (i ? `_${i}` : "");

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint && <span className="text-muted-foreground mt-1 block text-xs">{hint}</span>}
    </label>
  );
}

function StatusButton({ path, row, onDone, onError }: { path: string; row: { id: string; status: string }; onDone: () => void; onError: (e: string) => void }) {
  const active = row.status === "active";
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={async () => {
        try {
          await api(`${path}/${row.id}/${active ? "pause" : "activate"}`, { method: "POST" });
          onDone();
        } catch (e) {
          onError(errorText(e));
        }
      }}
    >
      {active ? <Pause className="size-4" /> : <Play className="size-4" />} {active ? "Pause" : "Activate"}
    </Button>
  );
}

/* ================================================================ discounts (service 14) */

type DiscountConfig = {
  keywords: string[];
  source: "pool" | "shopify";
  valueType: "percentage" | "fixed_amount";
  value: number;
  currency?: string;
  expiresInDays: number | null;
  message: string;
};
type Code = { c: { id: string; code: string; status: string; issuedAt: string | null; expiresAt: string | null; redeemedAt: string | null }; username: string | null };

export function DiscountsPanel() {
  const { data, error, reload } = useApi<{ campaigns: Row<DiscountConfig>[]; store: { provider: string } }>("/discount-campaigns");
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;
  const current = data.campaigns.find((c) => c.id === open);
  return (
    <>
      <Panel
        title="Discount codes"
        description="Someone DMs a keyword and gets a code. You set the value; Sojao never invents a discount. Shopify codes are unique and single-use; pool codes come from a list you upload."
        action={
          <Button size="sm" onClick={() => setEditing(true)}>
            <Plus className="size-4" /> New
          </Button>
        }
      >
        {err && <ErrorNote text={err} />}
        {data.campaigns.length === 0 ? (
          <Empty title="No discount campaigns" text="Create one, then upload codes (pool) or connect Shopify." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Keywords</Th>
                <Th>Value</Th>
                <Th>Source</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {data.campaigns.map((r) => (
                <tr key={r.id}>
                  <Td className="font-medium">{r.name}</Td>
                  <Td className="text-xs">{r.config?.keywords?.join(", ")}</Td>
                  <Td>{r.config?.valueType === "percentage" ? `${r.config.value}%` : `${r.config?.value} ${r.config?.currency ?? ""}`}</Td>
                  <Td>{r.config?.source === "shopify" ? "Shopify" : "Uploaded pool"}</Td>
                  <Td>
                    <Badge tone={r.status === "active" ? "good" : "neutral"}>{r.status}</Badge>
                  </Td>
                  <Td className="space-x-2 text-right whitespace-nowrap">
                    <Button size="sm" variant="ghost" onClick={() => setOpen(open === r.id ? null : r.id)}>
                      Codes
                    </Button>
                    <StatusButton path="/discount-campaigns" row={r} onDone={reload} onError={setErr} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
      {current && <DiscountCodes campaign={current} />}
      {editing && (
        <DiscountForm
          shopify={data.store.provider === "shopify"}
          onClose={() => setEditing(false)}
          onSaved={(id) => {
            setEditing(false);
            setOpen(id);
            void reload();
          }}
        />
      )}
    </>
  );
}

function DiscountForm({ shopify, onClose, onSaved }: { shopify: boolean; onClose: () => void; onSaved: (id: string) => void }) {
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("code, discount");
  const [source, setSource] = useState<"pool" | "shopify">(shopify ? "shopify" : "pool");
  const [valueType, setValueType] = useState<"percentage" | "fixed_amount">("percentage");
  const [value, setValue] = useState("15");
  const [currency, setCurrency] = useState("USD");
  const [days, setDays] = useState("14");
  const [message, setMessage] = useState("Here's your code: {{code}} for {{discount}} off. Valid until {{expiry}}.");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await api<{ id: string }>("/discount-campaigns", {
        method: "POST",
        body: {
          name: name.trim(),
          config: {
            keywords: csvList(keywords),
            source,
            valueType,
            value: Number(value),
            ...(valueType === "fixed_amount" ? { currency } : {}),
            expiresInDays: days ? Number(days) : null,
            message,
          },
        },
      });
      onSaved(r.id);
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title="New discount campaign"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={busy || !name.trim()} onClick={() => void save()}>
            Create (paused)
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className={inputCls} />
        </Field>
        <Field label="DM keywords" hint="Comma separated. Someone who DMs one of these gets a code.">
          <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className={inputCls} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Codes from">
            <select value={source} onChange={(e) => setSource(e.target.value as "pool" | "shopify")} className={inputCls}>
              <option value="pool">My uploaded list</option>
              <option value="shopify" disabled={!shopify}>
                Shopify {shopify ? "" : "(connect first)"}
              </option>
            </select>
          </Field>
          <Field label="Type">
            <select value={valueType} onChange={(e) => setValueType(e.target.value as "percentage" | "fixed_amount")} className={inputCls}>
              <option value="percentage">% off</option>
              <option value="fixed_amount">Amount off</option>
            </select>
          </Field>
          <Field label={valueType === "percentage" ? "Percent" : "Amount"}>
            <input type="number" min={1} value={value} onChange={(e) => setValue(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {valueType === "fixed_amount" && (
            <Field label="Currency">
              <input value={currency} maxLength={3} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className={inputCls} />
            </Field>
          )}
          <Field label="Valid for (days)" hint="Empty = no expiry">
            <input type="number" min={1} max={365} value={days} onChange={(e) => setDays(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Message" hint="Must include {{code}}. You can use {{discount}}, {{expiry}} and {{first_name|there}}.">
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={640} className={cn(inputCls, "h-auto py-2")} />
        </Field>
        {err && <ErrorNote text={err} />}
      </div>
    </Modal>
  );
}

function DiscountCodes({ campaign }: { campaign: Row<DiscountConfig> }) {
  const { data, reload } = useApi<{ codes: Code[] }>(`/discount-campaigns/${campaign.id}/codes`);
  const [csv, setCsv] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const counts = (data?.codes ?? []).reduce<Record<string, number>>((a, c) => ({ ...a, [c.c.status]: (a[c.c.status] ?? 0) + 1 }), {});
  return (
    <Panel title={`Codes: ${campaign.name}`} description={Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(" · ") || "No codes yet."}>
      {campaign.config?.source === "pool" && (
        <form
          className="mb-4 space-y-2"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const r = await api<{ added: number; duplicates: number; errors: unknown[] }>(`/discount-campaigns/${campaign.id}/pool`, { method: "POST", body: { csv } });
              setNote(`Added ${r.added} codes, ${r.duplicates} duplicates skipped${r.errors.length ? `, ${r.errors.length} invalid lines` : ""}.`);
              setCsv("");
              await reload();
            } catch (x) {
              setNote(errorText(x));
            }
          }}
        >
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={4}
            aria-label="Codes to upload"
            placeholder={"One code per line (a CSV with a “code” column also works)\nSPRING-001\nSPRING-002"}
            className={cn(inputCls, "h-auto py-2 font-mono")}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" type="submit" disabled={!csv.trim()}>
              <Upload className="size-4" /> Upload codes
            </Button>
            <label className="text-muted-foreground cursor-pointer text-xs underline">
              or choose a file
              <input type="file" accept=".csv,.txt" className="sr-only" onChange={async (e) => setCsv((await e.target.files?.[0]?.text()) ?? "")} />
            </label>
            {note && <span className="text-muted-foreground text-xs">{note}</span>}
          </div>
        </form>
      )}
      {!data ? (
        <Loading />
      ) : data.codes.length === 0 ? (
        <p className="text-muted-foreground text-sm">No codes yet.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Code</Th>
              <Th>Given to</Th>
              <Th>Status</Th>
              <Th>Expires</Th>
            </tr>
          </thead>
          <tbody>
            {data.codes.slice(0, 200).map(({ c, username }) => (
              <tr key={c.id}>
                <Td className="font-mono">{c.code}</Td>
                <Td>{username ? `@${username}` : "—"}</Td>
                <Td>
                  <Badge tone={c.status === "redeemed" ? "good" : c.status === "issued" ? "info" : "neutral"}>{c.status}</Badge>
                </Td>
                <Td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Panel>
  );
}

/* ================================================================ quizzes (service 13) */

type QuizChoice = { id: string; label: string; tags: string[]; tagText?: string };
type QuizQuestion = { id: string; text: string; saveTo?: string; choices: QuizChoice[] };
type QuizConfig = { keywords: string[]; intro: string; questions: QuizQuestion[]; maxResults: number; aiExplanation: boolean };
type QuizMetrics = { starts: number; completed: number; abandoned: number; completionRate: number; productClicks: number };

export function QuizzesPanel() {
  const { data, error, reload } = useApi<{ quizzes: Row<QuizConfig>[] }>("/quizzes");
  const [editing, setEditing] = useState<Row<QuizConfig> | "new" | null>(null);
  const [stats, setStats] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;
  return (
    <>
      <Panel
        title="Product quizzes"
        description="A few tap-to-answer questions in DMs, then up to 3 in-stock products from your catalog. Answers can be saved to custom fields."
        action={
          <Button size="sm" onClick={() => setEditing("new")}>
            <Plus className="size-4" /> New quiz
          </Button>
        }
      >
        {err && <ErrorNote text={err} />}
        {data.quizzes.length === 0 ? (
          <Empty title="No quizzes yet" text="Example: “Find your serum”: skin type → main concern → budget." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Keywords</Th>
                <Th>Questions</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {data.quizzes.map((q) => (
                <tr key={q.id}>
                  <Td className="font-medium">{q.name}</Td>
                  <Td className="text-xs">{q.config?.keywords?.join(", ")}</Td>
                  <Td>{q.config?.questions?.length ?? 0}</Td>
                  <Td>
                    <Badge tone={q.status === "active" ? "good" : "neutral"}>{q.status}</Badge>
                  </Td>
                  <Td className="space-x-2 text-right whitespace-nowrap">
                    <Button size="sm" variant="ghost" onClick={() => setStats(stats === q.id ? null : q.id)}>
                      <BarChart3 className="size-4" /> Results
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(q)}>
                      <Pencil className="size-4" /> Edit
                    </Button>
                    <StatusButton path="/quizzes" row={q} onDone={reload} onError={setErr} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
      {stats && <QuizStats id={stats} />}
      {editing && (
        <QuizForm
          quiz={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void reload();
          }}
        />
      )}
    </>
  );
}

function QuizStats({ id }: { id: string }) {
  const { data } = useApi<Row<QuizConfig> & { metrics: QuizMetrics }>(`/quizzes/${id}`);
  if (!data) return <Loading />;
  const m = data.metrics;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Started" value={String(m.starts)} />
      <StatCard label="Finished" value={String(m.completed)} change={`${m.completionRate}%`} />
      <StatCard label="Left halfway" value={String(m.abandoned)} />
      <StatCard label="Product clicks" value={String(m.productClicks)} />
    </div>
  );
}

const emptyQuestion = (i: number): QuizQuestion => ({ id: `q${i + 1}`, text: "", choices: [{ id: "a", label: "", tags: [] }, { id: "b", label: "", tags: [] }] });

function QuizForm({ quiz, onClose, onSaved }: { quiz: Row<QuizConfig> | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(quiz?.name ?? "");
  const [keywords, setKeywords] = useState(quiz?.config.keywords.join(", ") ?? "quiz");
  const [intro, setIntro] = useState(quiz?.config.intro ?? "Let's find your perfect match! Just tap an answer.");
  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz?.config.questions ?? [emptyQuestion(0)]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const setQ = (i: number, q: Partial<QuizQuestion>) => setQuestions(questions.map((x, j) => (j === i ? { ...x, ...q } : x)));
  const setC = (i: number, k: number, c: Partial<QuizChoice>) => setQ(i, { choices: questions[i]!.choices.map((x, j) => (j === k ? { ...x, ...c } : x)) });

  const save = async () => {
    setBusy(true);
    setErr(null);
    const config = {
      ...(quiz?.config ?? {}),
      keywords: csvList(keywords),
      intro,
      questions: questions.map((q, i) => ({
        ...q,
        id: q.id || `q${i + 1}`,
        saveTo: q.saveTo?.trim() || undefined,
        choices: q.choices
          .filter((c) => c.label.trim())
          .map(({ tagText, ...c }, k) => ({ ...c, tags: tagText !== undefined ? csvList(tagText) : c.tags, id: c.id || slug(c.label, k) })),
      })),
    };
    try {
      if (quiz) await api(`/quizzes/${quiz.id}`, { method: "PATCH", body: { name: name.trim(), config } });
      else await api("/quizzes", { method: "POST", body: { name: name.trim(), config } });
      onSaved();
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={quiz ? "Edit quiz" : "New quiz"}
      description="Answers are matched to products by tag. Give each answer the product tags it should prefer (e.g. “dry skin”)."
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={busy || !name.trim()} onClick={() => void save()}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className={inputCls} />
          </Field>
          <Field label="DM keywords" hint="Comma separated">
            <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Intro message">
          <input value={intro} onChange={(e) => setIntro(e.target.value)} maxLength={640} className={inputCls} />
        </Field>
        {questions.map((q, i) => (
          <fieldset key={i} className="space-y-3 rounded-xl border p-3">
            <legend className="px-1 text-sm font-medium">Question {i + 1}</legend>
            <div className="flex gap-2">
              <input value={q.text} onChange={(e) => setQ(i, { text: e.target.value })} placeholder="e.g. What's your skin type?" aria-label={`Question ${i + 1}`} className={inputCls} />
              {questions.length > 1 && (
                <Button variant="ghost" size="sm" aria-label="Remove question" onClick={() => setQuestions(questions.filter((_, j) => j !== i))}>
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
            <input value={q.saveTo ?? ""} onChange={(e) => setQ(i, { saveTo: e.target.value })} placeholder="Save answer to custom field key (optional), e.g. skin_type" aria-label="Save to field" className={cn(inputCls, "h-9 text-xs")} />
            {q.choices.map((c, k) => (
              <div key={k} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input value={c.label} maxLength={20} onChange={(e) => setC(i, k, { label: e.target.value })} placeholder="Answer (max 20 chars)" aria-label={`Answer ${k + 1}`} className={cn(inputCls, "h-9")} />
                <input value={c.tagText ?? c.tags.join(", ")} onChange={(e) => setC(i, k, { tagText: e.target.value })} placeholder="Product tags, comma separated" aria-label={`Tags for answer ${k + 1}`} className={cn(inputCls, "h-9")} />
                <Button variant="ghost" size="sm" aria-label="Remove answer" disabled={q.choices.length <= 2} onClick={() => setQ(i, { choices: q.choices.filter((_, j) => j !== k) })}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" disabled={q.choices.length >= 13} onClick={() => setQ(i, { choices: [...q.choices, { id: "", label: "", tags: [] }] })}>
              <Plus className="size-4" /> Answer
            </Button>
          </fieldset>
        ))}
        <Button variant="outline" size="sm" disabled={questions.length >= 10} onClick={() => setQuestions([...questions, emptyQuestion(questions.length)])}>
          <Plus className="size-4" /> Question
        </Button>
        {err && <ErrorNote text={err} />}
      </div>
    </Modal>
  );
}

/* ================================================================ surveys (service 15) */

type SurveyQuestion = { id: string; type: "rating" | "nps" | "choice" | "text"; text: string; options: string[]; optionText?: string };
type SurveyConfig = {
  trigger: { type: "order_fulfilled" | "order_delivered" | "manual"; delayHours: number };
  onIneligible: "optin_only" | "wait_for_reply" | "skip";
  questions: SurveyQuestion[];
  thankYouText: string;
};
type SurveyDash = {
  sent: number;
  completed: number;
  responseRate: number;
  averageRating: number | null;
  nps: number | null;
  weekly: { week: string; averageRating: number | null; responses: number }[];
  topics: Record<string, number>;
};

export function SurveysPanel() {
  const { data, error, reload } = useApi<{ surveys: Row<SurveyConfig>[] }>("/surveys");
  const [editing, setEditing] = useState<Row<SurveyConfig> | "new" | null>(null);
  const [dash, setDash] = useState<Row<SurveyConfig> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;
  return (
    <>
      <Panel
        title="Post-purchase surveys"
        description="Ask buyers for a rating after their order ships or arrives. If their 24-hour window is closed, the survey waits until they write again."
        action={
          <Button size="sm" onClick={() => setEditing("new")}>
            <Plus className="size-4" /> New survey
          </Button>
        }
      >
        {err && <ErrorNote text={err} />}
        {data.surveys.length === 0 ? (
          <Empty title="No surveys yet" text="Example: “How do you like your order?” (1-5 stars) → “What could be better?”" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Sent after</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {data.surveys.map((s) => (
                <tr key={s.id}>
                  <Td className="font-medium">{s.name}</Td>
                  <Td className="text-xs">{s.config?.trigger ? `${TRIGGER[s.config.trigger.type]}${s.config.trigger.type === "manual" ? "" : ` + ${s.config.trigger.delayHours}h`}` : "—"}</Td>
                  <Td>
                    <Badge tone={s.status === "active" ? "good" : "neutral"}>{s.status}</Badge>
                  </Td>
                  <Td className="space-x-2 text-right whitespace-nowrap">
                    <Button size="sm" variant="ghost" onClick={() => setDash(dash?.id === s.id ? null : s)}>
                      <BarChart3 className="size-4" /> Results
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(s)}>
                      <Pencil className="size-4" /> Edit
                    </Button>
                    <StatusButton path="/surveys" row={s} onDone={reload} onError={setErr} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
      {dash && <SurveyDashboard survey={dash} />}
      {editing && (
        <SurveyForm
          survey={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void reload();
          }}
        />
      )}
    </>
  );
}

const TRIGGER: Record<SurveyConfig["trigger"]["type"], string> = { order_fulfilled: "Order shipped", order_delivered: "Order delivered", manual: "Sent manually" };

function SurveyDashboard({ survey }: { survey: Row<SurveyConfig> }) {
  const { data, error, reload } = useApi<SurveyDash>(`/surveys/${survey.id}/dashboard`);
  if (error) return <ErrorNote text={error} onRetry={reload} />;
  if (!data) return <Loading />;
  const topics = Object.entries(data.topics).sort((a, b) => b[1] - a[1]);
  return (
    <Panel
      title={`Results: ${survey.name}`}
      action={
        <Button size="sm" variant="outline" onClick={() => void download(`/surveys/${survey.id}/responses.csv`, "survey-responses.csv")}>
          <Download className="size-4" /> CSV
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sent" value={String(data.sent)} />
        <StatCard label="Answered" value={String(data.completed)} change={`${data.responseRate}%`} />
        <StatCard label="Average rating" value={data.averageRating === null ? "—" : `${data.averageRating} / 5`} />
        <StatCard label="NPS" value={data.nps === null ? "—" : String(data.nps)} />
      </div>
      {topics.length > 0 && (
        <div className="mt-4">
          <p className="text-muted-foreground mb-2 text-xs uppercase">What people mention</p>
          <div className="flex flex-wrap gap-2">
            {topics.map(([t, n]) => (
              <Badge key={t} tone="info">
                {t.replaceAll("_", " ")} · {n}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {data.weekly.length > 0 && (
        <ul className="mt-4 divide-y text-sm">
          {data.weekly.map((w) => (
            <li key={w.week} className="flex justify-between py-1.5">
              <span>Week of {w.week}</span>
              <span className="tabular-nums">
                {w.averageRating ?? "—"} avg · {w.responses} answers
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function SurveyForm({ survey, onClose, onSaved }: { survey: Row<SurveyConfig> | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(survey?.name ?? "");
  const [trigger, setTrigger] = useState<SurveyConfig["trigger"]["type"]>(survey?.config.trigger.type ?? "order_fulfilled");
  const [delay, setDelay] = useState(String(survey?.config.trigger.delayHours ?? 72));
  const [onIneligible, setOnIneligible] = useState<SurveyConfig["onIneligible"]>(survey?.config.onIneligible ?? "wait_for_reply");
  const [questions, setQuestions] = useState<SurveyQuestion[]>(survey?.config.questions ?? [{ id: "q1", type: "rating", text: "How do you like your order? Tap 1-5 ⭐", options: [] }]);
  const [thanks, setThanks] = useState(survey?.config.thankYouText ?? "Thank you for your feedback! 💛");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const setQ = (i: number, q: Partial<SurveyQuestion>) => setQuestions(questions.map((x, j) => (j === i ? { ...x, ...q } : x)));
  const save = async () => {
    setBusy(true);
    setErr(null);
    const config = {
      ...(survey?.config ?? {}),
      trigger: { type: trigger, delayHours: Number(delay) || 0 },
      onIneligible,
      questions: questions.map(({ optionText, ...q }, i) => ({ ...q, options: optionText !== undefined ? csvList(optionText) : q.options, id: `q${i + 1}` })),
      thankYouText: thanks,
    };
    try {
      if (survey) await api(`/surveys/${survey.id}`, { method: "PATCH", body: { name: name.trim(), config } });
      else await api("/surveys", { method: "POST", body: { name: name.trim(), config } });
      onSaved();
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={survey ? "Edit survey" : "New survey"}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={busy || !name.trim()} onClick={() => void save()}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className={inputCls} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Send after">
            <select value={trigger} onChange={(e) => setTrigger(e.target.value as SurveyConfig["trigger"]["type"])} className={inputCls}>
              {Object.entries(TRIGGER).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Wait (hours)">
            <input type="number" min={0} max={720} value={delay} disabled={trigger === "manual"} onChange={(e) => setDelay(e.target.value)} className={inputCls} />
          </Field>
          <Field label="If the 24h window is closed">
            <select value={onIneligible} onChange={(e) => setOnIneligible(e.target.value as SurveyConfig["onIneligible"])} className={inputCls}>
              <option value="wait_for_reply">Wait until they write</option>
              <option value="optin_only">Only with an opt-in</option>
              <option value="skip">Skip</option>
            </select>
          </Field>
        </div>
        {questions.map((q, i) => (
          <fieldset key={i} className="space-y-2 rounded-xl border p-3">
            <legend className="px-1 text-sm font-medium">Question {i + 1}</legend>
            <div className="grid gap-2 sm:grid-cols-[140px_1fr_auto]">
              <select aria-label="Question type" value={q.type} onChange={(e) => setQ(i, { type: e.target.value as SurveyQuestion["type"] })} className={cn(inputCls, "h-9")}>
                <option value="rating">Rating 1-5</option>
                <option value="nps">0-10 (NPS)</option>
                <option value="choice">Choice</option>
                <option value="text">Free text</option>
              </select>
              <input aria-label={`Question ${i + 1}`} value={q.text} maxLength={640} onChange={(e) => setQ(i, { text: e.target.value })} className={cn(inputCls, "h-9")} />
              <Button variant="ghost" size="sm" aria-label="Remove question" disabled={questions.length <= 1} onClick={() => setQuestions(questions.filter((_, j) => j !== i))}>
                <Trash2 className="size-4" />
              </Button>
            </div>
            {q.type === "choice" && (
              <input aria-label="Options" placeholder="Options, comma separated (max 20 chars each)" value={q.optionText ?? q.options.join(", ")} onChange={(e) => setQ(i, { optionText: e.target.value })} className={cn(inputCls, "h-9")} />
            )}
          </fieldset>
        ))}
        <Button variant="outline" size="sm" disabled={questions.length >= 5} onClick={() => setQuestions([...questions, { id: "", type: "text", text: "", options: [] }])}>
          <Plus className="size-4" /> Question
        </Button>
        <Field label="Thank-you message">
          <input value={thanks} onChange={(e) => setThanks(e.target.value)} maxLength={640} className={inputCls} />
        </Field>
        {err && <ErrorNote text={err} />}
      </div>
    </Modal>
  );
}
