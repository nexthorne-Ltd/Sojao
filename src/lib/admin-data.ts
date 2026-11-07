/**
 * SAMPLE DATA for the Sojao admin panel.
 * Everything here is made up for the demo UI. Replace with real API / DB data
 * (users table, subscriptions table, payments table, audit log).
 */

export type PlanId = "starter" | "growth" | "pro";
export type BillingCycle = "monthly" | "yearly";
export type UserStatus = "active" | "trial" | "past_due" | "suspended" | "cancelled";
export type Role = "owner" | "admin" | "support" | "viewer";

export type Plan = {
  id: PlanId;
  name: string;
  monthly: number;
  yearly: number;
  description: string;
  active: boolean;
  limits: { conversations: number; channels: number; seats: number };
};

export const PLANS: Plan[] = [
  { id: "starter", name: "Starter", monthly: 29, yearly: 290, description: "All 3 pillars, basic version", active: true, limits: { conversations: 1000, channels: 2, seats: 1 } },
  { id: "growth", name: "Growth", monthly: 79, yearly: 790, description: "For brands ready to grow", active: true, limits: { conversations: 5000, channels: 3, seats: 3 } },
  { id: "pro", name: "Pro", monthly: 199, yearly: 1990, description: "Every tool Sojao has", active: true, limits: { conversations: 25000, channels: 3, seats: 10 } },
];

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  brand: string;
  country: string;
  plan: PlanId;
  cycle: BillingCycle;
  status: UserStatus;
  beta: boolean;
  signedUp: string; // ISO date
  lastActive: string;
  renewsOn: string; // ISO date
  channels: ("instagram" | "messenger" | "whatsapp")[];
  conversations: number; // this month
  totalPaid: number;
  verified: boolean;
  notes: string;
};

