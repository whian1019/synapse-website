import { useRef } from 'react';
import { motion } from 'framer-motion';
import { CONTACT_EMAIL } from '../data/site.js';
import { useScrollRevealStyle } from '../hooks/useScrollReveal.js';
import './Contact.css';

/**
 * Closing section. The particle stage pulls everything back together into
 * the SYNAPSE logo here (data-scene="logo-end"), drawn over the empty
 * .contact__mark box on the right, while the copy rises into place on the
 * left: a two-line headline, and the email address itself set large as the
 * main call to action.
 *
 * Unlike the scenes above it this section isn't pinned — it's the end of
 * the page, so it simply scrolls into view.
 */
export default function Contact() {
  const copyRef = useRef(null);
  const copyStyle = useScrollRevealStyle(copyRef, {
    distance: 56,
    scaleFrom: 0.96,
    offset: ['start 96%', 'start 58%'],
  });

  return (
    <section id="contact" className="section contact" data-scene="logo-end">
      <div className="container contact__grid">
        <motion.div className="contact__copy" ref={copyRef} style={copyStyle}>
          <span className="section-label">Contact</span>
          <h2 className="contact__title">
            함께 미래를
            <br />
            <span className="eyebrow-accent">만들어가요.</span>
          </h2>
          <p className="contact__lead">
            아이디어가 있으신가요? 함께 만들어가고 싶어요.
          </p>
          <p className="contact__note">
            프로젝트 협업, 비즈니스 문의 등 어떤 이야기든 편하게 보내주세요.
          </p>

          {/* the address itself is the primary action */}
          <a href={`mailto:${CONTACT_EMAIL}`} className="contact__email">
            <span className="contact__email-text">{CONTACT_EMAIL}</span>
            <span className="contact__email-arrow" aria-hidden="true">↗</span>
          </a>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="btn btn-primary contact__cta"
          >
            SYNAPSE에 문의하기 <span className="btn-arrow">→</span>
          </a>
        </motion.div>

        {/* empty on purpose: the particle stage draws the logo over this box */}
        <div className="contact__mark" data-stage-anchor aria-hidden="true" />
      </div>
    </section>
  );
}
