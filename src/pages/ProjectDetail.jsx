import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectBySlug } from '../data/projects.js';
import { getDevlogsByProject } from '../data/devlogs.js';
import { useScrollRevealStyle, useParallaxY } from '../hooks/useScrollReveal.js';
import ParticleStage from '../motion/ParticleStage.jsx';
import CursorGlow from '../motion/CursorGlow.jsx';
import NotFound from './NotFound.jsx';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  const glowRef = useRef(null);
  const glowY = useParallaxY(glowRef, 40);
  const descriptionRef = useRef(null);
  const descriptionStyle = useScrollRevealStyle(descriptionRef, { distance: 24, scaleFrom: 0.98 });
  const featuresRef = useRef(null);
  const featuresStyle = useScrollRevealStyle(featuresRef, { distance: 28 });
  const techRef = useRef(null);
  const techStyle = useScrollRevealStyle(techRef, { distance: 20, scaleFrom: 1 });
  const devlogRef = useRef(null);
  const devlogStyle = useScrollRevealStyle(devlogRef, { distance: 28 });

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — SYNAPSE`;
    }
    return () => {
      document.title = 'SYNAPSE — Independent Technology Studio';
    };
  }, [project]);

  if (!project) {
    return <NotFound />;
  }

  const logs = getDevlogsByProject(project.slug);

  return (
    <article className="project-detail">
      {/* The same particle visual this project has on the home page, drawn
          over the empty .project-detail__visual box in the hero below. */}
      <ParticleStage />
      <CursorGlow />

      <div
        className="project-detail__hero"
        data-scene={project.slug}
        style={{ '--card-accent': project.accent }}
      >
        <div className="project-detail__visual" data-stage-anchor aria-hidden="true" />
        <motion.div
          className="project-detail__glow"
          ref={glowRef}
          style={{ y: glowY }}
          aria-hidden="true"
        />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/#projects" className="project-detail__back">
              ← 프로젝트 목록으로
            </Link>

            <div className="project-detail__meta">
              <span className="project-detail__category">{project.category}</span>
              <span className="project-detail__status">{project.status}</span>
            </div>

            <h1 className="project-detail__title">{project.title}</h1>
            <p className="project-detail__oneliner">{project.oneLiner}</p>
            {project.link && (
              <a
                className="project-detail__link"
                href={project.link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.link.label} ↗
              </a>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container project-detail__body">
        <motion.p
          className="project-detail__description"
          ref={descriptionRef}
          style={descriptionStyle}
        >
          {project.description}
        </motion.p>

        {project.features?.length > 0 && (
          <motion.div
            className="project-detail__section"
            ref={featuresRef}
            style={featuresStyle}
          >
            <h2 className="project-detail__section-title">핵심 특징</h2>
            <ul className="project-detail__features">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {project.tech?.length > 0 && (
          <motion.div
            className="project-detail__section"
            ref={techRef}
            style={techStyle}
          >
            <h2 className="project-detail__section-title">사용 기술</h2>
            <ul className="project-detail__tags">
              {project.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {project.progress && (
          <div className="project-detail__note">{project.progress}</div>
        )}

        <motion.div
          className="project-detail__section project-detail__devlog"
          ref={devlogRef}
          style={devlogStyle}
        >
          <h2 className="project-detail__section-title">개발 로그</h2>
          {logs.length === 0 ? (
            <p className="project-detail__devlog-empty">
              아직 등록된 개발 로그가 없습니다. 진행 상황에 따라 이곳에 업데이트될 예정입니다.
            </p>
          ) : (
            <ul className="project-detail__devlog-list">
              {logs.map((log) => (
                <li key={log.id}>
                  <span className="project-detail__devlog-date">{log.date}</span>
                  <h3>{log.title}</h3>
                  <p>{log.content}</p>
                  {log.media?.type === 'image' && (
                    <img
                      src={log.media.src}
                      alt={log.media.alt}
                      loading="lazy"
                      className="project-detail__devlog-media"
                    />
                  )}
                  {log.media?.type === 'video' && (
                    <video
                      src={log.media.src}
                      controls
                      preload="none"
                      aria-label={log.media.alt}
                      className="project-detail__devlog-media"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <Link to="/#projects" className="btn btn-secondary project-detail__cta">
          ← 프로젝트 목록으로
        </Link>
      </div>
    </article>
  );
}
