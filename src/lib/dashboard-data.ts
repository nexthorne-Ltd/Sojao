/**
 * SAMPLE DATA for the Sojao owner dashboard.
 * Everything here is made up for the demo UI. Replace with real API data.
 */

export type Channel = "instagram" | "messenger" | "whatsapp";
export type Pillar = "Marketing" | "Sales" | "Support";

export const brand = {
  name: "Your brand",
  owner: "Owner",
  plan: "Growth",
  beta: true,
};

/* ---------------- Customers ---------------- */

export type Customer = {
  id: string;
  name: string;
  handle: string;
  channel: Channel;
  email?: string;
  phone?: string;
  tags: string[];
  orders: number;
  spent: number;
  lastSeen: string;
  city: string;
  notes: string;
};

export const customers: Customer[] = [
  { id: "c1", name: "Maya Lopez", handle: "@maya.wears", channel: "instagram", email: "maya@example.com", tags: ["VIP", "Dresses"], orders: 6, spent: 482, lastSeen: "2m ago", city: "Austin, US", notes: "Prefers size S. Loves linen." },
  { id: "c2", name: "Olivia Chen", handle: "@liv.chen", channel: "instagram", tags: ["New lead"], orders: 0, spent: 0, lastSeen: "8m ago", city: "Toronto, CA", notes: "Asked about the summer drop." },
  { id: "c3", name: "Jack Turner", handle: "+44 7700 900123", channel: "whatsapp", phone: "+44 7700 900123", tags: ["Returning"], orders: 3, spent: 214, lastSeen: "21m ago", city: "Leeds, UK", notes: "Gift buyer." },
  { id: "c4", name: "Ava Williams", handle: "Ava Williams", channel: "messenger", email: "ava.w@example.com", tags: ["Giveaway"], orders: 1, spent: 59, lastSeen: "1h ago", city: "Sydney, AU", notes: "" },
  { id: "c5", name: "Sophie Martin", handle: "@sophie.glow", channel: "instagram", tags: ["Skincare", "VIP"], orders: 9, spent: 731, lastSeen: "2h ago", city: "Vancouver, CA", notes: "Sensitive skin." },
  { id: "c6", name: "Noah Brown", handle: "+1 415 555 0142", channel: "whatsapp", phone: "+1 415 555 0142", tags: ["Abandoned DM"], orders: 0, spent: 0, lastSeen: "3h ago", city: "San Diego, US", notes: "Asked about shipping, went quiet." },
  { id: "c7", name: "Isla Scott", handle: "@isla.accessories", channel: "instagram", tags: ["Returning", "Jewelry"], orders: 4, spent: 268, lastSeen: "5h ago", city: "Glasgow, UK", notes: "" },
  { id: "c8", name: "Liam Davis", handle: "Liam Davis", channel: "messenger", tags: ["Return"], orders: 2, spent: 118, lastSeen: "Yesterday", city: "Denver, US", notes: "Return in progress." },
  { id: "c9", name: "Chloe Evans", handle: "@chloe.evans", channel: "instagram", email: "chloe@example.com", tags: ["New lead", "Giveaway"], orders: 0, spent: 0, lastSeen: "Yesterday", city: "Melbourne, AU", notes: "" },
  { id: "c10", name: "Ethan Wilson", handle: "+61 491 570 006", channel: "whatsapp", phone: "+61 491 570 006", tags: ["Returning"], orders: 5, spent: 392, lastSeen: "2d ago", city: "Brisbane, AU", notes: "Buys for partner." },
  { id: "c11", name: "Grace Taylor", handle: "@grace.t", channel: "instagram", tags: ["Dresses"], orders: 1, spent: 89, lastSeen: "3d ago", city: "Chicago, US", notes: "" },
  { id: "c12", name: "Harper Moore", handle: "Harper Moore", channel: "messenger", tags: ["VIP"], orders: 7, spent: 556, lastSeen: "4d ago", city: "London, UK", notes: "Always asks for gift wrap." },
];

export const customerById = (id: string) => customers.find((c) => c.id === id)!;

/* ---------------- Conversations ---------------- */

export type Message = {
  from: "customer" | "ai" | "owner";
  text: string;
  time: string;
  checkout?: { product: string; price: number };
};

export type ConversationStatus = "ai" | "needs-you" | "resolved";

