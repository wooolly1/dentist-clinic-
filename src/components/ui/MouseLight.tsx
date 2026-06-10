"use client";

import { useEffect, useRef } from "react";

/**
 * Soft radial light that trails the cursor, giving the page a premium,
 * "spotlight" depth. Disabled for touch devices and reduced-motion users.
 * Uses a rAF lerp so the glow eases toward the pointer instead of snapping.
 */
export default function MouseLight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      el.style.opacity = "1";
    };

    const loop = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[600px] w-[600px] rounded-full opacity-0 mix-blend-screen transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(circle, rgba(125,182,226,0.18) 0%, rgba(221,177,74,0.07) 35%, transparent 70%)",
      }}
    />
  );
}
