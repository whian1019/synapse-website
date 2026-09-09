import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css';

const NAV_LINKS = [
  { label: '홈', hash: '#home' },
  { label: '프로젝트', hash: '#projects' },
  { label: '소개', hash: '#about' },
  { label: '문의', hash: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (e, hash) => {
    e.preventDefault();
    setMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/' + hash);
      return;
    }

    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <Link
          to="/"
          className="nav__logo"
          onClick={(e) => handleNavClick(e, '#home')}
          aria-label="SYNAPSE — 홈"
        >
          <img
            src="/synapse-logo.png"
            alt=""
            className="nav__logo-mark"
            width="1024"
            height="1024"
          />
          <span className="nav__logo-text">SYNAPSE</span>
        </Link>

        <nav className="nav__links" aria-label="주 메뉴">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.hash}
              onClick={(e) => handleNavClick(e, link.hash)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#projects"
          className="btn btn-secondary nav__cta"
          onClick={(e) => handleNavClick(e, '#projects')}
        >
          프로젝트 보기 <span className="btn-arrow">→</span>
        </a>

        <button
          className={`nav__toggle ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`nav__mobile ${menuOpen ? 'is-open' : ''}`}>
        <nav aria-label="모바일 메뉴">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.hash}
              onClick={(e) => handleNavClick(e, link.hash)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#projects"
          className="btn btn-primary"
          onClick={(e) => handleNavClick(e, '#projects')}
        >
          프로젝트 보기 <span className="btn-arrow">→</span>
        </a>
      </div>
    </header>
  );
}
