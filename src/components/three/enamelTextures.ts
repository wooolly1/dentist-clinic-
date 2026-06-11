import * as THREE from "three";

/**
 * Generates subtle enamel surface maps procedurally on a <canvas> (client-side
 * only) so the tooth has believable micro-roughness and tiny imperfections
 * without shipping any image files.
 *
 * Returns a roughness map (varied gloss) and a bump map (fine pitting + faint
 * vertical enamel striations), both tiling.
 */
function valueNoise(w: number, h: number, scale: number, seed = 1) {
  const data = new Float32Array(w * h);
  // cheap hash-based value noise with bilinear smoothing
  const hash = (x: number, y: number) => {
    const n = Math.sin((x * 127.1 + y * 311.7 + seed * 13.3)) * 43758.5453;
    return n - Math.floor(n);
  };
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const fx = x / scale;
      const fy = y / scale;
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const tx = fx - x0;
      const ty = fy - y0;
      const sx = tx * tx * (3 - 2 * tx);
      const sy = ty * ty * (3 - 2 * ty);
      const n00 = hash(x0, y0);
      const n10 = hash(x0 + 1, y0);
      const n01 = hash(x0, y0 + 1);
      const n11 = hash(x0 + 1, y0 + 1);
      data[y * w + x] = lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy);
    }
  }
  return data;
}

let cache: { roughnessMap: THREE.Texture; bumpMap: THREE.Texture } | null = null;

export function getEnamelTextures() {
  if (cache) return cache;
  if (typeof document === "undefined") {
    // SSR guard — should never run since the canvas is client-only.
    return { roughnessMap: null, bumpMap: null } as unknown as NonNullable<
      typeof cache
    >;
  }

  const S = 256;
  const make = (draw: (d: ImageData) => void) => {
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(S, S);
    draw(img);
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.anisotropy = 4;
    return tex;
  };

  const fine = valueNoise(S, S, 5, 7);
  const broad = valueNoise(S, S, 26, 3);

  const roughnessMap = make((img) => {
    for (let i = 0; i < S * S; i++) {
      // Mostly glossy (low roughness) with faint matte patches.
      const r = 0.18 + broad[i] * 0.28 + fine[i] * 0.08;
      const val = Math.min(255, Math.max(0, r * 255));
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = val;
      img.data[i * 4 + 3] = 255;
    }
  });

  const bumpMap = make((img) => {
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const i = y * S + x;
        // faint vertical striations + pitting
        const stria = Math.sin(x * 0.5) * 0.5 + 0.5;
        const val = (fine[i] * 0.6 + stria * 0.15 + broad[i] * 0.25) * 255;
        const c = Math.min(255, Math.max(0, val));
        img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = c;
        img.data[i * 4 + 3] = 255;
      }
    }
  });

  cache = { roughnessMap, bumpMap };
  return cache;
}
