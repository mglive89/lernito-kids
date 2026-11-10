import type { ReactNode } from 'react';

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' | 'ok' }) {
  const cls = tone === 'warn' ? 'bg-koralle-50 border-koralle-300' : tone === 'ok' ? 'bg-minze-50 border-minze-300' : 'bg-himmel-50 border-himmel-300';
  return <div className={`rounded-2xl border px-4 py-3 text-base ${cls}`}>{children}</div>;
}

export function Toggle({ checked, onChange, label, description, disabled, testId }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: ReactNode; disabled?: boolean; testId?: string }) {
  return (
    <label className={`flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-tinte/[0.06] ${disabled ? 'opacity-60' : ''}`}>
      <span>
        <span className="block text-lg font-bold">{label}</span>
        {description && <span className="block text-sm text-tinte/70">{description}</span>}
      </span>
      <input type="checkbox" role="switch" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} data-testid={testId} />
      <span className={`relative mt-1 h-8 w-14 shrink-0 rounded-full transition ${checked ? 'bg-minze-500' : 'bg-tinte/20'} peer-focus-visible:outline peer-focus-visible:outline-4 peer-focus-visible:outline-himmel-500`} aria-hidden>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${checked ? 'left-7' : 'left-1'}`} />
      </span>
    </label>
  );
}
