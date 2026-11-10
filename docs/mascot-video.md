# Mascot video

The hero plays `public/mascot/mascot.webm` (or `.mp4`) when it exists.
Until then it shows the layered fallback animation (`mascot-*.webp`).

The player re-colors the **green** accents with the selected theme color and
removes a **solid magenta (#FF00FF)** background, so:

- keep the mascot's accents green (like the original art);
- use a magenta background, or a transparent one. **Never green-screen**: it
  would be re-colored instead of removed.

## 1. Generate the clip

Tool: Kling, Runway (Gen-4), Pika, Hailuo or Veo, using **image-to-video**.
Upload the original mascot image (the PNG/WebP with green accents) as the
first frame.

Settings: 9:16 (portrait), 5–8 s, highest quality, camera **static**.

Prompt:

```
The 3D cartoon alien mascot stands in place on a solid flat magenta (#FF00FF)
background. Static camera, full body always in frame, no zoom, no cuts.
He looks down at the tablet in his right hand and writes on it with the pen
in his left hand, small natural hand strokes. Then he pauses, lifts the pen
to his chin and looks up thinking, eyes moving. Then he smiles happily,
gives a small satisfied nod and a little bounce. Smooth, subtle, loopable
motion; ends in the same pose as the first frame. Keep all colors, outfit,
logo and green accents exactly the same. No text, no extra objects.
```

Negative prompt (if the tool has one):

```
camera movement, zoom, background change, green background, extra limbs,
distorted hands, changing outfit, changing colors, text, watermark
```

If the tool has an **end frame** option, upload the same image again as the
last frame so the loop is seamless.

## 2. Optional: transparent background

If the background is not clean magenta, remove it with a video background
remover (Runway "Remove Background", Unscreen, CapCut) and export with
transparency (WebM VP9 alpha or ProRes 4444 `.mov`).

## 3. Convert and drop in

Save the downloaded clip as `raw.mp4` (or `raw.mov`) and run from the project
root:

```bash
ffmpeg -i raw.mp4 -an -vf "scale=-2:900,fps=30" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 32 public/mascot/mascot.webm
```

```bash
ffmpeg -i raw.mp4 -an -vf "scale=-2:900,fps=30" -c:v libx264 -pix_fmt yuv420p -crf 23 -movflags +faststart public/mascot/mascot.mp4
```

Reload the site; the video replaces the fallback automatically.
