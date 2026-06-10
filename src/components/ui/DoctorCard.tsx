"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Doctor } from "@/data/problems";

/**
 * Glassmorphism doctor profile with a subtle 3D tilt that tracks the pointer.
 * Renders an elegant initial-based avatar so no external image asset is needed.
 */
export default function DoctorCard({
  doctor,
  accentColor,
}: {
  doctor: Doctor;
  accentColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 8, ry: px * 10 });
  };

  const reset = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="[perspective:1200px]"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 0.25s ease-out",
        }}
        className="glass group relative w-full max-w-sm overflow-hidden rounded-[28px] p-6 [transform-style:preserve-3d]"
      >
        {/* accent glow */}
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: accentColor }}
        />

        <div className="relative flex items-center gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${doctor.accent} text-xl font-semibold text-white shadow-glass`}
          >
            {doctor.initials}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-clinical-500">
              Specialist
            </div>
            <h4 className="font-display text-xl text-clinical-900">
              {doctor.name}
            </h4>
            <p className="text-sm text-clinical-600">{doctor.specialty}</p>
          </div>
        </div>

        <div className="relative mt-5 flex items-center justify-between border-t border-white/40 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-gold-500" aria-hidden>
              ★
            </span>
            <span className="text-sm font-semibold text-clinical-800">
              {doctor.rating.toFixed(1)}
            </span>
            <span className="text-xs text-clinical-500">rating</span>
          </div>
          <span className="rounded-full bg-clinical-50 px-3 py-1 text-xs font-medium text-clinical-700">
            {doctor.experience}
          </span>
        </div>

        <button className="relative mt-5 w-full rounded-2xl bg-clinical-900 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02]">
          Book with {doctor.name.split(" ")[1]}
        </button>
      </div>
    </motion.div>
  );
}
