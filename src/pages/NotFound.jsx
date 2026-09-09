import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

export default function NotFound() {
  useEffect(() => {
    document.title = '페이지를 찾을 수 없습니다 — SYNAPSE';
    return () => {
      document.title = 'SYNAPSE — Independent Technology Studio';
    };
  }, []);

  return (
    <section className="not-found">
      <div className="not-found__glow" aria-hidden="true" />
      <div className="container not-found__inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="not-found__code" aria-hidden="true">404</span>
          <h1 className="not-found__title">페이지를 찾을 수 없습니다.</h1>
          <p className="not-found__text">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
          <Link to="/" className="btn btn-primary not-found__cta">
            홈으로 돌아가기 <span className="btn-arrow">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
