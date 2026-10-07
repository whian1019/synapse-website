import { motion, useReducedMotion } from 'framer-motion';
import { useScrub } from './useSceneProgress.js';
import './LineReveal.css';

/**
 * One line: a clipping mask with the text rising up through it.
 */
function ScrubLine({ children, progress, start, end, className }) {
  const y = useScrub(progress, [start, end], ['108%', '0%']);
  const rotate = useScrub(progress, [start, end], [5, 0]);
  return (
    <span className={`line-reveal__mask${className ? ` ${className}` : ''}`}>
      <motion.span className="line-reveal__inner" style={{ y, rotate }}>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * A headline set as hand-broken lines, each rising out of its own mask —
 * the lines are designed (passed in explicitly), not left to wrap wherever
 * the browser decides, so the composition holds at every size.
 *
 * Two modes:
 *   scroll-scrubbed — pass `progress` (0..1 motion value, e.g. `enter` or
 *     `pin` from useSceneProgress) and the lines rise one after another
 *     between `from` and `to`, and sink back when scrolling up;
 *   on load — pass `auto` instead, and the lines rise once with a staggered
 *     CSS animation (`delay` seconds before the first line).
 *
 * `lines` is an array whose items are either a string/node, or
 * `{ content, className }` to style one line differently (an accent line).
 *
 * The text stays real, unsplit text, so screen readers read it normally.
 * Under prefers-reduced-motion nothing moves (the scrub values rest at their
 * end state and the CSS animation is collapsed by the global rule).
 */
export default function LineReveal({
  lines,
  progress,
  from = 0,
  to = 1,
  auto = false,
  delay = 0,
  className = '',
}) {
  const reduceMotion = useReducedMotion();
  const items = lines.map((line) =>
    typeof line === 'object' && line !== null && 'content' in line
      ? line
      : { content: line, className: '' }
  );

  if (auto || !progress) {
    return (
      <span className={`line-reveal${className ? ` ${className}` : ''}`}>
        {items.map((line, i) => (
          <span
            key={i}
            className={`line-reveal__mask${line.className ? ` ${line.className}` : ''}`}
          >
            <span
              className={`line-reveal__inner${reduceMotion ? '' : ' line-reveal__inner--auto'}`}
              style={{ '--line-delay': `${delay + i * 0.12}s` }}
            >
              {line.content}
            </span>
          </span>
        ))}
      </span>
    );
  }

  // Each line gets a window; consecutive windows overlap so the lines chase
  // each other up instead of taking strict turns.
  const span = to - from;
  const step = span / (items.length + 1);

  return (
    <span className={`line-reveal${className ? ` ${className}` : ''}`}>
      {items.map((line, i) => (
        <ScrubLine
          key={i}
          progress={progress}
          start={from + step * i}
          end={from + step * (i + 2)}
          className={line.className}
        >
          {line.content}
        </ScrubLine>
      ))}
    </span>
  );
}
