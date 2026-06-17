"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CLINIC } from "@/data/clinic";

/**
 * SCENE 1 — The patient.
 * A full-screen, photoreal smiling patient. As the visitor scrolls, a pinned
 * GSAP timeline pushes the "camera" straight into the mouth — scaling the
 * portrait around the lips and closing a vignette — handing off seamlessly to
 * the 3D jaw that flies open in the next scene.
 *
 * The portrait lives at /images/hero-patient.jpg; a warm gradient sits behind
 * it so the scene stays elegant even before the asset is in place.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const vignette = useRef<HTMLDivElement>(null);
  const focus = useRef<HTMLDivElement>(null);

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

      tl.to(overlay.current, { opacity: 0, y: -50, duration: 0.25 }, 0);
      tl.to(
        photo.current,
        { scale: 5.5, ease: "power2.inOut", duration: 1 },
        0
      );
      tl.fromTo(
        focus.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        0.15
      );
      tl.fromTo(
        vignette.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45 },
        0.55
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-ink-900"
    >
      {/* Warm fallback gradient backdrop (always elegant, never broken) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#fdf6e6,#e9d9b6_55%,#b9923f)]" />

      {/* Patient portrait — zoom target is the mouth (~62% down). Hides itself
          gracefully if the asset isn't in place yet. */}
      <div
        ref={photo}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: "50% 62%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-patient.jpg"
          alt="A smiling dental patient"
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Soft focus ring over the mouth as we push in */}
      <div
        ref={focus}
        className="pointer-events-none absolute left-1/2 top-[62%] h-[30vmin] w-[30vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          boxShadow:
            "0 0 0 100vmax rgba(14,11,8,0.18), inset 0 0 60px rgba(255,255,255,0.25)",
        }}
      />

      {/* Closing vignette for the hand-off into the mouth */}
      <div
        ref={vignette}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 62%, rgba(120,30,40,0) 6%, rgba(40,12,16,0.55) 34%, rgba(251,248,241,0.98) 72%)",
        }}
      />

      {/* Intro UI */}
      <div
        ref={overlay}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mb-6 rounded-full border border-white/30 bg-black/20 px-5 py-2 text-xs uppercase tracking-[0.35em] text-white backdrop-blur"
        >
          {CLINIC.tagline}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.8 }}
          className="max-w-4xl font-display text-5xl leading-[1.04] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] sm:text-7xl"
        >
          Your smile,
          <br />
          <span className="text-gradient-gold">reimagined</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.8 }}
          className="mt-6 max-w-xl text-base text-white/85 drop-shadow sm:text-lg"
        >
          Scroll to travel from the chair straight into an interactive 3D jaw —
          and explore the care behind every tooth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/70">
            Scroll to enter
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-white/50 p-1.5"
          >
            <span className="h-2 w-1 rounded-full bg-white/90" />
          </motion.div>
        </motion.div>
      </div>

      {/* top scrim for navbar legibility */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
    </section>
  );
}