export type Conversation = {
  id: string;
  customerId: string;
  channel: Channel;
  pillar: Pillar;
  status: ConversationStatus;
  unread: boolean;
  preview: string;
  time: string;
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    id: "v1", customerId: "c1", channel: "instagram", pillar: "Sales", status: "ai", unread: true, time: "2m",
    preview: "Sent checkout link for Linen Wrap Dress (S)",
    messages: [
      { from: "customer", text: "Hi! Is the linen wrap dress still in stock in small?", time: "11:42 PM" },
      { from: "ai", text: "Hi Maya! Yes, the Linen Wrap Dress is in stock in S. We have it in sand and olive. You picked sand last time. Want the same?", time: "11:42 PM" },
      { from: "customer", text: "Sand please. How long is shipping to Austin?", time: "11:43 PM" },
      { from: "ai", text: "Usually 2–4 business days to Austin, and it's free over $75. Here's your checkout link:", time: "11:43 PM", checkout: { product: "Linen Wrap Dress · Sand · S", price: 89 } },
    ],
  },
  {
    id: "v2", customerId: "c2", channel: "instagram", pillar: "Marketing", status: "ai", unread: true, time: "8m",
    preview: "Commented “DROP” · lead captured",
    messages: [
      { from: "customer", text: "DROP", time: "11:36 PM" },
      { from: "ai", text: "Hey Olivia! Thanks for the comment 💛 The summer drop goes live Friday at 9 AM. Want early access? Drop your email and I'll send the link first.", time: "11:36 PM" },
      { from: "customer", text: "yes! olivia.c@example.com", time: "11:37 PM" },
      { from: "ai", text: "Done! You're on the early list. I'll message you here too when it's live.", time: "11:37 PM" },
    ],
  },
  {
    id: "v3", customerId: "c3", channel: "whatsapp", pillar: "Support", status: "resolved", unread: false, time: "21m",
    preview: "Where is my order? · answered with tracking",
    messages: [
      { from: "customer", text: "Hi, where is my order #1041?", time: "11:20 PM" },
      { from: "ai", text: "Hi Jack! Order #1041 shipped yesterday with Royal Mail. It's due tomorrow. Tracking: RM20394857GB", time: "11:20 PM" },
      { from: "customer", text: "Perfect thanks", time: "11:21 PM" },
    ],
  },
  {
    id: "v4", customerId: "c8", channel: "messenger", pillar: "Support", status: "needs-you", unread: true, time: "34m",
    preview: "Wants to return a damaged item · handed to you",
    messages: [
      { from: "customer", text: "My necklace arrived broken. Can I get a refund instead of a swap?", time: "11:07 PM" },
      { from: "ai", text: "I'm really sorry, Liam. That shouldn't happen. A refund on a damaged item needs a quick check from the team, so I've passed this to them. You'll hear back soon.", time: "11:07 PM" },
    ],
  },
  {
    id: "v5", customerId: "c6", channel: "whatsapp", pillar: "Sales", status: "ai", unread: false, time: "3h",
    preview: "Follow-up sent · asked about shipping",
    messages: [
      { from: "customer", text: "Do you ship to San Diego? How much?", time: "8:15 PM" },
      { from: "ai", text: "We do! Shipping to San Diego is $6, free over $75. Which piece were you looking at?", time: "8:15 PM" },
      { from: "ai", text: "Hi Noah, just checking in! The Satin Slip Skirt you viewed is low in stock. Want me to hold one for you?", time: "11:15 PM" },
    ],
  },
  {
    id: "v6", customerId: "c5", channel: "instagram", pillar: "Sales", status: "resolved", unread: false, time: "2h",
    preview: "Bought Glow Serum + upsell Night Cream",
    messages: [
      { from: "customer", text: "Is the glow serum ok for sensitive skin?", time: "9:30 PM" },
      { from: "ai", text: "Yes, it's fragrance-free and made for sensitive skin. Many people pair it with our Night Cream. Want both? Together they're $64.", time: "9:30 PM" },
      { from: "customer", text: "Both please!", time: "9:31 PM" },
      { from: "ai", text: "Lovely! Here's your checkout link:", time: "9:31 PM", checkout: { product: "Glow Serum + Night Cream", price: 64 } },
    ],
  },
  {
    id: "v7", customerId: "c4", channel: "messenger", pillar: "Marketing", status: "ai", unread: false, time: "1h",
    preview: "Entered the summer giveaway",
    messages: [
      { from: "customer", text: "How do I enter the giveaway?", time: "10:40 PM" },
      { from: "ai", text: "Easy! Follow us, like the giveaway post, and tag a friend. You're already following, so just two steps left 🎉", time: "10:40 PM" },
    ],
  },
  {
    id: "v8", customerId: "c12", channel: "messenger", pillar: "Sales", status: "needs-you", unread: false, time: "4d",
    preview: "Asked for a custom engraving · handed to you",
    messages: [
      { from: "customer", text: "Can you engrave initials on the gold cuff?", time: "Mon 6:02 PM" },
      { from: "ai", text: "Great idea, Harper! Custom engraving isn't something I can confirm, so I've asked the team. They'll reply here.", time: "Mon 6:02 PM" },
    ],
  },
];

