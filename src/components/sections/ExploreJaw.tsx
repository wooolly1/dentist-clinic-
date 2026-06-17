"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import type { Tooth } from "@/data/clinic";
import ToothPanel from "@/components/ui/ToothPanel";

const JawScene = dynamic(() => import("@/components/three/JawScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-12 w-12 animate-spinSlow rounded-full border-2 border-gold-300 border-t-transparent" />
    </div>
  ),
});

/**
 * SCENE 2 — "Teeth".
 * A pinned, full-screen 3D jaw the visitor flies into from the hero. The first
 * third of the scroll dollies the camera out to reveal the whole model; after
 * that, the orbit controls take over so any of the 32 teeth can be rotated to
 * and clicked to open its clinical profile.
 */
export default function ExploreJaw() {
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [selected, setSelected] = useState<Tooth | null>(null);
  const [hovered, setHovered] = useState<Tooth | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  // Intro headline fades out as the camera completes its reveal.
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.12, 0.3], [1, 1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const hintOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section id="teeth" ref={ref} className="relative h-[220vh] bg-ivory">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ambient luxury wash */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#fffdf7,#f3ead6_70%,#ece0c6)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(201,151,46,0.18),transparent_55%)]" />

        {/* 3D model */}
        <div className="absolute inset-0">
          <JawScene
            progressRef={progressRef}
            selectedId={selected?.id ?? null}
            onSelect={(t) => setSelected(t)}
            onHover={setHovered}
            onMissCanvas={() => setSelected(null)}
          />
        </div>

        {/* Intro headline */}
        <motion.div
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="pointer-events-none absolute inset-x-0 top-[16%] z-10 px-6 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gold-600">
            The interactive anatomy
          </span>
          <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-6xl">
            Meet every tooth
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-500">
            Keep scrolling to step inside the mouth, then rotate the jaw and tap
            any tooth to explore its story.
          </p>
        </motion.div>

        {/* Hover label */}
        {hovered && !selected && (
          <div className="pointer-events-none absolute left-1/2 top-8 z-10 -translate-x-1/2 rounded-full border border-gold-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-ink-800 shadow-glass backdrop-blur">
            {hovered.name}
          </div>
        )}

        {/* Interaction hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-2 text-center"
        >
          <span className="rounded-full border border-gold-200 bg-white/70 px-4 py-2 text-sm font-medium text-ink-700 shadow-glass backdrop-blur">
            Drag to rotate · click a tooth for details
          </span>
        </motion.div>

        <ToothPanel tooth={selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}
