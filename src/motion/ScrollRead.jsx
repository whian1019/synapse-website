import { motion } from 'framer-motion';
import { useScrub } from './useSceneProgress.js';
import './ScrollRead.css';

/** One word: dim until the scroll reaches it, then fully lit. */
function Word({ children, progress, start, end }) {
  const opacity = useScrub(progress, [start, end], [0.16, 1]);
  return (
    <motion.span className="scroll-read__word" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

/**
 * A paragraph that "reads itself" as the visitor scrolls: every word starts
 * dim and lights up in turn, so the sentence is revealed at reading pace by
 * the scrollbar (and dims again when scrolling back up).
 *
 * @param {object} props
 * @param {string} props.text
 * @param {import('framer-motion').MotionValue<number>} props.progress
 *   0..1 scroll progress (e.g. `pin` from useSceneProgress)
 * @param {number} [props.from=0]  progress at which the first word lights
 * @param {number} [props.to=1]    progress at which the last word is lit
 * @param {string} [props.className]
 *
 * The words stay real text in normal order (only their opacity changes), so
 * screen readers read the paragraph as usual. Under prefers-reduced-motion
 * every word is simply fully lit.
 */
export default function ScrollRead({ text, progress, from = 0, to = 1, className = '' }) {
  const words = text.split(' ');
  // each word's window is a few words wide, so the light sweeps smoothly
  const OVERLAP = 3;
  const step = (to - from) / (words.length + OVERLAP - 1);

  return (
    <span className={`scroll-read${className ? ` ${className}` : ''}`}>
      {words.map((word, i) => (
        <span key={i}>
          <Word
            progress={progress}
            start={from + step * i}
            end={from + step * (i + OVERLAP)}
          >
            {word}
          </Word>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
