import type { AvatarConfig } from '../../store/useApp';
import { AVATAR_EXTRAS } from '../../learning/rewards';

export function Avatar({ config, size = 64, className = '' }: { config: AvatarConfig; size?: number; className?: string }) {
  const extra = AVATAR_EXTRAS.find((e) => e.id === config.extra);
  return (
    <div className={`relative flex shrink-0 items-center justify-center rounded-full ring-4 ring-white shadow-weich ${className}`} style={{ width: size, height: size, background: config.color }} aria-hidden>
      <span className="emoji" style={{ fontSize: size * 0.58 }}>{config.animal}</span>
      {extra?.emoji && (
        <span className="emoji absolute" style={{ fontSize: size * 0.36, top: extra.id === 'brille' ? size * 0.3 : -size * 0.12, right: extra.id === 'brille' ? undefined : -size * 0.04 }}>
          {extra.emoji}
        </span>
      )}
    </div>
  );
}
