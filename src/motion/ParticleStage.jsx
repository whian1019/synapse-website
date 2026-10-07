import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { getScene } from './scenes.js';
import {
  FLOW_Z_MIN,
  FLOW_Z_LEN,
  createRng,
  buildScatter,
  buildLogo,
  buildWarp,
  buildNeurolink,
  buildSwarm,
  buildNova,
  buildWave,
  buildNetwork,
} from './shapes.js';
import { setStageActive, setStageScene } from './stageStore.js';
import './ParticleStage.css';

/**
 * The scroll-driven particle stage: one fixed, full-viewport WebGL canvas
 * that sits behind the page and turns scrolling into a continuous
 * animation.
 *
 * How it decides what to draw, every frame:
 *   1. It finds every section marked `data-scene="<key>"` on the page.
 *   2. The section currently arriving in the viewport is the "to" scene;
 *      the one before it is the "from" scene.
 *   3. How far the arriving section has travelled up the screen becomes the
 *      morph amount — so the particles are scrubbed by the scrollbar itself,
 *      forwards and backwards, rather than playing a canned clip.
 *   4. If a section contains an element marked `data-stage-anchor`, the
 *      shape is laid exactly over that element's box. Layout stays in CSS;
 *      the canvas just follows it (which is also what makes it responsive).
 *
 * No library: a single draw call of GL points, with all the motion done in
 * the vertex shader, so it stays cheap even with thousands of particles.
 *
 * Not rendered at all under prefers-reduced-motion or without WebGL —
 * components check `useStageActive()` and show their static visuals instead.
 */

// How far up the viewport an arriving section travels while the morph plays:
// it starts when the section's top edge is 94% of the way down the screen and
// completes when that edge reaches 36%.
const ENTER_START = 0.94;
const ENTER_SPAN = 0.58;

// Seconds the opening "assemble out of the dark" animation takes.
const INTRO_SECONDS = 2.8;

