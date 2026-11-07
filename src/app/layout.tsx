import { Fredoka, Inter } from "next/font/google";
import localFont from "next/font/local";

import type { Metadata } from "next";

import { StyleGlideProvider } from "@/components/styleglide-provider";
import { ThemePicker } from "@/components/theme-picker";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

const dmSans = localFont({
  src: [
    {
      path: "../../fonts/dm-sans/DMSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/dm-sans/DMSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../fonts/dm-sans/DMSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../fonts/dm-sans/DMSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: {
    default: "Sojao AI – Your business sleeps. Your customers don't.",
    template: "%s | Sojao AI",
  },
  description:
    "Never miss a sale in your DMs again. Sojao answers every customer on Instagram, Messenger and WhatsApp like your best salesperson, 24/7.",
  keywords: [
    "Instagram DM automation",
    "AI sales agent",
    "WhatsApp AI",
    "Facebook Messenger AI",
    "comment to DM",
    "ManyChat alternative",
    "Shopify AI chat",
    "small business customer support",
  ],
  authors: [{ name: "Nexthorne" }],
  creator: "Nexthorne",
  publisher: "Nexthorne",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
  openGraph: {
    title: "Sojao AI – Your business sleeps. Your customers don't.",
    description:
      "Never miss a sale in your DMs again. Sojao answers every customer like your best salesperson, 24/7.",
    siteName: "Sojao AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sojao AI – Your business sleeps. Your customers don't.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sojao AI – Your business sleeps. Your customers don't.",
    description:
      "Never miss a sale in your DMs again. Sojao answers every customer like your best salesperson, 24/7.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body className={`${dmSans.variable} ${inter.variable} ${fredoka.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          themes={[
            "light",
            "dark",
            "crimson",
            "toxic",
            "inferno",
            "neon",
            "electric",
            "cobalt",
          ]}
          disableTransitionOnChange
        >
          <StyleGlideProvider />
          {children}
          <ThemePicker />
        </ThemeProvider>
      </body>
    </html>
  );
}
