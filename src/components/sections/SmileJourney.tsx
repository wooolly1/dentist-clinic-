"use client";

import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { PROBLEMS, FINALE, type Problem } from "@/data/problems";
import SmileStage from "./SmileStage";
import DoctorCard from "@/components/ui/DoctorCard";

type Chapter = Problem | typeof FINALE;

function isProblem(c: Chapter): c is Problem {
  return "doctor" in c;
}

/**
 * SCENE 3 — The interactive smile journey.
 *
 * A single pinned stage holds a front-facing face. As the visitor scrolls,
 * the face turns all the way around and reveals the next condition painted
 * onto the smile. Each tooth is hoverable (a tooltip names the condition) and
 * clickable (the responsible specialist's card slides in). The journey ends on
 * a flawless, healthy smile — every problem treated.
 */
export default function SmileJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const chapters = useMemo<Chapter[]>(() => [...PROBLEMS, FINALE], []);
  const total = chapters.length;

  const [chapter, setChapter] = useState(0);
  const [cardOpen, setCardOpen] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(total - 1, Math.max(0, Math.floor(v * total)));
    if (idx !== chapter) {
      setChapter(idx);
      setCardOpen(false); // a new face = reset any open specialist card
    }
  });

  const current = chapters[chapter];
  const finale = !isProblem(current);
  // A full 360° turn per chapter sells the "face turns around" hand-off.
  const rotation = chapter * 360;

  return (
    <section
      id="journey"
      ref={ref}
      className="relative bg-gradient-to-b from-ivory via-porcelain to-ivory"
      style={{ height: `${total * 100}vh` }}
    >
      {/* Jump-link anchors for the side rail / navbar */}
      {chapters.map((c, i) => (
        <span
          key={c.id}
          id={c.id}
          className="absolute left-0"
          style={{ top: `${(i / total) * 100}%` }}
        />
      ))}

      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        {/* subtle dotted texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(31,107,168,0.10) 1px, transparent 0)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-6 lg:grid-cols-2 lg:gap-12">
          {/* Narrative */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: current.color, background: `${current.color}16` }}
                >
                  {current.kicker}
                </span>

                <h2 className="mt-4 font-display text-4xl text-clinical-900 sm:text-5xl">
                  {current.title}
                </h2>

                <p className="mt-5 max-w-xl text-lg leading-relaxed text-clinical-600">
                  {current.description}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {current.highlights.map((h) => (
                    <li
                      key={h}
                      className="glass rounded-full px-4 py-2 text-sm font-medium text-clinical-700"
                    >
                      {h}
                    </li>
                  ))}
                </ul>

                {!finale && (
                  <p className="mt-7 flex items-center gap-2 text-sm font-medium text-clinical-500">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-clinical-100 text-clinical-600">
                      ☞
                    </span>
                    Hover the teeth to inspect — then click to meet the specialist.
                  </p>
                )}

                {finale && (
                  <a
                    href="#contact"
                    className="mt-7 inline-block rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-7 py-3.5 font-semibold text-white shadow-gold transition-transform hover:scale-105"
                  >
                    Start your smile journey
                  </a>
                )}
              </motion.div>
            </AnimatePresence>

            {/* chapter ticks */}
            <div className="mt-9 flex items-center gap-1.5">
              {chapters.map((c, i) => (
                <span
                  key={c.id}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === chapter ? 28 : 10,
                    background: i === chapter ? current.color : "#cdddec",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Face stage */}
          <div className="order-1 flex items-center justify-center lg:order-2">
            <div
              className="relative aspect-square w-full max-w-[520px]"
              style={{ perspective: "1400px" }}
            >
              {/* accent glow */}
              <div
                className="pointer-events-none absolute inset-6 rounded-full blur-3xl transition-colors duration-700"
                style={{ background: `${current.color}22` }}
              />

              <div
                className="relative h-full w-full"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${rotation}deg)`,
                  transition: "transform 0.95s cubic-bezier(0.65,0,0.35,1)",
                }}
              >
                {/* FRONT — the face + interactive smile */}
                <div
                  className="absolute inset-0"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <FaceFront
                    variant={finale ? "healthy" : (current as Problem).visual}
                    accent={current.color}
                    tooltip={finale ? "" : (current as Problem).tooltip}
                    target={finale ? "all" : (current as Problem).target}
                    onSelect={() => {
                      if (!finale) setCardOpen(true);
                    }}
                  />
                </div>

                {/* BACK — back of the head, seen mid-turn */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <BackOfHead />
                </div>
              </div>

              {/* Doctor card overlay */}
              <AnimatePresence>
                {cardOpen && isProblem(current) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 12 }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    className="absolute inset-x-0 bottom-0 z-20 flex justify-center"
                  >
                    <div className="relative w-full max-w-sm">
                      <button
                        onClick={() => setCardOpen(false)}
                        aria-label="Close"
                        className="absolute -top-3 right-1 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-clinical-900 text-white shadow-glass transition-transform hover:scale-110"
                      >
                        ✕
                      </button>
                      <div className="mb-2 inline-block rounded-full bg-clinical-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                        {current.title}
                      </div>
                      <DoctorCard doctor={current.doctor} accentColor={current.color} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The patient's face framing the interactive smile. */
function FaceFront({
  variant,
  accent,
  tooltip,
  target,
  onSelect,
}: React.ComponentProps<typeof SmileStage>) {
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 480 480" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="faceSkin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe2cf" />
            <stop offset="100%" stopColor="#f4c4a3" />
          </linearGradient>
        </defs>
        {/* head */}
        <ellipse cx="240" cy="240" rx="180" ry="205" fill="url(#faceSkin)" />
        {/* ears */}
        <ellipse cx="62" cy="250" rx="22" ry="32" fill="#f0b896" />
        <ellipse cx="418" cy="250" rx="22" ry="32" fill="#f0b896" />
        {/* hair */}
        <path
          d="M70 170 Q120 40 240 40 Q360 40 410 170 Q360 110 240 108 Q120 110 70 170 Z"
          fill="#3b2b22"
        />
        {/* brows */}
        <path d="M150 188 q34 -16 66 -2" stroke="#3b2b22" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M264 186 q34 -14 66 2" stroke="#3b2b22" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* relaxed, content eyes */}
        <path d="M150 220 q33 26 66 0" stroke="#5a4636" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M264 220 q33 26 66 0" stroke="#5a4636" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* nose */}
        <path d="M240 240 q14 36 -10 52 q10 6 22 1" stroke="#e0a583" strokeWidth="5" fill="none" strokeLinecap="round" />
      </svg>

      {/* Interactive mouth sits in the lower third of the face */}
      <div className="absolute inset-x-[14%] bottom-[12%] top-[58%]">
        <SmileStage
          variant={variant}
          accent={accent}
          tooltip={tooltip}
          target={target}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

/** The back of the head, briefly visible as the face turns around. */
function BackOfHead() {
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 480 480" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="hairBack" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#4a382d" />
            <stop offset="100%" stopColor="#2c2019" />
          </radialGradient>
        </defs>
        <ellipse cx="240" cy="240" rx="180" ry="205" fill="#f0b896" />
        {/* ears */}
        <ellipse cx="62" cy="250" rx="22" ry="32" fill="#e7a983" />
        <ellipse cx="418" cy="250" rx="22" ry="32" fill="#e7a983" />
        {/* hair covering the back */}
        <path
          d="M70 250 Q60 40 240 36 Q420 40 410 250 Q410 360 240 372 Q70 360 70 250 Z"
          fill="url(#hairBack)"
        />
        {/* a little neck */}
        <rect x="200" y="404" width="80" height="60" rx="22" fill="#f0b896" />
      </svg>
    </div>
  );
}