const VERTEX_SHADER = `
precision highp float;

attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec3 aColorFrom;
attribute vec3 aColorTo;
attribute vec4 aRand;

uniform float uMix;
uniform float uTime;
uniform float uAspect;
uniform float uDpr;
uniform float uKick;

uniform vec4 uFxA;
uniform vec4 uFxB;
uniform float uWaveA;
uniform float uWaveB;
uniform vec2 uRotA;
uniform vec2 uRotB;
uniform float uScaleA;
uniform float uScaleB;
uniform float uDollyA;
uniform float uDollyB;
uniform vec2 uOffsetA;
uniform vec2 uOffsetB;
uniform float uSizeA;
uniform float uSizeB;
uniform float uAlphaA;
uniform float uAlphaB;

uniform vec2 uPointer;
uniform float uPointerForce;

varying vec3 vColor;
varying float vAlpha;

const float CAMERA = 3.2;
const float Z_MIN = ${FLOW_Z_MIN.toFixed(2)};
const float Z_LEN = ${FLOW_Z_LEN.toFixed(2)};

// A shape's own idle motion, applied in its local space before it is
// rotated, scaled or blended with another shape.
vec3 applyFx(vec3 p, vec4 fx, float wave, float seed) {
  // swirl: turn around the vertical axis, with a shear that breathes in and
  // out so a flock keeps re-forming instead of winding itself into a disc
  float r = length(p.xz);
  float a = fx.x * (uTime * 0.35 + sin(uTime * 0.3 + r * 3.0) * 1.1);
  float c = cos(a);
  float s = sin(a);
  p.xz = mat2(c, s, -s, c) * p.xz;

  // flow: travel toward the camera and wrap back to the far end
  if (fx.y > 0.0) {
    p.z = mod(p.z - Z_MIN + uTime * fx.y, Z_LEN) + Z_MIN;
  }

  // rolling terrain
  p.y += wave * sin(p.x * 2.4 + uTime * 0.9) * cos(p.z * 2.1 + uTime * 0.6);

  // radial pulse travelling outward
  p *= 1.0 + fx.z * sin(uTime * 1.8 - length(p) * 6.0);

  // organic drift
  p += fx.w * vec3(
    sin(uTime * 0.9 + seed * 40.0),
    cos(uTime * 0.7 + seed * 71.0),
    sin(uTime * 0.8 + seed * 13.0)
  );
  return p;
}

// yaw (around Y) then pitch (around X)
vec3 rotate(vec3 p, vec2 rot) {
  float cy = cos(rot.x);
  float sy = sin(rot.x);
  p.xz = mat2(cy, sy, -sy, cy) * p.xz;
  float cx = cos(rot.y);
  float sx = sin(rot.y);
  p.yz = mat2(cx, sx, -sx, cx) * p.yz;
  return p;
}

void main() {
  // Each particle starts and finishes its journey at a slightly different
  // moment, so a morph sweeps through the cloud instead of snapping.
  float stagger = 0.45;
  float t = clamp(uMix * (1.0 + stagger) - aRand.x * stagger, 0.0, 1.0);
  float e = t * t * (3.0 - 2.0 * t);

  vec3 a = rotate(applyFx(aFrom, uFxA, uWaveA, aRand.y), uRotA) * uScaleA;
  vec3 b = rotate(applyFx(aTo, uFxB, uWaveB, aRand.y), uRotB) * uScaleB;
  a.z += uDollyA;
  b.z += uDollyB;
  vec3 p = mix(a, b, e);

  // Mid-flight the cloud bursts outward and twists, then pulls back together
  // into the new shape. uKick adds a one-off burst when the page jumps
  // several sections at once, so that jump reads as an explosion, not a cut.
  float arc = sin(e * 3.14159265);
  vec3 dir = normalize(aRand.xyz - 0.5 + 0.0001);
  p += dir * (arc * (0.1 + aRand.w * 0.5) + uKick * (0.25 + aRand.w * 0.9));
  float twist = arc * (aRand.z - 0.5) * 2.2;
  float ct = cos(twist);
  float st = sin(twist);
  p.xy = mat2(ct, st, -st, ct) * p.xy;

  // perspective
  float depth = CAMERA - p.z;
  float perspective = CAMERA / max(depth, 0.05);
  vec2 ndc = p.xy * perspective;
  ndc.x /= uAspect;

  // slide to wherever the page says this scene belongs
  ndc += mix(uOffsetA, uOffsetB, e);

  // cursor force (positive pushes away, negative attracts)
  vec2 away = ndc - uPointer;
  away.x *= uAspect;
  float dist = length(away);
  vec2 push = (away / max(dist, 0.0001)) * uPointerForce * smoothstep(0.5, 0.0, dist);
  push.x /= uAspect;
  ndc += push;

  gl_Position = vec4(ndc, 0.0, 1.0);

  // Particles flare — larger and brighter — while they're in flight between
  // two shapes, so a morph reads as a surge of light crossing the screen
  // rather than the picture thinning out.
  float flare = arc;
  float size = mix(uSizeA, uSizeB, e) * (0.55 + aRand.w * 1.1) * (1.0 + flare * 0.7);
  gl_PointSize = clamp(size * uDpr * perspective, 0.0, 64.0);

  // fade out right at the lens and far in the distance, and twinkle
  float nearFade = smoothstep(0.3, 1.1, depth);
  float farFade = 1.0 - smoothstep(5.6, 7.6, depth);
  float twinkle = 0.72 + 0.28 * sin(uTime * 2.2 + aRand.z * 60.0);
  vAlpha = mix(uAlphaA, uAlphaB, e) * nearFade * farFade * twinkle * (1.0 + flare * 1.1);
  vColor = mix(aColorFrom, aColorTo, e);

  // behind the camera: throw the point away
  if (depth < 0.25) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  }
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  // Each sprite is a small bright core inside a much wider, faint halo.
  // Where particles crowd together the halos add up, which reads as bloom
  // without needing a separate blur pass.
  float d = length(gl_PointCoord - 0.5) * 2.0; // 0 at the center, 1 at the edge
  float core = smoothstep(0.4, 0.0, d);
  float halo = smoothstep(1.0, 0.0, d);
  float a = (core * core + halo * halo * 0.2) * vAlpha;
  // Mostly additive (the low alpha lets overlapping points glow) but not
  // fully, so dense areas like the logo keep their color instead of
  // burning out to white.
  gl_FragColor = vec4(vColor * a, a * 0.26);
}
`;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ParticleStage() {
  const canvasRef = useRef(null);
  const ambientRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    if (!gl) return undefined;

    /* ---- program ------------------------------------------------------ */
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) return undefined;
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    gl.useProgram(program);

    const uniform = (name) => gl.getUniformLocation(program, name);
    const U = {
      mix: uniform('uMix'),
      time: uniform('uTime'),
      aspect: uniform('uAspect'),
      dpr: uniform('uDpr'),
      kick: uniform('uKick'),
      pointer: uniform('uPointer'),
      pointerForce: uniform('uPointerForce'),
      A: {
        fx: uniform('uFxA'),
        wave: uniform('uWaveA'),
        rot: uniform('uRotA'),
        scale: uniform('uScaleA'),
        dolly: uniform('uDollyA'),
        offset: uniform('uOffsetA'),
        size: uniform('uSizeA'),
        alpha: uniform('uAlphaA'),
      },
      B: {
        fx: uniform('uFxB'),
        wave: uniform('uWaveB'),
        rot: uniform('uRotB'),
        scale: uniform('uScaleB'),
        dolly: uniform('uDollyB'),
        offset: uniform('uOffsetB'),
        size: uniform('uSizeB'),
        alpha: uniform('uAlphaB'),
      },
    };

    /* ---- particles ---------------------------------------------------- */
    // Fewer particles on small screens: phones have less fill-rate to spare
    // and the shapes are drawn smaller anyway.
    const isSmall = window.innerWidth < 720;
    const COUNT = isSmall ? 9000 : 22000;
    const rand = createRng(20260707);

    const makeBuffer = (name, size, data, usage) => {
      const buffer = gl.createBuffer();
      const location = gl.getAttribLocation(program, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
      return buffer;
    };

    const seeds = new Float32Array(COUNT * 4);
    for (let i = 0; i < seeds.length; i++) seeds[i] = rand();
    makeBuffer('aRand', 4, seeds, gl.STATIC_DRAW);

    const empty = new Float32Array(COUNT * 3);
    const buffers = {
      from: makeBuffer('aFrom', 3, empty, gl.DYNAMIC_DRAW),
      to: makeBuffer('aTo', 3, empty, gl.DYNAMIC_DRAW),
      colorFrom: makeBuffer('aColorFrom', 3, empty, gl.DYNAMIC_DRAW),
      colorTo: makeBuffer('aColorTo', 3, empty, gl.DYNAMIC_DRAW),
    };
    const upload = (buffer, data) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    };

    // Shapes are built the first time a scene needs them and then reused.
    const builders = {
      scatter: buildScatter,
      warp: buildWarp,
      neurolink: buildNeurolink,
      swarm: buildSwarm,
      nova: buildNova,
      wave: buildWave,
      network: buildNetwork,
    };
    const shapes = new Map();
    const shapeFor = (name) => {
      if (!shapes.has(name)) {
        // The logo is sampled from the PNG, which loads asynchronously —
        // until it arrives, stand in with the node network (same motif).
        const build = builders[name] ?? builders.network;
        shapes.set(name, build(COUNT, createRng(name.length * 7919 + 13)));
      }
      return shapes.get(name);
    };

    let uploadedPair = '';
    let disposed = false;

    const logoImage = new Image();
    logoImage.onload = () => {
      if (disposed) return;
      const SIZE = 256;
      const sampler = document.createElement('canvas');
      sampler.width = SIZE;
      sampler.height = SIZE;
      const ctx = sampler.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(logoImage, 0, 0, SIZE, SIZE);
      const logo = buildLogo(
        ctx.getImageData(0, 0, SIZE, SIZE),
        SIZE,
        COUNT,
        createRng(4242)
      );
      if (logo) {
        shapes.set('logo', logo);
        uploadedPair = ''; // force a re-upload on the next frame
      }
    };
    logoImage.src = '/synapse-logo.png';

    /* ---- GL state ------------------------------------------------------ */
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2);
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ---- cursor --------------------------------------------------------- */
    // Only a real mouse drives the cursor effects; on touch there is no
    // resting pointer position, so the force stays off.
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, targetStrength: 0 };
    const onPointerMove = (event) => {
      if (event.pointerType !== 'mouse') return;
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -((event.clientY / window.innerHeight) * 2 - 1);
      pointer.targetStrength = 1;
    };
    const onPointerLeave = () => {
      pointer.targetStrength = 0;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    /* ---- per-frame helpers ---------------------------------------------- */
    // Anchor lookups are cached per section — but only once found, so an
    // anchor that renders a moment after its section is still picked up.
    const anchorCache = new WeakMap();
    const anchorOf = (node) => {
      let anchor = anchorCache.get(node);
      if (!anchor || !anchor.isConnected) {
        anchor = node.querySelector('[data-stage-anchor]');
        if (anchor) anchorCache.set(node, anchor);
      }
      return anchor;
    };

    // Where on screen (in clip space) a scene sits, and how big it is.
    const placementOf = (node, scene, vw, vh, aspect) => {
      const anchor = node ? anchorOf(node) : null;
      if (anchor) {
        const r = anchor.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          return {
            x: ((r.left + r.width / 2) / vw) * 2 - 1,
            y: -(((r.top + r.height / 2) / vh) * 2 - 1),
            scale: Math.min((r.width / vw) * aspect, r.height / vh) * scene.fit,
          };
        }
      }
      return {
        x: 0,
        y: 0,
        scale: scene.fill ? scene.scale : Math.min(scene.scale, aspect * 0.92),
      };
    };

    // 0..1 progress through a pinned section's own scroll (0 for sections
    // that aren't tall enough to pin).
    const localProgress = (rect, vh) => {
      const travel = rect.height - vh;
      if (travel < vh * 0.25) return 0;
      return clamp01(-rect.top / travel);
    };

    const setSide = (side, scene, place, local, time, sizeScale) => {
      gl.uniform4f(side.fx, scene.fx[0], scene.fx[1], scene.fx[2], scene.fx[3]);
      gl.uniform1f(side.wave, scene.wave);
      gl.uniform2f(
        side.rot,
        scene.spin * time + scene.turn * local + pointer.x * pointer.strength * scene.parallax,
        scene.tilt - pointer.y * pointer.strength * scene.parallax * 0.6
      );
      gl.uniform1f(side.scale, place.scale);
      gl.uniform1f(side.dolly, scene.zShift + scene.dolly * local * local);
      gl.uniform2f(side.offset, place.x, place.y);
      gl.uniform1f(side.size, scene.size * sizeScale);
      gl.uniform1f(side.alpha, scene.alpha * (1 - scene.fade * local) * (isSmall ? 0.85 : 1));
    };

    /* ---- loop ------------------------------------------------------------ */
    const startedAt = performance.now();
    // If the page opens already scrolled (a #hash link, a reload mid-page),
    // skip the opening assemble animation.
    const skipIntro = window.scrollY > 40;
    let last = startedAt;
    let lastIndex = 0;
    let mix = 0;
    let kick = 0;
    let ambientKey = '';
    let raf = 0;

    // Adaptive quality: if the device can't keep up, draw fewer particles
    // rather than letting the whole page stutter. Because every shape
    // scatters its points in random order, drawing just the first N of them
    // is simply a sparser version of the same picture.
    const MIN_COUNT = 3500;
    let drawCount = COUNT;
    let sampleFrames = 0;
    let sampleSeconds = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const elapsed = (now - last) / 1000;
      const dt = Math.min(elapsed, 0.1);
      last = now;
      const time = (now - startedAt) / 1000;

      // Sample the frame rate in batches (ignoring long gaps, e.g. the tab
      // being in the background) and step the particle count down while it
      // stays below roughly 26 fps.
      if (elapsed < 0.25) {
        sampleFrames += 1;
        sampleSeconds += elapsed;
        if (sampleFrames >= 40) {
          if (sampleSeconds / sampleFrames > 1 / 26 && drawCount > MIN_COUNT) {
            drawCount = Math.max(MIN_COUNT, Math.round(drawCount * 0.65));
          }
          sampleFrames = 0;
          sampleSeconds = 0;
        }
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const aspect = vw / vh;

      const nodes = document.querySelectorAll('[data-scene]');
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (nodes.length === 0) return;

      // Which section is arriving? The last one whose top edge has come far
      // enough up the screen to start its morph.
      let index = 0;
      const rects = [];
      for (let i = 0; i < nodes.length; i++) {
        const rect = nodes[i].getBoundingClientRect();
        rects.push(rect);
        if (rect.top <= vh * ENTER_START) index = i;
      }

      const toNode = nodes[index];
      const fromNode = index > 0 ? nodes[index - 1] : null;
      const toKey = toNode.dataset.scene;
      const fromKey = fromNode ? fromNode.dataset.scene : 'scatter';
      const toScene = getScene(toKey);
      const fromScene = getScene(fromKey);

      // Target morph amount: scroll-driven between sections; time-driven for
      // the very first scene assembling out of the scatter cloud.
      let target;
      if (index === 0) {
        const intro = skipIntro ? 1 : clamp01(time / INTRO_SECONDS);
        target = 1 - Math.pow(1 - intro, 3);
      } else {
        target = clamp01((vh * ENTER_START - rects[index].top) / (vh * ENTER_SPAN));
      }

      if (index !== lastIndex) {
        // Crossing into a neighbouring segment continues seamlessly (the old
        // "to" shape is the new "from"); a bigger jump gets a burst.
        mix = index > lastIndex ? 0 : 1;
        if (Math.abs(index - lastIndex) > 1) kick = 1;
        lastIndex = index;
      }
      // Ease toward the scroll position so the motion has a little weight.
      mix += (target - mix) * (1 - Math.exp(-dt * 9));
      kick *= Math.exp(-dt * 3.2);

      // Upload shapes only when the pair of scenes changes.
      const pair = `${fromScene.shape}>${toScene.shape}`;
      if (pair !== uploadedPair) {
        const from = shapeFor(fromScene.shape);
        const to = shapeFor(toScene.shape);
        upload(buffers.from, from.positions);
        upload(buffers.colorFrom, from.colors);
        upload(buffers.to, to.positions);
        upload(buffers.colorTo, to.colors);
        uploadedPair = pair;
      }

      // Shift the page's ambient glow to the arriving scene's color.
      if (toKey !== ambientKey) {
        // ...and pulse it, so each new scene arrives with a flash of its
        // own color (skipped for the very first scene on load).
        if (ambientKey !== '' && ambientRef.current?.animate) {
          ambientRef.current.animate(
            [{ opacity: 1 }, { opacity: 0.6 }],
            { duration: 1100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
          );
        }
        ambientKey = toKey;
        document.documentElement.style.setProperty('--ambient', toScene.ambient);
      }

      // Tell the rest of the app which scene is on screen (for the HUD). The
      // store ignores repeats, so calling this every frame is cheap.
      setStageScene(toKey, index, nodes.length);

      // smooth the cursor
      const follow = 1 - Math.exp(-dt * 6);
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
      pointer.strength += (pointer.targetStrength - pointer.strength) * follow;

      // Scale points with the viewport, and enlarge them slightly when
      // fewer are being drawn so the picture doesn't thin out as much.
      const sizeScale =
        Math.min(1.3, Math.max(0.75, vh / 900)) * Math.pow(COUNT / drawCount, 0.3);
      setSide(
        U.A,
        fromScene,
        placementOf(fromNode, fromScene, vw, vh, aspect),
        fromNode ? localProgress(rects[index - 1], vh) : 0,
        time,
        sizeScale
      );
      setSide(
        U.B,
        toScene,
        placementOf(toNode, toScene, vw, vh, aspect),
        localProgress(rects[index], vh),
        time,
        sizeScale
      );

      gl.uniform1f(U.mix, mix);
      gl.uniform1f(U.time, time);
      gl.uniform1f(U.aspect, aspect);
      gl.uniform1f(U.dpr, dpr);
      gl.uniform1f(U.kick, kick);
      gl.uniform2f(U.pointer, pointer.x, pointer.y);
      gl.uniform1f(
        U.pointerForce,
        (fromScene.pointer + (toScene.pointer - fromScene.pointer) * mix) * pointer.strength
      );

      gl.drawArrays(gl.POINTS, 0, drawCount);
    };

    // Don't burn battery while the tab is in the background.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    raf = requestAnimationFrame(frame);
    setStageActive(true);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      document.documentElement.style.removeProperty('--ambient');
      setStageActive(false);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      Object.values(buffers).forEach((buffer) => gl.deleteBuffer(buffer));
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <>
      <div ref={ambientRef} className="stage-ambient" aria-hidden="true" />
      <canvas ref={canvasRef} className="particle-stage" aria-hidden="true" />
    </>
  );
}
