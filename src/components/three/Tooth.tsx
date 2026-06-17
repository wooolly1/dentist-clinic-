"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { Tooth as ToothData } from "@/data/clinic";

/**
 * A single procedural tooth. The crown shape is driven by the tooth archetype
 * (incisor / canine / premolar / molar). The whole tooth is one interactive
 * unit: hovering washes it in warm gold, clicking selects it. Positioning and
 * arch orientation are handled by the parent <Jaw>.
 */

const ENAMEL = {
  color: "#fbfcfe",
  roughness: 0.18,
  clearcoat: 1,
  clearcoatRoughness: 0.12,
};

interface ToothProps {
  tooth: ToothData;
  position: [number, number, number];
  rotationY: number;
  /** Upper-arch teeth are flipped so the crown points downward. */
  flip: boolean;
  selected: boolean;
  dimmed: boolean;
  onSelect: (t: ToothData) => void;
  onHover: (t: ToothData | null) => void;
}

export default function Tooth({
  tooth,
  position,
  rotationY,
  flip,
  selected,
  dimmed,
  onSelect,
  onHover,
}: ToothProps) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  const [hovered, setHovered] = useState(false);

  const shape = tooth.type.shape;

  // Crown dimensions per archetype.
  const dims = useMemo<{
    crown: [number, number, number];
    radius: number;
    cusps: [number, number, number][];
    tip: boolean;
  }>(() => {
    switch (shape) {
      case "incisor":
        return { crown: [0.5, 0.74, 0.26], radius: 0.07, cusps: [], tip: false };
      case "canine":
        return { crown: [0.46, 0.74, 0.34], radius: 0.1, cusps: [], tip: true };
      case "premolar":
        return {
          crown: [0.56, 0.58, 0.5],
          radius: 0.13,
          cusps: [
            [-0.13, 0.3, 0],
            [0.13, 0.3, 0],
          ],
          tip: false,
        };
      default: // molar
        return {
          crown: [0.76, 0.56, 0.68],
          radius: 0.15,
          cusps: [
            [-0.18, 0.28, -0.16],
            [0.18, 0.28, -0.16],
            [-0.18, 0.28, 0.16],
            [0.18, 0.28, 0.16],
          ],
          tip: false,
        };
    }
  }, [shape]);

  // Smoothly animate highlight + lift.
  const target = selected ? 1 : hovered ? 0.6 : 0;
  useFrame(() => {
    if (mat.current) {
      mat.current.emissiveIntensity = THREE.MathUtils.lerp(
        mat.current.emissiveIntensity,
        target * 0.9,
        0.18
      );
      const op = dimmed && !selected && !hovered ? 0.55 : 1;
      mat.current.opacity = THREE.MathUtils.lerp(mat.current.opacity, op, 0.18);
    }
    if (group.current) {
      const lift = selected ? 0.16 : hovered ? 0.09 : 0;
      group.current.position.y = THREE.MathUtils.lerp(
        group.current.position.y,
        position[1] + lift,
        0.18
      );
      const s = selected ? 1.08 : hovered ? 1.05 : 1;
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, s, 0.18));
    }
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(tooth);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHover(null);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(tooth);
      }}
    >
      <group rotation={[flip ? Math.PI : 0, 0, 0]}>
        <RoundedBox args={dims.crown} radius={dims.radius} smoothness={4}>
          <meshPhysicalMaterial
            ref={mat}
            {...ENAMEL}
            emissive={"#d9a648"}
            emissiveIntensity={0}
            transparent
            opacity={1}
          />
        </RoundedBox>

        {dims.cusps.map((c, i) => (
          <mesh key={i} position={c}>
            <sphereGeometry args={[dims.crown[0] * 0.22, 16, 16]} />
            <meshPhysicalMaterial {...ENAMEL} />
          </mesh>
        ))}

        {dims.tip && (
          <mesh position={[0, 0.42, 0]}>
            <coneGeometry args={[0.18, 0.26, 16]} />
            <meshPhysicalMaterial {...ENAMEL} />
          </mesh>
        )}

        {/* short root tucked into the gum */}
        <mesh position={[0, -0.5, 0]}>
          <coneGeometry args={[dims.crown[0] * 0.34, 0.6, 12]} />
          <meshStandardMaterial color="#efe2d2" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}
