import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import NeuralBackground from './NeuralBackground.jsx';
import './Hero.css';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // As the hero scrolls out of view (progress 0 -> 1 across the section's
  // own height), the content eases back and fades — a cinematic "zoom out"
  // hand-off into the Projects section below, instead of a hard cut.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const scaleStyle = reduceMotion ? 1 : contentScale;
  const opacityStyle = reduceMotion ? 1 : contentOpacity;
  const bgYStyle = reduceMotion ? 0 : bgY;

  return (
    <section id="home" className="hero" ref={sectionRef}>
      <motion.div className="hero__bg-layer" style={{ y: bgYStyle }} aria-hidden="true">
        <div className="hero__grid" />
        <NeuralBackground />
      </motion.div>
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__vignette" aria-hidden="true" />

      <motion.div
        className="container hero__content"
        variants={container}
        initial="hidden"
        animate="show"
        style={{ scale: scaleStyle, opacity: opacityStyle }}
      >
        <motion.p variants={item} className="hero__kicker">
          AI · GAME · TECHNOLOGY
        </motion.p>

        <motion.h1 variants={item} className="hero__logo-wrap">
          <img
            src="/synapse-logo.png"
            alt="SYNAPSE"
            className="hero__logo"
            width="1024"
            height="1024"
            fetchPriority="high"
          />
        </motion.h1>

        <motion.p variants={item} className="hero__tagline">
          미래를 위한 디지털 경험을 만듭니다.
        </motion.p>

        <motion.div variants={item} className="hero__actions">
          <a href="#projects" className="btn btn-primary">
            프로젝트 보기 <span className="btn-arrow">→</span>
          </a>
          <a href="#about" className="btn btn-secondary">
            SYNAPSE 소개
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="hero__scroll-line" />
      </motion.div>
    </section>
  );
}
