/** Eigenes Zeichen von MathLens: Lupe mit „x“ und Gleichheitszeichen. */
export function LensLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs><linearGradient id="ml-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1E3A8A" /><stop offset="1" stopColor="#0E7490" /></linearGradient></defs>
      <rect width="64" height="64" rx="16" fill="url(#ml-g)" />
      <circle cx="28" cy="28" r="15" fill="none" stroke="#fff" strokeWidth="5" />
      <path d="M39 39 L50 50" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
      <path d="M22 22 L34 34 M34 22 L22 34" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
