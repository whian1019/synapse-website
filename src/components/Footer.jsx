import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Footer.css';

const LINKS = [
  { label: '프로젝트', hash: '#projects' },
  { label: '소개', hash: '#about' },
  { label: '문의', hash: '#contact' },
];

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
