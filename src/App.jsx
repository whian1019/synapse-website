import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import ScrollManager from './components/ScrollManager.jsx';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    // reducedMotion="user" makes every Framer Motion animation in the app
    // respect the OS-level prefers-reduced-motion setting automatically.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollManager />
        <a href="#main-content" className="skip-link">
          본문으로 건너뛰기
        </a>
        <Navigation />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </MotionConfig>
  );
}
