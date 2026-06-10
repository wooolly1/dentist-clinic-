"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PROBLEMS } from "@/data/problems";

/**
 * Fixed vertical progress rail (desktop) + a slim top bar.
 * Highlights which chapter of the journey the visitor is currently in by
 * mapping overall scroll progress onto the number of chapters.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [active, setActive] = useState(0);

  useEffect(() => {
    const total = PROBLEMS.length;
    return scrollYProgress.on("change", (v) => {
      // The chapters occupy roughly the middle 70% of the page.
      const journey = Math.min(1, Math.max(0, (v - 0.18) / 0.62));
      setActive(Math.min(total - 1, Math.floor(journey * total)));
    });
  }, [scrollYProgress]);

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-gradient-to-r from-clinical-400 via-clinical-500 to-gold-400"
        style={{ scaleX }}
      />

      {/* Side chapter rail (desktop only) */}
      <nav
        aria-label="Journey progress"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      >
        {PROBLEMS.map((p, i) => (
          <a
            key={p.id}
            href={`#${p.id}`}
            className="group relative flex items-center"
            aria-label={`Go to ${p.title}`}
          >
            <span className="absolute right-6 whitespace-nowrap rounded-full bg-clinical-900/85 px-3 py-1 text-xs text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
              {p.title}
            </span>
            <span
              className={`block rounded-full transition-all duration-500 ${
                i === active
                  ? "h-6 w-[6px] bg-gold-400"
                  : "h-[6px] w-[6px] bg-clinical-300/60 group-hover:bg-clinical-500"
              }`}
            />
          </a>
        ))}
      </nav>
    </>
  );
}
