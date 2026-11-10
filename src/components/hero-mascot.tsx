"use client";

import { useEffect, useId, useState } from "react";

import { MascotVideo } from "@/components/mascot-video";
import { cn } from "@/lib/utils";

type Pose = "write" | "think" | "happy";

/** One loop of the mascot's routine: write, pause to think, finish, celebrate. */
const ROUTINE: { pose: Pose; ms: number; label: string }[] = [
  { pose: "write", ms: 4200, label: "Replying to a DM…" },
  { pose: "think", ms: 2800, label: "Thinking…" },
  { pose: "write", ms: 3000, label: "Sending a checkout link…" },
  { pose: "happy", ms: 2800, label: "Sale closed!" },
];

/**
 * The art is split into three layers cut from the same 384x672 canvas
 * (body, head, pen hand) so the head and hand can move on their own.
 * Each layer's green accents are neutral in the image and re-colored with
 * the active theme's `--brand` through a multiply layer masked by the
 * matching `-accent.png`.
 */
function Layer({ name }: { name: "body" | "head" | "hand" }) {
  const mask = `url(/mascot/mascot-${name}-accent.png)`;
  return (
    <div className="absolute inset-0 isolate">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/mascot/mascot-${name}.webp`}
        alt=""
        draggable={false}
        className="absolute inset-0 size-full"
      />
      <div
        className="bg-brand absolute inset-0 mix-blend-multiply transition-colors duration-500"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      />
    </div>
  );
}

// eyes in source pixels: [cx, cy, rx, ry]
const EYES = [
  [153, 195, 34, 28],
  [255, 172, 29, 26],
] as const;

/** Drop the generated clip(s) here; see docs/mascot-video.md. */
const MASCOT_VIDEO = [
  { src: "/mascot/mascot.webm", type: "video/webm" },
  { src: "/mascot/mascot.mp4", type: "video/mp4" },
];

export function HeroMascot({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const [step, setStep] = useState(0);
  // real animated clip when present; the layered art is the fallback
  const [video, setVideo] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    const t = setTimeout(() => {
      setStep((step + 1) % ROUTINE.length);
    }, ROUTINE[step].ms);
    return () => clearTimeout(t);
  }, [step]);

  const { pose, label } = ROUTINE[step];

  return (
    <div
      className={cn("relative select-none", className)}
      role="img"
      aria-label="Sojao AI mascot"
    >
      {/* soft brand glow behind the character */}
      <div
        aria-hidden
        className="absolute inset-x-[-10%] top-[0%] bottom-[10%] -z-10 rounded-full opacity-40 blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--brand), color-mix(in oklch, var(--glow) 60%, transparent) 60%, transparent)",
        }}
      />

      <div data-pose={pose} className="mascot-float relative w-full">
        {/* face crop: x 44–364, y -10–300 of the 384x672 art, faded at the neck */}
        <div
          className="relative aspect-[320/310] w-full"
          style={{
            maskImage: "linear-gradient(to bottom, black 84%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 84%, transparent)",
          }}
        >
          <div className="absolute top-[3.2%] left-[-13.75%] aspect-[384/672] w-[120%]">
            {video !== "failed" && (
              <MascotVideo
                sources={MASCOT_VIDEO}
                onReady={() => setVideo("ready")}
                onFail={() => setVideo("failed")}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  video === "ready" ? "opacity-100" : "opacity-0",
                )}
              />
            )}
            <div
              data-pose={pose}
              className={cn(
                "hm-stage absolute inset-0 transition-opacity duration-500",
                video === "ready" && "invisible opacity-0",
              )}
            >
              <Layer name="body" />

              {/* head + eyelids */}
              <div className="hm-head absolute inset-0">
                <div className="hm-head-inner absolute inset-0">
                  <Layer name="head" />
                  <svg
                    aria-hidden
                    viewBox="0 0 384 672"
                    className="absolute inset-0 size-full"
                  >
                    <defs>
                      <linearGradient
                        id={`${id}-lid`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#3d5f84" />
                        <stop offset="88%" stopColor="#5a80a9" />
                        <stop offset="100%" stopColor="#1c2b3c" />
                      </linearGradient>
                      {EYES.map(([cx, cy, rx, ry], i) => (
                        <clipPath key={i} id={`${id}-eye${i}`}>
                          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
                        </clipPath>
                      ))}
                    </defs>
                    {EYES.map(([cx, cy, rx, ry], i) => (
                      <g key={i} clipPath={`url(#${id}-eye${i})`}>
                        <rect
                          x={cx - rx - 2}
                          y={cy - ry - 2}
                          width={rx * 2 + 4}
                          height={ry * 2 + 4}
                          fill={`url(#${id}-lid)`}
                          className="hm-lid"
                        />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* thought bubble */}
        <div
          aria-hidden
          className={cn(
            "hm-thought pointer-events-none absolute top-[-6%] left-[86%]",
            video === "ready" && "hidden",
          )}
        >
          <span className="bg-background absolute top-[34px] left-0 size-1.5 rounded-full border shadow-sm" />
          <span className="bg-background absolute top-[22px] left-[6px] size-2.5 rounded-full border shadow-sm" />
          <span className="bg-background absolute top-0 left-[12px] flex items-center gap-0.5 rounded-full border px-2 py-1.5 shadow-md">
            <span className="mascot-dot bg-brand size-1.5 rounded-full" />
            <span className="mascot-dot bg-brand size-1.5 rounded-full [animation-delay:150ms]" />
            <span className="mascot-dot bg-brand size-1.5 rounded-full [animation-delay:300ms]" />
          </span>
        </div>

        {/* celebration sparkles */}
        <div
          aria-hidden
          className={cn(
            "hm-sparkles pointer-events-none absolute inset-0",
            video === "ready" && "hidden",
          )}
        >
          <span className="text-brand absolute top-[10%] left-[-12%] text-sm">
            ✦
          </span>
          <span className="text-brand absolute top-[-4%] right-[-10%] text-xs [animation-delay:120ms]">
            ✦
          </span>
          <span className="text-brand absolute top-[55%] right-[-18%] text-sm [animation-delay:240ms]">
            ✦
          </span>
        </div>
      </div>

      {/* status chip */}
      <div className="bg-background/90 mx-auto mt-4 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap shadow-sm backdrop-blur">
        <span className="relative flex size-2">
          <span className="bg-brand absolute inline-flex size-full animate-ping rounded-full opacity-60" />
          <span className="bg-brand relative inline-flex size-2 rounded-full" />
        </span>
        <span
          key={step}
          className="animate-in fade-in slide-in-from-bottom-1 duration-300"
        >
          {label}
        </span>
      </div>
    </div>
  );
}
