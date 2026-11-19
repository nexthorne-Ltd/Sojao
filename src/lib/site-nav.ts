import {
  BookOpen,
  Bot,
  Gift,
  HelpCircle,
  LayoutTemplate,
  Map,
  Megaphone,
  Plug,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  UserPlus,
} from "lucide-react";
import { FaFacebookMessenger as MessageCircle, FaInstagram as Instagram, FaWhatsapp as MessagesSquare } from "react-icons/fa";

export type NavLink = {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
};

export type NavGroup = { label: string; links: NavLink[] };

export type NavItem =
  | { label: string; href: string }
  | { label: string; groups: NavGroup[]; feature?: { title: string; text: string; href: string; cta: string } };

/**
 * Site navigation, shared by the header (mega menus) and the footer.
 * Only list what is live; anything not shipped carries a "Soon" badge and
 * points to the roadmap.
 */
export const NAV: NavItem[] = [
  {
    label: "Product",
    groups: [
      {
        label: "Channels",
        links: [
          { title: "Instagram", href: "/instagram", description: "Comments, story replies, mentions and DMs", icon: Instagram },
          { title: "Messenger", href: "/messenger", description: "Facebook Page conversations", icon: MessageCircle, badge: "Soon" },
          { title: "WhatsApp", href: "/roadmap", description: "On the roadmap", icon: MessagesSquare, badge: "Soon" },
        ],
      },
      {
        label: "Platform",
        links: [
          { title: "AI agent", href: "/ai-agent", description: "Replies from your brand profile, never made up", icon: Bot },
          { title: "All features", href: "/features", description: "Every automation, in one place", icon: Sparkles },
          { title: "Integrations", href: "/integrations", description: "Shopify, website widget, CSV and more", icon: Plug },
        ],
      },
    ],
    feature: {
      title: "Marketing is live in beta",
      text: "Free while we're in beta. No card needed.",
      href: "/signup",
      cta: "Join the beta",
    },
  },
  {
    label: "Solutions",
    groups: [
      {
        label: "By goal",
        links: [
          { title: "Turn comments into leads", href: "/use-cases#leads", description: "Comment-to-DM with lead capture", icon: UserPlus },
          { title: "Launch a drop", href: "/use-cases#drops", description: "Links, alerts and broadcasts", icon: Megaphone },
          { title: "Run a giveaway", href: "/use-cases#giveaways", description: "Collect entries, message everyone", icon: Gift },
          { title: "Win customers back", href: "/use-cases#winback", description: "Bring quiet buyers back", icon: RefreshCcw },
        ],
      },
      {
        label: "By business",
        links: [
          { title: "Fashion and accessories", href: "/use-cases#industries", icon: ShoppingBag },
          { title: "Beauty and skincare", href: "/use-cases#industries", icon: Sparkles },
          { title: "Instagram sellers", href: "/use-cases#industries", icon: Store },
        ],
      },
    ],
  },
  { label: "Templates", href: "/templates" },
  {
    label: "Resources",
    groups: [
      {
        label: "Learn",
        links: [
          { title: "Guides", href: "/guides", description: "How each automation works, step by step", icon: BookOpen },
          { title: "FAQ", href: "/faq", description: "Quick answers", icon: HelpCircle },
          { title: "Templates", href: "/templates", description: "Ready-made flows to switch on", icon: LayoutTemplate },
        ],
      },
      {
        label: "Company",
        links: [
          { title: "Roadmap", href: "/roadmap", description: "What's live and what's next", icon: Map },
          { title: "Security", href: "/security", description: "How we keep data safe", icon: ShieldCheck },
          { title: "About us", href: "/about", description: "Why we built Sojao", icon: Sparkles },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
];

/** Footer columns. */
export const FOOTER_COLUMNS: NavGroup[] = [
  {
    label: "Product",
    links: [
      { title: "Instagram", href: "/instagram" },
      { title: "Messenger", href: "/messenger", badge: "Soon" },
      { title: "AI agent", href: "/ai-agent" },
      { title: "All features", href: "/features" },
      { title: "Integrations", href: "/integrations" },
      { title: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { title: "Use cases", href: "/use-cases" },
      { title: "Comments to leads", href: "/use-cases#leads" },
      { title: "Product drops", href: "/use-cases#drops" },
      { title: "Giveaways", href: "/use-cases#giveaways" },
      { title: "Win-back", href: "/use-cases#winback" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Templates", href: "/templates" },
      { title: "Guides", href: "/guides" },
      { title: "FAQ", href: "/faq" },
      { title: "Roadmap", href: "/roadmap" },
      { title: "Security", href: "/security" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "About us", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "Log in", href: "/login" },
      { title: "Join the beta", href: "/signup" },
    ],
  },
];
