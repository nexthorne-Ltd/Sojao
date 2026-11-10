import { ImageResponse } from "next/og";

import { BrandMark } from "@/components/brand-mark";

export const alt = "Sojao AI – Your business sleeps. Your customers don't.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "#ffffff",
          background:
            "radial-gradient(circle at 85% 15%, #0e5a6b 0%, #0b1426 55%, #070d1a 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <BrandMark size={88} />
          <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
            Sojao AI
          </div>
          <div
            style={{
              marginLeft: 16,
              padding: "6px 18px",
              borderRadius: 999,
              border: "2px solid #22d3ee",
              color: "#22d3ee",
              fontSize: 26,
            }}
          >
            Beta
          </div>
        </div>
        <div
          style={{
            marginTop: 56,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Your business sleeps.</span>
          <span style={{ color: "#22d3ee" }}>Your customers don&apos;t.</span>
        </div>
        <div style={{ marginTop: 36, fontSize: 30, color: "#b6c2d1" }}>
          AI that answers your DMs on Instagram, Messenger and WhatsApp, 24/7.
        </div>
      </div>
    ),
    size,
  );
}
