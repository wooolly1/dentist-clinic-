"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { ProblemVisual } from "@/data/problems";

/**
 * A stylised-yet-believable procedural tooth assembled from primitives:
 * an enamel crown (rounded box with cusps) sitting on tapered roots.
 * The `variant` drives condition-specific overlays — a decay pocket, an
 * internal infection glow, a crack, or an implant post.
 *
 * Everything is generated in code so the experience ships with zero binary
 * 3D assets while still feeling tactile and dimensional.
 */
export default function ToothMesh({
  variant = "cavity",
  floatSeed = 0,
}: {
  variant?: ProblemVisual;
  floatSeed?: number;
}) {
  const group = useRef<THREE.Group>(null);

  const enamel = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f3f6fb",
        roughness: 0.25,
        metalness: 0.05,
        clearcoat: 0.9,
        clearcoatRoughness: 0.15,
        sheen: 1,
        sheenColor: new THREE.Color("#dbeafe"),
        transmission: 0.04,
      }),
    []
  );

  const rootMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e9d8c4",
        roughness: 0.6,
        metalness: 0,
      }),
    []
  );

  // Gentle idle float + breathing rotation.
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + floatSeed;
    group.current.position.y = Math.sin(t * 0.8) * 0.08;
    group.current.rotation.y = Math.sin(t * 0.35) * 0.25;
    group.current.rotation.z = Math.cos(t * 0.3) * 0.05;
  });

  // Cusp bump positions on top of the crown.
  const cusps = useMemo(
    () => [
      [-0.45, 0.72, -0.45],
      [0.45, 0.72, -0.45],
      [-0.45, 0.72, 0.45],
      [0.45, 0.72, 0.45],
    ],
    []
  );

  const isMissing = variant === "missing";

  return (
    <group ref={group} scale={1.1}>
      {!isMissing ? (
        <>
          {/* Crown */}
          <RoundedBox
            args={[1.4, 1.2, 1.4]}
            radius={0.42}
            smoothness={6}
            position={[0, 0.35, 0]}
            material={enamel}
          />
          {/* Cusps */}
          {cusps.map((p, i) => (
            <mesh key={i} position={p as [number, number, number]} material={enamel}>
              <sphereGeometry args={[0.3, 24, 24]} />
            </mesh>
          ))}

          {/* Roots */}
          <mesh position={[-0.32, -0.95, 0]} rotation={[0, 0, 0.18]} material={rootMat}>
            <coneGeometry args={[0.34, 1.6, 20]} />
          </mesh>
          <mesh position={[0.32, -0.95, 0]} rotation={[0, 0, -0.18]} material={rootMat}>
            <coneGeometry args={[0.34, 1.6, 20]} />
          </mesh>

          <VariantOverlay variant={variant} />
        </>
      ) : (
        <ImplantAssembly enamel={enamel} />
      )}
    </group>
  );
}

/** Condition-specific decorations layered onto the tooth. */
function VariantOverlay({ variant }: { variant: ProblemVisual }) {
  const glow = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (glow.current) {
      const m = glow.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.4 + Math.sin(s.clock.elapsedTime * 3) * 0.6;
    }
  });

  switch (variant) {
    case "cavity":
      // Dark decay pocket eating into the crown surface.
      return (
        <mesh position={[0.5, 0.55, 0.55]}>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshStandardMaterial color="#2b1a0f" roughness={1} />
        </mesh>
      );
    case "gum":
      // Inflamed gum collar around the neck of the tooth.
      return (
        <mesh position={[0, -0.25, 0]}>
          <torusGeometry args={[0.78, 0.22, 20, 40]} />
          <meshStandardMaterial
            color="#d6485f"
            emissive="#9b1c33"
            emissiveIntensity={0.5}
            roughness={0.5}
          />
        </mesh>
      );
    case "plaque":
      // Mineral crust band near the gumline.
      return (
        <mesh position={[0, -0.15, 0]}>
          <torusGeometry args={[0.74, 0.16, 16, 36]} />
          <meshStandardMaterial color="#e7d8a6" roughness={0.95} />
        </mesh>
      );
    case "fracture":
      // A thin dark crack plane slicing the crown.
      return (
        <mesh position={[0, 0.4, 0]} rotation={[0, 0.4, 0.3]}>
          <boxGeometry args={[0.04, 1.5, 1.5]} />
          <meshStandardMaterial color="#1a2530" roughness={0.9} />
        </mesh>
      );
    case "rootcanal":
      // Glowing infected pulp visible through translucent enamel.
      return (
        <mesh ref={glow} position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.45, 24, 24]} />
          <meshStandardMaterial
            color="#ff5a36"
            emissive="#ff3b1f"
            emissiveIntensity={1.6}
            transparent
            opacity={0.9}
          />
        </mesh>
      );
    default:
      return null;
  }
}

/** Titanium implant + ceramic crown shown for the "missing tooth" chapter. */
function ImplantAssembly({ enamel }: { enamel: THREE.Material }) {
  const titanium = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c8ccd2",
        roughness: 0.3,
        metalness: 0.9,
      }),
    []
  );
  return (
    <group>
      {/* Screw post (threaded look via stacked torus rings) */}
      <mesh position={[0, -0.9, 0]} material={titanium}>
        <cylinderGeometry args={[0.26, 0.18, 1.6, 24]} />
      </mesh>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0, -0.4 - i * 0.22, 0]} material={titanium}>
          <torusGeometry args={[0.27, 0.04, 10, 24]} />
        </mesh>
      ))}
      {/* Abutment */}
      <mesh position={[0, 0.05, 0]} material={titanium}>
        <cylinderGeometry args={[0.22, 0.3, 0.5, 20]} />
      </mesh>
      {/* Ceramic crown */}
      <RoundedBox
        args={[1.3, 1.1, 1.3]}
        radius={0.4}
        smoothness={6}
        position={[0, 0.7, 0]}
        material={enamel}
      />
    </group>
  );
}
