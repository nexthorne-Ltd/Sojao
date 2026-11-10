"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Plays the mascot clip on a WebGL canvas and, per frame:
 *  - re-colors the green accents (antennas, headset, cap trim, eyes, logo,
 *    shoe details) with the active theme's `--brand`;
 *  - keys out a solid magenta (#ff00ff) background, so a clip without an
 *    alpha channel still works. Clips with real transparency pass through.
 *
 * Calls `onReady` after the first frame is drawn and `onFail` when the clip
 * is missing or WebGL is unavailable, so the caller can show a fallback.
 */
export function MascotVideo({
  sources,
  className,
  onReady,
  onFail,
}: {
  sources: { src: string; type: string }[];
  className?: string;
  onReady?: () => void;
  onFail?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cb = useRef({ onReady, onFail });
  cb.current = { onReady, onFail };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const video = videoRef.current!;
    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      alpha: true,
    });
    if (!gl) {
      cb.current.onFail?.();
      return;
    }

    const prog = createProgram(gl);
    if (!prog) {
      cb.current.onFail?.();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const uBrand = gl.getUniformLocation(prog, "u_brand");
    const uScale = gl.getUniformLocation(prog, "u_scale");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // --- theme color, re-read whenever the theme class changes ---
    const readBrand = () => {
      const probe = document.createElement("canvas").getContext("2d")!;
      const raw =
        getComputedStyle(canvas).getPropertyValue("--brand").trim() ||
        "#39ff14";
      probe.fillStyle = raw;
      probe.fillRect(0, 0, 1, 1);
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
      gl.uniform3f(uBrand, r / 255, g / 255, b / 255);
    };
    readBrand();
    const mo = new MutationObserver(() => requestAnimationFrame(readBrand));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    // --- size the canvas to the element, video drawn "contain" ---
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const va = (video.videoWidth || 9) / (video.videoHeight || 16);
      const ca = canvas.width / canvas.height;
      gl.uniform2f(uScale, va > ca ? 1 : va / ca, va > ca ? ca / va : 1);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let ready = false;
    const draw = () => {
      if (video.readyState >= 2) {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          video,
        );
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (!ready) {
          ready = true;
          cb.current.onReady?.();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const onMeta = () => resize();
    const onError = () => cb.current.onFail?.();
    video.addEventListener("loadedmetadata", onMeta);
    // the last <source> failing means no playable clip
    const lastSource = video.querySelector("source:last-of-type");
    lastSource?.addEventListener("error", onError);
    video.addEventListener("error", onError);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      video.addEventListener("loadeddata", () => video.pause(), { once: true });
    } else {
      video.play().catch(() => {
        /* autoplay blocked: first frame still renders */
      });
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      ro.disconnect();
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("error", onError);
      lastSource?.removeEventListener("error", onError);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden
        className="hidden"
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn("size-full", className)}
      />
    </>
  );
}

const VERT = `
attribute vec2 a_pos;
uniform vec2 u_scale;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x, -a_pos.y) * 0.5 + 0.5;
  gl_Position = vec4(a_pos * u_scale, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec3 u_brand;
varying vec2 v_uv;
void main() {
  vec4 c = texture2D(u_tex, v_uv);
  vec3 col = c.rgb;
  float a = c.a;

  // key out magenta background (+ remove magenta spill on edges)
  float key = distance(col, vec3(1.0, 0.0, 1.0));
  a *= smoothstep(0.32, 0.55, key);
  float spill = max(0.0, min(col.r, col.b) - col.g);
  col -= vec3(spill, 0.0, spill) * 0.6;

  // re-color green accents with the theme brand, keeping their shading
  float green = col.g - max(col.r, col.b);
  float s = smoothstep(0.10, 0.32, green);
  vec3 tinted = u_brand * clamp(pow(col.g, 0.8) * 1.12, 0.0, 1.0);
  col = mix(col, tinted, s);

  gl_FragColor = vec4(col, a);
}`;

function createProgram(gl: WebGLRenderingContext) {
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}
