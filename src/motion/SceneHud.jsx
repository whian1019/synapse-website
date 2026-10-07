import { useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { getScene } from './scenes.js';
import { useStageScene } from './stageStore.js';
import './SceneHud.css';

const pad = (n, width) => String(n).padStart(width, '0');

/**
 * A small heads-up display pinned to the bottom corners of the screen while
 * the particle stage is running: how far down the page the visitor is
 * (left) and which scene they're in (right) — a game-style readout that
 * makes the page feel like one continuous sequence.
 *
 * Decorative (aria-hidden): everything it shows is also conveyed by the
 * page itself. Not rendered when the stage isn't running, and hidden on
 * narrow screens where the corners are needed for content.
 */
export default function SceneHud() {
  const scene = useStageScene();
  const percentRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // written straight to the DOM: this changes on every scroll frame, and a
  // React re-render per frame would be wasted work
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (percentRef.current) {
      percentRef.current.textContent = pad(Math.round(value * 100), 3);
    }
  });

  if (!scene) return null;

  return (
    <div className="scene-hud" aria-hidden="true">
      <p className="scene-hud__item">
        <span className="scene-hud__dim">SCROLL</span>
        <span ref={percentRef}>{pad(Math.round(scrollYProgress.get() * 100), 3)}</span>
        <span className="scene-hud__dim">%</span>
      </p>
      <p className="scene-hud__item">
        <span className="scene-hud__dim">SCENE</span>
        <span>
          {pad(scene.index + 1, 2)}
          <span className="scene-hud__dim"> / {pad(scene.total, 2)}</span>
        </span>
        {/* keyed by scene so the label re-runs its flash-in each time it changes */}
        <span key={scene.key} className="scene-hud__label">
          {getScene(scene.key).label}
        </span>
      </p>
    </div>
  );
}
