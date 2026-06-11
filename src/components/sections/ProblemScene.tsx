"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { Problem } from "@/data/problems";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import ConditionVisual from "./ConditionVisual";
import DoctorCard from "@/components/ui/DoctorCard";

// 3D is client-only and lazily loaded so the page streams fast.
const ToothCanvas = dynamic(() => import("@/components/three/ToothCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-spinSlow rounded-full border-2 border-clinical-300 border-t-transparent" />
    </div>
  ),
});

/**
 * A single chapter of the dental-problems journey. The 3D tooth stays pinned
 * (sticky) on one side while the educational copy, scroll-reactive condition
 * overlay and the responsible specialist's card animate in on the other.
 * Layout alternates left/right per chapter for cinematic rhythm.
 */
export default function ProblemScene({ problem }: { problem: Problem }) {
  const { ref, progress } = useSectionProgress<HTMLDivElement>();
  const flip = problem.index % 2 === 0;

  return (
    <section
      id={problem.id}
      ref={ref}
      className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-6 py-24 lg:grid-cols-2 lg:gap-16"
      style={{ contain: "layout paint" }}
    >
      {/* Sticky 3D stage */}
      <div
        className={`relative h-[58vh] lg:sticky lg:top-[18vh] lg:h-[64vh] ${
          flip ? "lg:order-2" : ""
        }`}
      >
        <div
          className="absolute inset-0 rounded-[40px]"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${problem.color}22 0%, transparent 65%)`,
          }}
        />
        <div className="relative h-full w-full">
          <ToothCanvas variant={problem.visual} seed={problem.index} />
          <ConditionVisual
            variant={problem.visual}
            p={progress}
            color={problem.color}
          />
        </div>

        {/* progress dial */}
        <div className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-3 lg:flex">
          <div className="h-1 w-40 overflow-hidden rounded-full bg-clinical-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.round(progress * 100)}%`,
                background: problem.color,
              }}
            />
          </div>
        </div>
      </div>

      {/* Narrative + doctor */}
      <div className={flip ? "lg:order-1" : ""}>
        <motion.span
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em]"
          style={{ color: problem.color, background: `${problem.color}14` }}
        >
          {problem.kicker}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-4 font-display text-4xl text-clinical-900 sm:text-5xl"
        >
          {problem.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-5 max-w-xl text-lg leading-relaxed text-clinical-600"
        >
          {problem.description}
        </motion.p>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
          }}
          className="mt-6 flex flex-wrap gap-2.5"
        >
          {problem.highlights.map((h) => (
            <motion.li
              key={h}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              className="glass rounded-full px-4 py-2 text-sm font-medium text-clinical-700"
            >
              {h}
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-10">
          <DoctorCard doctor={problem.doctor} accentColor={problem.color} />
        </div>
      </div>
    </section>
  );
}
