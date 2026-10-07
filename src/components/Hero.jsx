import { useRef } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import LineReveal from '../motion/LineReveal.jsx';
import { useSceneProgress, useScrub } from '../motion/useSceneProgress.js';
import { useStageActive } from '../motion/stageStore.js';
import './Hero.css';

/**
 * Opening scene.
 *
 * Composition: the logo floats in the middle of the screen (drawn by the
 * particle stage, data-scene="logo" — it assembles out of a scattered cloud
 * on load); a small monospace caption sits in each top corner; the tagline
 * is set as a three-line headline in the bottom-left, rising line by line
 * out of masks; the calls to action sit bottom-right.
 *
 * As the visitor scrolls through this pinned section the headline slides
 * off to the left, the actions to the right, and the logo flies straight
 * through the camera into the Projects scene.
 *
 * The real <img> logo stays in the markup — it is the page's <h1> (via its
 * alt text), it marks where the particle logo should be drawn
 * (data-stage-anchor), and it is what's shown when the stage isn't running
 * (reduced motion / no WebGL).
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const { pin } = useSceneProgress(sectionRef);
  const stageActive = useStageActive();
  const reduceMotion = useReducedMotion();

  // Exit, scrubbed over the first third of the pinned scroll. (The last
  // argument of useScrub is the value used under prefers-reduced-motion.)
  const frameOpacity = useScrub(pin, [0.06, 0.36], [1, 0], 1);
  const headlineX = useScrub(pin, [0, 0.36], ['0vw', '-24vw'], '0vw');
  const sideX = useScrub(pin, [0, 0.36], ['0vw', '24vw'], '0vw');
  const captionY = useScrub(pin, [0, 0.3], [0, -48], 0);

  // Once the copy has faded out it's also hidden outright, so its (now
  // invisible) buttons can't be clicked or tabbed to while the next scene
  // slides over the top. The logo image inside keeps its layout box either
  // way, which is all the particle stage needs from it.
  const fadedOut = useTransform(pin, (v) => (v > 0.38 ? 'hidden' : 'visible'));
  const frameVisibility = reduceMotion ? 'visible' : fadedOut;

  return (
    <section
      id="home"
      className="scene hero"
      data-scene="logo"
      ref={sectionRef}
      style={{ '--scene-vh': 200 }}
    >
      <div className="scene__pin hero__pin">
        <motion.div
          className="hero__frame"
          style={{ opacity: frameOpacity, visibility: frameVisibility }}
        >
          <motion.div className="container hero__captions" style={{ y: captionY }}>
            <p className="mono hero__caption">Independent Technology Studio</p>
            <p className="mono hero__caption hero__caption--right">AI · GAME · TECHNOLOGY</p>
          </motion.div>

          <h1 className="hero__logo-wrap">
            <img
              src="/synapse-logo.png"
              alt="SYNAPSE"
              className={`hero__logo${stageActive ? ' is-handed-off' : ''}`}
              width="1024"
              height="1024"
              fetchPriority="high"
              data-stage-anchor
            />
          </h1>

          <div className="container hero__bottom">
            <motion.p className="hero__headline" style={{ x: headlineX }}>
              <LineReveal
                auto
                delay={0.6}
                lines={[
                  '미래를 위한',
                  '디지털 경험을',
                  { content: <span className="eyebrow-accent">만듭니다.</span> },
                ]}
              />
            </motion.p>

            <motion.div className="hero__side" style={{ x: sideX }}>
              <div className="hero__actions">
                <a href="#projects" className="btn btn-primary">
                  프로젝트 보기 <span className="btn-arrow">→</span>
                </a>
                <a href="#about" className="btn btn-secondary">
                  SYNAPSE 소개
                </a>
              </div>
              <p className="mono hero__scroll" aria-hidden="true">
                Scroll <span className="hero__scroll-arrow">↓</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
