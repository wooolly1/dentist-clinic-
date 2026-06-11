"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * SCENE 2 — Enter The Mouth.
 * A dark, intimate interior that the hero's vignette dissolves into. Parallax
 * layers (cavity walls, a row of teeth, drifting light) move at different
 * speeds as the visitor scrolls, selling the feeling of travelling inside the
 * mouth before the condition chapters begin.
 */
export default function MouthIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const backY = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);
  const teethY = useTransform(scrollYProgress, [0, 1], ["12%", "-18%"]);
  const teethScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.3, 1, 0.92]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.6, 0.85],
    [0, 1, 1, 0]
  );
  const textY = useTransform(scrollYProgress, [0, 0.5], [40, -20]);
  const fadeToLight = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  return (
    <section
      id="journey"
      ref={ref}
      className="relative h-[160vh] w-full overflow-hidden bg-[#180407]"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* deep cavity backdrop */}
        <motion.div
          style={{ y: backY }}
          className="absolute inset-0 scale-125"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 42%, #6e1320 0%, #3a0a12 38%, #180407 72%)",
            }}
          />
          {/* gum ridges */}
          <div
            className="absolute inset-x-0 top-0 h-1/3"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(214,72,95,0.6), transparent 70%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(214,72,95,0.55), transparent 70%)",
            }}
          />
        </motion.div>

        {/* parallax teeth arch */}
        <motion.div
          style={{ y: teethY, scale: teethScale }}
          className="absolute inset-x-0 top-[14%] flex justify-center gap-2"
        >
          {[...Array(11)].map((_, i) => {
            const mid = Math.abs(i - 5);
            return (
              <div
                key={i}
                className="rounded-b-[14px] rounded-t-md bg-gradient-to-b from-white to-[#dce8f4] shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
                style={{
                  width: `${46 - mid * 2}px`,
                  height: `${110 - mid * 8}px`,
                  transform: `translateY(${mid * 10}px) rotate(${(i - 5) * 4}deg)`,
                }}
              />
            );
          })}
        </motion.div>
        {/* lower arch */}
        <motion.div
          style={{ y: teethY, scale: teethScale }}
          className="absolute inset-x-0 bottom-[14%] flex justify-center gap-2"
        >
          {[...Array(11)].map((_, i) => {
            const mid = Math.abs(i - 5);
            return (
              <div
                key={i}
                className="rounded-t-[14px] rounded-b-md bg-gradient-to-t from-white to-[#dce8f4] shadow-[0_-8px_20px_rgba(0,0,0,0.4)]"
                style={{
                  width: `${44 - mid * 2}px`,
                  height: `${100 - mid * 7}px`,
                  transform: `translateY(${-mid * 10}px) rotate(${(i - 5) * -4}deg)`,
                }}
              />
            );
          })}
        </motion.div>

        {/* drifting saliva-light particles */}
        <div className="absolute inset-0">
          {[...Array(14)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white/40 blur-[1px]"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                width: `${4 + (i % 4) * 2}px`,
                height: `${4 + (i % 4) * 2}px`,
              }}
              animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>

        {/* intro copy */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="relative z-10 max-w-2xl px-6 text-center"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-rose-200/80">
            Scene II
          </span>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-6xl">
            Welcome inside
            <br />
            <span className="text-gradient-gold">the smile</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-rose-100/70">
            We&rsquo;ll travel tooth by tooth through the most common dental
            conditions — and introduce the specialist who treats each one.
          </p>
        </motion.div>

        {/* hand-off fade to the bright clinical journey */}
        <motion.div
          style={{ opacity: fadeToLight }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ivory/40 to-ivory"
        />
      </div>
    </section>
  );
}
