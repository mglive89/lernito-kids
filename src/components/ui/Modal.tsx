import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { L } from '../../i18n';

export function Modal({ open, onClose, title, children, labelledBy = 'modal-titel' }: { open: boolean; onClose?: () => void; title: string; children: ReactNode; labelledBy?: string }) {
  useEffect(() => {
    if (!open || !onClose) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-tinte/40 p-3 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby={labelledBy}
            className="karte max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
            initial={{ y: 40, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, opacity: 0 }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 id={labelledBy} className="font-display text-2xl font-bold">{title}</h2>
              {onClose && <button className="rounded-full p-2 hover:bg-tinte/5" onClick={onClose} aria-label={L('Schließen', 'Chiudi')}><X /></button>}
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
