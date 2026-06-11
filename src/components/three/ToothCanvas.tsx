"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  Environment,
  Lightformer,
  AdaptiveDpr,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  N8AO,
} from "@react-three/postprocessing";
import * as THREE from "three";
import ToothMesh from "./ToothMesh";
import type { ProblemVisual } from "@/data/problems";

/**
 * Cinematic 3D viewport for a single tooth condition. Pairs the realistic
 * procedural tooth with a procedural studio environment and a post-processing
 * stack (ambient occlusion, subtle bloom, depth-of-field, vignette) under
 * ACES filmic tone mapping for a photographic, premium render.
 *
 * Rendering is gated to when the canvas is on-screen so that all six chapter
 * canvases never run their effect composers simultaneously.
 */
export default function ToothCanvas({
  variant,
  seed = 0,
}: {
  variant: ProblemVisual;
  seed?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = wrap.current;
    if (!el) return;
    // Mount the WebGL context only as the canvas nears the viewport (and keep
    // it mounted thereafter) so all six chapters never spin up at once.
    const mountIo = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          mountIo.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    // Drive the render loop only while actually on screen.
    const viewIo = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "120px",
    });
    mountIo.observe(el);
    viewIo.observe(el);
    return () => {
      mountIo.disconnect();
      viewIo.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      {failed || !mounted ? (
        <ToothFallback dim={!failed} />
      ) : (
        <Canvas
          shadows
          dpr={[1, 1.7]}
          frameloop={inView && !reduced ? "always" : "demand"}
          camera={{ position: [0, 0.4, 5.2], fov: 36 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            preserveDrawingBuffer: true,
          }}
          className="!touch-pan-y"
          onCreated={({ gl }) =>
            gl.domElement.addEventListener("webglcontextlost", () =>
              setFailed(true)
            )
          }
          fallback={<ToothFallback />}
        >
          {/* Key + fill + rim studio lighting */}
          <ambientLight intensity={0.45} />
          <hemisphereLight args={["#ffffff", "#9bbcdc", 0.5]} />
          <directionalLight
            position={[4, 6, 4]}
            intensity={2.1}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0002}
          />
          <directionalLight position={[-5, 2, -3]} intensity={0.6} color="#cfe3f7" />
          <spotLight
            position={[0, 5, 3]}
            angle={0.5}
            penumbra={1}
            intensity={1.2}
            color="#fff6e6"
          />

          <Suspense fallback={null}>
            <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.55}>
              <ToothMesh variant={variant} floatSeed={seed} />
            </Float>

            <ContactShadows
              position={[0, -2.05, 0]}
              opacity={0.4}
              scale={10}
              blur={2.8}
              far={4}
              resolution={512}
              color="#16314f"
            />

            {/* Procedural reflections — no external HDR. */}
            <Environment resolution={256}>
              <Lightformer intensity={2.2} position={[0, 3, 2]} scale={[7, 3, 1]} color="#ffffff" />
              <Lightformer intensity={1.3} position={[-3, 1, 3]} scale={[3, 4, 1]} color="#dbeafe" />
              <Lightformer intensity={1} position={[3, -1, 2]} scale={[3, 3, 1]} color="#fff1d6" />
              <Lightformer intensity={0.6} position={[0, -3, -3]} scale={[6, 3, 1]} color="#bcd6ee" />
            </Environment>

            {/* Only run the effect stack while the canvas is on screen. */}
            {inView && (
              <EffectComposer multisampling={4} enableNormalPass>
                <N8AO aoRadius={1.2} intensity={2.2} distanceFalloff={1} quality="medium" />
                <Bloom
                  intensity={0.55}
                  luminanceThreshold={0.75}
                  luminanceSmoothing={0.3}
                  mipmapBlur
                />
                <DepthOfField
                  focusDistance={0.012}
                  focalLength={0.045}
                  bokehScale={2.2}
                />
                <Vignette eskil={false} offset={0.28} darkness={0.62} />
              </EffectComposer>
            )}
          </Suspense>

          <AdaptiveDpr pixelated />
        </Canvas>
      )}
    </div>
  );
}

/** 2D stand-in shown before mount or when WebGL can't initialise. */
function ToothFallback({ dim = false }: { dim?: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className={`animate-float ${dim ? "opacity-30" : ""}`}>
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
