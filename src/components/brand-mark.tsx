/**
 * The sleepy-face mark from the Sojao AI logo, as plain SVG elements so it
 * can be rendered by next/og (favicon, Apple touch icon, Open Graph image).
 */
export function BrandMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#76828e" />
      <circle cx="50" cy="53" r="35" fill="#e4e9ee" />
      <path
        d="M15 50 C15 26 31 16 50 16 C69 16 85 26 85 50 C76 47 68 40 64 32 C58 41 46 46 33 46 C27 46 21 48 15 50 Z"
        fill="#14171d"
      />
      <path d="M30 62 Q37 68 44 62" fill="none" stroke="#14171d" strokeWidth="4" strokeLinecap="round" />
      <path d="M56 62 Q63 68 70 62" fill="none" stroke="#14171d" strokeWidth="4" strokeLinecap="round" />
      <path d="M46 76 Q50 78 54 76" fill="none" stroke="#14171d" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
