// Particle "shapes" for the scroll-driven WebGL stage (see ParticleStage.jsx).
//
// Every builder returns the same thing — `count` points as flat
// Float32Arrays of xyz positions and rgb colors — so the stage can morph any
// shape into any other just by blending two buffers. Shapes live in a small
// "world" where a radius of ~1 fills the height of whatever box the shape is
// anchored to on the page.
//
// Each shape is a visual stand-in for something real on the site:
//   logo        — the actual SYNAPSE logo, sampled pixel-by-pixel
//   warp        — a starfield rushing at the camera (hand-off into Projects)
//   neurolink   — a cyberpunk city corridor with link-gates (NEUROLINK)
//   dark-swarm  — a murmuration that follows the cursor (Dark Swarm)
//   nova        — a pulsing star with orbit rings (NOVA)
//   wave        — a rolling terrain of light (About)
//   network     — nodes joined by links, echoing the logo mark (Vision)

const TAU = Math.PI * 2;

// Depth range used by "flow" shapes (points that travel toward the camera
// and wrap around). Shared with the vertex shader so both agree on where the
// wrap happens. The range sits well in front of the camera (which is at
// z = 3.2), so a flowing shape stays a readable picture; a scene that should
// rush *past* the lens instead (the warp starfield) is pulled forward with
// its `zShift` in scenes.js.
export const FLOW_Z_MIN = -4.4;
export const FLOW_Z_LEN = 5.0;

/**
 * Small deterministic PRNG (mulberry32). Seeded so every visitor — and every
 * reload — gets the same composition instead of a different random one.
 */
export function createRng(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Normally-distributed random number (Box–Muller), for soft clusters. */
function gauss(rand) {
  const u = Math.max(rand(), 1e-6);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

/** '#rrggbb' -> [r, g, b] in 0..1 */
function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/**
 * Builds a weighted color picker from [[hex, weight], ...] so a shape can
 * be "mostly teal with a few magenta sparks" without repeating that logic.
 */
function palette(entries) {
  const colors = entries.map(([hex]) => rgb(hex));
  const weights = entries.map(([, w]) => w);
  const total = weights.reduce((sum, w) => sum + w, 0);
  return (rand) => {
    let r = rand() * total;
    for (let i = 0; i < colors.length; i++) {
      r -= weights[i];
      if (r <= 0) return colors[i];
    }
    return colors[colors.length - 1];
  };
}

function alloc(count) {
  return {
    positions: new Float32Array(count * 3),
    colors: new Float32Array(count * 3),
  };
}

/** Writes point `i` into a shape; `gain` dims or brightens its color. */
function put(shape, i, x, y, z, color, gain = 1) {
  const o = i * 3;
  shape.positions[o] = x;
  shape.positions[o + 1] = y;
  shape.positions[o + 2] = z;
  shape.colors[o] = color[0] * gain;
  shape.colors[o + 1] = color[1] * gain;
  shape.colors[o + 2] = color[2] * gain;
}

/* --------------------------------------------------------------------------
   scatter — loose cloud the logo assembles out of when the page first loads
   -------------------------------------------------------------------------- */
export function buildScatter(count, rand) {
  const shape = alloc(count);
  const pick = palette([
    ['#4cc9f0', 3],
    ['#f72585', 3],
    ['#f7f3ec', 2],
    ['#ff9d4d', 1],
  ]);
  for (let i = 0; i < count; i++) {
    // uniform direction on a sphere, radius biased outward
    const theta = rand() * TAU;
    const cosPhi = rand() * 2 - 1;
    const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
    const r = 0.9 + Math.cbrt(rand()) * 2.4;
    put(
      shape,
      i,
      Math.cos(theta) * sinPhi * r,
      cosPhi * r * 0.75,
      Math.sin(theta) * sinPhi * r,
      pick(rand),
      0.35 + rand() * 0.5
    );
  }
  return shape;
}

/* --------------------------------------------------------------------------
   logo — the real SYNAPSE logo. Pixels of the PNG become particles, keeping
   each pixel's own color, so the mark and its cyan/magenta are untouched.
   Coordinates map the image square onto [-1, 1], which lets the stage lay
   the particle logo exactly over the <img> it replaces.
   -------------------------------------------------------------------------- */
export function buildLogo(imageData, size, count, rand) {
  const shape = alloc(count);
  const { data } = imageData;

  // collect every visibly-opaque pixel as a candidate position
  const candidates = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const o = (y * size + x) * 4;
      if (data[o + 3] > 70) candidates.push(o);
    }
  }
  if (candidates.length === 0) return null;

  for (let i = 0; i < count; i++) {
    const o = candidates[Math.floor(rand() * candidates.length)];
    const px = (o / 4) % size;
    const py = Math.floor(o / 4 / size);
    // jitter inside the pixel so particles don't sit on a visible grid
    const x = ((px + rand()) / size - 0.5) * 2;
    const y = -((py + rand()) / size - 0.5) * 2;
    const alpha = data[o + 3] / 255;
    put(
      shape,
      i,
      x,
      y,
      gauss(rand) * 0.012,
      [data[o] / 255, data[o + 1] / 255, data[o + 2] / 255],
      0.55 + alpha * 0.6
    );
  }
  return shape;
}

