"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import ToothMesh from "./ToothMesh";
import type { ProblemVisual } from "@/data/problems";

/**
 * Self-contained interactive 3D viewport for a single tooth condition.
 * Lightweight on purpose — one mesh, soft studio lighting, contact shadow —
 * so multiple instances can live on the page without tanking performance.
 *
 * The reflective environment is built procedurally from <Lightformer> panels
 * (no external HDR fetch), keeping the project fully self-contained. If WebGL
 * is unavailable, a tasteful 2D fallback is shown instead.
 */
export default function ToothCanvas({
  variant,
  seed = 0,
}: {
  variant: ProblemVisual;
  seed?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return <ToothFallback />;

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.4, 5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-pan-y"
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", () => setFailed(true));
      }}
      fallback={<ToothFallback />}
    >
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#ffffff", "#9bbcdc", 0.7]} />
      <directionalLight position={[4, 6, 4]} intensity={1.7} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#cfe3f7" />
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
        {/* Procedural studio reflections — no external HDR required. */}
        <Environment resolution={128}>
          <Lightformer
            intensity={2}
            position={[0, 3, 2]}
            scale={[6, 3, 1]}
            color="#ffffff"
          />
          <Lightformer
            intensity={1.2}
            position={[-3, 1, 3]}
            scale={[3, 3, 1]}
            color="#dbeafe"
          />
          <Lightformer
            intensity={0.8}
            position={[3, -1, 2]}
            scale={[3, 3, 1]}
            color="#fbf3de"
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

/** 2D stand-in shown when WebGL can't initialise. */
function ToothFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="animate-float">
        <svg viewBox="0 0 64 80" className="h-40 w-40 text-white drop-shadow-[0_20px_40px_rgba(31,107,168,0.35)]">
          <path
            d="M32 4C20 4 14 0.5 8 4 1.5 7.7 0 17 2.5 30c1.7 8.6 3.6 13.4 5.6 22.5C9.4 59 10.8 76 16.2 76c5 0 5.3-12 7-19 1.2-4.9 3.1-7.4 8.8-7.4s7.6 2.5 8.8 7.4c1.7 7 2 19 7 19 5.4 0 6.8-17 8.1-23.5 2-9.1 3.9-13.9 5.6-22.5C64 17 62.5 7.7 56 4c-6-3.5-12 0-24 0Z"
            fill="url(#tg)"
          />
          <defs>
            <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#dce8f4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
