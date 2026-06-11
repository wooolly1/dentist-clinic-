"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ProblemVisual } from "@/data/problems";
import { getToothGeometry } from "./toothGeometry";
import { getEnamelTextures } from "./enamelTextures";

/**
 * Realistic procedural tooth: an anatomically-sculpted molar (see
 * toothGeometry.ts) finished with a translucent, clear-coated enamel material
 * and a soft gum collar. Condition-specific overlays (decay, infection glow,
 * fracture, plaque, inflamed gums, implant) are layered on per `variant`.
 */
export default function ToothMesh({
  variant = "cavity",
  floatSeed = 0,
}: {
  variant?: ProblemVisual;
  floatSeed?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => getToothGeometry(), []);

  const enamel = useMemo(() => {
    const { roughnessMap, bumpMap } = getEnamelTextures();
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f6f4ec"),
      roughness: 0.22,
      roughnessMap: roughnessMap ?? null,
      bumpMap: bumpMap ?? null,
      bumpScale: 0.006,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      transmission: 0.16,
      thickness: 1.3,
      ior: 1.6,
      attenuationColor: new THREE.Color("#ffe9d6"),
      attenuationDistance: 2.4,
      sheen: 0.6,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color("#dbeafe"),
      envMapIntensity: 1.15,
      specularIntensity: 1,
    });
  }, []);

  const isMissing = variant === "missing";

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + floatSeed;
    group.current.rotation.y = Math.sin(t * 0.32) * 0.35;
    group.current.rotation.z = Math.cos(t * 0.28) * 0.045;
  });

  return (
    <group ref={group} position={[0, 0.15, 0]} scale={0.82}>
      {!isMissing ? (
        <>
          <mesh geometry={geometry} material={enamel} castShadow receiveShadow />
          <Gum variant={variant} />
          <VariantOverlay variant={variant} />
        </>
      ) : (
        <ImplantAssembly geometry={geometry} enamel={enamel} />
      )}
    </group>
  );
}

/** Soft gum collar hugging the neck of the tooth (inflamed for gum disease). */
function Gum({ variant }: { variant: ProblemVisual }) {
  const inflamed = variant === "gum";
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(inflamed ? "#d6485f" : "#e58aa0"),
        roughness: 0.55,
        clearcoat: 0.4,
        clearcoatRoughness: 0.4,
        transmission: 0.25,
        thickness: 0.6,
        sheen: 1,
        sheenColor: new THREE.Color("#ffd9e0"),
        emissive: new THREE.Color(inflamed ? "#9b1c33" : "#000000"),
        emissiveIntensity: inflamed ? 0.45 : 0,
      }),
    [inflamed]
  );
  return (
    <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat}>
      <torusGeometry args={[0.62, 0.2, 24, 48]} />
    </mesh>
  );
}

/** Condition-specific decorations layered onto the tooth. */
function VariantOverlay({ variant }: { variant: ProblemVisual }) {
  const glow = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (glow.current) {
      const m = glow.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.5 + Math.sin(s.clock.elapsedTime * 3) * 0.7;
    }
  });

  switch (variant) {
    case "cavity":
      return (
        <group position={[0.52, 1.0, 0.5]}>
          {/* dark decayed pocket */}
          <mesh>
            <sphereGeometry args={[0.3, 28, 28]} />
            <meshStandardMaterial color="#1c0f07" roughness={1} metalness={0} />
          </mesh>
          {/* brown demineralised halo */}
          <mesh scale={1.5}>
            <sphereGeometry args={[0.3, 24, 24]} />
            <meshStandardMaterial
              color="#5a3a1e"
              roughness={1}
              transparent
              opacity={0.45}
            />
          </mesh>
        </group>
      );

    case "plaque":
      // yellow tartar crust accreting at the gumline
      return (
        <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.12, 18, 40]} />
          <meshStandardMaterial color="#e3cf8f" roughness={0.95} />
        </mesh>
      );

    case "fracture":
      // a dark crack slicing down through the crown
      return (
        <mesh position={[0, 0.9, 0]} rotation={[0, 0.5, 0.28]}>
          <boxGeometry args={[0.03, 1.7, 1.5]} />
          <meshStandardMaterial color="#10181f" roughness={0.9} />
        </mesh>
      );

    case "rootcanal":
      // glowing infected pulp seen through the translucent enamel
      return (
        <mesh ref={glow} position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.42, 28, 28]} />
          <meshStandardMaterial
            color="#ff5a36"
            emissive="#ff3b1f"
            emissiveIntensity={1.6}
            transparent
            opacity={0.92}
          />
        </mesh>
      );

    default:
      return null;
  }
}

/** Titanium implant + ceramic crown for the "missing tooth" chapter. */
function ImplantAssembly({
  geometry,
  enamel,
}: {
  geometry: THREE.BufferGeometry;
  enamel: THREE.Material;
}) {
  const titanium = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c8ccd2",
        roughness: 0.28,
        metalness: 0.95,
      }),
    []
  );
  // Reuse the enamel crown but hide the natural roots behind the implant post.
  return (
    <group>
      {/* Threaded screw post */}
      <mesh position={[0, -0.95, 0]} material={titanium} castShadow>
        <cylinderGeometry args={[0.26, 0.16, 1.7, 28]} />
      </mesh>
      {[...Array(7)].map((_, i) => (
        <mesh key={i} position={[0, -0.35 - i * 0.2, 0]} material={titanium}>
          <torusGeometry args={[0.27, 0.035, 10, 28]} />
        </mesh>
      ))}
      {/* Abutment */}
      <mesh position={[0, 0.1, 0]} material={titanium} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.55, 24]} />
      </mesh>
      {/* Ceramic crown — clip to just the crown portion of the tooth mesh */}
      <mesh
        geometry={geometry}
        material={enamel}
        position={[0, 0.05, 0]}
        scale={[1, 0.62, 1]}
        castShadow
      />
    </group>
  );
}