/* --------------------------------------------------------------------------
   warp — streaks of light rushing past the camera
   -------------------------------------------------------------------------- */
export function buildWarp(count, rand) {
  const shape = alloc(count);
  const pick = palette([
    ['#f7f3ec', 4],
    ['#ffd166', 3],
    ['#ff9d4d', 3],
    ['#4cc9f0', 1],
    ['#f72585', 1],
  ]);
  const STREAK = 8; // points per streak, trailing back along z
  for (let i = 0; i < count; i += STREAK) {
    const theta = rand() * TAU;
    const r = 0.22 + Math.sqrt(rand()) * 2.3;
    const z = FLOW_Z_MIN + rand() * FLOW_Z_LEN;
    const color = pick(rand);
    for (let k = 0; k < STREAK && i + k < count; k++) {
      // brightest at the head, fading down the tail
      put(
        shape,
        i + k,
        Math.cos(theta) * r,
        Math.sin(theta) * r * 0.72,
        z - k * 0.05,
        color,
        1 - k * 0.115
      );
    }
  }
  return shape;
}

/* --------------------------------------------------------------------------
   neurolink — a cyberpunk city corridor: grid floor, wireframe towers on
   both sides, and ring "link gates" to fly through. Everything flows toward
   the camera, so the visitor is always travelling deeper into the city.
   -------------------------------------------------------------------------- */
export function buildNeurolink(count, rand) {
  const shape = alloc(count);
  const teal = rgb('#5eead4');
  const cyan = rgb('#4cc9f0');
  const magenta = rgb('#f72585');
  const amber = rgb('#ffd166');
  const FLOOR = -0.6;
  const zAt = () => FLOW_Z_MIN + rand() * FLOW_Z_LEN;

  // Pre-generate the towers so particles can be scattered over their edges:
  // a low row right beside the corridor and a taller row behind it.
  const towers = [];
  for (let i = 0; i < 30; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const front = i % 4 < 2;
    towers.push({
      x: side * (front ? 0.52 + rand() * 0.16 : 0.9 + rand() * 0.5),
      z: zAt(),
      w: 0.08 + rand() * 0.07,
      d: 0.08 + rand() * 0.1,
      h: front ? 0.45 + rand() * 0.7 : 0.9 + rand() * 1.2,
      color: rand() < 0.2 ? magenta : rand() < 0.75 ? teal : cyan,
    });
  }

  for (let i = 0; i < count; i++) {
    const roll = rand();

    if (roll < 0.2) {
      // floor grid: lanes running into the distance, and rows across them
      if (rand() < 0.6) {
        const lane = Math.round((rand() * 2 - 1) * 8) * 0.2;
        put(shape, i, lane, FLOOR, zAt(), teal, 0.5);
      } else {
        const row = FLOW_Z_MIN + Math.floor(rand() * 24) * (FLOW_Z_LEN / 24);
        put(shape, i, (rand() * 2 - 1) * 1.6, FLOOR, row, teal, 0.36);
      }
    } else if (roll < 0.88) {
      // towers
      const t = towers[Math.floor(rand() * towers.length)];
      const cornerX = t.x + (rand() < 0.5 ? -t.w : t.w);
      const cornerZ = t.z + (rand() < 0.5 ? -t.d : t.d);
      const kind = rand();
      if (kind < 0.42) {
        // the four vertical edges
        put(shape, i, cornerX, FLOOR + rand() * t.h, cornerZ, t.color, 1);
      } else if (kind < 0.9) {
        // outlines: the roof, and one per storey below it
        const level = kind < 0.56 ? t.h : Math.floor(rand() * (t.h / 0.11)) * 0.11;
        const alongX = rand() < 0.5;
        const x = alongX ? t.x + (rand() * 2 - 1) * t.w : cornerX;
        const z = alongX ? cornerZ : t.z + (rand() * 2 - 1) * t.d;
        const lit = kind >= 0.56 && rand() < 0.22; // a lit window
        put(shape, i, x, FLOOR + level, z, lit ? amber : t.color, lit ? 1 : 0.7);
      } else {
        // a beacon mast on the roof
        put(shape, i, t.x, FLOOR + t.h + rand() * 0.16, t.z, magenta, 1);
      }
    } else if (roll < 0.95) {
      // link gates: rings spaced along the corridor
      const gate = Math.floor(rand() * 5);
      const a = rand() * TAU;
      const r = 0.36 + gauss(rand) * 0.004;
      put(
        shape,
        i,
        Math.cos(a) * r,
        -0.14 + Math.sin(a) * r,
        FLOW_Z_MIN + gate * (FLOW_Z_LEN / 5) + 0.3,
        gate % 2 === 0 ? cyan : magenta,
        0.95
      );
    } else {
      // traffic: thin trails of light overhead
      const trail = Math.floor(rand() * 7);
      const x = (trail - 3) * 0.13;
      const y = 0.32 + (trail % 3) * 0.16;
      put(shape, i, x, y, zAt(), trail % 2 === 0 ? amber : cyan, 0.75);
    }
  }
  return shape;
}

