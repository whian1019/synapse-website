import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DecodeText from '../motion/DecodeText.jsx';
import FitText from '../motion/FitText.jsx';
import { useSceneProgress, useScrub } from '../motion/useSceneProgress.js';
import './ProjectScene.css';

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * One row of a project's feature list — a monospace number and the feature
 * — sliding in at its own point in the pinned scroll, so the list builds up
 * one line at a time.
 */
function FeatureItem({ children, number, progress, start }) {
  const opacity = useScrub(progress, [start, start + 0.1], [0, 1]);
  const x = useScrub(progress, [start, start + 0.1], [-32, 0]);
  return (
    <motion.li style={{ opacity, x }}>
      <span className="project-scene__feature-num" aria-hidden="true">
        {number}
      </span>
      <span>{children}</span>
    </motion.li>
  );
}

/**
 * A full-screen pinned scene for a single project.
 *
 * Composition: a monospace readout line (number, category, status, and the
 * engine when one is decided), then the project's name set as wide as the
 * page allows, "decoding" into place letter by letter as the scene arrives;
 * below it a narrow column of copy — one-line intro, description, the
 * project's real feature list building up row by row, and the link to its
 * detail page. The particle stage draws that project's own visual
 * (data-scene is the project slug — see src/motion/scenes.js) in the large
 * empty .project-scene__visual box behind and beside the copy.
 *
 * Odd-numbered scenes are mirrored: visual on the left, copy on the right.
 */
export default function ProjectScene({ project, index, total }) {
  const sectionRef = useRef(null);
  const { enter, pin } = useSceneProgress(sectionRef);

  // while the section arrives
  const barOpacity = useScrub(enter, [0.28, 0.55], [0, 1]);
  const barY = useScrub(enter, [0.28, 0.55], [20, 0]);
  const oneLinerOpacity = useScrub(enter, [0.8, 1], [0, 1]);
  const oneLinerY = useScrub(enter, [0.8, 1], [18, 0]);

  // while pinned
  const taglineOpacity = useScrub(pin, [0.02, 0.14], [0, 1]);
  const taglineY = useScrub(pin, [0.02, 0.14], [18, 0]);
  const ctaOpacity = useScrub(pin, [0.58, 0.7], [0, 1]);
  const ctaY = useScrub(pin, [0.58, 0.7], [18, 0]);
  // The scene dissolves over the last stretch of its pin, in step with the
  // particle stage starting to morph into the next scene — so the copy never
  // lingers on screen after its visual has gone.
  const exitOpacity = useScrub(pin, [0.9, 1], [1, 0], 1);

  return (
    <section
      className={`scene project-scene${index % 2 === 1 ? ' is-flipped' : ''}`}
      data-scene={project.slug}
      ref={sectionRef}
      style={{ '--scene-vh': 250, '--card-accent': project.accent }}
      aria-label={project.title}
    >
      <motion.div className="scene__pin" style={{ opacity: exitOpacity }}>
        {/* empty on purpose: the particle stage draws this project's visual
            over this box */}
        <div className="project-scene__visual" data-stage-anchor aria-hidden="true" />

        <div className="container project-scene__inner">
          <motion.div
            className="project-scene__bar"
            style={{ opacity: barOpacity, y: barY }}
          >
            <span className="project-scene__index">
              {pad2(index + 1)}
              <span> / {pad2(total)}</span>
            </span>
            <span className="project-scene__chip">{project.category}</span>
            <span className="project-scene__readout">{project.status}</span>
            {project.tech?.map((tech) => (
              <span key={tech} className="project-scene__readout">
                {tech}
              </span>
            ))}
          </motion.div>

          <h3 className="project-scene__title">
            <FitText text={project.title} maxVh={22}>
              <DecodeText text={project.title} progress={enter} from={0.3} to={0.96} />
            </FitText>
          </h3>

          <div className="project-scene__body">
            <motion.p
              className="project-scene__oneliner"
              style={{ opacity: oneLinerOpacity, y: oneLinerY }}
            >
              {project.oneLiner}
            </motion.p>

            <motion.p
              className="project-scene__tagline"
              style={{ opacity: taglineOpacity, y: taglineY }}
            >
              {project.tagline}
            </motion.p>

            {project.features?.length > 0 && (
              <ol className="project-scene__features">
                {project.features.map((feature, i) => (
                  <FeatureItem
                    key={feature}
                    number={pad2(i + 1)}
                    progress={pin}
                    start={0.16 + i * 0.13}
                  >
                    {feature}
                  </FeatureItem>
                ))}
              </ol>
            )}

            <motion.div style={{ opacity: ctaOpacity, y: ctaY }}>
              <Link to={`/projects/${project.slug}`} className="project-scene__cta">
                <span>자세히 보기</span>
                <span className="project-scene__cta-arrow" aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
