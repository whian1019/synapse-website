import { useRef } from 'react';
import { motion } from 'framer-motion';
import { CONTACT_EMAIL } from '../data/site.js';
import { useScrollRevealStyle } from '../hooks/useScrollReveal.js';
import './Contact.css';

export default function Contact() {
  const contentRef = useRef(null);
  const contentStyle = useScrollRevealStyle(contentRef, { distance: 36, scaleFrom: 0.96 });

  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner">
        <motion.div ref={contentRef} style={contentStyle}>
          <span className="section-label">Contact</span>
          <h2 className="section-title contact__title">
            함께 미래를 만들어가요.
          </h2>
          <p className="section-subtitle">
            아이디어가 있으신가요? 함께 만들어가고 싶어요.
          </p>
          <p className="contact__note">
            프로젝트 협업, 비즈니스 문의 등 어떤 이야기든 편하게 보내주세요.
          </p>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="btn btn-primary contact__cta"
          >
            SYNAPSE에 문의하기 <span className="btn-arrow">→</span>
          </a>

          <a href={`mailto:${CONTACT_EMAIL}`} className="contact__email">
            {CONTACT_EMAIL}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
