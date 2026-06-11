"use client";

import { useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// The 3D arch is client-only and lazily loaded.
const MouthArchCanvas = dynamic(
  () => import("@/components/three/MouthArchCanvas"),
  { ssr: false }
);

/**
 * SCENE 2 — Enter The Mouth.
 * The hero's vignette dissolves into a real, lit 3D dental arch. As the visitor
 * scrolls, the camera flies forward past the incisors and between the rows,
 * selling the sensation of travelling inside the mouth before the condition
 * chapters begin. A GSAP ScrollTrigger feeds scroll progress straight into the
 * canvas via a ref (no React re-renders per frame).
 */
export default function MouthIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const textOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.28, 0.5, 0.72],
    [0, 1, 1, 0]
  );
  const textY = useTransform(scrollYProgress, [0, 0.5], [50, -30]);
  const fadeToLight = useTransform(scrollYProgress, [0.72, 0.95], [0, 1]);
  const fadeFromDark = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Feed precise section progress into the 3D camera dolly.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // Map the middle of the scroll range to the 0→1 fly-in.
          progress.current = gsap.utils.clamp(
            0,
            1,
            (self.progress - 0.1) / 0.7
          );
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={ref}
      className="relative h-[220vh] w-full overflow-hidden bg-[#240509]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Real 3D dental arch */}
        <div className="absolute inset-0">
          <MouthArchCanvas progressRef={progress} />
        </div>

        {/* cinematic vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 38%, rgba(20,3,6,0.55) 78%, rgba(20,3,6,0.9) 100%)",
          }}
        />

        {/* entry fade from the hero's dark vignette */}
        <motion.div
          style={{ opacity: fadeFromDark }}
          className="pointer-events-none absolute inset-0 bg-[#180407]"
        />

        {/* intro copy */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-rose-200/80">
            Scene II
          </span>
          <h2 className="mt-4 font-display text-4xl text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:text-6xl">
            Welcome inside
            <br />
            <span className="text-gradient-gold">the smile</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-rose-100/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            We&rsquo;ll travel tooth by tooth through the most common dental
            conditions — and introduce the specialist who treats each one.
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="mt-12 flex h-10 w-6 items-start justify-center rounded-full border border-white/40 p-1.5"
          >
            <span className="h-2 w-1 rounded-full bg-white/80" />
          </motion.div>
        </motion.div>

        {/* hand-off fade to the bright clinical journey */}
        <motion.div
          style={{ opacity: fadeToLight }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ivory/50 to-ivory"
        />
      </div>
    </section>
  );
}
