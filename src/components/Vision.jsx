import { useRef } from 'react';
import { motion } from 'framer-motion';
import FitText from '../motion/FitText.jsx';
import { useSceneProgress, useScrub } from '../motion/useSceneProgress.js';
import './Vision.css';

/**
 * One word of the statement on its own full-width line, sliding in from
 * the side of the screen it is aligned to. `side` is 'left' or 'right'.
 */
function VisionLine({ word, number, progress, start, side, accent = false }) {
  const from = side === 'left' ? '-55vw' : '55vw';
  const x = useScrub(progress, [start, start + 0.2], [from, '0vw'], '0vw');
  const opacity = useScrub(progress, [start, start + 0.12], [0, 1]);

  return (
    <motion.span
      className={`vision__line vision__line--${side}`}
      style={{ x, opacity }}
    >
      <span className="vision__num" aria-hidden="true">
        <span>{number}</span>
      </span>
      <span className={accent ? 'eyebrow-accent' : undefined}>{word}</span>
    </motion.span>
  );
}

/**
 * Vision scene — the brand statement as three stacked, screen-wide lines
 * over the node network (data-scene="network").
 *
 * The three words zig-zag: BUILD. sits left and slides in from the left as
 * the section arrives, CREATE. sits right and slides in from the right,
 * CONNECT. (in the accent gradient) comes from the left again; then the
 * supporting line fades up. Scrolling back up plays it in reverse.
 *
 * All three lines share one font size, fitted (by FitText) so the longest
 * word spans the page.
 */
export default function Vision() {
  const sectionRef = useRef(null);
  const { enter, pin } = useSceneProgress(sectionRef);

  const textOpacity = useScrub(pin, [0.56, 0.7], [0, 1]);
  const textY = useScrub(pin, [0.56, 0.7], [24, 0]);
  // dissolves at the end of the pin as everything gathers back into the logo
  const exitOpacity = useScrub(pin, [0.9, 1], [1, 0], 1);

  return (
    <section
      className="scene vision"
      data-scene="network"
      ref={sectionRef}
      style={{ '--scene-vh': 260 }}
    >
      <motion.div className="scene__pin" style={{ opacity: exitOpacity }}>
        <div className="container vision__inner">
          <h2 className="vision__statement">
            {/* "CONNECT." is the longest word, so it sets the size for all three */}
            <FitText text="CONNECT." maxVh={21} fill={0.94}>
              <VisionLine word="BUILD." number="01" progress={enter} start={0.4} side="left" />{' '}
              <VisionLine word="CREATE." number="02" progress={pin} start={0.06} side="right" />{' '}
              <VisionLine
                word="CONNECT."
                number="03"
                progress={pin}
                start={0.3}
                side="left"
                accent
              />
            </FitText>
          </h2>

          <motion.p className="vision__text" style={{ opacity: textOpacity, y: textY }}>
            기술은 단순한 도구가 아니라, 경험을 만든다고 믿습니다.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
