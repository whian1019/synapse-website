import { useRef } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard.jsx';
import { projects } from '../data/projects.js';
import { useScrollRevealStyle } from '../hooks/useScrollReveal.js';
import './Projects.css';

export default function Projects() {
  const headingRef = useRef(null);
  const headingStyle = useScrollRevealStyle(headingRef, { distance: 36, scaleFrom: 0.96 });

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <motion.div ref={headingRef} style={headingStyle}>
          <span className="section-label">Projects</span>
          <h2 className="section-title">
            아이디어를 <span className="eyebrow-accent">현실로.</span>
          </h2>
        </motion.div>

        <div className="projects__grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
