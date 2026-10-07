import { useSyncExternalStore } from 'react';

// Tiny shared state published by the WebGL particle stage.
//
// Two things other components need to know about it:
//
//   active — is the stage actually running? It can be absent for good
//     reasons (the visitor prefers reduced motion, or the browser has no
//     WebGL), and components that hand their visuals over to it — the hero
//     hides its <img> logo so the particle logo can take its place — must
//     show the static version instead.
//
//   scene — which scene is on screen right now ({ key, index, total }), so
//     the HUD can label it.
//
// A module-level store keeps both in sync without threading props or
// context through the whole tree.

let active = false;
let scene = null;
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Called by ParticleStage when it starts or stops rendering. */
export function setStageActive(next) {
  if (active === next) return;
  active = next;
  if (!next) scene = null;
  emit();
}

/** Called by ParticleStage whenever a different scene becomes the current one. */
export function setStageScene(key, index, total) {
  if (scene && scene.key === key && scene.index === index && scene.total === total) return;
  // a new object each time, so React sees the change
  scene = { key, index, total };
  emit();
}

/** True while the particle stage is rendering. Always false during SSR/first paint. */
export function useStageActive() {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => false
  );
}

/** The scene currently on screen — `{ key, index, total }` — or null when the stage isn't running. */
export function useStageScene() {
  return useSyncExternalStore(
    subscribe,
    () => scene,
    () => null
  );
}
