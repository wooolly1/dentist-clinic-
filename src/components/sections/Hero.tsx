"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ClinicScene, { ClinicSceneHandles } from "./ClinicScene";
import { CLINIC } from "@/data/problems";

/**
 * SCENE 1 — Camera Zoom.
 * A pinned, full-screen cinematic shot. As the visitor scrolls, a GSAP
 * timeline pushes the "camera" toward the patient's face, eases the jaw open,
 * brightens the teeth and dissolves the intro UI — handing off seamlessly to
 * the mouth-interior journey below.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const sceneWrap = useRef<HTMLDivElement>(null);
  const scene = useRef<ClinicSceneHandles>({ face: null, mouth: null, teeth: null });
  const overlay = useRef<HTMLDivElement>(null);
  const vignette = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=180%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Fade out the intro headline / CTA early.
      tl.to(overlay.current, { opacity: 0, y: -40, duration: 0.25 }, 0);

      // 2. Camera dollies toward the head: scale up the whole scene and
      //    re-centre on the face.
      tl.to(
        sceneWrap.current,
        { scale: 3.4, xPercent: -22, yPercent: 6, ease: "power2.inOut", duration: 1 },
        0
      );

      // 3. The jaw opens naturally.
      tl.to(scene.current.mouth, { rotate: 16, transformOrigin: "846px 452px", duration: 0.6 }, 0.3);

      // 4. Teeth become the hero — scale + subtle glow via brightness.
      tl.to(
        scene.current.teeth,
        { scale: 1.25, transformOrigin: "846px 462px", duration: 0.5 },
        0.5
      );

      // 5. Cinematic vignette closes in as we "enter" the mouth.
      tl.fromTo(
        vignette.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        0.7
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-clinical-900"
    >
      {/* Cinematic scene */}
      <div
        ref={sceneWrap}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <ClinicScene ref={scene} className="h-full w-full" />
      </div>

      {/* Closing vignette for the "enter the mouth" hand-off */}
      <div
        ref={vignette}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 70% 56%, rgba(122,29,43,0) 8%, rgba(60,10,18,0.6) 34%, rgba(20,4,8,0.96) 70%)",
        }}
      />

      {/* Intro UI overlay */}
      <div
        ref={overlay}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="glass-dark mb-6 rounded-full px-5 py-2 text-xs uppercase tracking-[0.3em] text-clinical-100"
        >
          {CLINIC.tagline}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.8 }}
          className="max-w-4xl font-display text-5xl leading-[1.05] text-white drop-shadow-2xl sm:text-7xl"
        >
          A cinematic journey
          <br />
          <span className="text-gradient-gold">into your smile</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.55, duration: 0.8 }}
          className="mt-6 max-w-xl text-base text-clinical-100/80 sm:text-lg"
        >
          Scroll to travel from the patient chair into the mouth — and meet the
          specialists who treat every condition with precision and care.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-clinical-200/70">
            Scroll to begin
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 p-1.5"
          >
            <span className="h-2 w-1 rounded-full bg-white/80" />
          </motion.div>
        </motion.div>
      </div>

      {/* top fade for navbar legibility */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-clinical-900/60 to-transparent" />
    </section>
  );
}
