import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollRevealStyle } from '../hooks/useScrollReveal.js';
import './About.css';

const KEYWORDS = ['AI', 'GAME', 'SOFTWARE', 'INNOVATION'];

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  // x stays <= the container's own side padding (22px at mobile widths —
  // see .container in global.css) so the pre-reveal "hidden" position
  // never pushes this element past the viewport edge and causes a stray
  // horizontal scrollbar before it's animated in.
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function About() {
  const headingRef = useRef(null);
  const headingStyle = useScrollRevealStyle(headingRef, { distance: 40, scaleFrom: 0.95 });

  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <motion.div ref={headingRef} style={headingStyle}>
          <span className="section-label">About Synapse</span>
          <h2 className="section-title">
            한 프로젝트씩,{' '}
            <span className="eyebrow-accent">스튜디오를 만들어갑니다.</span>
          </h2>
          <p className="about__text">
            SYNAPSE는 게임, AI, 소프트웨어를 통해 새로운 디지털 경험을 만드는
            독립 기술 스튜디오입니다.
          </p>
        </motion.div>

        <motion.ul
          className="about__keywords"
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {KEYWORDS.map((word, i) => (
            <motion.li key={word} variants={itemVariants}>
              <span className="about__keyword-index">0{i + 1}</span>
              <span>{word}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
