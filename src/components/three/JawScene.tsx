"use client";

import { Suspense, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Jaw from "./Jaw";
import type { Tooth as ToothData } from "@/data/clinic";

/**
 * The interactive 3D jaw viewport.
 *
 * `progressRef` carries the host section's 0→1 scroll progress. The opening
 * 35% flies the camera out from *inside* the mouth (continuing the hero's
 * zoom) to the full-jaw framing, then control is handed to the orbit controls
 * so visitors can rotate the model and click individual teeth.
 */

const FROM = new THREE.Vector3(0, 0.05, 1.5); // deep inside the mouth
const TO = new THREE.Vector3(0, 1.7, 7.4); // full-jaw reveal

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

function Rig({
  progressRef,
  controlsRef,
}: {
  progressRef: MutableRefObject<number>;
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
}) {
  const introEnd = 0.35;
  const revealed = useRef(false);
  useFrame(({ camera }) => {
    const p = progressRef.current;
    const c = controlsRef.current;
    if (p < introEnd) {
      // Scripted fly-out from inside the mouth — controls held off.
      revealed.current = false;
      if (c) c.enabled = false;
      const k = easeOutCubic(Math.max(0, p) / introEnd);
      camera.position.lerpVectors(FROM, TO, k);
      camera.lookAt(0, 0, 0);
    } else if (!revealed.current) {
      // First frame past the reveal (even on a fast jump): park the camera at
      // the full-jaw framing, then hand control to the orbit controls.
      revealed.current = true;
      camera.position.copy(TO);
      camera.lookAt(0, 0, 0);
      if (c) {
        c.target.set(0, 0, 0);
        c.enabled = true;
      }
    }
  });
  return null;
}

interface JawSceneProps {
  progressRef: MutableRefObject<number>;
  selectedId: string | null;
  onSelect: (t: ToothData) => void;
  onHover: (t: ToothData | null) => void;
  onMissCanvas?: () => void;
}

export default function JawScene({
  progressRef,
  selectedId,
  onSelect,
  onHover,
  onMissCanvas,
}: JawSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.05, 1.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onMissCanvas?.()}
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight args={["#ffffff", "#f4e6c8", 0.6]} />
      <directionalLight position={[5, 8, 6]} intensity={1.8} />
      <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#ffe9c2" />

      <Suspense fallback={null}>
        <Jaw selectedId={selectedId} onSelect={onSelect} onHover={onHover} />
        <ContactShadows
          position={[0, -2.1, 0]}
          opacity={0.3}
          scale={14}
          blur={2.8}
          far={5}
          color="#8a6a2a"
        />
        {/* Procedural gold-tinted studio reflections — no external HDR. */}
        <Environment resolution={128}>
          <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 4, 1]} color="#ffffff" />
          <Lightformer intensity={1.3} position={[-4, 1, 4]} scale={[4, 4, 1]} color="#fff0d4" />
          <Lightformer intensity={1} position={[4, -1, 3]} scale={[4, 4, 1]} color="#ffe2b0" />
        </Environment>
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.82}
        target={[0, 0, 0]}
      />
      <Rig progressRef={progressRef} controlsRef={controlsRef} />
    </Canvas>
  );
}