/* --------------------------------------------------------------------------
   dark-swarm — one large flock on a twisting path plus two smaller ones.
   The stage swirls it and pulls it toward the cursor, so it behaves like a
   swarm reacting to the visitor.
   -------------------------------------------------------------------------- */
export function buildSwarm(count, rand) {
  const shape = alloc(count);
  const pick = palette([
    ['#ec4899', 5],
    ['#a855f7', 4],
    ['#f72585', 2],
    ['#f7f3ec', 1],
  ]);
  for (let i = 0; i < count; i++) {
    const roll = rand();
    if (roll < 0.78) {
      // main flock: a figure-eight band, thick in the middle of each lobe
      const u = rand() * TAU;
      const thick = 0.035 + 0.1 * Math.abs(Math.sin(u * 1.5));
      put(
        shape,
        i,
        Math.cos(u) * 0.92 + gauss(rand) * thick,
        Math.sin(u * 2) * 0.36 + gauss(rand) * thick,
        Math.sin(u) * 0.62 + gauss(rand) * thick,
        pick(rand),
        0.55 + rand() * 0.45
      );
    } else if (roll < 0.92) {
      // satellite flocks
      const cx = rand() < 0.5 ? -0.55 : 0.6;
      const cy = cx < 0 ? 0.55 : -0.5;
      put(
        shape,
        i,
        cx + gauss(rand) * 0.13,
        cy + gauss(rand) * 0.1,
        gauss(rand) * 0.13,
        pick(rand),
        0.7
      );
    } else {
      // stragglers drifting in the dark around the flock
      const a = rand() * TAU;
      const r = 0.6 + rand() * 0.9;
      put(
        shape,
        i,
        Math.cos(a) * r,
        gauss(rand) * 0.4,
        Math.sin(a) * r,
        pick(rand),
        0.3
      );
    }
  }
  return shape;
}

/* --------------------------------------------------------------------------
   nova — a bright core, a shell, tilted orbit rings and a faint halo
   -------------------------------------------------------------------------- */
