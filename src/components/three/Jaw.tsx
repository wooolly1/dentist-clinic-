"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TEETH, type Tooth as ToothData } from "@/data/clinic";
import Tooth from "./Tooth";

/**
 * The full mouth: an upper and lower dental arch of 32 procedural teeth laid
 * out along an elliptical curve, with soft gum ridges. Idly breathes so the
 * model feels alive; user orbit is handled by the parent canvas.
 */

const ARCH = { a: 2.05, b: 2.65, yUpper: 0.92, yLower: -0.92 };

/** Position + radial orientation for a tooth along the arch. */
function layout(side: "L" | "R", pos: number) {
  const angle = THREE.MathUtils.degToRad(8 + pos * 11.2);
  const sign = side === "R" ? 1 : -1;
  const x = sign * ARCH.a * Math.sin(angle);
  const z = ARCH.b * Math.cos(angle);
  return { x, z, rotY: Math.atan2(x, z) };
}

function GumRidge({ y, flip }: { y: number; flip: boolean }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let a = -90; a <= 90; a += 6) {
      const ang = THREE.MathUtils.degToRad(a);
      pts.push(
        new THREE.Vector3(ARCH.a * Math.sin(ang), 0, ARCH.b * Math.cos(ang))
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts, false);
    return new THREE.TubeGeometry(curve, 80, 0.34, 16, false);
  }, []);

  return (
    <mesh geometry={geo} position={[0, y + (flip ? 0.28 : -0.28), 0]}>
      <meshStandardMaterial color="#e6798b" roughness={0.55} />
    </mesh>
  );
}

interface JawProps {
  selectedId: string | null;
  onSelect: (t: ToothData) => void;
  onHover: (t: ToothData | null) => void;
}

export default function Jaw({ selectedId, onSelect, onHover }: JawProps) {
  const root = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;
    // gentle breathing sway when idle
    root.current.rotation.z = Math.sin(t * 0.4) * 0.015;
    root.current.position.y = Math.sin(t * 0.6) * 0.03;
  });

  return (
    <group ref={root}>
      <GumRidge y={ARCH.yUpper} flip />
      <GumRidge y={ARCH.yLower} flip={false} />

      {TEETH.map((tooth) => {
        const { x, z, rotY } = layout(tooth.side, tooth.pos);
        const y = tooth.arch === "upper" ? ARCH.yUpper : ARCH.yLower;
        return (
          <Tooth
            key={tooth.id}
            tooth={tooth}
            position={[x, y, z]}
            rotationY={rotY}
            flip={tooth.arch === "upper"}
            selected={selectedId === tooth.id}
            dimmed={selectedId !== null}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
    </group>
  );
}
