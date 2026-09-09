import { motion } from 'framer-motion';
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
  return (
    <section id="home" className="hero">
      <div className="hero__grid" aria-hidden="true" />
      <NeuralBackground />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__vignette" aria-hidden="true" />

      <motion.div
        className="container hero__content"
        variants={container}
        initial="hidden"
        animate="show"
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
