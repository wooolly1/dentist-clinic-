"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * SECTION — Dental Implants.
 * An interactive anatomy of a titanium implant. Hover or tap a part (crown,
 * abutment, post) to highlight it and read how it rebuilds a missing tooth.
 */

const PARTS = [
  {
    id: "crown",
    label: "Ceramic crown",
    desc: "A custom, colour-matched crown that looks and bites exactly like a natural tooth.",
  },
  {
    id: "abutment",
    label: "Abutment",
    desc: "The precision connector that links the crown to the implant post beneath the gum.",
  },
  {
    id: "post",
    label: "Titanium post",
    desc: "A biocompatible screw that fuses with the jawbone (osseointegration) to act as a new root.",
  },
] as const;

type PartId = (typeof PARTS)[number]["id"];

export default function Implants() {
  const [active, setActive] = useState<PartId>("post");

  const hi = (id: PartId) =>
    active === id ? "#c9972e" : "#cfd4da";
  const enamel = (id: PartId) => (active === id ? "#ffffff" : "#f2ece0");

  return (
    <section id="implants" className="relative bg-ivory py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(201,151,46,0.10),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Diagram */}
        <div className="order-2 flex justify-center lg:order-1">
          <div className="relative w-full max-w-sm rounded-[32px] border border-gold-200/60 bg-white/70 p-6 shadow-glass backdrop-blur">
            <svg viewBox="0 0 200 320" className="mx-auto h-[60vh] max-h-[460px]">
              {/* bone / gum bed */}
              <rect x="0" y="150" width="200" height="170" rx="20" fill="#f0d9c4" />
              <rect x="0" y="150" width="200" height="34" fill="#e6798b" />

              {/* crown */}
              <g
                onMouseEnter={() => setActive("crown")}
                onClick={() => setActive("crown")}
                style={{ cursor: "pointer" }}
              >
                <path
                  d="M70 60 Q100 36 130 60 Q138 110 100 140 Q62 110 70 60 Z"
                  fill={enamel("crown")}
                  stroke={hi("crown")}
                  strokeWidth={active === "crown" ? 4 : 2}
                />
              </g>

              {/* abutment */}
              <g
                onMouseEnter={() => setActive("abutment")}
                onClick={() => setActive("abutment")}
                style={{ cursor: "pointer" }}
              >
                <path d="M86 138 L114 138 L108 178 L92 178 Z" fill={hi("abutment")} />
              </g>

              {/* titanium post (threaded) */}
              <g
                onMouseEnter={() => setActive("post")}
                onClick={() => setActive("post")}
                style={{ cursor: "pointer" }}
              >
                <path d="M88 176 L112 176 L104 280 L96 280 Z" fill={hi("post")} />
                {Array.from({ length: 9 }).map((_, i) => (
                  <line
                    key={i}
                    x1={88 - 1}
                    y1={188 + i * 10}
                    x2={112 + 1}
                    y2={184 + i * 10}
                    stroke="#ffffff"
                    strokeWidth={2}
                    opacity={0.6}
                  />
                ))}
              </g>
            </svg>

            {/* part chips */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {PARTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    active === p.id
                      ? "bg-gold-500 text-white"
                      : "border border-gold-200 bg-white text-ink-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-600">
            04 — Dental Implants
          </span>
          <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">
            A permanent new root
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-500">
            Implants replace a missing tooth from the root up — no drilling
            neighbours, no slipping dentures. Explore the three parts that make
            them feel completely your own.
          </p>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 rounded-2xl border border-gold-200/60 bg-white/70 p-5 shadow-glass"
          >
            <div className="font-display text-xl text-ink-900">
              {PARTS.find((p) => p.id === active)?.label}
            </div>
            <p className="mt-2 text-ink-600">
              {PARTS.find((p) => p.id === active)?.desc}
            </p>
          </motion.div>

          <div className="mt-7 flex gap-3">
            <Stat value="3D" label="guided surgery" />
            <Stat value="98%" label="success rate" />
            <Stat value="Life" label="time restoration" />
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
