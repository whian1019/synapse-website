import { motion } from 'framer-motion';
import { CONTACT_EMAIL } from '../data/site.js';
import './Contact.css';

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
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
