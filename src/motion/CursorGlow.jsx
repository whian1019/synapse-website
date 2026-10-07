import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import './CursorGlow.css';

/**
 * A soft pool of light that trails the mouse, tinted with the active
 * scene's ambient color. Purely decorative.
 *
 * Only shown for a real mouse (hover-capable, fine pointer) — on touch
 * devices there's no cursor to follow — and never under
 * prefers-reduced-motion.
 */
export default function CursorGlow() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  // the spring is what makes it trail behind the cursor instead of sticking to it
  const springX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduceMotion) return undefined;
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, x, y]);

  if (!enabled || reduceMotion) return null;

  return (
    <motion.div
      className="cursor-glow"
      style={{ x: springX, y: springY }}
      aria-hidden="true"
    />
  );
}
