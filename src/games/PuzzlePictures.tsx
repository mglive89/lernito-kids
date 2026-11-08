import type { PuzzlePicture } from '../learning/types';

/** Eigene, einfache Puzzle-Motive als SVG (300×300). */
export function PuzzleScene({ picture }: { picture: PuzzlePicture }) {
  switch (picture) {
    case 'lino':
      return (
        <g>
          <rect width="300" height="300" fill="#8ED1FC" />
          <circle cx="250" cy="50" r="30" fill="#FFD166" />
          <rect y="230" width="300" height="70" fill="#8EE3BF" />
          <g transform="translate(150 150)">
            <g fill="#FF8A3D">{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 80} cy={Math.sin(a) * 80} r="26" />; })}<circle r="90" /></g>
            <circle cx="-45" cy="-50" r="18" fill="#FFD166" /><circle cx="45" cy="-50" r="18" fill="#FFD166" />
            <ellipse rx="66" ry="60" fill="#FFD166" />
            <circle cx="-24" cy="-10" r="10" fill="#2B2D42" /><circle cx="24" cy="-10" r="10" fill="#2B2D42" />
            <ellipse cy="18" rx="22" ry="16" fill="#FFF1CC" /><path d="M-9 10 h18 l-9 10z" fill="#8B4513" />
            <path d="M-14 28 q14 14 28 0" stroke="#2B2D42" strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
        </g>
      );
    case 'haus':
      return (
        <g>
          <rect width="300" height="300" fill="#DDF1FF" />
          <rect y="220" width="300" height="80" fill="#38B000" />
          <circle cx="50" cy="50" r="28" fill="#FFD60A" />
          <rect x="80" y="130" width="140" height="110" fill="#FF6F59" />
          <path d="M65 135 L150 60 L235 135z" fill="#8E6CEF" />
          <rect x="135" y="180" width="32" height="60" fill="#8B5A2B" />
          <rect x="95" y="150" width="30" height="30" fill="#fff" stroke="#2B2D42" strokeWidth="3" />
          <rect x="178" y="150" width="30" height="30" fill="#fff" stroke="#2B2D42" strokeWidth="3" />
          <rect x="240" y="170" width="14" height="60" fill="#8B5A2B" /><circle cx="247" cy="160" r="30" fill="#2EC4B6" />
        </g>
      );
    case 'meer':
      return (
        <g>
          <rect width="300" height="300" fill="#3A86FF" />
          <rect width="300" height="110" fill="#8ED1FC" />
          <path d="M0 110 q25 -14 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 v20 h-300z" fill="#DDF1FF" />
          <path d="M110 70 L150 20 L150 80z" fill="#fff" /><path d="M95 80 h90 l-15 20 h-60z" fill="#FF6F59" />
          <g transform="translate(80 200)"><ellipse rx="34" ry="20" fill="#FFB627" /><path d="M30 0 l22 -16 v32z" fill="#FFB627" /><circle cx="-16" cy="-4" r="5" fill="#2B2D42" /></g>
          <g transform="translate(210 250)"><ellipse rx="28" ry="16" fill="#FF8FC7" /><path d="M-24 0 l-20 -12 v24z" fill="#FF8FC7" /><circle cx="12" cy="-3" r="4" fill="#2B2D42" /></g>
          <path d="M240 300 q-10 -40 10 -70 q-20 30 -5 70z" fill="#38B000" />
        </g>
      );
    case 'ballon':
      return (
        <g>
          <rect width="300" height="300" fill="#FFF1CC" />
          <circle cx="60" cy="240" r="40" fill="#FFFFFF" opacity="0.8" /><circle cx="250" cy="70" r="30" fill="#FFFFFF" opacity="0.8" />
          <ellipse cx="150" cy="110" rx="80" ry="90" fill="#FF6F59" />
          <path d="M110 30 q40 80 0 160" stroke="#FFD166" strokeWidth="14" fill="none" />
          <path d="M190 30 q-40 80 0 160" stroke="#3A9BDC" strokeWidth="14" fill="none" />
          <path d="M115 195 L130 235 M185 195 L170 235" stroke="#8B5A2B" strokeWidth="4" />
          <rect x="125" y="232" width="50" height="38" rx="6" fill="#C98B4B" />
        </g>
      );
  }
}
