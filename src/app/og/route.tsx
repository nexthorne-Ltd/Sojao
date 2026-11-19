import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

/** Shared Open Graph image (1200×630) used by every public page. */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f3ead6",
          color: "#111111",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 56, fontWeight: 700 }}>
          <span>sojao</span>
          <span style={{ color: "#db5227", marginLeft: 14 }}>ai</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Your business sleeps.
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, color: "#db5227" }}>
            Your customers don&apos;t.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#3d3a33" }}>
          <span>AI marketing for Instagram-first brands · Now in beta</span>
          <span>A product of {siteConfig.legalName}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
