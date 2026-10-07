import { Link, useLocation, useNavigate } from 'react-router-dom';
import FitText from '../motion/FitText.jsx';
import './Footer.css';

const LINKS = [
  { label: '프로젝트', hash: '#projects' },
  { label: '소개', hash: '#about' },
  { label: '문의', hash: '#contact' },
];

/**
 * Site footer: the studio name set edge to edge as a giant outlined
 * wordmark (with a slow sheen passing across it), and under it one quiet
 * row — logo, links, copyright.
 */
export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e, hash) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/' + hash);
      return;
    }
    document.getElementById(hash.replace('#', ''))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <footer className="footer">
      {/* decorative: the name is already given by the logo link below */}
      <div className="container footer__wordmark" aria-hidden="true">
        <FitText text="SYNAPSE" maxVh={40}>
          <span className="footer__wordmark-text">SYNAPSE</span>
        </FitText>
      </div>

      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo" aria-label="SYNAPSE — 홈">
            <img
              src="/synapse-logo.png"
              alt=""
              className="footer__logo-mark"
              width="1024"
              height="1024"
              loading="lazy"
            />
            <span className="footer__logo-text">SYNAPSE</span>
          </Link>
          <p className="footer__tag">AI · GAME · TECHNOLOGY</p>
        </div>

        <nav className="footer__links" aria-label="하단 메뉴">
          {LINKS.map((link) => (
            <a key={link.label} href={link.hash} onClick={(e) => handleClick(e, link.hash)}>
              {link.label}
            </a>
          ))}
        </nav>

        <p className="footer__copyright">
          © {new Date().getFullYear()} SYNAPSE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