/* ---------------- Overview ---------------- */

export const overviewStats = [
  { label: "Sales from DMs", value: "$4,820", change: "+18%", hint: "Last 14 days" },
  { label: "Chats answered", value: "1,284", change: "+9%", hint: "Last 14 days" },
  { label: "Answered by Sojao", value: "92%", change: "+3 pts", hint: "No human needed" },
  { label: "Answered at night", value: "41%", change: "", hint: "10 PM – 8 AM" },
];

export const dailyChats = [
  { day: "Oct 25", chats: 64, sales: 210 },
  { day: "Oct 26", chats: 71, sales: 260 },
  { day: "Oct 27", chats: 58, sales: 180 },
  { day: "Oct 28", chats: 83, sales: 340 },
  { day: "Oct 29", chats: 92, sales: 410 },
  { day: "Oct 30", chats: 77, sales: 300 },
  { day: "Oct 31", chats: 110, sales: 520 },
  { day: "Nov 1", chats: 124, sales: 610 },
  { day: "Nov 2", chats: 98, sales: 380 },
  { day: "Nov 3", chats: 86, sales: 290 },
  { day: "Nov 4", chats: 95, sales: 350 },
  { day: "Nov 5", chats: 101, sales: 330 },
  { day: "Nov 6", chats: 113, sales: 360 },
  { day: "Nov 7", chats: 112, sales: 370 },
];

export const channelSplit: { channel: Channel; chats: number }[] = [
  { channel: "instagram", chats: 812 },
  { channel: "whatsapp", chats: 301 },
  { channel: "messenger", chats: 171 },
];

export const pillarSplit: { pillar: Pillar; chats: number; detail: string }[] = [
  { pillar: "Marketing", chats: 402, detail: "Leads captured: 138" },
  { pillar: "Sales", chats: 571, detail: "Checkout links sent: 214" },
  { pillar: "Support", chats: 311, detail: "Orders tracked: 187" },
];

/* ---------------- Marketing ---------------- */

export type Automation = {
  id: string;
  name: string;
  trigger: string;
  kind: "Comment-to-DM" | "Story reply" | "Mention" | "Keyword" | "Follow";
  enabled: boolean;
  runs: number;
  leads: number;
  plan: "Starter" | "Growth" | "Pro";
};

export const automations: Automation[] = [
  { id: "a1", name: "Summer drop early access", trigger: "Comment “DROP” on any post", kind: "Comment-to-DM", enabled: true, runs: 342, leads: 118, plan: "Starter" },
  { id: "a2", name: "Story reply → product link", trigger: "Any reply to a story", kind: "Story reply", enabled: true, runs: 211, leads: 34, plan: "Starter" },
  { id: "a3", name: "Thank you for the mention", trigger: "Someone mentions @yourbrand", kind: "Mention", enabled: true, runs: 57, leads: 9, plan: "Starter" },
  { id: "a4", name: "Size guide", trigger: "Keyword “SIZE” in a DM", kind: "Keyword", enabled: true, runs: 96, leads: 0, plan: "Growth" },
  { id: "a5", name: "Welcome new followers", trigger: "New follower", kind: "Follow", enabled: false, runs: 0, leads: 0, plan: "Growth" },
];

export type Broadcast = {
  id: string;
  name: string;
  audience: string;
  channel: Channel;
  status: "Sent" | "Scheduled" | "Draft";
  date: string;
  sent: number;
  replies: number;
  sales: number;
};

