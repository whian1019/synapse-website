import { motion } from 'framer-motion';
import './Vision.css';

export default function Vision() {
  return (
    <section className="section vision">
      <div className="vision__glow" aria-hidden="true" />
      <div className="container">
        <motion.h2
          className="vision__statement"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          BUILD. CREATE. <span className="eyebrow-accent">CONNECT.</span>
        </motion.h2>

        <motion.p
          className="vision__text"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          기술은 단순한 도구가 아니라, 경험을 만든다고 믿습니다.
        </motion.p>
      </div>
    </section>
  );
}
