import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useScrollRevealStyle } from '../hooks/useScrollReveal.js';
import './ProjectCard.css';

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  // Each card's reveal window is shifted slightly earlier than the last,
  // so cards in a row cascade in left-to-right as you scroll past them
  // instead of all popping in together.
  const revealStyle = useScrollRevealStyle(cardRef, {
    distance: 56,
    scaleFrom: 0.92,
    offset: [`start ${92 - index * 6}%`, `start ${58 - index * 6}%`],
  });

  const reduceMotion = useReducedMotion();

  // Subtle pointer-driven tilt — a small "this card is a physical object"
  // interaction on hover. Disabled entirely under prefers-reduced-motion.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 300, damping: 28 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 300, damping: 28 });

  const handleMouseMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.article
      ref={cardRef}
      className="project-card"
      style={{
        '--card-accent': project.accent,
        opacity: revealStyle.opacity,
        y: revealStyle.y,
        scale: revealStyle.scale,
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformPerspective: 900,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/projects/${project.slug}`} className="project-card__link">
        <div className="project-card__visual" aria-hidden="true">
          <div className="project-card__glow" />
          <svg
            className="project-card__mark"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="100" cy="40" r="4" fill="var(--card-accent)" />
            <circle cx="50" cy="110" r="3.5" fill="var(--card-accent)" />
            <circle cx="150" cy="100" r="3.5" fill="var(--card-accent)" />
            <circle cx="115" cy="165" r="3" fill="var(--card-accent)" />
            <circle cx="70" cy="165" r="2.5" fill="var(--card-accent)" />
            <path
              d="M100 40L50 110M100 40L150 100M50 110L115 165M150 100L115 165M50 110L70 165"
              stroke="var(--card-accent)"
              strokeWidth="1"
            />
          </svg>
          <span className="project-card__id">{project.id}</span>
        </div>

        <div className="project-card__body">
          <div className="project-card__meta">
            <span className="project-card__category">{project.category}</span>
            <span className="project-card__status">{project.status}</span>
          </div>

          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__tagline">{project.tagline}</p>

          <span className="project-card__cta">
            자세히 보기 <span className="btn-arrow">→</span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