export const USERS: AdminUser[] = [
  { id: "u1", name: "Ayesha Khan", email: "ayesha@noorstudio.co", brand: "Noor Studio", country: "PK", plan: "pro", cycle: "yearly", status: "active", beta: true, signedUp: "2026-08-02", lastActive: "4m ago", renewsOn: "2027-08-02", channels: ["instagram", "whatsapp", "messenger"], conversations: 14210, totalPaid: 1990, verified: true, notes: "Top account. Asked for Shopify sync." },
  { id: "u2", name: "Daniel Reyes", email: "dan@kindredco.com", brand: "Kindred Co", country: "US", plan: "growth", cycle: "monthly", status: "active", beta: true, signedUp: "2026-08-11", lastActive: "1h ago", renewsOn: "2026-11-11", channels: ["instagram", "messenger"], conversations: 3820, totalPaid: 237, verified: true, notes: "" },
  { id: "u3", name: "Priya Nair", email: "priya@glowlab.in", brand: "Glow Lab", country: "IN", plan: "starter", cycle: "monthly", status: "trial", beta: true, signedUp: "2026-11-01", lastActive: "12m ago", renewsOn: "2026-11-15", channels: ["instagram"], conversations: 210, totalPaid: 0, verified: true, notes: "Onboarding call booked." },
  { id: "u4", name: "Lucas Moreau", email: "lucas@atelierlm.fr", brand: "Atelier LM", country: "FR", plan: "growth", cycle: "yearly", status: "active", beta: false, signedUp: "2026-09-04", lastActive: "Yesterday", renewsOn: "2027-09-04", channels: ["instagram", "whatsapp"], conversations: 4105, totalPaid: 790, verified: true, notes: "" },
  { id: "u5", name: "Fatima Zahra", email: "fatima@zahrahome.ma", brand: "Zahra Home", country: "MA", plan: "starter", cycle: "monthly", status: "past_due", beta: false, signedUp: "2026-09-19", lastActive: "3d ago", renewsOn: "2026-11-03", channels: ["whatsapp"], conversations: 640, totalPaid: 29, verified: true, notes: "Card declined twice." },
  { id: "u6", name: "Hamza Ali", email: "hamza@threadline.pk", brand: "Threadline", country: "PK", plan: "growth", cycle: "monthly", status: "active", beta: true, signedUp: "2026-08-21", lastActive: "35m ago", renewsOn: "2026-11-21", channels: ["instagram", "whatsapp"], conversations: 4980, totalPaid: 237, verified: true, notes: "Near conversation limit, upsell to Pro." },
  { id: "u7", name: "Emily Carter", email: "emily@petalandpine.com", brand: "Petal & Pine", country: "UK", plan: "pro", cycle: "monthly", status: "active", beta: false, signedUp: "2026-09-28", lastActive: "2h ago", renewsOn: "2026-11-28", channels: ["instagram", "messenger", "whatsapp"], conversations: 9320, totalPaid: 398, verified: true, notes: "" },
  { id: "u8", name: "Kenji Watanabe", email: "kenji@kumaworks.jp", brand: "Kuma Works", country: "JP", plan: "starter", cycle: "yearly", status: "active", beta: false, signedUp: "2026-10-03", lastActive: "6h ago", renewsOn: "2027-10-03", channels: ["instagram"], conversations: 512, totalPaid: 290, verified: true, notes: "" },
  { id: "u9", name: "Sara Ahmed", email: "sara@miraboutique.ae", brand: "Mira Boutique", country: "AE", plan: "growth", cycle: "monthly", status: "trial", beta: true, signedUp: "2026-11-04", lastActive: "20m ago", renewsOn: "2026-11-18", channels: ["instagram", "whatsapp"], conversations: 88, totalPaid: 0, verified: false, notes: "Email not verified yet." },
  { id: "u10", name: "Tom Becker", email: "tom@nordlicht.de", brand: "Nordlicht", country: "DE", plan: "starter", cycle: "monthly", status: "cancelled", beta: false, signedUp: "2026-08-15", lastActive: "3w ago", renewsOn: "2026-10-15", channels: ["messenger"], conversations: 0, totalPaid: 58, verified: true, notes: "Cancelled: 'too expensive for now'." },
  { id: "u11", name: "Zainab Malik", email: "zainab@henna.house", brand: "Henna House", country: "PK", plan: "pro", cycle: "yearly", status: "active", beta: true, signedUp: "2026-08-09", lastActive: "10m ago", renewsOn: "2027-08-09", channels: ["instagram", "whatsapp"], conversations: 11840, totalPaid: 1990, verified: true, notes: "" },
  { id: "u12", name: "Marco Rossi", email: "marco@vespashop.it", brand: "Vespa Shop", country: "IT", plan: "growth", cycle: "monthly", status: "suspended", beta: false, signedUp: "2026-09-12", lastActive: "1w ago", renewsOn: "2026-11-12", channels: ["instagram"], conversations: 0, totalPaid: 158, verified: true, notes: "Suspended: spam reports from Meta." },
  { id: "u13", name: "Grace Okafor", email: "grace@adireprints.ng", brand: "Adire Prints", country: "NG", plan: "starter", cycle: "monthly", status: "active", beta: true, signedUp: "2026-10-14", lastActive: "1d ago", renewsOn: "2026-11-14", channels: ["instagram", "whatsapp"], conversations: 905, totalPaid: 29, verified: true, notes: "" },
  { id: "u14", name: "Olivia Brooks", email: "liv@saltandsage.co", brand: "Salt & Sage", country: "AU", plan: "growth", cycle: "yearly", status: "active", beta: false, signedUp: "2026-10-20", lastActive: "4h ago", renewsOn: "2027-10-20", channels: ["instagram", "messenger"], conversations: 2760, totalPaid: 790, verified: true, notes: "" },
  { id: "u15", name: "Bilal Siddiqui", email: "bilal@kicksdepot.pk", brand: "Kicks Depot", country: "PK", plan: "starter", cycle: "monthly", status: "trial", beta: true, signedUp: "2026-11-06", lastActive: "2m ago", renewsOn: "2026-11-20", channels: ["instagram"], conversations: 14, totalPaid: 0, verified: true, notes: "" },
  { id: "u16", name: "Chloe Martin", email: "chloe@lunejewels.ca", brand: "Lune Jewels", country: "CA", plan: "pro", cycle: "monthly", status: "past_due", beta: false, signedUp: "2026-09-30", lastActive: "2d ago", renewsOn: "2026-11-01", channels: ["instagram", "messenger"], conversations: 6100, totalPaid: 199, verified: true, notes: "Retry scheduled." },
];

