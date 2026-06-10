"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import ToothMesh from "./ToothMesh";
import type { ProblemVisual } from "@/data/problems";

/**
 * Self-contained interactive 3D viewport for a single tooth condition.
 * Lightweight on purpose — one mesh, soft studio lighting, contact shadow —
 * so multiple instances can live on the page without tanking performance.
 */
export default function ToothCanvas({
  variant,
  seed = 0,
}: {
  variant: ProblemVisual;
  seed?: number;
}) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.4, 5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-pan-y"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#cfe3f7" />
      <Suspense fallback={null}>
        <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
          <ToothMesh variant={variant} floatSeed={seed} />
        </Float>
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.35}
          scale={9}
          blur={2.6}
          far={4}
          color="#1f3a5f"
        />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  );
}
