import * as THREE from "three";
import { mergeBufferGeometries } from "three-stdlib";

/**
 * Procedurally sculpts an anatomically-believable molar as a single seamless
 * BufferGeometry — no external model file required.
 *
 * Pipeline:
 *  1. Start from a high-subdivision icosphere (smooth, even topology).
 *  2. Map it toward a rounded cuboid (superquadric) to get a chunky crown.
 *  3. Sculpt occlusal cusps + a cross-shaped central fissure on the biting
 *     surface, taper the neck, and add fine enamel micro-noise.
 *  4. Graft on two gently-curved, tapering roots.
 *
 * The result has proper soft edges and surface variation that, combined with a
 * translucent PBR enamel material and post-processing, reads as a real tooth.
 */

// Smooth bump kernel.
const gauss = (d: number, s: number) => Math.exp(-(d * d) / (2 * s * s));

function buildCrown(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, 14).toNonIndexed();
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();

  // The four cusp centres on the occlusal (top) plane.
  const cusps = [
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(-0.5, 0.5),
    new THREE.Vector2(0.5, -0.5),
    new THREE.Vector2(-0.5, -0.5),
  ];

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const dir = v.clone().normalize();

    // 1) Sphere -> rounded cuboid via p-norm.
    const p = 4.0;
    const pn = Math.pow(
      Math.pow(Math.abs(dir.x), p) +
        Math.pow(Math.abs(dir.y), p) +
        Math.pow(Math.abs(dir.z), p),
      -1 / p
    );
    v.copy(dir).multiplyScalar(pn);

    // 2) Crown proportions (wide, slightly squat).
    v.x *= 0.92;
    v.z *= 0.92;
    v.y *= 1.02;

    // 3) Neck taper — pinch inward toward the gumline (low y).
    const neck = THREE.MathUtils.smoothstep(v.y, -1.0, 0.25); // 0 at base, 1 up top
    const taper = THREE.MathUtils.lerp(0.74, 1.0, neck);
    v.x *= taper;
    v.z *= taper;

    // 4) Occlusal sculpting on the top third.
    const topMask = THREE.MathUtils.smoothstep(v.y, 0.15, 0.6);
    if (topMask > 0.001) {
      // cusps
      let bump = 0;
      for (const c of cusps) {
        const d = Math.hypot(v.x - c.x, v.z - c.y);
        bump += gauss(d, 0.34) * 0.3;
      }
      // central cross fissure (lower the grooves along x≈0 and z≈0)
      const groove =
        Math.min(gauss(v.x, 0.12), 1) * 0.14 +
        Math.min(gauss(v.z, 0.12), 1) * 0.14;
      v.y += (bump - groove * 0.5) * topMask;
    }

    // 5) Fine enamel micro-surface noise.
    const n =
      Math.sin(v.x * 14.0) * Math.cos(v.z * 13.0) * Math.sin(v.y * 11.0);
    v.addScaledVector(dir, n * 0.012);

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  // Shift so the crown sits above the origin; roots will hang below.
  geo.translate(0, 0.45, 0);
  geo.scale(0.95, 1.05, 0.95);
  return geo;
}

function buildRoot(curveOut: number, lean: number): THREE.BufferGeometry {
  // A tapered, gently curved root built by bending a cylinder along its length.
  const geo = new THREE.CylinderGeometry(0.3, 0.05, 1.9, 20, 8, false)
    .toNonIndexed();
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // y goes from +0.95 (top) to -0.95 (tip). Normalize 0..1 downward.
    const t = (0.95 - v.y) / 1.9;
    // curve outward toward the tip
    v.x += Math.sin(t * Math.PI * 0.5) * curveOut;
    v.z += Math.sin(t * Math.PI * 0.5) * curveOut * 0.4;
    // slight surface irregularity
    v.x += Math.sin(v.y * 20 + i) * 0.004;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  // position under the crown, leaning apart
  geo.translate(lean, -1.05, 0);
  return geo;
}

let cached: THREE.BufferGeometry | null = null;

/** Returns a shared, merged tooth geometry (built once, reused everywhere). */
export function getToothGeometry(): THREE.BufferGeometry {
  if (cached) return cached;
  const crown = buildCrown();
  const rootL = buildRoot(-0.28, -0.34);
  const rootR = buildRoot(0.28, 0.34);
  const merged = mergeBufferGeometries([crown, rootL, rootR], false);
  if (!merged) throw new Error("Failed to merge tooth geometry");
  merged.computeVertexNormals();
  merged.computeBoundingSphere();
  cached = merged;
  return merged;
}
