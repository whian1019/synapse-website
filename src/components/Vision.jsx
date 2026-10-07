import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollScrubStyle } from '../hooks/useScrollReveal.js';
import './Vision.css';

export default function Vision() {
  const sectionRef = useRef(null);

  // The brand statement is the site's one deliberately "big" moment: it
  // swells into full size and brightness as it crosses the viewport, holds
  // near its peak, then eases back down — a scroll-scrubbed zoom rather
  // than a fixed-duration fade, so it reads as a reaction to scrolling
  // itself.
  const scrubStyle = useScrollScrubStyle(sectionRef, {
    scale: [0.86, 1, 1, 0.94],
    opacity: [0.25, 1, 1, 0.45],
  });

  return (
    <section className="section vision" ref={sectionRef}>
      <motion.div
        className="vision__glow"
        style={{ opacity: scrubStyle.opacity }}
        aria-hidden="true"
      />
      <div className="container">
        <motion.h2 className="vision__statement" style={scrubStyle}>
          BUILD. CREATE. <span className="eyebrow-accent">CONNECT.</span>
        </motion.h2>

        <motion.p className="vision__text" style={{ opacity: scrubStyle.opacity }}>
          기술은 단순한 도구가 아니라, 경험을 만든다고 믿습니다.
        </motion.p>
      </div>
    </section>
  );
}