export function buildNova(count, rand) {
  const shape = alloc(count);
  const blue = rgb('#60a5fa');
  const ice = rgb('#bfdbfe');
  const white = rgb('#f7f3ec');
  const violet = rgb('#818cf8');
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const roll = rand();
    if (roll < 0.2) {
      // core
      const r = Math.abs(gauss(rand)) * 0.1;
      const a = rand() * TAU;
      const b = Math.acos(rand() * 2 - 1);
      put(
        shape,
        i,
        Math.cos(a) * Math.sin(b) * r,
        Math.cos(b) * r,
        Math.sin(a) * Math.sin(b) * r,
        white,
        1
      );
    } else if (roll < 0.58) {
      // shell: evenly spread over a sphere (fibonacci lattice)
      const k = Math.floor(rand() * 2400);
      const y = 1 - (k / 2399) * 2;
      const ring = Math.sqrt(1 - y * y);
      const a = k * GOLDEN;
      const r = 0.5 + gauss(rand) * 0.006;
      put(
        shape,
        i,
        Math.cos(a) * ring * r,
        y * r,
        Math.sin(a) * ring * r,
        rand() < 0.7 ? blue : ice,
        0.75
      );
    } else if (roll < 0.9) {
      // orbit rings, each tilted on a different axis
      const ringIndex = Math.floor(rand() * 3);
      const r = 0.74 + ringIndex * 0.14 + gauss(rand) * 0.005;
      const a = rand() * TAU;
      const tilt = [0.42, -0.6, 1.05][ringIndex];
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      put(
        shape,
        i,
        x * Math.cos(tilt),
        x * Math.sin(tilt),
        z,
        ringIndex === 1 ? violet : ice,
        0.85
      );
    } else {
      // halo
      const a = rand() * TAU;
      const b = Math.acos(rand() * 2 - 1);
      const r = 0.6 + rand() * 0.7;
      put(
        shape,
        i,
        Math.cos(a) * Math.sin(b) * r,
        Math.cos(b) * r,
        Math.sin(a) * Math.sin(b) * r,
        blue,
        0.28
      );
    }
  }
  return shape;
}

/* --------------------------------------------------------------------------
   wave — rows of light forming a terrain; the shader makes it roll
   -------------------------------------------------------------------------- */
export function buildWave(count, rand) {
  const shape = alloc(count);
  const pick = palette([
    ['#ff9d4d', 5],
    ['#ffd166', 3],
    ['#f7f3ec', 1],
  ]);
  const ROWS = 46;
  for (let i = 0; i < count; i++) {
    const row = Math.floor(rand() * ROWS);
    put(
      shape,
      i,
      (rand() * 2 - 1) * 3,
      -0.4,
      FLOW_Z_MIN + (row / ROWS) * FLOW_Z_LEN,
      pick(rand),
      0.6 + rand() * 0.4
    );
  }
  return shape;
}

/* --------------------------------------------------------------------------
   network — nodes on a sphere joined to their nearest neighbours: the logo
   mark's "connected nodes" idea, opened up into three dimensions
   -------------------------------------------------------------------------- */
export function buildNetwork(count, rand) {
  const shape = alloc(count);
  const nodeColors = [rgb('#4cc9f0'), rgb('#f72585'), rgb('#ffd166')];
  const NODES = 26;
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));

  const nodes = [];
  for (let k = 0; k < NODES; k++) {
    const y = 1 - (k / (NODES - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const a = k * GOLDEN + rand() * 0.5;
    const r = 0.82 + rand() * 0.16;
    nodes.push({
      x: Math.cos(a) * ring * r,
      y: y * r,
      z: Math.sin(a) * ring * r,
      color: nodeColors[k % nodeColors.length],
    });
  }

  // each node links to its two nearest neighbours
  const edges = [];
  nodes.forEach((n, i) => {
    const nearest = nodes
      .map((m, j) => ({ j, d: Math.hypot(n.x - m.x, n.y - m.y, n.z - m.z) }))
      .filter((e) => e.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    nearest.forEach((e) => edges.push([i, e.j]));
  });

  for (let i = 0; i < count; i++) {
    if (rand() < 0.38) {
      const n = nodes[Math.floor(rand() * NODES)];
      put(
        shape,
        i,
        n.x + gauss(rand) * 0.028,
        n.y + gauss(rand) * 0.028,
        n.z + gauss(rand) * 0.028,
        n.color,
        1
      );
    } else {
      const [ai, bi] = edges[Math.floor(rand() * edges.length)];
      const a = nodes[ai];
      const b = nodes[bi];
      const t = rand();
      put(
        shape,
        i,
        a.x + (b.x - a.x) * t + gauss(rand) * 0.005,
        a.y + (b.y - a.y) * t + gauss(rand) * 0.005,
        a.z + (b.z - a.z) * t + gauss(rand) * 0.005,
        [
          a.color[0] + (b.color[0] - a.color[0]) * t,
          a.color[1] + (b.color[1] - a.color[1]) * t,
          a.color[2] + (b.color[2] - a.color[2]) * t,
        ],
        0.6
      );
    }
  }
  return shape;
}
