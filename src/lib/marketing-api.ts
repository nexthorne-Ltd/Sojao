/**
 * Client for the Sojao API (separate repo: sojao-backend).
 * Auth is the httpOnly session cookie set by POST /auth/login or /auth/signup; every request sends it
 * (credentials: "include"). Nothing secret lives in the browser.
 */
export const API_URL = (process.env.NEXT_PUBLIC_SOJAO_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

/** Kept for older components: the dashboard always uses the real API now. */
export const apiEnabled = true;

/** Session gone (logged out, expired, password changed elsewhere): back to the login page. */
function toLogin() {
  if (typeof window === "undefined") return;
  const next = window.location.pathname + window.location.search;
  if (!window.location.pathname.startsWith("/login")) window.location.href = `/login?next=${encodeURIComponent(next)}`;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: { error?: string; message?: string; issues?: { path: (string | number)[]; message: string }[] },
  ) {
    super(body.message ?? body.error ?? `HTTP ${status}`);
  }
  /** One readable line for the UI. */
  get readable(): string {
    if (this.body.issues?.length) {
      return this.body.issues.map((i) => `${i.path.join(".") || "input"}: ${i.message}`).join(" · ");
    }
    if (this.body.error === "not_available") return "This feature is not available on Instagram yet.";
    if (this.body.error === "account_suspended" || this.body.error === "maintenance") return this.body.message ?? "Your account can't be used right now.";
    return this.message;
  }
}

/** Raw call: `path` is the full path ("/auth/login", "/api/me"). */
export async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: init.method ?? "GET",
      credentials: "include",
      headers: init.body !== undefined ? { "content-type": "application/json" } : {},
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new ApiError(0, { error: "Can't reach Sojao. Check your connection and try again." });
  }
  const text = await res.text();
  let data: unknown = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text.slice(0, 200) };
  }
  if (!res.ok) throw new ApiError(res.status, data as ApiError["body"]);
  return data as T;
}

/** /api/* call. A 401 sends the user to the login page. */
export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  try {
    return await request<T>(`/api${path}`, init);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) toLogin();
    throw e;
  }
}

/** Fetches a file (auth header required, so a plain link won't do) and saves it. */
export async function download(path: string, filename: string) {
  const res = await fetch(`${API_URL}/api${path}`, { credentials: "include" });
  if (res.status === 401) toLogin();
  if (!res.ok) throw new ApiError(res.status, {});
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------------- types (mirror the API) ---------------- */

export type AutomationType = "comment_to_dm" | "story_reply" | "story_mention" | "dm_keyword" | "welcome" | "follow";

export type Automation = {
  id: string;
  type: AutomationType;
  name: string;
  status: "enabled" | "disabled";
  config: Record<string, unknown>;
  createdAt: string;
  stats: { matched: number; sent: number; clicks: number };
};

export type Capabilities = Record<string, { available: boolean; note?: string; privateReplyButtons?: boolean; max?: number }>;

export type IgAccount = {
  id: string;
  igUserId: string;
  username: string | null;
  status: "active" | "expired" | "disconnected" | "error";
  statusReason: string | null;
  tokenExpiresAt: string | null;
  permissions: string | null;
};

export type Lead = {
  id: string;
  username: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  tags: string[];
  consentAt: string | null;
  lastInboundAt: string | null;
  optedOut: boolean;
  createdAt: string;
};

export type Audience = {
  tags?: string[];
  lastInboundWithinHours?: number;
  sources?: string[];
  optinTopic?: string;
};

export type CampaignButton = { type: "web_url"; title: string; url: string };
export type CampaignMessage = { text: string; imageUrl?: string; buttons?: CampaignButton[] };

export type Compliance = {
  total: number;
  eligibleNow: number;
  ineligible: { opted_out: number; outside_window: number; no_optin: number };
  estimatedHours: number;
  estimatedFinishAt: string;
  notes: string[];
};

export type CampaignStatus = "draft" | "scheduled" | "sending" | "paused" | "completed" | "cancelled";

export type Campaign = {
  id: string;
  igAccountId: string;
  name: string;
  status: CampaignStatus;
  audience: Audience;
  message: CampaignMessage;
  scheduledAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  progress: { byStatus: Record<string, number>; skippedReasons: Record<string, number>; pending: number; estimatedFinishAt: string };
};

export type Workspace = { id: string; name: string; timezone: string };
