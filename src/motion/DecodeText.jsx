import { useCallback, useEffect, useRef } from 'react';
import { useMotionValueEvent, useReducedMotion } from 'framer-motion';
import './DecodeText.css';

// Glyphs shown while a character is still "decoding". Kept to letters and
// digits of ordinary width so the line doesn't jump around too much.
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
const LOWER = 'abcdefghjkmnopqrstuvwxyz0123456789';

// How far ahead of its own resolve point (in 0..1 text progress) a character
// starts flickering through random glyphs.
const SCRAMBLE_LEAD = 0.32;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * Text that "decodes" as the visitor scrolls: each character flickers
 * through random glyphs in the accent color, then locks into the real
 * letter, sweeping left to right. Scrubbed directly by a scroll progress
 * value, so scrolling back up scrambles it again.
 *
 * Meant for short Latin titles and labels (project names, numbers).
 *
 * @param {object} props
 * @param {string} props.text
 * @param {import('framer-motion').MotionValue<number>} props.progress
 *   0..1 scroll progress (e.g. `enter` or `pin` from useSceneProgress)
 * @param {number} [props.from=0]  progress at which decoding starts
 * @param {number} [props.to=1]    progress at which the last letter locks in
 * @param {string} [props.className]
 *
 * The characters are written straight to the DOM on scroll (no React
 * re-render per frame). Accessibility: the real text is rendered once,
 * visually hidden, for screen readers; the animated characters are
 * aria-hidden. Under prefers-reduced-motion the plain text is rendered.
 */
export default function DecodeText({ text, progress, from = 0, to = 1, className = '' }) {
  const reduceMotion = useReducedMotion();
  const spans = useRef([]);
  const chars = Array.from(text);

  const paint = useCallback(
    (value) => {
      const letters = Array.from(text);
      const t = clamp01((value - from) / (to - from));
      // changes a few dozen times across the reveal, re-rolling the glyphs
      const tick = Math.floor(value * 160);
      const total = letters.length;

      for (let i = 0; i < total; i++) {
        const el = spans.current[i];
        const real = letters[i];
        if (!el || real === ' ') continue;

        // character i locks in at this point of the text's progress
        const resolveAt = ((i + 1) / total) * (1 - 0.08) + 0.08;

        if (t >= resolveAt) {
          if (el.dataset.state !== 'done') {
            el.textContent = real;
            el.dataset.state = 'done';
          }
        } else if (t > resolveAt - SCRAMBLE_LEAD && t > 0) {
          const pool = real === real.toLowerCase() && real !== real.toUpperCase() ? LOWER : UPPER;
          // cheap deterministic hash of (character index, tick)
          const pick = Math.abs(Math.sin(i * 12.9898 + tick * 78.233) * 43758.5453);
          el.textContent = pool[Math.floor(pick) % pool.length];
          el.dataset.state = 'scramble';
        } else if (el.dataset.state !== 'hidden') {
          // not reached yet: keep the real letter in place (so the line's
          // width is stable) but invisible
          el.textContent = real;
          el.dataset.state = 'hidden';
        }
      }
    },
    [text, from, to]
  );

  useMotionValueEvent(progress, 'change', paint);

  // paint once on mount (and whenever the text or range changes) so the
  // initial state matches wherever the page happens to be scrolled
  useEffect(() => {
    if (!reduceMotion) paint(progress.get());
  }, [paint, progress, reduceMotion]);

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`decode-text${className ? ` ${className}` : ''}`}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {chars.map((char, i) => (
          <span
            key={i}
            className="decode-text__char"
            data-state="hidden"
            ref={(el) => {
              spans.current[i] = el;
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