export type Payment = {
  id: string;
  userId: string;
  amount: number;
  date: string;
  status: "paid" | "failed" | "refunded";
  method: string;
};

export const PAYMENTS: Payment[] = [
  { id: "INV-1042", userId: "u7", amount: 199, date: "2026-11-06", status: "paid", method: "Visa •• 4242" },
  { id: "INV-1041", userId: "u5", amount: 29, date: "2026-11-03", status: "failed", method: "Mastercard •• 1188" },
  { id: "INV-1040", userId: "u16", amount: 199, date: "2026-11-01", status: "failed", method: "Visa •• 9031" },
  { id: "INV-1039", userId: "u14", amount: 790, date: "2026-10-20", status: "paid", method: "Amex •• 3005" },
  { id: "INV-1038", userId: "u13", amount: 29, date: "2026-10-14", status: "paid", method: "Visa •• 7712" },
  { id: "INV-1037", userId: "u10", amount: 29, date: "2026-10-15", status: "refunded", method: "Visa •• 5521" },
  { id: "INV-1036", userId: "u8", amount: 290, date: "2026-10-03", status: "paid", method: "JCB •• 0044" },
  { id: "INV-1035", userId: "u2", amount: 79, date: "2026-10-11", status: "paid", method: "Visa •• 6610" },
  { id: "INV-1034", userId: "u6", amount: 79, date: "2026-10-21", status: "paid", method: "Mastercard •• 2290" },
  { id: "INV-1033", userId: "u12", amount: 79, date: "2026-10-12", status: "paid", method: "Visa •• 8801" },
  { id: "INV-1032", userId: "u4", amount: 790, date: "2026-09-04", status: "paid", method: "Visa •• 1414" },
];

export type AuditEntry = { id: string; actor: string; action: string; target?: string; time: string };

export const AUDIT: AuditEntry[] = [
  { id: "a1", actor: "System", action: "Payment failed", target: "Zahra Home", time: "2026-11-03 09:12" },
  { id: "a2", actor: "You", action: "Suspended account", target: "Vespa Shop", time: "2026-10-31 16:40" },
  { id: "a3", actor: "Sana (Support)", action: "Extended trial by 7 days", target: "Glow Lab", time: "2026-10-30 11:05" },
  { id: "a4", actor: "You", action: "Changed Pro yearly price to $1,990", time: "2026-10-28 18:22" },
  { id: "a5", actor: "System", action: "Subscription cancelled", target: "Nordlicht", time: "2026-10-15 00:00" },
];

export type TeamMember = { id: string; name: string; email: string; role: Role; lastActive: string };

export const TEAM: TeamMember[] = [
  { id: "t1", name: "You", email: "badaryoung.goat@gmail.com", role: "owner", lastActive: "Now" },
  { id: "t2", name: "Sana Iqbal", email: "sana@sojao.ai", role: "support", lastActive: "1h ago" },
  { id: "t3", name: "Omar Farooq", email: "omar@sojao.ai", role: "admin", lastActive: "Yesterday" },
];

export const SIGNUPS_BY_WEEK = [
  { x: "Sep 15", y: 4 }, { x: "Sep 22", y: 6 }, { x: "Sep 29", y: 9 }, { x: "Oct 6", y: 7 },
  { x: "Oct 13", y: 12 }, { x: "Oct 20", y: 15 }, { x: "Oct 27", y: 13 }, { x: "Nov 3", y: 19 },
];

export const planById = (id: PlanId) => PLANS.find((p) => p.id === id)!;

/** Monthly recurring revenue contributed by one user (yearly plans spread over 12). */
export const userMrr = (u: AdminUser, plans: Plan[] = PLANS) => {
  if (u.status !== "active" && u.status !== "past_due") return 0;
  const p = plans.find((x) => x.id === u.plan)!;
  return u.cycle === "yearly" ? p.yearly / 12 : p.monthly;
};

export const STATUS_META: Record<UserStatus, { label: string; tone: "good" | "info" | "warn" | "bad" | "neutral" }> = {
  active: { label: "Active", tone: "good" },
  trial: { label: "Trial", tone: "info" },
  past_due: { label: "Past due", tone: "warn" },
  suspended: { label: "Suspended", tone: "bad" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
