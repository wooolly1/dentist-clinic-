"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ToothIcon from "./ToothIcon";
import { CLINIC } from "@/data/problems";

/**
 * Cinematic intro overlay. Simulates an asset-load progress bar with a glowing
 * tooth that "fills" as the counter climbs, then lifts away like a curtain.
 */
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let value = 0;
    const step = () => {
      // Ease toward 100 with a little organic jitter.
      value += Math.max(0.6, (100 - value) * 0.025);
      if (value >= 100) {
        value = 100;
        setProgress(100);
        window.setTimeout(() => setDone(true), 450);
        return;
      }
      setProgress(value);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-clinical-900 via-clinical-800 to-clinical-900"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* ambient glow */}
          <div className="pointer-events-none absolute h-[60vmin] w-[60vmin] rounded-full bg-clinical-400/20 blur-3xl" />

          <div className="relative flex flex-col items-center">
            <div className="relative h-28 w-24">
              {/* faint base tooth */}
              <ToothIcon className="absolute inset-0 h-full w-full text-white/10" />
              {/* fill clipped by progress */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
              >
                <ToothIcon className="h-full w-full text-white drop-shadow-[0_0_18px_rgba(125,182,226,0.8)]" />
              </div>
              <motion.div
                className="absolute -inset-6 rounded-full bg-clinical-300/20 blur-2xl"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <motion.p
              className="mt-8 font-display text-2xl tracking-wide text-white"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {CLINIC.name}
            </motion.p>
            <p className="mt-1 text-xs uppercase tracking-[0.35em] text-clinical-200">
              Preparing your visit
            </p>

            <div className="mt-7 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-clinical-300 to-gold-300 transition-[width] duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 font-mono text-xs text-clinical-200/80">
              {Math.round(progress)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
