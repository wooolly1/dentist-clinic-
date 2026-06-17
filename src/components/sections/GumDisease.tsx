"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * SECTION — Gum Diseases.
 * A realistic gum visualization the visitor can drag from healthy to severely
 * inflamed, with interactive hotspots that explain each clinical sign.
 */

interface Hotspot {
  id: string;
  x: number; // 0..100 (% of stage)
  y: number;
  title: string;
  desc: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "gingivitis",
    x: 28,
    y: 40,
    title: "Gingivitis",
    desc: "The earliest stage — red, puffy gums that bleed easily. Fully reversible with professional cleaning.",
  },
  {
    id: "pocket",
    x: 52,
    y: 33,
    title: "Periodontal pocket",
    desc: "Gums detach from the tooth, forming deep pockets where bacteria thrive below the gumline.",
  },
  {
    id: "tartar",
    x: 70,
    y: 46,
    title: "Plaque & tartar",
    desc: "Hardened deposits at the margin keep the tissue inflamed and can only be removed by scaling.",
  },
  {
    id: "recession",
    x: 40,
    y: 60,
    title: "Gum recession",
    desc: "Chronic inflammation pulls the gum down, exposing sensitive roots and threatening the bone.",
  },
];

// blend healthy → inflamed
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

export default function GumDisease() {
  const [severity, setSeverity] = useState(0.7);
  const [active, setActive] = useState<string | null>("gingivitis");

  const gumTop = mix([243, 169, 181], [200, 51, 74], severity);
  const gumBot = mix([214, 105, 120], [150, 20, 42], severity);
  const swell = 1 + severity * 0.16;

  return (
    <section id="gum-disease" className="relative bg-porcelain py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(192,51,74,0.08),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Copy + control */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-600">
            03 — Gum Diseases
          </span>
          <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
            See inflammation as it spreads
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-500">
            Gum disease is silent until it isn&rsquo;t. Drag the slider to watch
            healthy tissue turn inflamed, and tap the hotspots to learn the
            warning signs we screen for at every visit.
          </p>

          <div className="mt-8 max-w-md">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-400">
              <span>Healthy</span>
              <span>Severe</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={severity}
              onChange={(e) => setSeverity(parseFloat(e.target.value))}
              aria-label="Gum inflammation severity"
              className="w-full accent-rose-500"
            />
          </div>

          <a
            href="#contact"
            className="mt-8 inline-block rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-7 py-3.5 font-semibold text-white shadow-gold transition-transform hover:scale-105"
          >
            Book a gum health check
          </a>
        </div>

        {/* Visualization */}
        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-gold-200/60 bg-gradient-to-b from-[#2a0d12] to-[#15060a] shadow-glass-lg">
            <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="gumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gumTop} />
                  <stop offset="100%" stopColor={gumBot} />
                </linearGradient>
                <filter id="gumGloss" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>

              {/* upper gum (swells with severity) */}
              <path
                d={`M0 ${120 - 18 * (swell - 1) * 6} Q200 ${40} 400 ${
                  120 - 18 * (swell - 1) * 6
                } L400 0 L0 0 Z`}
                fill="url(#gumGrad)"
              />
              {/* scalloped gumline highlights */}
              <g opacity={0.5} filter="url(#gumGloss)">
                <path d="M0 120 Q200 60 400 120" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.25" />
              </g>

              {/* teeth peeking below the gum */}
              {Array.from({ length: 9 }).map((_, i) => {
                const x = 30 + i * 45;
                const recession = severity * 14;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={110 + recession}
                    width={34}
                    height={150}
                    rx={12}
                    fill="url(#toothGrad)"
                  />
                );
              })}
              <defs>
                <linearGradient id="toothGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fdfaf3" />
                  <stop offset="100%" stopColor="#e7dcc6" />
                </linearGradient>
              </defs>

              {/* inflamed sheen */}
              <ellipse
                cx="200"
                cy="80"
                rx="220"
                ry="60"
                fill="#ff6b6b"
                opacity={severity * 0.18}
              />
            </svg>

            {/* Hotspots */}
            {HOTSPOTS.map((h) => (
              <button
                key={h.id}
                onClick={() => setActive((a) => (a === h.id ? null : h.id))}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                aria-label={h.title}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <span className="relative flex h-5 w-5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
                  <span
                    className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow ${
                      active === h.id ? "bg-rose-600" : "bg-rose-500"
                    }`}
                  >
                    +
                  </span>
                </span>
              </button>
            ))}

            {/* Popover */}
            <AnimatePresence>
              {active && (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-ink-900/80 p-4 text-white backdrop-blur-xl"
                >
                  <div className="text-sm font-semibold text-gold-300">
                    {HOTSPOTS.find((h) => h.id === active)?.title}
                  </div>
                  <p className="mt-1 text-sm text-white/80">
                    {HOTSPOTS.find((h) => h.id === active)?.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-3 text-center text-xs text-ink-400">
            Tap the <span className="text-rose-500">+</span> hotspots · drag the
            slider to compare
          </p>
        </div>
      </div>
    </section>
  );
}