export const broadcasts: Broadcast[] = [
  { id: "b1", name: "New collection: Linen edit", audience: "Dress lovers · 640", channel: "instagram", status: "Sent", date: "Nov 3", sent: 640, replies: 92, sales: 1180 },
  { id: "b2", name: "Restock: Glow Serum", audience: "Skincare tag · 310", channel: "whatsapp", status: "Sent", date: "Oct 29", sent: 310, replies: 61, sales: 940 },
  { id: "b3", name: "Black Friday early access", audience: "VIP · 120", channel: "instagram", status: "Scheduled", date: "Nov 24", sent: 0, replies: 0, sales: 0 },
  { id: "b4", name: "Holiday gift guide", audience: "All customers · 1,920", channel: "messenger", status: "Draft", date: "—", sent: 0, replies: 0, sales: 0 },
];

export const sequences = [
  { id: "s1", name: "New lead welcome", steps: 3, active: 84, enabled: true, description: "Day 0 welcome · Day 2 best sellers · Day 5 10% code" },
  { id: "s2", name: "After first order", steps: 2, active: 41, enabled: true, description: "Day 3 how to care · Day 14 review request" },
  { id: "s3", name: "Win back", steps: 2, active: 0, enabled: false, description: "Day 45 we miss you · Day 52 new arrivals" },
];

export const giveaways = [
  { id: "g1", name: "Summer tote giveaway", status: "Live", entries: 486, ends: "Nov 12", rules: "Follow · Like · Tag a friend" },
];

/* ---------------- Sales ---------------- */

export const products = [
  { id: "p1", name: "Linen Wrap Dress", price: 89, stock: 14, variants: "Sand, Olive · XS–L", asked: 128, links: 46, sold: 31 },
  { id: "p2", name: "Satin Slip Skirt", price: 59, stock: 3, variants: "Black, Champagne · XS–XL", asked: 94, links: 38, sold: 22 },
  { id: "p3", name: "Glow Serum", price: 38, stock: 52, variants: "30 ml", asked: 76, links: 41, sold: 35 },
  { id: "p4", name: "Night Cream", price: 32, stock: 40, variants: "50 ml", asked: 33, links: 19, sold: 17 },
  { id: "p5", name: "Gold Cuff Bracelet", price: 45, stock: 0, variants: "Gold, Silver", asked: 61, links: 12, sold: 9 },
  { id: "p6", name: "Pearl Drop Earrings", price: 29, stock: 22, variants: "One size", asked: 48, links: 25, sold: 20 },
];

export const followUps = [
  { id: "f1", customerId: "c6", product: "Satin Slip Skirt", lastMessage: "3h ago", status: "Follow-up sent" as const, value: 59 },
  { id: "f2", customerId: "c2", product: "Linen Wrap Dress", lastMessage: "Yesterday", status: "Waiting" as const, value: 89 },
  { id: "f3", customerId: "c9", product: "Pearl Drop Earrings", lastMessage: "Yesterday", status: "Recovered" as const, value: 29 },
  { id: "f4", customerId: "c11", product: "Glow Serum", lastMessage: "2d ago", status: "Recovered" as const, value: 38 },
  { id: "f5", customerId: "c4", product: "Gold Cuff Bracelet", lastMessage: "3d ago", status: "Lost" as const, value: 45 },
];

export const salesStats = [
  { label: "Checkout links sent", value: "214", hint: "Last 14 days" },
  { label: "Paid from links", value: "134", hint: "63% of links" },
  { label: "Recovered from follow-ups", value: "$1,120", hint: "Abandoned DMs" },
  { label: "Upsell revenue", value: "$640", hint: "Added in chat" },
];

/* ---------------- Support ---------------- */

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Return requested";

export const orders: {
  id: string;
  customerId: string;
  items: string;
  total: number;
  status: OrderStatus;
  date: string;
  tracking?: string;
  updatesSent: number;
}[] = [
  { id: "#1048", customerId: "c1", items: "Linen Wrap Dress", total: 89, status: "Processing", date: "Today", updatesSent: 1 },
  { id: "#1047", customerId: "c5", items: "Glow Serum, Night Cream", total: 64, status: "Processing", date: "Today", updatesSent: 1 },
  { id: "#1046", customerId: "c10", items: "Pearl Drop Earrings ×2", total: 58, status: "Shipped", date: "Nov 6", tracking: "AU8812739", updatesSent: 2 },
  { id: "#1041", customerId: "c3", items: "Satin Slip Skirt", total: 59, status: "Shipped", date: "Nov 5", tracking: "RM20394857GB", updatesSent: 3 },
  { id: "#1039", customerId: "c7", items: "Gold Cuff Bracelet", total: 45, status: "Delivered", date: "Nov 2", tracking: "RM19283746GB", updatesSent: 4 },
  { id: "#1036", customerId: "c8", items: "Pearl Necklace", total: 72, status: "Return requested", date: "Oct 30", tracking: "US55102938", updatesSent: 4 },
  { id: "#1033", customerId: "c12", items: "Linen Wrap Dress, Gold Cuff", total: 134, status: "Delivered", date: "Oct 28", tracking: "RM18273645GB", updatesSent: 4 },
];

