import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ProjectCard.css';

export default function ProjectCard({ project, index }) {
  return (
    <motion.article
      className="project-card"
      style={{ '--card-accent': project.accent }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
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
