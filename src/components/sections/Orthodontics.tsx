"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

/**
 * SECTION — Orthodontics.
 * A scroll-controlled before/after: a row of crowded, rotated teeth gradually
 * straightens into a perfect arch as the visitor scrolls. Braces appear to do
 * the work, then come off to reveal the aligned result.
 */

const N = 10;
// Per-tooth "crooked" offsets (x px, y px, rotation deg) relative to aligned.
const CROOKED = [
  { dx: 6, dy: 10, rot: -16 },
  { dx: -8, dy: -6, rot: 12 },
  { dx: 4, dy: 14, rot: -8 },
  { dx: -6, dy: -10, rot: 18 },
  { dx: 9, dy: 6, rot: -14 },
  { dx: -5, dy: 12, rot: 10 },
  { dx: 7, dy: -8, rot: -18 },
  { dx: -9, dy: 8, rot: 14 },
  { dx: 5, dy: -12, rot: -10 },
  { dx: -7, dy: 6, rot: 16 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Orthodontics() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", setP);

  // ease the alignment for a satisfying settle
  const align = Math.min(1, Math.max(0, (p - 0.15) / 0.65));
  const eased = 1 - Math.pow(1 - align, 3);
  // braces present through the middle of the journey
  const braces = Math.min(
    1,
    Math.max(0, p < 0.5 ? (p - 0.12) / 0.22 : (0.9 - p) / 0.18)
  );

  const labelOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const startX = 60;
  const gap = 36;
  const baseY = 150;

  return (
    <section id="orthodontics" ref={ref} className="relative h-[240vh] bg-ivory">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(201,151,46,0.10),transparent_60%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-600">
              02 — Orthodontics
            </span>
            <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
              Straighten, scroll by scroll
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-500">
              Crowded and rotated teeth are coaxed into a balanced arch with
              modern braces and clear aligners. Scroll to watch the
              transformation happen in real time.
            </p>
            <div className="mt-7 flex gap-3">
              <Stat value="6–18" label="months average" />
              <Stat value="3D" label="smile preview" />
              <Stat value="98%" label="patient confidence" />
            </div>
          </div>

          {/* Animation stage */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[32px] border border-gold-200/60 bg-white/70 p-4 shadow-glass backdrop-blur">
              <svg viewBox="0 0 420 240" className="w-full">
                {/* gum */}
                <path
                  d="M30 120 Q210 70 390 120 L390 96 Q210 48 30 96 Z"
                  fill="#e6798b"
                  opacity="0.9"
                />
                {Array.from({ length: N }).map((_, i) => {
                  const c = CROOKED[i];
                  const ax = startX + i * gap;
                  const x = lerp(ax + c.dx, ax, eased);
                  const y = lerp(baseY + c.dy, baseY, eased);
                  const rot = lerp(c.rot, 0, eased);
                  return (
                    <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
                      <rect
                        x={-13}
                        y={-34}
                        width={26}
                        height={64}
                        rx={9}
                        fill="url(#orthoEnamel)"
                        stroke="#e4d9c2"
                        strokeWidth={1}
                      />
                      {/* bracket */}
                      <g opacity={braces}>
                        <rect x={-6} y={-8} width={12} height={12} rx={2} fill="#c9ced6" stroke="#8a929c" strokeWidth={0.7} />
                        <circle cx={0} cy={-2} r={2.4} fill="#eef1f5" />
                      </g>
                    </g>
                  );
                })}
                {/* archwire across brackets */}
                <path
                  d={`M${startX} ${baseY - 2} ${Array.from({ length: N })
                    .map((_, i) => {
                      const c = CROOKED[i];
                      const ax = startX + i * gap;
                      const x = lerp(ax + c.dx, ax, eased);
                      const y = lerp(baseY + c.dy, baseY, eased) - 2;
                      return `L${x} ${y}`;
                    })
                    .join(" ")}`}
                  fill="none"
                  stroke="#9aa3ad"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  opacity={braces}
                />
                <defs>
                  <linearGradient id="orthoEnamel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#ede4d2" />
                  </linearGradient>
                </defs>
              </svg>

              {/* before / after labels */}
              <motion.span
                style={{ opacity: labelOpacity }}
                className="absolute left-6 top-6 rounded-full bg-ink-900/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
              >
                Before
              </motion.span>
              <span
                style={{ opacity: eased }}
                className="absolute right-6 top-6 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
              >
                After
              </span>

              {/* progress bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                  style={{ width: `${Math.round(eased * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-gold-200/60 bg-white/60 px-4 py-3 text-center">
      <div className="font-display text-2xl text-gold-600">{value}</div>
      <div className="mt-0.5 text-xs text-ink-500">{label}</div>
    </div>
  );
}
