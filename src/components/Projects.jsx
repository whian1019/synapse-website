import { useRef } from 'react';
import { motion, useMotionTemplate } from 'framer-motion';
import ProjectScene from './ProjectScene.jsx';
import LineReveal from '../motion/LineReveal.jsx';
import { useSceneProgress, useScrub } from '../motion/useSceneProgress.js';
import { projects } from '../data/projects.js';
import './Projects.css';

/**
 * The Projects chapter: a title card (over a starfield rushing at the
 * camera) followed by one full-screen pinned scene per project. Everything
 * is generated from src/data/projects.js — adding a project there adds a
 * scene here.
 *
 * The title card is two giant lines. "아이디어를" rises in solid; "현실로."
 * rises as an outline and is then filled in with the accent gradient from
 * left to right as the visitor keeps scrolling — the idea becoming real.
 */
export default function Projects() {
  const introRef = useRef(null);
  const { enter, pin } = useSceneProgress(introRef);

  const labelOpacity = useScrub(enter, [0.3, 0.6], [0, 1]);
  // the fill layer is clipped from the right; 100% = fully hidden
  const fillHidden = useScrub(pin, [0.02, 0.6], [100, 0], 0);
  const fillClip = useMotionTemplate`inset(0 ${fillHidden}% 0 0)`;
  // drifts toward the viewer while pinned, then dissolves as the first
  // project's scene starts to form behind it
  const scale = useScrub(pin, [0, 1], [1, 1.2], 1);
  const exitOpacity = useScrub(pin, [0.8, 1], [1, 0], 1);

  const count = String(projects.length).padStart(2, '0');

  return (
    <>
      <section
        id="projects"
        className="scene projects-intro"
        data-scene="warp"
        ref={introRef}
        style={{ '--scene-vh': 180 }}
      >
        <div className="scene__pin">
          <motion.div
            className="container projects-intro__inner"
            style={{ scale, opacity: exitOpacity }}
          >
            <motion.span className="section-label" style={{ opacity: labelOpacity }}>
              Projects — {count}
            </motion.span>
            <h2 className="projects-intro__title">
              <LineReveal
                progress={enter}
                from={0.3}
                to={0.94}
                lines={[
                  '아이디어를',
                  {
                    content: (
                      <span className="projects-intro__wipe">
                        <span className="projects-intro__outline">현실로.</span>
                        <motion.span
                          className="projects-intro__fill"
                          style={{ clipPath: fillClip }}
                          aria-hidden="true"
                        >
                          현실로.
                        </motion.span>
                      </span>
                    ),
                  },
                ]}
              />
            </h2>
          </motion.div>
        </div>
      </section>

      {projects.map((project, i) => (
        <ProjectScene
          key={project.slug}
          project={project}
          index={i}
          total={projects.length}
        />
      ))}
    </>
  );
}
