"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Tracks a 0→1 progress value for how far a given element has travelled
 * through the viewport. Backed by GSAP ScrollTrigger so it stays perfectly in
 * sync with Lenis and the rest of the scroll timeline.
 *
 * Returns a ref to attach to the target element and the live progress value.
 */
export function useSectionProgress<T extends HTMLElement = HTMLDivElement>(
  start = "top bottom",
  end = "bottom top"
) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current!,
        start,
        end,
        onUpdate: (self) => setProgress(self.progress),
      });
    }, ref);
    return () => ctx.revert();
  }, [start, end]);

  return { ref, progress } as const;
}
