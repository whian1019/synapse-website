import { useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Scroll progress for a "scene" — a tall section whose content is pinned to
 * the viewport while the visitor scrolls through it (see .scene in
 * global.css).
 *
 * Returns two 0..1 motion values:
 *   enter — the section arriving: 0 when its top edge appears at the bottom
 *           of the viewport, 1 when it reaches the top and the pin begins
 *   pin   — the pinned stretch: 0 when the pin begins, 1 when it releases
 *
 * Headline content should be revealed on `enter`, so that jumping straight
 * to a section (nav link, #hash) lands on something readable, and the
 * secondary choreography should run on `pin`.
 *
 * Usage: create the ref yourself and attach it to the section.
 *
 *   const sectionRef = useRef(null);
 *   const { enter, pin } = useSceneProgress(sectionRef);
 *   <section ref={sectionRef} className="scene">...</section>
 */
export function useSceneProgress(sectionRef) {
  const { scrollYProgress: enter } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  });
  const { scrollYProgress: pin } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  return { enter, pin };
}

/**
 * Extends an input/output range so it explicitly covers all of 0..1, holding
 * the first value before the range and the last value after it.
 *
 * useTransform already clamps like this in JavaScript, but Framer Motion
 * hands scroll-linked opacity to the browser's native scroll timeline, and a
 * native animation whose keyframes stop short of 0 or 1 drifts back to the
 * element's un-animated value outside them (a fade-out that ends at 0.4
 * would fade back *in* by 1). Spelling out both ends avoids that.
 *
 *   coverRange([0.2, 0.4], [0, 1]) -> [[0, 0.2, 0.4, 1], [0, 0, 1, 1]]
 */
export function coverRange(input, output) {
  const ins = [...input];
  const outs = [...output];
  if (ins[0] > 0) {
    ins.unshift(0);
    outs.unshift(outs[0]);
  }
  if (ins[ins.length - 1] < 1) {
    ins.push(1);
    outs.push(outs[outs.length - 1]);
  }
  return [ins, outs];
}

/**
 * useTransform, but respectful of prefers-reduced-motion: when reduced
 * motion is requested the value is pinned to `rest` so nothing is scrubbed
 * by scrolling. `rest` defaults to the last output value (the "finished"
 * state of a reveal); pass it explicitly for values that animate *out*
 * (e.g. a fade to 0 should rest at 1).
 *
 *   const opacity = useScrub(pin, [0, 0.3], [0, 1]);          // rests at 1
 *   const fadeOut = useScrub(pin, [0.7, 1], [1, 0], 1);       // rests at 1
 */
export function useScrub(progress, input, output, rest = output[output.length - 1]) {
  const reduceMotion = useReducedMotion();
  const [ins, outs] = coverRange(input, output);
  const value = useTransform(progress, ins, outs);
  return reduceMotion ? rest : value;
}