export const returns = [
  { id: "r1", order: "#1036", customerId: "c8", reason: "Arrived damaged", wants: "Refund", status: "Needs you" as const },
  { id: "r2", order: "#1029", customerId: "c11", reason: "Too big", wants: "Swap to S", status: "Approved" as const },
  { id: "r3", order: "#1022", customerId: "c4", reason: "Changed mind", wants: "Refund", status: "Done" as const },
];

export const supportStats = [
  { label: "“Where is my order?” answered", value: "187", hint: "From live Shopify data" },
  { label: "Delivery updates sent", value: "402", hint: "Shipped, out for delivery, delivered" },
  { label: "Handed to you", value: "23", hint: "Sojao wasn't sure" },
  { label: "Average first reply", value: "6 sec", hint: "Day and night" },
];

/* ---------------- Billing ---------------- */

export const invoices = [
  { id: "INV-0003", date: "Nov 1, 2026", plan: "Growth · monthly", amount: 0, status: "Free (beta)" },
  { id: "INV-0002", date: "Oct 1, 2026", plan: "Growth · monthly", amount: 0, status: "Free (beta)" },
  { id: "INV-0001", date: "Sep 1, 2026", plan: "Starter · monthly", amount: 0, status: "Free (beta)" },
];

export const usage = [
  { label: "Conversations this month", used: 1284, limit: "[__]" },
  { label: "Broadcast messages sent", used: 950, limit: "[__]" },
  { label: "Connected accounts", used: 2, limit: "[__]" },
];

export const metaFees = [
  { label: "Marketing messages", count: 310, cost: 7.75 },
  { label: "Utility messages (order updates)", count: 402, cost: 1.61 },
];

/* ---------------- Notifications ---------------- */

export type Notice = {
  id: string;
  kind: "handover" | "sale" | "summary" | "system" | "lead";
  title: string;
  text: string;
  time: string;
  href: string;
  unread: boolean;
};

export const notifications: Notice[] = [
  { id: "n1", kind: "handover", title: "Liam Davis needs you", text: "Wants a refund for a damaged necklace.", time: "34m ago", href: "/dashboard/inbox?c=v4", unread: true },
  { id: "n2", kind: "sale", title: "New sale from a DM", text: "Maya Lopez paid $89 for the Linen Wrap Dress.", time: "1h ago", href: "/dashboard/inbox?c=v1", unread: true },
  { id: "n3", kind: "summary", title: "Your night shift summary", text: "47 chats answered, 9 sales ($612) while you slept.", time: "8:00 AM", href: "/dashboard", unread: true },
  { id: "n4", kind: "lead", title: "18 new leads", text: "From the “DROP” comment automation.", time: "Yesterday", href: "/dashboard/marketing", unread: false },
  { id: "n5", kind: "handover", title: "Harper Moore needs you", text: "Asked for a custom engraving.", time: "4d ago", href: "/dashboard/inbox?c=v8", unread: false },
  { id: "n6", kind: "system", title: "Shopify synced", text: "6 products and 7 orders are up to date.", time: "4d ago", href: "/dashboard/settings?tab=store", unread: false },
];

/* ---------------- Analytics ---------------- */

export const funnel = [
  { step: "Conversations", value: 1284 },
  { step: "Asked about a product", value: 702 },
  { step: "Got a checkout link", value: 214 },
  { step: "Paid", value: 134 },
];

export const topQuestions = [
  { q: "Is it in stock in my size?", count: 212, pillar: "Sales" as Pillar },
  { q: "How long is shipping?", count: 168, pillar: "Sales" as Pillar },
  { q: "Where is my order?", count: 187, pillar: "Support" as Pillar },
  { q: "Can I return it?", count: 74, pillar: "Support" as Pillar },
  { q: "How do I enter the giveaway?", count: 61, pillar: "Marketing" as Pillar },
];

export const chatsByHour = [
  9, 6, 4, 3, 2, 2, 3, 6, 14, 22, 28, 31, 35, 30, 27, 29, 33, 41, 52, 64, 71, 66, 48, 21,
];
