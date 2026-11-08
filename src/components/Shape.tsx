import type { ShapeName } from '../learning/types';

export function shapePath(shape: ShapeName): string {
  switch (shape) {
    case 'kreis': return 'M50 8 a42 42 0 1 0 0.01 0z';
    case 'quadrat': return 'M12 12 h76 v76 h-76z';
    case 'dreieck': return 'M50 8 L92 88 H8z';
    case 'rechteck': return 'M4 24 h92 v52 h-92z';
    case 'stern': return 'M50 5 L61 37 L95 37 L67 57 L78 90 L50 70 L22 90 L33 57 L5 37 L39 37z';
    case 'herz': return 'M50 88 C10 60 4 38 18 22 C30 9 46 14 50 28 C54 14 70 9 82 22 C96 38 90 60 50 88z';
    case 'oval': return 'M50 18 C80 18 96 34 96 50 C96 66 80 82 50 82 C20 82 4 66 4 50 C4 34 20 18 50 18z';
    case 'raute': return 'M50 4 L92 50 L50 96 L8 50z';
  }
}

export function Shape({ shape, color = '#3A9BDC', size = 80, outline = false, label }: { shape: ShapeName; color?: string; size?: number; outline?: boolean; label?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <path
        d={shapePath(shape)}
        fill={outline ? 'rgba(43,45,66,0.12)' : color}
        stroke={outline ? 'rgba(43,45,66,0.45)' : 'rgba(0,0,0,0.15)'}
        strokeWidth={outline ? 4 : 3}
        strokeDasharray={outline ? '8 6' : undefined}
        strokeLinejoin="round"
      />
    </svg>
  );
}
