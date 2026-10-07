import { useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Ties opacity / vertical offset / scale directly to how far an element
 * has scrolled through the viewport, instead of a fixed-duration
 * "whileInView" animation that fires once and is done. The element keeps
 * responding to scroll position the whole time it's near the viewport —
 * that continuous relationship is what makes scrolling itself feel
 * cinematic, rather than just triggering a canned transition.
 *
 * Usage: create the ref yourself and pass it in, so it can be attached to
 * the element with a plain `ref={myRef}` — this hook only derives style
 * values from it, it doesn't own or return the ref.
 *
 *   const headingRef = useRef(null);
 *   const headingStyle = useScrollRevealStyle(headingRef);
 *   <motion.div ref={headingRef} style={headingStyle}>...</motion.div>
 *
 * Respects the OS-level prefers-reduced-motion setting (via Framer
 * Motion's useReducedMotion): when reduced motion is requested the values
 * are pinned to their resting state so nothing moves, same as every other
 * animation in this app (see MotionConfig in App.jsx).
 *
 * @param {import('react').RefObject} targetRef
 * @param {object} options
 * @param {number} [options.distance=48] - starting vertical offset in px
 * @param {number} [options.scaleFrom=0.94] - starting scale (settles at 1)
 * @param {[string, string]} [options.offset] - scroll trigger range, in
 *   Framer Motion's `useScroll` offset syntax. Defaults to starting the
 *   reveal when the element is 90% down the viewport and finishing while
 *   it's still well below center, so it's fully revealed before it needs
 *   to be read.
 */
export function useScrollRevealStyle(targetRef, {
  distance = 48,
  scaleFrom = 0.94,
  offset = ['start 92%', 'start 60%'],
} = {}) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: targetRef, offset });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [distance, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, 1]);

  if (reduceMotion) {
    return { opacity: 1, y: 0, scale: 1 };
  }

  return { opacity, y, scale };
}

/**
 * A slower-moving decorative layer (glows, grids, background art) that
 * drifts opposite to scroll direction as its container crosses the
 * viewport — classic parallax depth. Purely decorative: pass
 * `aria-hidden="true"` on the element this is applied to.
 *
 * Same usage pattern as useScrollRevealStyle: pass in a ref you created
 * and attached yourself.
 *
 * @param {import('react').RefObject} targetRef
 * @param {number} [distance=60] - max px of vertical drift each direction
 */
export function useParallaxY(targetRef, distance = 60) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return reduceMotion ? 0 : y;
}

/**
 * Scrubs opacity/scale across an element's own scroll range using
 * explicit keyframes — used for the "big visual impact" transitions
 * (section statements that swell in, hold, and settle back) rather than
 * a simple in/out reveal.
 *
 * @param {import('react').RefObject} targetRef
 * @param {object} options
 * @param {number[]} [options.scale] - 4 keyframe values matching the
 *   default progress stops [0, 0.35, 0.65, 1]
 * @param {number[]} [options.opacity] - same, for opacity
 */
export function useScrollScrubStyle(targetRef, {
  scale = [0.88, 1, 1, 0.96],
  opacity = [0.25, 1, 1, 0.5],
} = {}) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 85%', 'start 20%', 'end 60%', 'end 5%'],
  });

  const scaleValue = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], scale);
  const opacityValue = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], opacity);

  if (reduceMotion) {
    return { opacity: 1, scale: 1 };
  }

  return { opacity: opacityValue, scale: scaleValue };
}
