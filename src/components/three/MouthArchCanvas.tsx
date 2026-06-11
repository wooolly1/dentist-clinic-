"use client";

import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Instances, Instance, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { mergeBufferGeometries } from "three-stdlib";
import { getToothGeometry } from "./toothGeometry";

/**
 * SCENE 2 in 3D — a real dental arch the "camera" flies into.
 *
 * Two arches of the realistic procedural tooth are instanced along a parabola
 * with pink gum ridges behind them, lit like the inside of a mouth. The camera
 * dollies forward past the incisors and between the rows as the visitor
 * scrolls, reading its position from `progressRef` (updated outside React for
 * frame-perfect, churn-free scrolling).
 */

const PER_ARCH = 9;
const ARCH_R = 3.3;
const SPREAD = 1.2; // half-angle of the arch in radians

interface Tooth {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
}

function buildArches() {
  const upper: Tooth[] = [];
  const lower: Tooth[] = [];
  for (let i = 0; i < PER_ARCH; i++) {
    const t = (i / (PER_ARCH - 1)) * 2 - 1; // -1..1
    const a = t * SPREAD;
    const x = Math.sin(a) * ARCH_R;
    const z = (Math.cos(a) - 1) * ARCH_R; // 0 at front incisors, negative toward molars
    const s = 0.52 - Math.abs(t) * 0.07;
    upper.push({ pos: [x, 1.05, z], rot: [Math.PI, -a, 0], scale: s });
    lower.push({ pos: [x, -1.05, z], rot: [0, -a, 0], scale: s * 0.92 });
  }
  return { upper, lower };
}

function gumGeometry(y: number): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * 2 - 1;
    const a = t * (SPREAD + 0.08);
    pts.push(
      new THREE.Vector3(
        Math.sin(a) * (ARCH_R + 0.05),
        y,
        (Math.cos(a) - 1) * (ARCH_R + 0.05)
      )
    );
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, 80, 0.42, 14, false);
}

function ArchScene({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { upper, lower } = useMemo(buildArches, []);
  const geometry = useMemo(() => getToothGeometry(), []);

  const enamel = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f4f1e8"),
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
        sheen: 0.5,
        sheenColor: new THREE.Color("#ffe7d6"),
        envMapIntensity: 0.9,
      }),
    []
  );

  const gumMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c14156",
        roughness: 0.7,
        emissive: new THREE.Color("#5e1020"),
        emissiveIntensity: 0.4,
      }),
    []
  );

  const upperGum = useMemo(() => gumGeometry(1.7), []);
  const lowerGum = useMemo(() => gumGeometry(-1.7), []);

  const lamp = useRef<THREE.PointLight>(null);

  // Scroll-driven camera dolly into the mouth.
  useFrame((state) => {
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const eased = p * p * (3 - 2 * p); // smoothstep
    const cam = state.camera;
    cam.position.z = THREE.MathUtils.lerp(7.5, -1.4, eased);
    cam.position.y = THREE.MathUtils.lerp(0.4, 0.0, eased);
    cam.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
    cam.lookAt(0, 0, -3.2);
    if (lamp.current) {
      lamp.current.position.set(cam.position.x, cam.position.y + 0.5, cam.position.z + 0.5);
    }
  });

  return (
    <>
      <color attach="background" args={["#240509"]} />
      <fogExp2 attach="fog" args={["#1a0306", 0.085]} />

      <ambientLight intensity={0.35} color="#ffb9a8" />
      <pointLight ref={lamp} intensity={28} distance={16} decay={2} color="#fff4ea" />
      <directionalLight position={[2, 4, 4]} intensity={0.7} color="#ffd9c2" />

      {/* back-of-throat glow */}
      <mesh position={[0, -0.3, -5.5]}>
        <sphereGeometry args={[2.4, 24, 24]} />
        <meshStandardMaterial color="#3a0a12" emissive="#6e1320" emissiveIntensity={0.7} />
      </mesh>

      <Suspense fallback={null}>
        <Instances geometry={geometry} material={enamel} limit={PER_ARCH * 2}>
          {[...upper, ...lower].map((t, i) => (
            <Instance key={i} position={t.pos} rotation={t.rot} scale={t.scale} />
          ))}
        </Instances>

        <mesh geometry={upperGum} material={gumMat} />
        <mesh geometry={lowerGum} material={gumMat} />

        <Environment resolution={64}>
          <Lightformer intensity={1.4} position={[0, 0, 4]} scale={[5, 5, 1]} color="#ffd9c2" />
          <Lightformer intensity={0.6} position={[0, 3, 0]} scale={[4, 2, 1]} color="#ffffff" />
        </Environment>
      </Suspense>
    </>
  );
}

export default function MouthArchCanvas({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.4, 7.5], fov: 52 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
    >
      <ArchScene progressRef={progressRef} />
    </Canvas>
  );
}
