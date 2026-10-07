import ParticleStage from '../motion/ParticleStage.jsx';
import CursorGlow from '../motion/CursorGlow.jsx';
import SceneHud from '../motion/SceneHud.jsx';
import Hero from '../components/Hero.jsx';
import Projects from '../components/Projects.jsx';
import About from '../components/About.jsx';
import Vision from '../components/Vision.jsx';
import Contact from '../components/Contact.jsx';

/**
 * The home page is one continuous scroll-driven sequence. The particle
 * stage sits behind everything and morphs from scene to scene as each
 * section below arrives (each section names its scene with data-scene):
 *
 *   Hero      logo        the logo assembles, then flies through the camera
 *   Projects  warp        starfield hand-off into the projects
 *             neurolink   cyberpunk city corridor
 *             dark-swarm  a swarm that follows the cursor
 *             nova        a pulsing star
 *   About     wave        rolling terrain of light
 *   Vision    network     connected nodes
 *   Contact   logo-end    everything gathers back into the logo
 */
export default function Home() {
  return (
    <>
      <ParticleStage />
      <CursorGlow />
      <SceneHud />
      <Hero />
      <Projects />
      <About />
      <Vision />
      <Contact />
    </>
  );
}
