// Scene registry for the particle stage.
//
// A page section opts into a scene with `data-scene="<key>"`. As the visitor
// scrolls from one section into the next, the stage morphs the previous
// section's scene into the next one. Each entry describes how that scene's
// particles look and move once they've formed:
//
//   shape    which builder in shapes.js to use (defaults to the key itself)
//   fx       [swirl, flow, pulse, jitter]
//              swirl  — rotation around the vertical axis, with a breathing
//                       shear (used for the swarm)
//              flow   — units/second the points travel toward the camera,
//                       wrapping around (city corridor, warp, terrain)
//              pulse  — radial breathing (nova)
//              jitter — small organic drift of every point
//   wave     height of the rolling-terrain displacement
//   size     point size in CSS px (before perspective)
//   alpha    overall brightness
//   spin     rigid rotation, radians/second
//   turn     extra rotation across the section's own scroll (radians)
//   tilt     base pitch, radians
//   zShift   constant offset toward the camera (pulls a flowing shape
//            forward so it streams past the lens instead of staying distant)
//   dolly    how far the shape travels toward the camera across the
//            section's own scroll — at 3 it flies straight through the lens
//   fade     how much it dims across the section's own scroll (0..1)
//   parallax how strongly it leans toward the cursor
//   pointer  cursor force: positive pushes particles away, negative attracts
//   fit      multiplier on the size of the anchor box (see data-stage-anchor)
//   scale    size when the section has no anchor box
//   fill     true = allowed to be wider than the viewport (backdrops)
//   ambient  color the page's background glow shifts to for this scene
//   label    name shown for this scene in the HUD (see SceneHud.jsx)

export const SCENES = {
  // not attached to any section: what the first scene assembles out of
  scatter: {
    fx: [0.08, 0, 0, 0.05],
    size: 3.2,
    alpha: 0.6,
    spin: 0.03,
    fill: true,
    ambient: '#4cc9f0',
  },

  // hero: the real logo, flying through the lens as the visitor scrolls on
  logo: {
    fx: [0, 0, 0, 0.004],
    size: 2.7,
    alpha: 1,
    parallax: 0.3,
    pointer: 0.05,
    turn: 0.35,
    dolly: 3.05,
    fade: 0.55,
    ambient: '#4cc9f0',
    label: 'SYNAPSE',
  },

  // projects intro
  warp: {
    fx: [0, 1.25, 0, 0],
    zShift: 2.3,
    size: 4.4,
    alpha: 1,
    parallax: 0.12,
    fill: true,
    ambient: '#ff9d4d',
    label: 'PROJECTS',
  },

  // NEUROLINK — cyberpunk city corridor
  neurolink: {
    fx: [0, 0.5, 0, 0],
    zShift: 1.1,
    size: 3.8,
    alpha: 1,
    tilt: 0.1,
    parallax: 0.16,
    turn: 0.22,
    fit: 1.12,
    ambient: '#5eead4',
    label: 'NEUROLINK',
  },

  // Dark Swarm — a flock that chases the cursor
  'dark-swarm': {
    shape: 'swarm',
    fx: [0.7, 0, 0, 0.045],
    size: 3.8,
    alpha: 1,
    tilt: 0.42,
    parallax: 0.2,
    pointer: -0.09,
    turn: 0.9,
    fit: 0.98,
    ambient: '#ec4899',
    label: 'DARK SWARM',
  },

  // NOVA — a pulsing star
  nova: {
    fx: [0, 0, 0.045, 0.003],
    size: 3.6,
    alpha: 1,
    spin: 0.22,
    tilt: 0.32,
    parallax: 0.25,
    pointer: 0.04,
    turn: 1.4,
    fit: 0.86,
    ambient: '#60a5fa',
    label: 'NOVA',
  },

  // About — rolling terrain of light
  wave: {
    fx: [0, 0.3, 0, 0],
    zShift: 1.7,
    wave: 0.2,
    size: 4.0,
    alpha: 1,
    tilt: 0.1,
    parallax: 0.08,
    fill: true,
    ambient: '#ff9d4d',
    label: 'ABOUT',
  },

  // Vision — connected nodes
  network: {
    fx: [0, 0, 0, 0.004],
    size: 3.6,
    alpha: 0.8,
    spin: 0.1,
    tilt: 0.2,
    parallax: 0.22,
    turn: 1.1,
    scale: 1.15,
    ambient: '#ffd166',
    label: 'VISION',
  },

  // Contact — the logo again, at rest (no fly-through)
  'logo-end': {
    shape: 'logo',
    fx: [0, 0, 0, 0.004],
    size: 2.7,
    alpha: 1,
    parallax: 0.3,
    pointer: 0.05,
    ambient: '#ff9d4d',
    label: 'CONTACT',
  },
};

const DEFAULTS = {
  fx: [0, 0, 0, 0],
  wave: 0,
  size: 1.8,
  alpha: 0.8,
  spin: 0,
  turn: 0,
  tilt: 0,
  zShift: 0,
  dolly: 0,
  fade: 0,
  parallax: 0.15,
  pointer: 0,
  fit: 1,
  scale: 1,
  fill: false,
  ambient: '#ff9d4d',
  label: '',
};

/** Looks up a scene by key, filling in defaults; unknown keys fall back to `scatter`. */
export function getScene(key) {
  const scene = SCENES[key] ?? SCENES.scatter;
  return { ...DEFAULTS, ...scene, shape: scene.shape ?? (SCENES[key] ? key : 'scatter') };
}
