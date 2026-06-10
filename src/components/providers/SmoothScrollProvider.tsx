"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Wires Lenis smooth scrolling into GSAP's ticker and keeps ScrollTrigger
 * in sync. This is the backbone of the entire scroll-driven experience —
 * every pinned scene reads its progress from ScrollTrigger, which in turn
 * reads the position Lenis reports here.
 *
 * Respects `prefers-reduced-motion` by skipping smoothing entirely.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      // Native scrolling, but still refresh triggers on resize.
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    // Drive Lenis from GSAP's RAF loop for frame-perfect sync.
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Let pinned sections settle after fonts / images load.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const refreshTimeout = window.setTimeout(refresh, 350);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimeout);
    };
  }, []);

  return <>{children}</>;
}
