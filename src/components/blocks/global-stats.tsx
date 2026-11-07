"use client";

import { useEffect, useRef } from "react";

import createGlobe from "cobe";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

type RGB = [number, number, number];

/** Resolve any CSS color (oklch, lab, hex, var()) to 0..1 RGB using a 1px canvas. */
function cssVarToRgb(name: string, fallback: RGB): RGB {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!raw) return fallback;
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d");
  if (!ctx) return fallback;
  ctx.fillStyle = "#000";
  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const MARKERS: { location: [number, number]; size: number }[] = [
  { location: [40.71, -74.0], size: 0.025 }, // New York
  { location: [37.77, -122.42], size: 0.02 }, // San Francisco
  { location: [19.43, -99.13], size: 0.02 }, // Mexico City
  { location: [-23.55, -46.63], size: 0.02 }, // São Paulo
  { location: [51.5, -0.12], size: 0.025 }, // London
  { location: [64.14, -21.94], size: 0.015 }, // Reykjavik
  { location: [24.86, 67.0], size: 0.025 }, // Karachi
  { location: [25.2, 55.27], size: 0.02 }, // Dubai
  { location: [1.35, 103.82], size: 0.02 }, // Singapore
  { location: [35.68, 139.69], size: 0.02 }, // Tokyo
];

function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    if (!canvas || !grid) return;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let raf = 0;
    let phi = 4.4; // start facing the Americas, like the reference
    const theta = 0.3;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // wait one frame so next-themes has applied the new theme class
    const start = requestAnimationFrame(() => {
      const isLight = resolvedTheme === "light";
      const bg = cssVarToRgb("--background", [0, 0, 0]);
      const fg = cssVarToRgb("--foreground", [1, 1, 1]);
      const brand = cssVarToRgb("--brand", [0.86, 0.32, 0.15]);
      const primary = cssVarToRgb("--primary", brand);
      const accent = isLight ? brand : primary;

      // brighter bg (e.g. navy) needs more dot contrast than near-black
      const bgLum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2];
      const dotMix = isLight ? 0.1 : Math.min(0.2 + bgLum * 2, 0.45);

      const size = canvas.offsetWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi,
        theta,
        dark: isLight ? 0 : 1,
        diffuse: isLight ? 1.2 : 0.6,
        mapSamples: 9000,
        mapBrightness: isLight ? 2 : 4,
        mapBaseBrightness: 0,
        baseColor: mix(bg, fg, dotMix),
        markerColor: mix(accent, fg, 0.3),
        markerElevation: 0,
        glowColor: isLight ? mix(bg, accent, 0.12) : mix(bg, accent, 0.1),
        markers: MARKERS,
        opacity: isLight ? 0.85 : 0.75,
      });

      // lat/long wireframe drawn on a 2D canvas, rotated in sync with the globe
      const g = grid.getContext("2d")!;
      grid.width = size * dpr;
      grid.height = size * dpr;
      const lineColor = `rgba(${fg.map((v) => Math.round(v * 255)).join(",")},${isLight ? 0.14 : 0.1})`;

      const drawGrid = () => {
        const W = grid.width;
        const R = W * 0.4; // cobe draws the sphere at ~80% of the canvas
        const cx = W / 2;
        const cy = W / 2;
        g.clearRect(0, 0, W, W);
        g.strokeStyle = lineColor;
        g.lineWidth = 1 * dpr;

        const project = (lat: number, lon: number) => {
          const la = (lat * Math.PI) / 180;
          const lo = (lon * Math.PI) / 180 - phi;
          const x = Math.cos(la) * Math.sin(lo);
          const y0 = Math.sin(la);
          const z0 = Math.cos(la) * Math.cos(lo);
          // tilt around X by theta
          const y = y0 * Math.cos(theta) - z0 * Math.sin(theta);
          const z = y0 * Math.sin(theta) + z0 * Math.cos(theta);
          return { x: cx + x * R, y: cy - y * R, front: z > 0 };
        };

        const stroke = (pts: { x: number; y: number; front: boolean }[]) => {
          g.beginPath();
          let pen = false;
          for (const p of pts) {
            if (!p.front) {
              pen = false;
              continue;
            }
            if (pen) g.lineTo(p.x, p.y);
            else g.moveTo(p.x, p.y);
            pen = true;
          }
          g.stroke();
        };

        for (let lon = 0; lon < 360; lon += 30) {
          const pts = [];
          for (let lat = -90; lat <= 90; lat += 3) pts.push(project(lat, lon));
          stroke(pts);
        }
        for (let lat = -60; lat <= 60; lat += 30) {
          const pts = [];
          for (let lon = 0; lon <= 360; lon += 3) pts.push(project(lat, lon));
          stroke(pts);
        }
        // outline
        g.beginPath();
        g.arc(cx, cy, R, 0, Math.PI * 2);
        g.stroke();
      };

      const tick = () => {
        if (!reduceMotion) phi += 0.0022;
        globe?.update({ phi });
        drawGrid();
        raf = requestAnimationFrame(tick);
      };
      tick();

      requestAnimationFrame(() => (canvas.style.opacity = "1"));
    });

    return () => {
      cancelAnimationFrame(start);
      cancelAnimationFrame(raf);
      globe?.destroy();
      canvas.style.opacity = "0";
    };
  }, [resolvedTheme]);

  return (
    <div className="relative aspect-square w-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-1000"
      />
      <canvas ref={gridRef} className="absolute inset-0 size-full" />
    </div>
  );
}

export function GlobalStats() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="container">
        <div className="relative mx-auto max-w-5xl">
          {/* globe, partly hidden behind the glass card */}
          <div className="pointer-events-none relative mx-auto -mb-[28%] w-[min(100%,620px)] md:-mb-[30%]">
            <Globe />
          </div>

          {/* glass card */}
          <div className="bg-card/35 relative overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl">
            {/* soft color washes like the reference */}
            <div className="bg-glow/25 pointer-events-none absolute -top-24 left-1/2 h-56 w-2/3 -translate-x-1/2 rounded-full blur-3xl" />
            <div className="bg-foreground/5 pointer-events-none absolute -top-10 -left-10 h-40 w-72 rounded-full blur-2xl" />
            <div className="bg-foreground/5 pointer-events-none absolute -right-10 -bottom-10 h-40 w-72 rounded-full blur-2xl" />

            <div className="relative grid gap-10 px-8 py-12 md:grid-cols-2 md:px-12 md:py-16">
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl leading-[1.1] tracking-tight md:text-5xl">
                  Sleep tight.
                  <br />
                  Sojao&apos;s got the{" "}
                  <em className="font-normal italic">night shift</em>.
                </h2>
                <div className="mt-8">
                  <Button className="rounded-full px-5" asChild>
                    <a href="/#feature-modern-teams">See how it works</a>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-brand flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                  <span className="relative flex size-2">
                    <span className="bg-brand absolute inline-flex size-full animate-ping rounded-full opacity-60" />
                    <span className="bg-brand relative inline-flex size-2 rounded-full" />
                  </span>
                  Always on · Instagram, Messenger and WhatsApp
                </p>
                <p className="font-display mt-4 text-5xl tracking-tight md:text-6xl">
                  24/7
                </p>
                <p className="text-muted-foreground mt-3 text-sm">
                  Every DM answered, day and night. Even when you&apos;re
                  asleep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
