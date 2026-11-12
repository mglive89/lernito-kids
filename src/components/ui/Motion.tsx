import { Children, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView, useReducedMotion, type Variants } from 'framer-motion';

/**
 * Bewegung, die die Oberfläche lebendig macht – dezent und kurz.
 * Alles respektiert „Weniger Bewegung“ (Gerät oder Elternbereich) über <MotionConfig> in App.tsx.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Sanftes Einblenden einer ganzen Seite beim Wechsel. */
export function PageTransition({ id, children }: { id: string; children: ReactNode }) {
  return (
    <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease: EASE }}>
      {children}
    </motion.div>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: EASE } }
};

/** Raster/Liste, deren Einträge nacheinander erscheinen. */
export function Stagger({ children, className = '', as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }) {
  const M = as === 'ul' ? motion.ul : as === 'ol' ? motion.ol : motion.div;
  return <M className={className} variants={container} initial="hidden" animate="show">{children}</M>;
}

/** Eintrag in einem <Stagger>. */
export function StaggerItem({ children, className = '', as = 'div', ...rest }: { children: ReactNode; className?: string; as?: 'div' | 'li'; 'aria-label'?: string; 'data-testid'?: string }) {
  const M = as === 'li' ? motion.li : motion.div;
  return <M className={className} variants={item} {...rest}>{children}</M>;
}

/** Blendet einen Abschnitt ein, sobald er ins Bild scrollt. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -40px 0px' }} transition={{ duration: 0.45, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Zahl, die beim Erscheinen hochzählt (z. B. XP, Sterne). */
export function CountUp({ value, duration = 0.9, className }: { value: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView) return;
    if (reduce || value === 0) { setShown(value); return; }
    const c = animate(0, value, { duration, ease: EASE, onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [inView, value, duration, reduce]);
  return <span ref={ref} className={className}>{shown}</span>;
}

/** Raster, dessen Kinder automatisch nacheinander erscheinen. */
export function AnimatedGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Stagger className={className}>
      {Children.toArray(children).map((c, i) => (
        <StaggerItem key={isValidElement(c) && c.key != null ? c.key : i} className="h-full">{c}</StaggerItem>
      ))}
    </Stagger>
  );
}
