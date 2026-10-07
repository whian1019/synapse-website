import { useRef } from 'react';
import { motion } from 'framer-motion';
import LineReveal from '../motion/LineReveal.jsx';
import ScrollRead from '../motion/ScrollRead.jsx';
import { useSceneProgress, useScrub } from '../motion/useSceneProgress.js';
import './About.css';

const KEYWORDS = ['AI', 'GAME', 'SOFTWARE', 'INNOVATION'];

// The band repeats the keyword list so there is always text entering from
// the right as it slides left.
const BAND_REPEATS = 3;

/**
 * About scene, over a rolling terrain of light (data-scene="wave").
 *
 * Composition: the heading on the left as three heavy lines rising out of
 * masks; on the right, the studio's one-sentence description, which lights
 * up word by word as the visitor scrolls ("reads itself"); and along the
 * bottom a band of the four keywords in giant alternating solid/outline
 * type, sliding sideways with the scroll.
 */
export default function About() {
  const sectionRef = useRef(null);
  const { enter, pin } = useSceneProgress(sectionRef);

  const labelOpacity = useScrub(enter, [0.25, 0.5], [0, 1]);
  const bandX = useScrub(pin, [0, 1], ['4%', '-46%'], '0%');
  const bandOpacity = useScrub(enter, [0.5, 1], [0, 1]);
  // dissolves at the end of the pin as the Vision scene takes over
  const exitOpacity = useScrub(pin, [0.9, 1], [1, 0], 1);

  return (
    <section
      id="about"
      className="scene about"
      data-scene="wave"
      ref={sectionRef}
      style={{ '--scene-vh': 240 }}
    >
      <motion.div className="scene__pin" style={{ opacity: exitOpacity }}>
        <div className="container about__inner">
          <motion.span className="section-label" style={{ opacity: labelOpacity }}>
            About Synapse
          </motion.span>

          <div className="about__grid">
            <h2 className="about__title">
              <LineReveal
                progress={enter}
                from={0.26}
                to={0.92}
                lines={[
                  '한 프로젝트씩,',
                  { content: <span className="eyebrow-accent">스튜디오를</span> },
                  { content: <span className="eyebrow-accent">만들어갑니다.</span> },
                ]}
              />
            </h2>

            <p className="about__statement">
              <ScrollRead
                text="SYNAPSE는 게임, AI, 소프트웨어를 통해 새로운 디지털 경험을 만드는 독립 기술 스튜디오입니다."
                progress={pin}
                from={0.04}
                to={0.52}
              />
            </p>
          </div>
        </div>

        {/* The keywords for assistive tech, once, as a plain list... */}
        <ul className="visually-hidden">
          {KEYWORDS.map((word) => (
            <li key={word}>{word}</li>
          ))}
        </ul>

        {/* ...and for the eye, as a sliding band of giant type. */}
        <motion.div
          className="about__band"
          style={{ x: bandX, opacity: bandOpacity }}
          aria-hidden="true"
        >
          {Array.from({ length: BAND_REPEATS }, (_, repeat) =>
            KEYWORDS.map((word, i) => (
              <span
                key={`${repeat}-${word}`}
                className={`about__band-word${i % 2 === 1 ? ' is-outline' : ''}`}
              >
                {word}
              </span>
            ))
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
